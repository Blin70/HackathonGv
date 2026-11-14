#!/usr/bin/env node
/**
 * PostToolUse check: type-checks the project and lints the file that changed.
 *
 * Runs async (see .claude/settings.json), so it never slows an edit down. It
 * only speaks up on failure, by exiting 2 — which hands the errors back to
 * Claude. `tsc --noEmit` is the real gate here: tsconfig.json sets
 * "strict": true, so the compiler catches what nothing else in this repo does.
 *
 * A lock file keeps a burst of edits from starting a pile of compilers; the
 * run already in flight reads from disk, so it sees the newer edits anyway.
 */

import { spawn } from "node:child_process"
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { dirname, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"
import { tmpdir } from "node:os"

const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..")
const LOCK = resolve(tmpdir(), "bookafixer-verify-changes.lock")
const LOCK_STALE_MS = 120_000
const CHECKABLE = /\.(ts|tsx|mts|cts)$/

function readPayload() {
  try {
    return JSON.parse(readFileSync(0, "utf8") || "{}")
  } catch {
    return {}
  }
}

/** Best-effort single-flight lock. Returns false when a run is already going. */
function acquireLock() {
  try {
    const held = Number(readFileSync(LOCK, "utf8"))
    if (Number.isFinite(held) && Date.now() - held < LOCK_STALE_MS) return false
  } catch {
    // No lock file, or an unreadable one: fall through and take it.
  }
  try {
    mkdirSync(dirname(LOCK), { recursive: true })
    writeFileSync(LOCK, String(Date.now()))
    return true
  } catch {
    return true
  }
}

/**
 * Runs a tool's JS entry point under this same Node binary. No shell and no
 * npx: it sidesteps .cmd resolution on Windows, and skips the ~5s npx costs.
 */
function run(binary, args) {
  return new Promise((done) => {
    const child = spawn(process.execPath, [resolve(PROJECT_ROOT, binary), ...args], {
      cwd: PROJECT_ROOT,
      env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" },
    })
    let output = ""
    child.stdout.on("data", (d) => (output += d))
    child.stderr.on("data", (d) => (output += d))
    // A tool that cannot start is reported, never treated as a pass.
    child.on("error", (error) => done({ code: 1, output: `could not start: ${error.message}` }))
    child.on("close", (code) => done({ code: code ?? 0, output }))
  })
}

const payload = readPayload()
const input = payload.tool_input ?? {}
const edited = input.file_path ?? input.notebook_path ?? input.path

let relativeTarget = ""
if (typeof edited === "string" && edited) {
  const rel = relative(PROJECT_ROOT, resolve(PROJECT_ROOT, edited)).split(sep).join("/")
  if (!rel.startsWith("../")) relativeTarget = rel
}

// Nothing TypeScript-shaped changed, so there is nothing these tools can say.
if (!CHECKABLE.test(relativeTarget)) process.exit(0)
if (!acquireLock()) process.exit(0)

try {
  const [types, lint] = await Promise.all([
    run("node_modules/typescript/bin/tsc", ["--noEmit"]),
    run("node_modules/eslint/bin/eslint.js", ["--max-warnings", "0", relativeTarget]),
  ])

  const problems = []
  // tsc reports every error in the project, not just this file. That is the
  // point: an edit here often breaks a caller somewhere else.
  if (types.code !== 0) problems.push(`tsc --noEmit failed:\n${types.output.trim()}`)
  if (lint.code !== 0) problems.push(`eslint ${relativeTarget} failed:\n${lint.output.trim()}`)

  if (problems.length > 0) {
    process.stderr.write(`${problems.join("\n\n")}\n`)
    process.exit(2)
  }
} finally {
  try {
    rmSync(LOCK, { force: true })
  } catch {
    // Losing the lock file is harmless; it goes stale on its own.
  }
}

process.exit(0)
