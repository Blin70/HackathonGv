"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { createClient } from "@/lib/client"
import {
  fetchUserBookings,
  updateBookingStatus,
  type Booking,
  type BookingStatus,
  type StatusChangeOptions,
} from "@/lib/bookings"
import { getErrorMessage } from "@/lib/utils"

/**
 * Loads the signed-in user's bookings from both sides — requests they sent (as a
 * client) and requests they received (as a worker) — and exposes the status
 * transitions each side can make, plus a `reload` for retrying after an error.
 */
export function useBookings() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState<Booking[]>([])
  const [received, setReceived] = useState<Booking[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    // `active` discards the result of a run that was already cleaned up (React
    // Strict Mode double-mounts in dev, and `reload` re-runs this effect), so an
    // aborted run can't clobber state or surface a spurious error.
    let active = true

    async function load() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        const { sent: sentRows, received: receivedRows } = await fetchUserBookings(user.id)
        if (!active) return
        setSent(sentRows)
        setReceived(receivedRows)
      } catch (err) {
        if (active) {
          console.error("Failed to load bookings:", err)
          setError(getErrorMessage(err, "We couldn't load your bookings. Please try again."))
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [supabase, router, refreshKey])

  /** Re-runs the load — used to retry after a transient failure. */
  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    setRefreshKey((key) => key + 1)
  }, [])

  const applyStatus = useCallback(
    async (
      id: string,
      status: BookingStatus,
      bucket: "sent" | "received",
      options?: StatusChangeOptions
    ) => {
      setBusyId(id)
      const setter = bucket === "sent" ? setSent : setReceived
      try {
        const { error: updateError } = await updateBookingStatus(id, status, options)
        if (updateError) throw updateError
        // Refetch rather than patching locally: the row now carries server-set
        // milestone timestamps the card renders.
        setRefreshKey((key) => key + 1)
        setter((prev) =>
          prev.map((booking) => (booking.id === id ? { ...booking, status } : booking))
        )
      } catch (err) {
        console.error("Failed to update booking:", err)
      } finally {
        setBusyId(null)
      }
    },
    []
  )

  /** Moves a request the user received (as a worker) along the lifecycle. */
  const transitionReceived = useCallback(
    (id: string, status: BookingStatus, options?: StatusChangeOptions) =>
      applyStatus(id, status, "received", options),
    [applyStatus]
  )

  /** Moves a request the user sent (as a client) — in practice, cancelling. */
  const transitionSent = useCallback(
    (id: string, status: BookingStatus, options?: StatusChangeOptions) =>
      applyStatus(id, status, "sent", options),
    [applyStatus]
  )

  return {
    loading,
    error,
    sent,
    received,
    busyId,
    reload,
    transitionReceived,
    transitionSent,
  }
}
