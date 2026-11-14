---
name: new-feature
description: Scaffold a feature in Book A Fixer following the project's own layering — Zod schema, lib data access, use-* hook, feature component folder, shadcn primitives. Use when adding a new page, panel, form, or data-backed view.
---

# Add a feature to Book A Fixer

Follow the layering this codebase already uses. The goal is that a new feature
is indistinguishable from the existing ones.

## Before writing anything

1. **Look for what already exists.** Read a comparable feature end to end
   first — `components/repair-intake/` plus `hooks/use-repair-intake.ts` plus
   `lib/schemas/repair-intake.ts` is the cleanest example; `components/book/`
   plus `hooks/use-worker-detail.ts` plus `lib/workers.ts` is the busiest.
2. **Check `components/ui/`** for the primitives you need, and `package.json`
   for a library that already solves it. Do not hand-roll a dialog, select,
   calendar, chart, toast, or carousel.
3. **Do not create new top-level or `_`-prefixed folders.** Everything belongs
   in `app/`, `components/<feature>/`, `hooks/`, or `lib/`.

## The layers, in order

**1. Schema — `lib/schemas/<feature>.ts`**
Zod schemas for anything crossing a boundary (request bodies, model output,
form input), plus the inferred types. Export limits as named constants rather
than inlining numbers.

**2. Data access — `lib/<feature>.ts`**
Supabase queries and row-to-UI mapping. Define the row interface
(`<Thing>Row`) and a mapper next to it, like `rowToCompany` in
`lib/workers.ts`. Browser: `createClient()` from `lib/client.ts`. Server:
`await createClient()` from `lib/server.ts`, created per request.

**3. Hook — `hooks/use-<feature>.ts`**
`"use client"`. Owns loading, error, and data state; returns a small explicit
object. Validate anything coming back over the wire with the Zod schema before
putting it in state. Guard against setting state after unmount — the existing
hooks use an `active` flag in the effect cleanup.

**4. Components — `components/<feature>/`**
One concern per file, composed from `components/ui/`. Style with design tokens
(`text-primary`, `bg-background`, `border-border`), not raw hex. Keep files
small; split rather than growing one past a few hundred lines.

**5. Route — `app/<route>/page.tsx`**
Thin: export `metadata` and render the feature's top-level component.

## If the feature needs a route handler

Copy the shape of `app/api/repair-intake/route.ts`: rate-limit first, then Zod
validation, then the work, then a plain-language error. Check the session and
confirm the acting user owns the row they are touching — there is no shared
auth middleware doing it for you.

## If the feature needs a table or column

Use the `/migration` skill. Never edit an existing migration. Every new table
needs an RLS policy.

## Before you call it done

- `npx tsc --noEmit` and `npx eslint <changed files>` are clean.
- Empty, loading, and error states all render honestly.
- It works at 375px wide.
- No placeholder ratings, fake reviews, or invented social proof. If there is
  no data yet, say so in the UI.
