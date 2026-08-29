"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import type { User } from "@supabase/supabase-js"

import type { Company } from "@/lib/data"
import {
  averageRating,
  createReviewItem,
  fetchReviews,
  insertReview,
  type NewReview,
  type ReviewItem,
} from "@/lib/reviews"

/** Loads a worker's reviews from the DB, and posts new ones as the signed-in user. */
export function useWorkerReviews(company: Company | null, user: User | null) {
  const [items, setItems] = useState<ReviewItem[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    if (!company) return
    let active = true
    fetchReviews(company)
      .then((reviews) => {
        if (active) setItems(reviews)
      })
      .catch((error) => console.error("Failed to load reviews:", error))
    return () => {
      active = false
    }
  }, [company])

  const addReview = async (input: NewReview) => {
    if (!company || !user) return

    const { error } = await insertReview(input, company, user)
    if (error) {
      console.error("Failed to publish review:", error)
      toast.error("Couldn't publish your review. Please try again.")
      return
    }

    // Optimistically show it (the insert succeeded).
    setItems((prev) => [createReviewItem(input, company.type), ...prev])
    setDialogOpen(false)
    toast.success("Review published", { description: "Thanks for sharing your feedback!" })
  }

  return {
    items,
    average: averageRating(items, company?.rating ?? 0),
    dialogOpen,
    setDialogOpen,
    addReview,
  }
}
