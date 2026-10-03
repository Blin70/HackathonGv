import { format, parseISO } from "date-fns"

import { createClient } from "@/lib/client"

/**
 * Single source of truth for booking statuses. The union type is derived from
 * this tuple, so the values and the type can never drift apart, and the array is
 * available at runtime (iteration, validation, DB check constraint parity).
 */
export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "declined",
  "cancelled",
] as const

export type BookingStatus = (typeof BOOKING_STATUSES)[number]

/**
 * Statuses that represent a live engagement. A client may hold only one booking
 * per worker in this set — mirrored by the `bookings_one_open_request_per_pair`
 * partial unique index, which is the actual guarantee.
 */
export const OPEN_BOOKING_STATUSES = ["pending", "confirmed", "in_progress"] as const

/** Statuses a job can no longer move out of. */
export const CLOSED_BOOKING_STATUSES = ["completed", "declined", "cancelled"] as const

/**
 * Which status each side may move a booking to. Encoding the lifecycle here
 * keeps the buttons, the guards, and the DB constraint describing one process
 * rather than three.
 */
export const BOOKING_TRANSITIONS: Record<
  BookingStatus,
  { worker: BookingStatus[]; client: BookingStatus[] }
> = {
  // A job runs start-then-finish: "Mark complete" only appears once it has
  // actually been started, so the two never compete for the same click.
  pending: { worker: ["confirmed", "declined"], client: ["cancelled"] },
  confirmed: { worker: ["in_progress", "cancelled"], client: ["cancelled"] },
  in_progress: { worker: ["completed", "cancelled"], client: [] },
  completed: { worker: [], client: [] },
  declined: { worker: [], client: [] },
  cancelled: { worker: [], client: [] },
}

/** The times of day a client can request, on the half hour from 08:00 to 20:00. */
export const BOOKING_TIME_SLOTS: string[] = Array.from({ length: 25 }, (_, index) => {
  const minutes = 8 * 60 + index * 30
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`
})

/** Renders a stored `HH:MM[:SS]` clock time for display, e.g. "09:30". */
export function formatBookingTime(time: string | null): string | null {
  if (!time) return null
  const [hours, minutes] = time.split(":")
  if (hours === undefined || minutes === undefined) return null
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`
}

/** A `public.bookings` row. */
export interface Booking {
  id: string
  client_id: string
  client_name: string
  worker_id: string
  worker_name: string
  trade_type: string | null
  message: string | null
  preferred_date: string | null
  /** `HH:MM:SS` as returned by Postgres `time`. */
  preferred_time: string | null
  client_phone: string | null
  address: string | null
  status: BookingStatus
  started_at: string | null
  completed_at: string | null
  cancelled_at: string | null
  cancelled_by: CancelledBy | null
  cancellation_reason: string | null
  created_at: string
  updated_at: string
}

/** Which side walked away from an accepted job. */
export type CancelledBy = "client" | "worker"

export interface CreateBookingInput {
  clientId: string
  clientName: string
  workerId: string
  workerName: string
  tradeType?: string | null
  /** All of these are required by the request form — a worker can't plan without them. */
  message: string
  /** ISO `yyyy-MM-dd`; the column is a bare `date`, so no timezone shifting. */
  preferredDate: string
  /** `HH:MM` on the half hour. */
  preferredTime: string
  clientPhone: string
  address: string
}

/** Postgres unique-violation, raised by `bookings_one_open_request_per_pair`. */
const UNIQUE_VIOLATION = "23505"

export class DuplicateBookingError extends Error {
  constructor(workerName: string) {
    super(`You already have an open request with ${workerName}.`)
    this.name = "DuplicateBookingError"
  }
}

/**
 * Creates a pending booking request.
 *
 * The partial unique index is the real defence against duplicate open requests
 * — checking first would still race — so a unique violation is translated into
 * a message the client can act on.
 */
export async function createBooking(input: CreateBookingInput) {
  const supabase = createClient()
  const { error } = await supabase.from("bookings").insert({
    client_id: input.clientId,
    client_name: input.clientName,
    worker_id: input.workerId,
    worker_name: input.workerName,
    trade_type: input.tradeType ?? null,
    message: input.message.trim(),
    preferred_date: input.preferredDate,
    preferred_time: input.preferredTime,
    client_phone: input.clientPhone.trim(),
    address: input.address.trim(),
  })

  if (error?.code === UNIQUE_VIOLATION) {
    throw new DuplicateBookingError(input.workerName)
  }
  return { error }
}

/** True when the client already holds an open request with this worker. */
export async function hasOpenBooking(clientId: string, workerId: string): Promise<boolean> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("bookings")
    .select("id")
    .eq("client_id", clientId)
    .eq("worker_id", workerId)
    .in("status", [...OPEN_BOOKING_STATUSES])
    .limit(1)

  if (error) return false
  return (data?.length ?? 0) > 0
}

/**
 * The schedule a client asked for, e.g. "Tue, 15 Sep 2026 · 09:30".
 * Returns null when neither part is set, so callers can hide the row.
 */
export function formatBookingSchedule(booking: Booking): string | null {
  const slot = formatBookingTime(booking.preferred_time)

  if (!booking.preferred_date) return slot

  // parseISO reads a bare `yyyy-MM-dd` as local midnight. `new Date(...)` would
  // read it as UTC and render the previous day anywhere west of Greenwich.
  const date = parseISO(booking.preferred_date)
  if (Number.isNaN(date.getTime())) return slot

  const day = format(date, "EEE, d MMM yyyy")
  return slot ? `${day} · ${slot}` : day
}

/** Requests the signed-in user has sent (as a client). */
export async function fetchSentBookings(userId: string): Promise<Booking[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("client_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data as Booking[] | null) ?? []
}

/** Requests the signed-in user has received (as a worker). */
export async function fetchReceivedBookings(userId: string): Promise<Booking[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("worker_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data as Booking[] | null) ?? []
}

/** Loads both sides of a user's bookings in one call. */
export async function fetchUserBookings(
  userId: string
): Promise<{ sent: Booking[]; received: Booking[] }> {
  const [sent, received] = await Promise.all([
    fetchSentBookings(userId),
    fetchReceivedBookings(userId),
  ])
  return { sent, received }
}

/** One month of request volume, split by whether the worker won the job. */
export interface BookingActivityPoint {
  month: string
  confirmed: number
  other: number
}

/** Groups a date into the calendar month it belongs to. */
function monthKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}`
}

/**
 * Buckets bookings into the last `months` calendar months, oldest first. Empty
 * months are kept so the chart shows a continuous timeline rather than
 * collapsing gaps and implying activity that never happened.
 */
export function monthlyBookingActivity(
  bookings: Booking[],
  months = 6
): BookingActivityPoint[] {
  const now = new Date()
  const buckets = new Map<string, BookingActivityPoint>()

  for (let offset = months - 1; offset >= 0; offset--) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1)
    buckets.set(monthKey(date), { month: format(date, "MMM"), confirmed: 0, other: 0 })
  }

  for (const booking of bookings) {
    const created = new Date(booking.created_at)
    if (Number.isNaN(created.getTime())) continue

    const point = buckets.get(monthKey(created))
    if (!point) continue // older than the window we chart

    if (booking.status === "confirmed") point.confirmed += 1
    else point.other += 1
  }

  return [...buckets.values()]
}

/** Updates a booking's status (worker confirm/decline, or client cancel). */
export interface StatusChangeOptions {
  /** Required when cancelling: which side walked away. */
  cancelledBy?: CancelledBy
  /** Required when a worker cancels an accepted job (min 10 chars, enforced in the DB). */
  reason?: string
}

/**
 * Updates a booking's status and stamps the moment it happened.
 *
 * `updated_at` alone can't answer "when did this job start" once anything else
 * touches the row, so each milestone gets its own column.
 */
export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
  options: StatusChangeOptions = {}
) {
  const supabase = createClient()
  const now = new Date().toISOString()

  const milestone: Record<string, string | null> = {}
  if (status === "in_progress") milestone.started_at = now
  if (status === "completed") milestone.completed_at = now
  if (status === "cancelled") {
    milestone.cancelled_at = now
    milestone.cancelled_by = options.cancelledBy ?? null
    milestone.cancellation_reason = options.reason?.trim() || null
  }

  return supabase
    .from("bookings")
    .update({ status, updated_at: now, ...milestone })
    .eq("id", id)
}
