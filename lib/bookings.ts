import { createClient } from "@/lib/client"

/**
 * Single source of truth for booking statuses. The union type is derived from
 * this tuple, so the values and the type can never drift apart, and the array is
 * available at runtime (iteration, validation, DB check constraint parity).
 */
export const BOOKING_STATUSES = ["pending", "confirmed", "declined", "cancelled"] as const

export type BookingStatus = (typeof BOOKING_STATUSES)[number]

/** A `public.bookings` row. */
export interface Booking {
  id: string
  client_id: string
  client_name: string
  worker_id: string
  worker_name: string
  trade_type: string | null
  message: string | null
  status: BookingStatus
  created_at: string
  updated_at: string
}

export interface CreateBookingInput {
  clientId: string
  clientName: string
  workerId: string
  workerName: string
  tradeType?: string | null
  message?: string | null
}

/** Creates a pending booking request. Returns Supabase's `{ error }`. */
export async function createBooking(input: CreateBookingInput) {
  const supabase = createClient()
  return supabase.from("bookings").insert({
    client_id: input.clientId,
    client_name: input.clientName,
    worker_id: input.workerId,
    worker_name: input.workerName,
    trade_type: input.tradeType ?? null,
    message: input.message ?? null,
  })
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

/** Updates a booking's status (worker confirm/decline, or client cancel). */
export async function updateBookingStatus(id: string, status: BookingStatus) {
  const supabase = createClient()
  return supabase
    .from("bookings")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
}
