"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import type { User } from "@supabase/supabase-js"

import { hasCompletedBooking } from "@/lib/bookings"
import type { Company } from "@/lib/data"
import {
  averageRating,
  createReviewItem,
  fetchReviews,
  upsertReview,
  type NewReview,
  type ReviewItem,
} from "@/lib/reviews"
import { describeError } from "@/lib/utils"

/** Loads a worker's reviews and lets the signed-in user post or edit their own (one per worker). */
export function useWorkerReviews(company: Company | null, user: User | null) {
  const [items, setItems] = useState<ReviewItem[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  // Holds "<userId>:<workerId>" once a completed booking is confirmed for that
  // exact pair, rather than a bare boolean. A boolean would stay true for a
  // moment after switching account or listing, which is the one direction this
  // flag must never be wrong in.
  const [reviewableFor, setReviewableFor] = useState<string | null>(null)

  useEffect(() => {
    if (!company) return
    let active = true
    fetchReviews(company.id)
      .then((reviews) => {
        if (active) setItems(reviews)
      })
      .catch((error) => console.error(`Failed to load reviews: ${describeError(error)}`))
    return () => {
      active = false
    }
  }, [company])

  const reviewPair = user && company ? `${user.id}:${String(company.id)}` : null

  useEffect(() => {
    if (!reviewPair) return
    const [clientId, workerId] = reviewPair.split(":")
    let active = true

    hasCompletedBooking(clientId, workerId)
      .then((completed) => {
        if (active && completed) setReviewableFor(reviewPair)
      })
      .catch((error) => console.error(`Failed to check booking history: ${describeError(error)}`))

    return () => {
      active = false
    }
  }, [reviewPair])

  /** Only true for the pair the check actually ran against. */
  const canReview = reviewPair !== null && reviewableFor === reviewPair

  const myReview = user ? items.find((review) => review.authorId === user.id) ?? null : null

  const submitReview = async (input: NewReview) => {
    if (!company || !user) return

    const editing = Boolean(myReview)
    const { error } = await upsertReview(input, company, user)
    if (error) {
      console.error(`Failed to publish review: ${describeError(error)}`)
      toast.error("Couldn't publish your review. Please try again.")
      return
    }

    // Optimistically replace the user's existing review, or add a new one.
    const item = createReviewItem(input, company.type, user.id)
    setItems((prev) => [item, ...prev.filter((review) => review.authorId !== user.id)])
    setDialogOpen(false)
    toast.success(editing ? "Review updated" : "Review published", {
      description: "Thanks for sharing your feedback!",
    })
  }

  return {
    items,
    average: averageRating(items, company?.rating ?? 0),
    dialogOpen,
    setDialogOpen,
    submitReview,
    myReview,
    /** Whether this viewer has a completed job with this worker. */
    canReview,
  }
}
