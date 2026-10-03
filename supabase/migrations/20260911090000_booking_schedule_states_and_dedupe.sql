-- Three related corrections to bookings.
--
-- 1. `preferred_time` becomes a real clock time. Morning/afternoon/evening was
--    too vague to plan a day around; clients now pick an actual time.
-- 2. Accepting a job is not finishing it, so the lifecycle gains `in_progress`
--    and `completed`.
-- 3. A client may only hold one open request per worker, which stops repeat
--    requests to the same business from piling up.

-- 1 ── preferred_time: text slot -> time -------------------------------------
-- Guarded so re-running is safe: the cast only applies while the column is
-- still text. Existing slots map onto the middle of the window they described.
alter table public.bookings
  drop constraint if exists bookings_preferred_time_check;

do $$
begin
  if exists (
    select 1
      from information_schema.columns
     where table_schema = 'public'
       and table_name   = 'bookings'
       and column_name  = 'preferred_time'
       and data_type    = 'text'
  ) then
    alter table public.bookings
      alter column preferred_time type time without time zone
      using case preferred_time
              when 'morning'   then time '09:00'
              when 'afternoon' then time '13:00'
              when 'evening'   then time '18:00'
              else null
            end;
  end if;
end $$;

-- 2 ── richer lifecycle -------------------------------------------------------
-- Keep in sync with BOOKING_STATUSES in lib/bookings.ts.
-- NOTE: this assumes `status` is text + CHECK (the default schema). If you ran
-- the optional `booking_status` enum instead, use ALTER TYPE ... ADD VALUE for
-- 'in_progress' and 'completed' rather than this block.
alter table public.bookings
  drop constraint if exists bookings_status_check;

alter table public.bookings
  add constraint bookings_status_check
  check (
    status in ('pending', 'confirmed', 'in_progress', 'completed', 'declined', 'cancelled')
  );

-- 3 ── retire duplicate open requests ----------------------------------------
-- The index below cannot be created while a pair already holds more than one
-- open row, which is the normal state of a database that has been tested
-- against. Keep the most recent request per pair and cancel the rest: the newer
-- request is the one the client actually meant, and cancelling preserves the
-- history rather than deleting it.
--
-- On a fresh database this matches nothing and does nothing.

with ranked as (
  select id,
         row_number() over (
           partition by client_id, worker_id
           order by created_at desc, id desc
         ) as position
    from public.bookings
   where status in ('pending', 'confirmed', 'in_progress')
)
update public.bookings as b
   set status     = 'cancelled',
       updated_at = now()
  from ranked as r
 where b.id = r.id
   and r.position > 1;

-- 4 ── one open request per client/worker pair --------------------------------
-- Partial index: only *open* engagements collide, so a client can hire the same
-- worker again once the previous job is completed, declined, or cancelled.

create unique index if not exists bookings_one_open_request_per_pair
  on public.bookings (client_id, worker_id)
  where status in ('pending', 'confirmed', 'in_progress');
