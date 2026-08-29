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

/** Loads a worker's reviews from the DB; seeds the fictional demo companies. */
export async function fetchReviews(company: Company): Promise<ReviewItem[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("worker_id", String(company.id))
    .order("created_at", { ascending: false })

  if (error) console.error("Failed to load reviews:", error)

  const reviews = ((data as ReviewRow[] | null) ?? []).map(rowToReviewItem)
  if (reviews.length > 0) return reviews

  // No real reviews yet — show seed reviews for the demo companies (numeric ids)
  // so they aren't empty; real workers (uuid) get a genuine empty state.
  if (typeof company.id === "number") {
    return DEFAULT_REVIEWS[company.id] ?? getGenericReviews(company.name, company.type)
  }
  return []
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

// ---------------------------------------------------------------------------
// Seed reviews — fictional content shown only for the demo catalogue companies
// that have no real reviews yet.
// ---------------------------------------------------------------------------
const DEFAULT_REVIEWS: Record<string, ReviewItem[]> = {
  4: [
    {
      id: "r1",
      name: "Elvira K.",
      rating: 5,
      date: "2 days ago",
      comment:
        "Master craftsmen indeed! Simon built custom oak shelving and fitted our exterior doors flawlessly. The attention to detail is remarkable.",
      trade: "Custom Built-ins",
      initial: "E",
      color: "bg-blue-100 text-blue-700",
    },
    {
      id: "r2",
      name: "Arjan M.",
      rating: 5,
      date: "1 week ago",
      comment:
        "Arrived exactly on time, brought all heavy duty tools, and completed our deck framing ahead of schedule. Very clean job site afterwards.",
      trade: "Deck Construction",
      initial: "A",
      color: "bg-amber-100 text-amber-800",
    },
    {
      id: "r3",
      name: "Sara D.",
      rating: 5,
      date: "3 weeks ago",
      comment:
        "Solid woodwork and fair pricing. The door frame installation looks fantastic. Will definitely hire again for future projects.",
      trade: "Door Installation",
      initial: "S",
      color: "bg-emerald-100 text-emerald-800",
    },
  ],
}

function getGenericReviews(companyName: string, tradeType: string): ReviewItem[] {
  return [
    {
      id: "r-gen-1",
      name: "Elvira K.",
      rating: 5,
      date: "3 days ago",
      comment: `Extremely professional ${tradeType.toLowerCase()} service! Arrived promptly and completed the job with great precision.`,
      trade: `${tradeType} Work`,
      initial: "E",
      color: "bg-blue-100 text-blue-700",
    },
    {
      id: "r-gen-2",
      name: "Arjan M.",
      rating: 5,
      date: "2 weeks ago",
      comment: `Fair pricing, transparent quote, and high-quality workmanship from ${companyName}. Highly recommended!`,
      trade: "Home Repair",
      initial: "A",
      color: "bg-amber-100 text-amber-800",
    },
    {
      id: "r-gen-3",
      name: "Sara D.",
      rating: 5,
      date: "1 month ago",
      comment:
        "Great experience overall. Friendly customer service and solid attention to detail throughout.",
      trade: "General Service",
      initial: "S",
      color: "bg-emerald-100 text-emerald-800",
    },
  ]
}
