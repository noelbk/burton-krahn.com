import fs from "node:fs"
import path from "node:path"
import { spawn } from "node:child_process"

const REPO_ROOT = path.resolve(import.meta.dirname, "..")
const VAULT_DIR = process.env.VAULT_DIR ?? path.join(REPO_ROOT, "vault")
const QUARTZ_DIR = process.env.QUARTZ_DIR ?? path.join(REPO_ROOT, "quartz")
const QUARTZ_CONTENT_DIR = process.env.QUARTZ_CONTENT_DIR ?? path.join(REPO_ROOT, "site-content")
const SYNC_SCRIPT = path.join(REPO_ROOT, "tools", "sync-vault-to-quartz.mjs")

let debounceTimer = null
let running = false
let rerunRequested = false
let pendingReason = "initial"

function shouldSync(filename) {
  if (!filename) return true

  const rel = String(filename).replaceAll("\\", "/")
  if (rel.startsWith(".obsidian/")) return false
  if (rel === ".obsidian") return false
  if (rel === "static" || rel.startsWith("static/")) return true
  return rel.toLowerCase().endsWith(".md")
}

function queueSync(reason) {
  pendingReason = reason
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debounceTimer = null
    void runSync()
  }, 250)
}

function runSync() {
  if (running) {
    rerunRequested = true
    return Promise.resolve()
  }

  running = true
  const reason = pendingReason
  console.log(`[vault-watch] syncing after ${reason}`)

  return new Promise((resolve) => {
    const child = spawn(process.execPath, [SYNC_SCRIPT], {
      cwd: REPO_ROOT,
      env: {
        ...process.env,
        VAULT_DIR,
        QUARTZ_DIR,
        QUARTZ_CONTENT_DIR,
      },
      stdio: "inherit",
    })

    child.on("exit", (code, signal) => {
      running = false
      if (code === 0) {
        console.log("[vault-watch] sync complete")
      } else {
        console.error(
          `[vault-watch] sync failed${signal ? ` (signal ${signal})` : ` (exit ${code ?? "unknown"})`}`,
        )
      }

      if (rerunRequested) {
        rerunRequested = false
        queueSync("queued changes")
      }

      resolve()
    })
  })
}

console.log(`[vault-watch] watching ${VAULT_DIR}`)
const watcher = fs.watch(VAULT_DIR, { recursive: true }, (_eventType, filename) => {
  if (!shouldSync(filename)) return
  queueSync(filename ? `change in ${filename}` : "unattributed change")
})

function shutdown() {
  if (debounceTimer) clearTimeout(debounceTimer)
  watcher.close()
  process.exit(0)
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
