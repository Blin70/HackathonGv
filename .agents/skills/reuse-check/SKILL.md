---
name: reuse-check
description: Search Book A Fixer for existing components, hooks, helpers and libraries that already do what you are about to build, before writing new code. Use at the start of any task that adds a component, a piece of UI, a formatter, a validator, a data fetch, or a badge/label — and when a change would touch the same idea in more than one file.
---

# Check for reuse before you build

The failure this prevents is not writing bad code. It is writing *the same
code a fourth time*, slightly differently each time, so the behaviour drifts
and a fix has to be applied in four places.

Run this **before** writing, not after. `/simplify` is the after-the-fact pass.

## 1. Inventory what already exists

Spend a minute on these before deciding anything is new:

```bash
# UI primitives — almost everything is already here
ls components/ui/

# Shared, app-level components
ls components/*.tsx

# Feature components, grouped by area
ls components/*/

# Data hooks
ls hooks/

# Helpers, formatters, validators, data access
ls lib/ lib/schemas/
```

Then search for the *concept*, not the filename. If you are about to build a
price label, grep `price`; a rating, grep `rating` and `reviews`; an empty
state, grep `EmptyState`; a badge, grep `Badge`.

```bash
grep -rn "<concept>" --include=*.ts --include=*.tsx app components hooks lib
```

Check `package.json` too. `date-fns`, `libphonenumber-js`, `recharts`,
`sonner`, `vaul`, `cmdk`, `embla-carousel-react`, `react-day-picker`,
`class-variance-authority` and `zod` are already installed. Hand-rolling date
maths, phone parsing, a carousel, a toast or a chart is almost always wrong.

## 2. Decide honestly, in this order

1. **It already exists** → use it. Say so rather than silently duplicating.
2. **It almost exists** → extend the existing thing with a prop or a variant
   (`class-variance-authority`, as `components/ui/*` and `DemoBadge` do).
   Extending beats forking.
3. **It will exist twice after this change** → build it shared from the start,
   in `components/` for app-wide UI, `lib/` for logic, `hooks/` for state.
4. **It is genuinely one-off** → write it locally. Not everything should be
   extracted.

## 3. Know when *not* to extract

Over-abstraction is the opposite error and it is worse, because it couples
things that only looked alike. Leave them separate when:

- They share a **shape** but not a **reason to change**. Two cards that both
  show a name and a price, for different purposes, are not one component.
- Unifying needs three or more variant props to cover the differences. That is
  a signal the call sites genuinely differ.
- The duplication is two short blocks and one of them is about to be deleted.

A worked example in this codebase: the "rating, or New when there are no
reviews" rule appears in four places (`app/book/page.tsx`,
`components/book/WorkerHero.tsx`, `components/dashboard/DashboardHeader.tsx`,
`components/repair-intake/RepairWorkerMatches.tsx`). The *rule* is shared, but
one splits across a flex row, one sits on a dark photo, one is a dense list
row. These were left separate deliberately. `components/DemoBadge.tsx` went the
other way: same meaning, same reason to change, four call sites that had
already drifted in wording and colour.

## 4. Report what you found

In your summary, say which existing thing you reused, or which near-miss you
extended, or why you concluded nothing fit. A reader should be able to tell
you looked. If you found duplication you did not fix, name it and say why.
