"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import type { Company } from "@/lib/data"
import {
  averageRating,
  createReview,
  loadReviews,
  saveReviews,
  type NewReview,
  type ReviewItem,
} from "@/lib/reviews"

/** Manages a worker's review list, the write dialog, and persistence. */
export function useWorkerReviews(company: Company | null) {
  const [items, setItems] = useState<ReviewItem[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    if (!company) return
    // loadReviews reads localStorage (client-only), so it must run in an effect
    // after hydration — not during render — to avoid an SSR/client mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(loadReviews(company.id, company.name, company.type))
  }, [company])

  const addReview = (input: NewReview) => {
    if (!company) return
    const updated = [createReview(input, company.type), ...items]
    setItems(updated)
    saveReviews(company.id, updated)
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
