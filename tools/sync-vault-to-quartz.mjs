import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { createHash } from "node:crypto";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");

const VAULT_DIR =
  process.env.VAULT_DIR ?? path.join(REPO_ROOT, "vault");
const QUARTZ_DIR = process.env.QUARTZ_DIR ?? path.join(REPO_ROOT, "quartz");

const QUARTZ_CONTENT_DIR =
  process.env.QUARTZ_CONTENT_DIR ?? path.join(REPO_ROOT, "site-content");
const QUARTZ_STATIC_DIR =
  process.env.QUARTZ_STATIC_DIR ?? path.join(QUARTZ_DIR, "quartz", "static");
const QUARTZ_SITE_STATIC_DIR = path.join(QUARTZ_STATIC_DIR, "site");

const VAULT_STATIC_DIR = path.join(VAULT_DIR, "static");

function hashShort(s) {
  return createHash("sha256").update(s).digest("hex").slice(0, 12);
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function clearDir(dir) {
  await fs.rm(dir, { recursive: true, force: true });
  await ensureDir(dir);
}

async function pathExists(p) {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.isFile()) out.push(p);
  }
  return out;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeTextareaValue(s) {
  return String(s).replaceAll("</textarea>", "<\\/textarea>");
}

async function renderTikzToPng({ tikzSource, outPngAbsPath, siteRequire }) {
  const tex2svgPath = siteRequire.resolve("node-tikzjax");
  const resvgPath = siteRequire.resolve("@resvg/resvg-js");
  const tikzjaxFontsCssPath = siteRequire.resolve("node-tikzjax/css/fonts.css");
  const tikzjaxFontDir = path.join(path.dirname(tikzjaxFontsCssPath), "bakoma", "ttf");

  const tex2svgMod = await import(tex2svgPath);
  const tex2svg =
    tex2svgMod.default?.default ??
    tex2svgMod.default ??
    tex2svgMod.tex2svg ??
    tex2svgMod;

  const resvgMod = await import(resvgPath);
  const Resvg = resvgMod.Resvg ?? resvgMod.default?.Resvg ?? resvgMod.default;

  const svg = await tex2svg(tikzSource, {
    showConsole: false,
    texPackages: { amsmath: "" },
    embedFontCss: false,
    disableOptimize: false,
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
    background: "white",
    font: {
      fontDirs: [tikzjaxFontDir],
      loadSystemFonts: false,
    },
  });

  const png = resvg.render().asPng();
  await ensureDir(path.dirname(outPngAbsPath));
  await fs.writeFile(outPngAbsPath, png);
}

async function replaceTikzBlocksWithImages({ markdown, idBase, siteRequire }) {
  const re = /```tikz\s*([\s\S]*?)```/gi;
  const matches = [...markdown.matchAll(re)];
  if (!matches.length) return markdown;

  let out = "";
  let last = 0;
  let idx = 0;

  for (const m of matches) {
    const full = m[0];
    const body = (m[1] ?? "").trimEnd();
    const start = m.index ?? 0;

    out += markdown.slice(last, start);

    const key = hashShort(body);
    const name = `${idBase}-tikz-${String(idx + 1).padStart(2, "0")}-${key}.png`;
    const relPng = path
      .join("site", "generated", "tikz", name)
      .replaceAll(path.sep, "/");
    const absPng = path.join(QUARTZ_STATIC_DIR, relPng);

    await renderTikzToPng({ tikzSource: body, outPngAbsPath: absPng, siteRequire });

    const textareaId = `tikz-src-${idBase}-${String(idx + 1).padStart(2, "0")}-${key}`;

    out += `![TikZ diagram](/static/${relPng})\n\n`;
    out += `<details class="tikz-source">\n`;
    out += `<summary>TikZ source</summary>\n`;
    out += `<div class="tikz-source__controls">\n`;
    out += `<button type="button" onclick="(async(btn)=>{try{await navigator.clipboard.writeText(document.getElementById('${textareaId}').value);btn.textContent='Copied';setTimeout(()=>btn.textContent='Copy to clipboard',1200)}catch(e){}})(this)">Copy to clipboard</button>\n`;
    out += `</div>\n`;
    out += `<textarea id="${textareaId}" class="tikz-source__textarea" readonly>${escapeTextareaValue(
      body
    )}</textarea>\n`;
    out += `<pre class="tikz-source__pre"><code>${escapeHtml(body)}</code></pre>\n`;
    out += `</details>\n`;

    last = start + full.length;
    idx++;
  }

  out += markdown.slice(last);
  return out;
}

async function syncStatic() {
  if (!(await pathExists(VAULT_STATIC_DIR))) return;
  const files = await walk(VAULT_STATIC_DIR);
  for (const f of files) {
    const rel = path.relative(VAULT_STATIC_DIR, f);
    const out = path.join(QUARTZ_SITE_STATIC_DIR, rel);
    await ensureDir(path.dirname(out));
    await fs.copyFile(f, out);
  }
}

async function syncContent() {
  const files = await walk(VAULT_DIR);
  const mdFiles = files.filter((f) => f.toLowerCase().endsWith(".md"));

  const siteRequire = createRequire(path.join(QUARTZ_DIR, "package.json"));

  for (const f of mdFiles) {
    // skip Obsidian internals
    if (f.includes(`${path.sep}.obsidian${path.sep}`)) continue;
    // skip vault static directory
    if (f.startsWith(`${VAULT_STATIC_DIR}${path.sep}`)) continue;

    const rel = path.relative(VAULT_DIR, f);
    const outPath = path.join(QUARTZ_CONTENT_DIR, rel);
    await ensureDir(path.dirname(outPath));

    const raw = await fs.readFile(f, "utf8");
    const idBase = rel.replace(/\.md$/i, "").replaceAll(path.sep, "-");
    const processed = await replaceTikzBlocksWithImages({
      markdown: raw,
      idBase,
      siteRequire,
    });
    await fs.writeFile(outPath, processed, "utf8");
  }
}

async function main() {
  if (!(await pathExists(VAULT_DIR))) throw new Error(`VAULT_DIR not found: ${VAULT_DIR}`);
  if (!(await pathExists(QUARTZ_DIR))) throw new Error(`QUARTZ_DIR not found: ${QUARTZ_DIR}`);

  await clearDir(QUARTZ_CONTENT_DIR);
  // Don't clear QUARTZ_STATIC_DIR entirely (Quartz owns icons/fonts). Only clear our site-owned static.
  await clearDir(QUARTZ_SITE_STATIC_DIR);

  await syncStatic();
  await syncContent();
  console.log("Synced vault -> quartz (content + static).");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

