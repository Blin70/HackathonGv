"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import type { User } from "@supabase/supabase-js"

import type { Company } from "@/lib/data"
import {
  averageRating,
  createReviewItem,
  fetchReviews,
  upsertReview,
  type NewReview,
  type ReviewItem,
} from "@/lib/reviews"

/** Loads a worker's reviews and lets the signed-in user post or edit their own (one per worker). */
export function useWorkerReviews(company: Company | null, user: User | null) {
  const [items, setItems] = useState<ReviewItem[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    if (!company) return
    let active = true
    fetchReviews(company.id)
      .then((reviews) => {
        if (active) setItems(reviews)
      })
      .catch((error) => console.error("Failed to load reviews:", error))
    return () => {
      active = false
    }
  }, [company])

  const myReview = user ? items.find((review) => review.authorId === user.id) ?? null : null

  const submitReview = async (input: NewReview) => {
    if (!company || !user) return

    const editing = Boolean(myReview)
    const { error } = await upsertReview(input, company, user)
    if (error) {
      console.error("Failed to publish review:", error)
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
  }
}
