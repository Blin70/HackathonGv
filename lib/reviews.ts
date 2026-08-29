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

type CompanyId = Company["id"]

const reviewsKey = (id: CompanyId) => `worker_reviews_${id}`

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
      rating: 4.8,
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
      rating: 4.7,
      date: "1 month ago",
      comment:
        "Great experience overall. Friendly customer service and solid attention to detail throughout.",
      trade: "General Service",
      initial: "S",
      color: "bg-emerald-100 text-emerald-800",
    },
  ]
}

/** Loads a worker's reviews from localStorage, seeding demo/generic ones first. */
export function loadReviews(id: CompanyId, name: string, tradeType: string): ReviewItem[] {
  const seed = DEFAULT_REVIEWS[id] ?? getGenericReviews(name, tradeType)
  if (typeof window === "undefined") return seed
  try {
    const stored = localStorage.getItem(reviewsKey(id))
    if (stored) return JSON.parse(stored) as ReviewItem[]
  } catch (error) {
    console.error(error)
  }
  return seed
}

export function saveReviews(id: CompanyId, reviews: ReviewItem[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(reviewsKey(id), JSON.stringify(reviews))
  } catch (error) {
    console.error(error)
  }
}

/** Builds a `ReviewItem` from viewer input. */
export function createReview(input: NewReview, tradeType: string): ReviewItem {
  const name = input.name.trim() || "Verified Client"
  return {
    id: `rev-${Date.now()}`,
    name,
    rating: input.rating,
    date: "Just now",
    comment: input.comment.trim(),
    trade: tradeType,
    initial: name.charAt(0).toUpperCase(),
    color: "bg-emerald-100 text-emerald-800",
  }
}

export function averageRating(reviews: ReviewItem[], fallback: number): string {
  if (reviews.length === 0) return fallback.toFixed(1)
  const total = reviews.reduce((acc, review) => acc + review.rating, 0)
  return (total / reviews.length).toFixed(1)
}
