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
- **Reuse before building — search first, then write.** Before adding a
  component, formatter, validator or badge, look for one that already exists:
  `components/ui/` (shadcn primitives), `components/*.tsx` (shared app
  components like `DemoBadge`, `EmptyState`, `StarRating`, `LoadingState`),
  `hooks/use-*`, `lib/`. Then check `package.json` — `date-fns`,
  `libphonenumber-js`, `recharts`, `sonner`, `vaul`, `cmdk`,
  `embla-carousel-react`, `react-day-picker` and `class-variance-authority`
  are already installed, so hand-rolling date maths, phone parsing, a
  carousel, a toast or a chart is almost always wrong.
  - If it almost exists, **extend it with a variant** rather than forking it.
  - If the change would make something exist twice, build it shared now.
  - Don't over-extract: things that share a shape but not a reason to change
    should stay separate.
  - Say in your summary what you reused, or why nothing fit.
  - The `/reuse-check` skill walks this properly; `/simplify` is the
    after-the-fact pass.
- The data flow is `component → hooks/use-*.ts → lib/*.ts → Supabase`. Client
  components should not query Supabase directly.
- Style with design tokens, never raw hex. There are no hex colours left in
  `app/` or `components/`; keep it that way. See **Colour** below.
- `components/ui/**` is vendored shadcn/ui code. Two lint rules are switched
  off there (`no-explicit-any`, `react-hooks/set-state-in-effect`) because
  they fire on upstream's own patterns — don't chase those. Every other rule
  still applies, and the repo is currently at zero lint problems; keep it there.

## Colour

The palette follows 60-30-10: neutrals carry most of the page, dark slate
bands are the secondary surface, and the brand green is the accent used
sparingly. Adding a seventh hue is almost always the wrong answer.

**Brand (the 10%)** — one hue, two lightnesses, both defined in
`app/globals.css`:

| Token | Value | Use | Never |
|---|---|---|---|
| `--primary` | `#1a7a4a` | Solid fills, link text on light | — |
| `--primary-bright` | `#32ad6d` | Text and icons on dark surfaces | As text on white (2.86:1) |

Use `bg-primary text-primary-foreground` for solid buttons rather than
`bg-primary text-white`: the foreground token flips with the theme, and in
dark mode `--primary` is the lighter tint, where white text fails.

**Neutral (the 60/30)** — `slate-*` and the shadcn tokens (`background`,
`muted`, `border`, `foreground`). `gray-*` is not used; don't reintroduce a
second neutral family.

**Functional** — these encode meaning and sit outside the palette. Keep them,
and don't borrow them for decoration:

- `red` — errors, destructive actions
- `amber` — warnings, star ratings, the example-listing badge
- `blue` — informational, and the "scheduled/accepted" booking state
- `violet` — the "in progress" booking state only
- `orange` — one step of the four-level urgency ramp in
  `RepairAssessmentPanel` (routine → soon → urgent → emergency). Collapsing
  that ramp would lose safety-relevant distinctions.

**Decoration gets no colour of its own.** Trade and category icons are all
`text-primary`. They used to be six different hues, which is most of why the
site looked busy.

Check contrast when changing any of this: white-on-`--primary` is 5.35:1 and
`--primary-bright` on `slate-950` is 7.04:1, both passing WCAG AA. The green
that shipped before this was `#00ae00`, which failed at 2.98:1.

## Type, radius and motion

The same restraint as the palette. Before this pass, 228 of 338 weight
declarations were bold or heavier — when most of a page shouts, nothing reads
as emphasised, and that was the main thing making the site look unfinished.

- **Weight.** `font-bold` is the heaviest thing on the site. `font-black` and
  `font-extrabold` are not used; don't reintroduce them. Headings are bold,
  UI labels and small text are `font-semibold`, body is `font-medium` or
  `font-normal`. **Small text (`text-xs` and below) is never `font-bold`** —
  semibold carries the emphasis without the shout.
- **Radius.** Cards and panels `rounded-2xl`, controls and inputs
  `rounded-xl`, pills and avatars `rounded-full`. `rounded-3xl` is not used.
  `components/ui/*` follows `--radius` and is left alone.
- **Shadow.** `shadow-sm` and `shadow-md` for resting surfaces, `shadow-lg`
  for things that genuinely float (modals, the hero panel). `shadow-xl` and
  `shadow-2xl` are not used — heavy drop shadows read cheap.
- **Motion.** Cards lift with `hover:-translate-y-1`. Small interactive
  elements may use `hover:scale-105`. **Buttons do not scale** — they change
  colour or opacity. One treatment per kind of thing, not five.

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

## Example listings, and the line they must not cross

`lib/data.ts` holds `COMPANIES`, a seeded catalogue of invented businesses with
stock photography. It exists so the marketplace does not look broken before
real tradespeople sign up, and it is legitimate **only** because it is labelled
and self-retiring:

- Every entry carries `isDemo: true`, and the UI badges it as "Example
  listing" in the marketplace, the detail hero and the repair-intake matches.
  **The badge is what makes them legitimate** — never render one without it.
- `NEXT_PUBLIC_SHOW_DEMO_LISTINGS` picks the behaviour, via `demoListingMode()`
  in `lib/workers.ts`: `always` (the default — examples sit alongside real
  listings, so one test account cannot empty the page), `until-real` (retire
  once any real listing exists), `never` (the switch to throw at launch).
  `getCompanyById` follows the same mode, so under `until-real` or `never` a
  stale `/book/<n>` link 404s rather than serving an invented business.
- `Company.id` is a `number` for these and a uuid `string` for real
  `worker_profiles` rows; code handling both must expect either.

**Never extend this into claims about reality.** An example listing is honest
because it says what it is. Invented reviews, an average rating, a customer
count or a guarantee are not — those were removed and must not come back. If
there is no data yet, say so in the UI. Several tests exist purely to catch
regressions here.

Prices are stored bare (`"900"`) and formatted at render by `lib/currency.ts`,
which is the only place the market's currency is defined.

## Routes

- `/` — the marketing landing page (`components/landing/LandingPage.tsx`).
  One search input, a reassurance line, then categories, listings and how it
  works. This is a value proposition, not a tool; keep it that way.
- `/describe` — the AI repair intake. The accelerator for people who don't
  know which trade they need, reached from the hero and from `/book`. It is
  deliberately **not** the homepage: it depends on a paid third-party call, so
  nothing load-bearing should sit behind it.
- `/book`, `/book/[id]` — marketplace and listing detail.
- `/home` and `/ai` are retired, and redirect (308) from `next.config.ts` to
  `/` and `/describe`. Middleware runs before those redirects, so both paths
  must stay in `PUBLIC_ROUTES` in `lib/proxy.ts` or a signed-out visitor is
  sent to login instead of being forwarded.

**A new public route needs an entry in `PUBLIC_ROUTES`**, or guests get
bounced to `/auth/login`.

## Other things worth knowing

- The repair assessment returns no cost estimate. Don't let copy promise one.
- There is one AI surface. `app/ai/page.tsx` was a second one, off the design
  system and building HTML from regex; it and its `/api/ai` endpoint were
  removed. Don't reintroduce a parallel chat UI.

## Testing

Vitest, with tests co-located next to the code as `*.test.ts`. `pnpm verify`
runs the whole gate (`typecheck`, `lint`, `test`); `pnpm test:watch` while
working.

The suite covers pure logic — schema boundaries, phone normalisation, the AI
rate limiter, row mappers. That is deliberate: it is the layer where a bug is
silent and expensive. Prefer adding to it over writing brittle UI assertions.

- The default environment is `node`. A test needing a DOM can opt in with
  `// @vitest-environment jsdom`, once jsdom is installed.
- `lib/ai/rate-limit.ts` keeps counters in a module-level Map, so its tests
  use a distinct IP each rather than resetting shared state.
- Never assert an invented rating, review count, or price. Several tests exist
  specifically to stop fabricated social proof reaching the UI.

CI (`.github/workflows/ci.yml`) runs typecheck, lint, test and `next build` on
every PR and on pushes to `main`. The build step matters: it catches
server/client boundary violations the other three miss.

## Gaps worth knowing

There is no analytics, so conversion claims are unmeasurable today — that
needs fixing before anyone reasons about funnel changes. No component or hook
tests yet, only the logic layer.
