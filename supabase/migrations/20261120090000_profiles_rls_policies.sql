-- The missing INSERT policy on `profiles`.
--
-- The table was created in the Supabase dashboard rather than in a migration,
-- so its policies were never in this repo. Saving a client profile failed with
--
--   42501: new row violates row-level security policy for table "profiles"
--
-- `saveClientProfile` in hooks/use-profile.ts calls `.upsert()`, and PostgREST
-- implements upsert as INSERT ... ON CONFLICT DO UPDATE — so it needs an
-- INSERT policy even when the row already exists. A person who signed up as a
-- tradesperson has no `profiles` row at all, which makes it a true insert.
--
-- The dashboard had four policies on this table: two SELECT and two UPDATE,
-- each a near-duplicate of the other. Nothing for INSERT. Compare
-- `worker_profiles`, whose "write own" policy is FOR ALL and therefore covers
-- inserts — which is why publishing a worker listing worked while saving a
-- client profile did not.
--
-- Only the missing policy is added here. The existing SELECT and UPDATE
-- policies work, and this migration deliberately does not touch them: their
-- USING clauses are not in this repo, so dropping one on the strength of its
-- name would be a guess at production access rules.

alter table public.profiles enable row level security;

-- Scoped to `authenticated` rather than `public`. The existing policies target
-- `public`, which in Postgres means every role including `anon`; they are safe
-- only because `auth.uid()` is null for a signed-out caller, so no row matches.
-- A new policy should not lean on that.
drop policy if exists "A person can create their own profile" on public.profiles;
create policy "A person can create their own profile"
  on public.profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

-- ---------------------------------------------------------------------------
-- Note, not applied here: `worker_profiles` is world-readable.
--
-- Its read policy is `USING (true)`, which the public marketplace needs — a
-- signed-out visitor has to see listings. But RLS is row-level, so "readable"
-- means every column, and the table holds each tradesperson's `phone`, which
-- no public screen displays. Anyone holding the publishable key (it ships in
-- the client bundle by design) can request it:
--
--   GET /rest/v1/worker_profiles?select=display_name,phone
--
-- The application side is handled: the public queries in lib/workers.ts now
-- ask for a named list of columns instead of `*`, so phone numbers are no
-- longer in the marketplace payload. That narrows exposure without closing it.
--
-- Closing it needs a column grant rather than a policy, roughly:
--
--   revoke select on public.worker_profiles from anon;
--   grant select (user_id, display_name, business_name, trade_type, tagline,
--                 about_us, services, available_days, price, banner_image,
--                 city, is_verified)
--     on public.worker_profiles to anon;
--
-- It is left out deliberately. Column grants are role-wide, not row-aware, so
-- the same restriction on `authenticated` would also block a tradesperson from
-- reading their own `phone` in the profile editor, which still selects `*`.
-- Decide how the owner reads their own row first, then apply this.
