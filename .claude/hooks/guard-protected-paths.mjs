#!/usr/bin/env node
/**
 * PreToolUse guard: refuses edits to files that must not be changed in place.
 *
 * - secrets (.env, .env.local, ...) because they hold live Supabase/OpenAI keys
 * - lockfiles, which belong to the package manager
 * - Supabase migrations that already exist, because they have been applied to
 *   a database somewhere; editing one silently desyncs environments
 *
 * Reads the hook payload on stdin and prints a PreToolUse decision on stdout.
 */

import { existsSync } from "node:fs"
import { dirname, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"

const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..")

/** @type {Array<{ test: (p: string) => boolean, reason: string }>} */
const RULES = [
  {
    test: (p) => /(^|\/)\.env($|\.)/.test(p) && !p.endsWith(".env.example"),
    reason:
      "This file holds live credentials and is gitignored. Change it yourself, and document any new key in .env.example instead.",
  },
  {
    test: (p) => /(^|\/)(pnpm-lock\.yaml|package-lock\.json|yarn\.lock)$/.test(p),
    reason:
      "Lockfiles are generated. Run the package manager (`pnpm add`, `pnpm install`) and let it rewrite the lockfile.",
  },
  {
    test: (p) => p.startsWith("supabase/migrations/") && existsSync(resolve(PROJECT_ROOT, p)),
    reason:
      "This migration already exists, so it has probably been applied. Editing it desyncs environments that already ran it. Add a new timestamped migration instead.",
  },
]

function decide(filePath) {
  if (!filePath) return null
  const absolute = resolve(PROJECT_ROOT, filePath)
  // Normalise to forward slashes so one set of patterns works on Windows too.
  const rel = relative(PROJECT_ROOT, absolute).split(sep).join("/")
  if (rel.startsWith("../")) return null
  return RULES.find((rule) => rule.test(rel))?.reason ?? null
}

let raw = ""
process.stdin.setEncoding("utf8")
for await (const chunk of process.stdin) raw += chunk

let payload = {}
try {
  payload = JSON.parse(raw || "{}")
} catch {
  // A payload we cannot read is not grounds to block an edit.
  process.exit(0)
}

const input = payload.tool_input ?? {}
const target = input.file_path ?? input.notebook_path ?? input.path
const reason = decide(typeof target === "string" ? target : "")

if (reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: reason,
      },
    })
  )
}

process.exit(0)
