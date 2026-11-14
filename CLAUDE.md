# Book A Fixer

A marketplace connecting homeowners in North Macedonia with local tradespeople.
Pre-seed funded and heading for real users, so treat this as production code:
placeholder content and unguarded public endpoints are bugs, not shortcuts.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (`strict`) · Tailwind v4 ·
shadcn/ui · Supabase (auth + Postgres) · OpenAI · Zod

**pnpm is the package manager.** `pnpm dev` · `pnpm build` · `pnpm lint`

## Layout and conventions

```
app/                  routes; app/api/* are route handlers
components/<feature>/ feature components (book, bookings, dashboard, profile, repair-intake)
components/ui/        shadcn/ui primitives — do not hand-roll what lives here
hooks/use-*.ts        client-side data hooks
lib/                  data access, mapping, helpers
lib/schemas/          Zod schemas
supabase/migrations/  timestamped SQL migrations
```

- **Put new code in these existing folders.** Don't invent new top-level or
  `_`-prefixed directories.
- **Reuse before building.** Check `components/ui/` and the installed
  dependencies first — `date-fns`, `libphonenumber-js`, `recharts`, `sonner`,
  `vaul`, `cmdk`, `embla-carousel-react`, `react-day-picker` are all already
  here. Keep files small and split along the folders above.
- The data flow is `component → hooks/use-*.ts → lib/*.ts → Supabase`. Client
  components should not query Supabase directly.
- Style with design tokens (`text-primary`, `bg-background`, `border-border`),
  not raw hex. The brand green `#1a7a4a` is still hardcoded in older files;
  prefer the token when you touch them.

## Supabase

- Browser: `createClient()` from `lib/client.ts`
- Server (route handlers, server components): `await createClient()` from
  `lib/server.ts` — create a new client per request, never a module global.
- Row types live beside their mappers in `lib/` (e.g. `WorkerProfileRow` and
  `rowToCompany` in `lib/workers.ts`).
- **Never edit a migration that already exists** — it has been applied
  somewhere. Add a new timestamped file instead.
- RLS is the access boundary. Any new table or column needs a policy; don't
  rely on the client filtering correctly.

## AI route handlers

`app/api/repair-intake/route.ts` is the pattern to copy:

1. Rate-limit via `checkAiRateLimit(getClientIp(request))`.
2. Validate the body with a Zod schema from `lib/schemas/`.
3. Call OpenAI with `zodTextFormat(...)` for structured output, `store: false`,
   an explicit `max_output_tokens`, and a timeout.
4. Log the error shape, return a plain-language message — never the raw error.

Model comes from `OPENAI_MODEL` (defaults to `gpt-6-luna`). `OPENAI_API_KEY`
is server-only; never prefix it with `NEXT_PUBLIC_`.

These endpoints are unauthenticated and cost money per call, so every change
to them should consider abuse and spend. `lib/ai/rate-limit.ts` is in-memory:
it resets on deploy and does not hold across serverless instances, so it is
not real protection yet.

## Known placeholder content (remove before launch)

These are demo leftovers that would be a legal and trust problem with real
users. Flag them when you touch the surrounding code; don't copy the pattern.

- `lib/data.ts` — `COMPANIES` is seeded demo data with Unsplash stock photos
  and invented ratings. `Company.id` is a `number` for these and a uuid
  `string` for real `worker_profiles` rows; code handling both must expect it.
- `app/home/page.tsx` — fabricated testimonials with fake names, a
  "4.9 / 5 Average Customer Rating", an unbacked "100% satisfaction guarantee",
  and `$`-denominated prices in a market that uses MKD/EUR.
- `app/ai/page.tsx` — a second AI surface, off the shared design system, that
  builds HTML from regex. Prefer `components/repair-intake/` and don't extend
  this page.

## Gaps worth knowing

No test suite and no CI yet, so `pnpm build` and `npx tsc --noEmit` are the
only real gates. There is no analytics, so conversion claims are unmeasurable
today.
