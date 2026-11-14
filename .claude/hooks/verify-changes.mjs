#!/usr/bin/env node
/**
 * PostToolUse check: type-checks the project and lints the files that changed.
 *
 * Runs async (see .claude/settings.json), so it never slows an edit down. It
 * only speaks up on failure, by exiting 2 — which hands the errors back to
 * Claude. `tsc --noEmit` is the real gate here: tsconfig.json sets
 * "strict": true, so the compiler catches what nothing else in this repo does.
 *
 * Edits usually arrive in bursts, and a check reading the tree halfway through
 * one reports errors that the next edit already fixed. So: one run at a time,
 * it settles briefly before reading, and any edit that lands while it works
 * records itself as pending and gets folded into another pass.
 */

import { spawn } from "node:child_process"
import { appendFileSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { dirname, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"
import { tmpdir } from "node:os"

const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..")
const LOCK = resolve(tmpdir(), "bookafixer-verify.lock")
const PENDING = resolve(tmpdir(), "bookafixer-verify.pending")
const LOCK_STALE_MS = 180_000
/** Long enough for the rest of a burst of edits to land before we read. */
const SETTLE_MS = 400
const MAX_PASSES = 3
const CHECKABLE = /\.(ts|tsx|mts|cts)$/

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function readPayload() {
  try {
    return JSON.parse(readFileSync(0, "utf8") || "{}")
  } catch {
    return {}
  }
}

/** Project-relative path, or "" when the edit landed outside the repo. */
function toRelative(candidate) {
  if (typeof candidate !== "string" || !candidate) return ""
  const rel = relative(PROJECT_ROOT, resolve(PROJECT_ROOT, candidate)).split(sep).join("/")
  return rel.startsWith("../") ? "" : rel
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
    writeFileSync(LOCK, String(Date.now()))
  } catch {
    // If we cannot write the lock we still check; a duplicate run is cheap.
  }
  return true
}

function recordPending(target) {
  try {
    appendFileSync(PENDING, `${target}\n`)
  } catch {
    // Losing a pending note only costs us one extra pass.
  }
}

/** Reads and clears the pending list, returning the paths recorded in it. */
function drainPending() {
  let contents = ""
  try {
    contents = readFileSync(PENDING, "utf8")
  } catch {
    return []
  }
  try {
    rmSync(PENDING, { force: true })
  } catch {
    // Left behind, it would only add a pass.
  }
  return contents.split("\n").filter(Boolean)
}

function hasPending() {
  try {
    return readFileSync(PENDING, "utf8").trim().length > 0
  } catch {
    return false
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

async function check(targets) {
  const lintable = targets.filter((t) => CHECKABLE.test(t))
  const [types, lint] = await Promise.all([
    run("node_modules/typescript/bin/tsc", ["--noEmit"]),
    // Errors gate; warnings are left to `pnpm lint` and CI. A hook that fails
    // on every new warning is a hook people switch off.
    lintable.length > 0
      ? run("node_modules/eslint/bin/eslint.js", lintable)
      : Promise.resolve({ code: 0, output: "" }),
  ])

  const problems = []
  // tsc reports every error in the project, not just the edited files. That is
  // the point: an edit here often breaks a caller somewhere else.
  if (types.code !== 0) problems.push(`tsc --noEmit failed:\n${types.output.trim()}`)
  if (lint.code !== 0) {
    problems.push(`eslint ${lintable.join(" ")} failed:\n${lint.output.trim()}`)
  }
  return problems
}

const payload = readPayload()
const input = payload.tool_input ?? {}
const target = toRelative(input.file_path ?? input.notebook_path ?? input.path)

// Nothing TypeScript-shaped changed, so there is nothing these tools can say.
if (!CHECKABLE.test(target)) process.exit(0)

// Another run holds the lock. Hand it our file and let it fold us in.
if (!acquireLock()) {
  recordPending(target)
  process.exit(0)
}

let problems = []
try {
  for (let pass = 0; pass < MAX_PASSES; pass += 1) {
    const targets = new Set([target, ...drainPending()])
    await sleep(SETTLE_MS)
    // Anything that arrived during the settle joins this pass.
    for (const extra of drainPending()) targets.add(extra)

    problems = await check([...targets])

    // The tree stood still while we read it, so the result is trustworthy.
    if (!hasPending()) break
  }
} finally {
  try {
    rmSync(LOCK, { force: true })
  } catch {
    // Losing the lock file is harmless; it goes stale on its own.
  }
}

if (problems.length > 0) {
  process.stderr.write(`${problems.join("\n\n")}\n`)
  process.exit(2)
}

process.exit(0)
