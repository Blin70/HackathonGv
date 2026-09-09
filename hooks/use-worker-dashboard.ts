"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { createClient } from "@/lib/client"
import {
  fetchWorkerRow,
  profileChecklist,
  profileCompleteness,
  type WorkerProfileRow,
} from "@/lib/workers"
import {
  fetchReceivedBookings,
  monthlyBookingActivity,
  updateBookingStatus,
  type Booking,
  type BookingStatus,
} from "@/lib/bookings"
import { averageRating, fetchReviews, type ReviewItem } from "@/lib/reviews"
import { getErrorMessage } from "@/lib/utils"

/**
 * Loads everything a signed-in worker needs for their dashboard — their listing,
 * the booking requests they've received, and the reviews they've earned — and
 * lets them confirm/decline pending requests inline.
 */
export function useWorkerDashboard() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState("")
  const [listing, setListing] = useState<WorkerProfileRow | null>(null)
  const [received, setReceived] = useState<Booking[]>([])
  const [reviews, setReviews] = useState<ReviewItem[]>([])
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
        if (!active) return
        setUserId(user.id)

        const [listingRow, bookings, reviewItems] = await Promise.all([
          fetchWorkerRow(user.id),
          fetchReceivedBookings(user.id),
          fetchReviews(user.id),
        ])

        if (!active) return
        setListing(listingRow)
        setReceived(bookings)
        setReviews(reviewItems)
      } catch (err) {
        if (active) {
          console.error("Failed to load dashboard:", err)
          setError(getErrorMessage(err, "We couldn't load your dashboard. Please try again."))
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

  const applyStatus = useCallback(async (id: string, status: BookingStatus) => {
    setBusyId(id)
    try {
      const { error: updateError } = await updateBookingStatus(id, status)
      if (updateError) throw updateError
      setReceived((prev) =>
        prev.map((booking) => (booking.id === id ? { ...booking, status } : booking))
      )
    } catch (err) {
      console.error("Failed to update booking:", err)
    } finally {
      setBusyId(null)
    }
  }, [])

  const confirmBooking = useCallback((id: string) => applyStatus(id, "confirmed"), [applyStatus])
  const declineBooking = useCallback((id: string) => applyStatus(id, "declined"), [applyStatus])

  const pending = received.filter((booking) => booking.status === "pending")
  const confirmed = received.filter((booking) => booking.status === "confirmed")
  const declined = received.filter((booking) => booking.status === "declined").length
  const responded = confirmed.length + declined

  const checklist = listing ? profileChecklist(listing) : []

  const stats = {
    rating: averageRating(reviews, 0),
    reviewCount: reviews.length,
    pending: pending.length,
    confirmed: confirmed.length,
    total: received.length,
    // Share of decided requests that were accepted; null until there's data.
    acceptanceRate: responded > 0 ? Math.round((confirmed.length / responded) * 100) : null,
    completeness: profileCompleteness(checklist),
  }

  return {
    loading,
    error,
    reload,
    userId,
    listing,
    received,
    pending,
    confirmed,
    reviews,
    checklist,
    stats,
    activity: monthlyBookingActivity(received),
    busyId,
    confirmBooking,
    declineBooking,
  }
}
