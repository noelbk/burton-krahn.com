import fs from "node:fs/promises";
import path from "node:path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");

const SYNC_DIR =
  process.env.SYNC_DIR ?? path.join(REPO_ROOT, "content");
const VAULT_DIR = process.env.VAULT_DIR ?? path.join(REPO_ROOT, "vault");

const LEGACY_STATIC_DIR =
  process.env.LEGACY_STATIC_DIR ?? path.join(REPO_ROOT, "content", "static");

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function pathExists(p) {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

function normalizePelicanStaticLinks(md) {
  // Pelican used {filename}static/... and {filename}/static/...
  return md
    .replaceAll(/\{filename\}\/?static\//g, "/static/site/")
    .replaceAll(/\{filename\}\/?static\//gi, "/static/site/");
}

function parsePelicanHeader(md) {
  const lines = md.split(/\r?\n/);
  const meta = {};

  let i = 0;
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) {
      // blank line ends header once we've seen any keys
      if (Object.keys(meta).length > 0) {
        i++;
        break;
      }
      continue;
    }
    const m = /^([A-Za-z][A-Za-z0-9 _-]*):\s*(.*)$/.exec(line);
    if (!m) break;
    meta[m[1].trim().toLowerCase()] = m[2].trim();
  }

  if (Object.keys(meta).length === 0) return { frontmatter: null, body: md };

  const body = lines.slice(i).join("\n").replace(/^\s*\n+/, "");

  const tags = new Set();
  if (meta.tags) {
    for (const t of meta.tags.split(/[,\s]+/).map((s) => s.trim()).filter(Boolean)) {
      tags.add(t);
    }
  }
  if (meta.category) tags.add(meta.category.toLowerCase());

  const fm = {};
  if (meta.title) fm.title = meta.title;
  if (meta.date) fm.date = meta.date;
  if (meta.summary) fm.description = meta.summary;
  if (tags.size) fm.tags = [...tags];
  if (meta.authors) fm.authors = meta.authors.split(";").map((s) => s.trim()).filter(Boolean);

  return { frontmatter: fm, body };
}

function toYamlFrontmatter(obj) {
  const lines = ["---"];
  for (const [k, v] of Object.entries(obj)) {
    if (Array.isArray(v)) {
      lines.push(`${k}:`);
      for (const item of v) lines.push(`  - ${JSON.stringify(item)}`);
    } else {
      lines.push(`${k}: ${JSON.stringify(v)}`);
    }
  }
  lines.push("---", "");
  return lines.join("\n");
}

function extractStaticRelPaths(md) {
  // Capture /static/... paths in markdown links or html attrs.
  const out = new Set();
  const re = /\/static\/site\/([A-Za-z0-9._~:/?#\[\]@!$&'()*+,;=%-]+)/g;
  for (const m of md.matchAll(re)) {
    const rel = m[1];
    if (!rel || rel.includes("://")) continue;
    const clean = rel.split(/[)"'\s>]/)[0];
    if (clean) out.add(clean);
  }
  return [...out];
}

async function copyLegacyStatic(rel) {
  const src = path.join(LEGACY_STATIC_DIR, rel);
  const dst = path.join(VAULT_DIR, "static", rel);
  if (!(await pathExists(src))) return { rel, ok: false, reason: "missing" };
  await ensureDir(path.dirname(dst));
  await fs.copyFile(src, dst);
  return { rel, ok: true };
}

async function main() {
  if (!(await pathExists(SYNC_DIR))) throw new Error(`SYNC_DIR not found: ${SYNC_DIR}`);
  if (!(await pathExists(VAULT_DIR))) throw new Error(`VAULT_DIR not found: ${VAULT_DIR}`);

  const entries = await fs.readdir(SYNC_DIR, { withFileTypes: true });
  const mdFiles = entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".md"))
    .map((e) => path.join(SYNC_DIR, e.name));

  await ensureDir(path.join(VAULT_DIR, "static"));

  const copied = [];
  const skipped = [];
  const assetsCopied = [];
  const assetsMissing = [];

  for (const abs of mdFiles) {
    const base = path.basename(abs);
    const outAbs = path.join(VAULT_DIR, base);

    if (await pathExists(outAbs)) {
      skipped.push(base);
      continue;
    }

    let md = await fs.readFile(abs, "utf8");
    md = normalizePelicanStaticLinks(md);

    const { frontmatter, body } = parsePelicanHeader(md);
    const outMd = frontmatter ? `${toYamlFrontmatter(frontmatter)}${body}` : md;

    const relStatic = extractStaticRelPaths(outMd);
    for (const rel of relStatic) {
      const r = await copyLegacyStatic(rel);
      if (r.ok) assetsCopied.push(rel);
      else assetsMissing.push(rel);
    }

    await fs.writeFile(outAbs, outMd, "utf8");
    copied.push(base);
  }

  console.log(
    JSON.stringify(
      {
        copied,
        skipped,
        assetsCopied: [...new Set(assetsCopied)],
        assetsMissing: [...new Set(assetsMissing)],
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

