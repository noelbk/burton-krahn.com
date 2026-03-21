import fs from "node:fs/promises"
import path from "node:path"
import { createRequire } from "node:module"

const REPO_ROOT = path.resolve(import.meta.dirname, "..")

const SYNC_DIR = process.env.SYNC_DIR ?? "/Users/noel/projects/notes/Sync/burton-krahn.com"
const VAULT_DIR = process.env.VAULT_DIR ?? path.join(REPO_ROOT, "vault")

const quartzRequire = createRequire(path.join(REPO_ROOT, "quartz", "package.json"))
const matter = quartzRequire("gray-matter")
const yaml = quartzRequire("js-yaml")

async function pathExists(p) {
  try {
    await fs.stat(p)
    return true
  } catch {
    return false
  }
}

async function walk(dir) {
  const out = []
  const ents = await fs.readdir(dir, { withFileTypes: true })
  for (const e of ents) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...(await walk(p)))
    else if (e.isFile()) out.push(p)
  }
  return out
}

function dateOnlyLocal(d) {
  // YYYY-MM-DD in local time
  const yr = d.getFullYear()
  const mo = String(d.getMonth() + 1).padStart(2, "0")
  const da = String(d.getDate()).padStart(2, "0")
  return `${yr}-${mo}-${da}`
}

function parsePelicanHeaderDate(md) {
  // Only for Pelican-style headers (Title:, Date:, Modified:, etc.)
  // Returns raw strings (as in source).
  const out = {}
  const lines = md.split(/\r?\n/)
  for (const line of lines) {
    if (!line.trim()) break
    const m = /^([A-Za-z][A-Za-z0-9 _-]*):\s*(.*)$/.exec(line)
    if (!m) break
    out[m[1].trim().toLowerCase()] = m[2].trim()
  }
  return out
}

async function main() {
  if (!(await pathExists(SYNC_DIR))) throw new Error(`SYNC_DIR not found: ${SYNC_DIR}`)
  if (!(await pathExists(VAULT_DIR))) throw new Error(`VAULT_DIR not found: ${VAULT_DIR}`)

  const syncFiles = await walk(SYNC_DIR)
  const syncIndex = new Map()
  for (const f of syncFiles) {
    if (!f.toLowerCase().endsWith(".md")) continue
    syncIndex.set(path.relative(SYNC_DIR, f), f)
    syncIndex.set(path.basename(f), f) // convenience for root-level files
  }

  const vaultFiles = (await walk(VAULT_DIR)).filter((f) => f.toLowerCase().endsWith(".md"))
  const changed = []
  const skipped = []
  const missingSource = []

  for (const vf of vaultFiles) {
    if (vf.includes(`${path.sep}.obsidian${path.sep}`)) continue
    const rel = path.relative(VAULT_DIR, vf)

    // Map vault file -> sync file
    let sf = syncIndex.get(rel)
    if (!sf) {
      // special-case: great-circle and calculating-pi live under Sync/pages/
      if (rel === "great-circle.md") sf = syncIndex.get(path.join("pages", "great-circle.md"))
      if (rel === "calculating-pi.md") sf = syncIndex.get(path.join("pages", "calculating-pi.md"))
    }

    if (!sf) {
      skipped.push(rel)
      continue
    }

    const [sStat, vStat] = await Promise.all([fs.stat(sf), fs.stat(vf)])
    const syncRaw = await fs.readFile(sf, "utf8")

    // Determine published/created/modified from source.
    let publishedRaw = undefined
    let modifiedRaw = undefined

    // Source might be yaml-frontmatter or Pelican header.
    const srcMatter = matter(syncRaw)
    if (Object.keys(srcMatter.data ?? {}).length > 0) {
      // Obsidian YAML: prefer explicit date/published/modified if present
      publishedRaw = srcMatter.data.published ?? srcMatter.data.date ?? srcMatter.data.created
      modifiedRaw =
        srcMatter.data.modified ?? srcMatter.data.updated ?? srcMatter.data["last-modified"]
    } else {
      const pel = parsePelicanHeaderDate(syncRaw)
      publishedRaw = pel.date
      modifiedRaw = pel.modified ?? pel.updated ?? pel["last-modified"]
    }

    // If source doesn't contain an explicit date, fall back to file timestamps
    const created = dateOnlyLocal(sStat.birthtime ?? sStat.ctime)
    const modified = dateOnlyLocal(sStat.mtime)
    const published =
      typeof publishedRaw === "string" && publishedRaw.trim() ? publishedRaw.trim() : modified
    const updated =
      typeof modifiedRaw === "string" && modifiedRaw.trim() ? modifiedRaw.trim() : modified

    // Update vault frontmatter
    const vRaw = await fs.readFile(vf, "utf8")
    const vParsed = matter(vRaw)
    const data = { ...(vParsed.data ?? {}) }

    data.created = created
    data.modified = updated
    // keep Quartz "published" date stable via `date` key (FrontMatter aliases to published)
    data.date = published

    const fm = yaml.dump(data, { lineWidth: 999, quotingType: '"', forceQuotes: true })
    const next = `---\n${fm}---\n${vParsed.content.replace(/^\n+/, "\n")}`

    if (next !== vRaw) {
      await fs.writeFile(vf, next, "utf8")
      changed.push(rel)
    } else if (vStat.mtimeMs !== vStat.mtimeMs) {
      // no-op placeholder; keep structure similar
      skipped.push(rel)
    } else {
      skipped.push(rel)
    }
  }

  console.log(
    JSON.stringify(
      {
        changed,
        skipped,
        missingSource,
        syncDir: SYNC_DIR,
        vaultDir: VAULT_DIR,
      },
      null,
      2,
    ),
  )
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

