import fs from "node:fs/promises";
import path from "node:path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const VAULT_DIR = process.env.VAULT_DIR ?? path.join(REPO_ROOT, "vault");

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

async function main() {
  const files = (await walk(VAULT_DIR)).filter((f) => f.toLowerCase().endsWith(".md"));
  let changed = 0;

  for (const f of files) {
    if (f.includes(`${path.sep}.obsidian${path.sep}`)) continue;
    let md = await fs.readFile(f, "utf8");

    // Rewrite /static/... -> /static/site/... but don't double-prefix.
    md = md.replaceAll(/\/static\/(?!site\/)/g, "/static/site/");

    await fs.writeFile(f, md, "utf8");
    changed++;
  }

  console.log(`Rewrote static links in ${changed} markdown files under ${VAULT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

