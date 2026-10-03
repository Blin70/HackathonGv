-- Job timing and accountable cancellation.
--
-- `updated_at` only ever holds the last change, so it can't answer "when did
-- this job actually start" once anything else touches the row. Each meaningful
-- moment gets its own column.
--
-- Cancellation after a job was accepted is recorded rather than prevented: who
-- walked away, when, and why. That turns an invisible escape hatch into a fact
-- the business can measure — see the cancellation-rate view at the bottom.

alter table public.bookings
  add column if not exists started_at          timestamptz,
  add column if not exists completed_at        timestamptz,
  add column if not exists cancelled_at        timestamptz,
  add column if not exists cancelled_by        text,
  add column if not exists cancellation_reason text;

alter table public.bookings
  drop constraint if exists bookings_cancelled_by_check;

alter table public.bookings
  add constraint bookings_cancelled_by_check
  check (cancelled_by is null or cancelled_by in ('client', 'worker'));

-- A worker who abandons an accepted job must say why; a client cancelling a
-- request they never had accepted does not owe an explanation.
alter table public.bookings
  drop constraint if exists bookings_worker_cancellation_needs_reason;

alter table public.bookings
  add constraint bookings_worker_cancellation_needs_reason
  check (
    cancelled_by is distinct from 'worker'
    or coalesce(length(btrim(cancellation_reason)), 0) >= 10
  );

-- Cancellation rate per worker, so the escape hatch carries a visible cost.
-- Counts only jobs the worker had already accepted — declining a request up
-- front is legitimate and is deliberately excluded.
create or replace view public.worker_reliability as
select
  worker_id,
  count(*) filter (where status = 'completed')                              as completed_jobs,
  count(*) filter (where status = 'cancelled' and cancelled_by = 'worker')  as cancelled_by_worker,
  round(
    100.0 * count(*) filter (where status = 'cancelled' and cancelled_by = 'worker')
    / nullif(count(*) filter (
        where status = 'completed'
           or (status = 'cancelled' and cancelled_by = 'worker')
      ), 0)
  ) as cancellation_rate
from public.bookings
group by worker_id;
