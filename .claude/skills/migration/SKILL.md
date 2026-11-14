---
name: migration
description: Create a new timestamped Supabase migration for Book A Fixer with the RLS policy checklist. Use when a change needs a new table, column, constraint, index, or policy.
disable-model-invocation: true
---

# New Supabase migration

## Rules

1. **Never edit an existing file in `supabase/migrations/`.** It has been
   applied to at least one database. Changing it desyncs every environment
   that already ran it. Always add a new file.
2. **Name it `YYYYMMDDHHMMSS_short_snake_case_description.sql`**, matching the
   existing files (e.g. `20260912100000_booking_timestamps_and_cancellation.sql`).
   Use a timestamp later than every file already there — check with
   `ls supabase/migrations/`.
3. **Forward-only and idempotent where possible.** Prefer
   `create table if not exists`, `add column if not exists`,
   `drop policy if exists` before `create policy`.

## Write the migration

Open with a comment saying what it does and why. Then, in order: schema
changes, constraints and indexes, RLS, triggers.

```sql
-- <what this migration does, and why it is needed>

alter table public.<table>
  add column if not exists <name> <type>;

-- Index anything this app filters or joins on.
create index if not exists <table>_<column>_idx
  on public.<table> (<column>);
```

## RLS checklist — do not skip

RLS is the only access boundary in this app. Client code runs queries with the
caller's own token, so a table without the right policies is readable or
writable by any signed-in user.

For every new table:

- [ ] `alter table public.<table> enable row level security;`
- [ ] A `select` policy — who may read a row, and how is that expressed
      against `auth.uid()`?
- [ ] An `insert` policy with a `with check` that pins the owning column to
      `auth.uid()`, so a caller cannot create rows owned by someone else.
- [ ] An `update` policy with **both** `using` and `with check` — `using`
      alone lets a caller reassign ownership.
- [ ] A `delete` policy, or a deliberate decision that nobody deletes.
- [ ] Named policies, so a later migration can `drop policy if exists`.

For a new column on an existing table: does any policy need widening, and does
that accidentally expose other columns?

```sql
alter table public.<table> enable row level security;

drop policy if exists "<table>_select_own" on public.<table>;
create policy "<table>_select_own"
  on public.<table> for select
  using (auth.uid() = user_id);

drop policy if exists "<table>_update_own" on public.<table>;
create policy "<table>_update_own"
  on public.<table> for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

## After writing it

1. Update the matching row interface and mapper in `lib/` (for example
   `WorkerProfileRow` and `rowToCompany` in `lib/workers.ts`) and any Zod
   schema in `lib/schemas/` — a migration that the types don't know about is
   a runtime error waiting to happen.
2. Run `npx tsc --noEmit`.
3. Tell the user the migration needs applying; don't assume it ran.
