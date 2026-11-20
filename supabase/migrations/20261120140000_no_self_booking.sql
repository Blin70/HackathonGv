-- A booking has two different people on it, and a review is written by someone
-- other than its subject.
--
-- Neither was enforced anywhere: a tradesperson could open their own listing,
-- send themselves a booking request, and then review themselves — which is the
-- one thing a ratings system exists to prevent. The UI now hides both actions
-- and lib/bookings.ts throws, but the client is not a boundary; this is.
--
-- Cast to text because these columns hold uuids for real accounts and
-- catalogue numbers ("1", "2", ...) for the seeded example listings, so the
-- comparison has to work for both shapes.

alter table public.bookings
  drop constraint if exists bookings_no_self_booking;

-- NOT VALID: enforced for every new row, existing rows left alone. Any
-- self-booking already in the table would otherwise make this statement fail,
-- and deleting someone's rows is not a migration's job. To find them:
--
--   select id, client_id, worker_id, status, created_at
--     from public.bookings
--    where client_id::text = worker_id::text;
--
-- Once they are gone: alter table public.bookings validate constraint
-- bookings_no_self_booking;
alter table public.bookings
  add constraint bookings_no_self_booking
  check (client_id::text <> worker_id::text)
  not valid;

alter table public.reviews
  drop constraint if exists reviews_no_self_review;

-- Same reasoning. To find existing self-reviews:
--
--   select id, author_id, worker_id, rating
--     from public.reviews
--    where author_id::text = worker_id::text;
alter table public.reviews
  add constraint reviews_no_self_review
  check (author_id::text <> worker_id::text)
  not valid;
