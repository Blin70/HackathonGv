"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { createClient } from "@/lib/client"
import { fetchWorkerRow, type WorkerProfileRow } from "@/lib/workers"
import {
  fetchReceivedBookings,
  updateBookingStatus,
  type Booking,
  type BookingStatus,
} from "@/lib/bookings"
import { averageRating, fetchReviews, type ReviewItem } from "@/lib/reviews"

/**
 * Loads everything a signed-in worker needs for their dashboard — their listing,
 * the booking requests they've received, and the reviews they've earned — and
 * lets them confirm/decline pending requests inline.
 */
export function useWorkerDashboard() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState("")
  const [listing, setListing] = useState<WorkerProfileRow | null>(null)
  const [received, setReceived] = useState<Booking[]>([])
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
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
      } catch (error) {
        console.error("Failed to load dashboard:", error)
      } finally {
        if (active) setLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [supabase, router])

  const applyStatus = useCallback(async (id: string, status: BookingStatus) => {
    setBusyId(id)
    try {
      const { error } = await updateBookingStatus(id, status)
      if (error) throw error
      setReceived((prev) =>
        prev.map((booking) => (booking.id === id ? { ...booking, status } : booking))
      )
    } catch (error) {
      console.error("Failed to update booking:", error)
    } finally {
      setBusyId(null)
    }
  }, [])

  const confirmBooking = useCallback((id: string) => applyStatus(id, "confirmed"), [applyStatus])
  const declineBooking = useCallback((id: string) => applyStatus(id, "declined"), [applyStatus])

  const pending = received.filter((booking) => booking.status === "pending")
  const confirmed = received.filter((booking) => booking.status === "confirmed").length
  const declined = received.filter((booking) => booking.status === "declined").length
  const responded = confirmed + declined

  const stats = {
    rating: averageRating(reviews, 0),
    reviewCount: reviews.length,
    pending: pending.length,
    confirmed,
    total: received.length,
    // Share of decided requests that were accepted; null until there's data.
    acceptanceRate: responded > 0 ? Math.round((confirmed / responded) * 100) : null,
  }

  return {
    loading,
    userId,
    listing,
    pending,
    reviews,
    stats,
    busyId,
    confirmBooking,
    declineBooking,
  }
}
