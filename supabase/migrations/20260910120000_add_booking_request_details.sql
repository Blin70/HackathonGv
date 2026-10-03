-- Booking request details.
--
-- Until now a booking recorded only who requested whom. A tradesperson had no
-- way to tell what the job was, when the client wanted it, where it is, or how
-- to reach them — so every accepted job was a dead end. These columns carry the
-- request itself.
--
-- All nullable: existing rows predate the request form and must stay valid.

alter table public.bookings
  add column if not exists preferred_date date,
  add column if not exists preferred_time text,
  add column if not exists client_phone   text,
  add column if not exists address        text;

-- Keep the allowed slots in sync with PREFERRED_TIMES in lib/bookings.ts.
alter table public.bookings
  drop constraint if exists bookings_preferred_time_check;

alter table public.bookings
  add constraint bookings_preferred_time_check
  check (
    preferred_time is null
    or preferred_time in ('morning', 'afternoon', 'evening')
  );

-- Workers sort their inbox by when the job is needed, not when it was asked.
create index if not exists bookings_worker_preferred_date_idx
  on public.bookings (worker_id, preferred_date);
