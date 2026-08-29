import { formatDistanceToNow } from "date-fns"
import type { User } from "@supabase/supabase-js"

import { createClient } from "@/lib/client"
import type { Company } from "@/lib/data"

export interface ReviewItem {
  id: string
  name: string
  rating: number
  date: string
  comment: string
  trade: string
  initial: string
  color: string
}

/** The fields a viewer supplies when writing a review. */
export interface NewReview {
  rating: number
  name: string
  comment: string
}

export interface ReviewStat {
  rating: number
  count: number
}

interface ReviewRow {
  id: string
  worker_id: string
  author_id: string | null
  author_name: string
  rating: number
  comment: string
  trade: string | null
  created_at: string
}

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-amber-100 text-amber-800",
  "bg-emerald-100 text-emerald-800",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
]

function avatarColor(name: string): string {
  const sum = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return AVATAR_COLORS[sum % AVATAR_COLORS.length]
}

function rowToReviewItem(row: ReviewRow): ReviewItem {
  const name = row.author_name || "Verified Client"
  let date = ""
  try {
    date = formatDistanceToNow(new Date(row.created_at), { addSuffix: true })
  } catch {
    date = ""
  }
  return {
    id: row.id,
    name,
    rating: row.rating,
    date,
    comment: row.comment,
    trade: row.trade || "Service",
    initial: name.charAt(0).toUpperCase(),
    color: avatarColor(name),
  }
}

/** A local, unsaved review item for optimistic display right after posting. */
export function createReviewItem(input: NewReview, tradeType: string): ReviewItem {
  const name = input.name.trim() || "Verified Client"
  return {
    id: `local-${Date.now()}`,
    name,
    rating: input.rating,
    date: "just now",
    comment: input.comment.trim(),
    trade: tradeType,
    initial: name.charAt(0).toUpperCase(),
    color: avatarColor(name),
  }
}

/** Loads a worker's reviews from the DB (newest first). */
export async function fetchReviews(workerId: Company["id"]): Promise<ReviewItem[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("worker_id", String(workerId))
    .order("created_at", { ascending: false })

  if (error) console.error("Failed to load reviews:", error)
  return ((data as ReviewRow[] | null) ?? []).map(rowToReviewItem)
}

/** Inserts a review as the signed-in user. Returns Supabase's `{ error }`. */
export async function insertReview(input: NewReview, company: Company, user: User) {
  const supabase = createClient()
  return supabase.from("reviews").insert({
    worker_id: String(company.id),
    author_id: user.id,
    author_name: input.name.trim() || "Verified Client",
    rating: input.rating,
    comment: input.comment.trim(),
    trade: company.type,
  })
}

/** Average rating + review count per worker, aggregated across all reviews. */
export async function fetchReviewStats(): Promise<Map<string, ReviewStat>> {
  const supabase = createClient()
  const { data, error } = await supabase.from("reviews").select("worker_id, rating")
  if (error) {
    console.error("Failed to load review stats:", error)
    return new Map()
  }

  const totals = new Map<string, { total: number; count: number }>()
  for (const row of (data as { worker_id: string; rating: number }[] | null) ?? []) {
    const current = totals.get(row.worker_id) ?? { total: 0, count: 0 }
    totals.set(row.worker_id, { total: current.total + row.rating, count: current.count + 1 })
  }

  const stats = new Map<string, ReviewStat>()
  for (const [workerId, { total, count }] of totals) {
    stats.set(workerId, { rating: total / count, count })
  }
  return stats
}

export function averageRating(reviews: ReviewItem[], fallback: number): string {
  if (reviews.length === 0) return fallback.toFixed(1)
  const total = reviews.reduce((acc, review) => acc + review.rating, 0)
  return (total / reviews.length).toFixed(1)
}
