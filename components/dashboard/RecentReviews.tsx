"use client"

import { Star } from "lucide-react"

import { EmptyState } from "@/components/EmptyState"
import { StarRating } from "@/components/StarRating"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { ReviewItem } from "@/lib/reviews"

interface RecentReviewsProps {
  reviews: ReviewItem[]
  /** How many of the most recent reviews to show. */
  limit?: number
}

/** The latest client feedback on the worker's listing. */
export function RecentReviews({ reviews, limit = 3 }: RecentReviewsProps) {
  const recent = reviews.slice(0, limit)

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-black flex items-center gap-2">
        <Star size={18} className="text-amber-500" /> Recent Reviews
      </h2>

      {recent.length > 0 ? (
        <div className="space-y-3">
          {recent.map((review) => (
            <div key={review.id} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className={`text-xs font-bold ${review.color}`}>
                      {review.initial}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-sm text-foreground">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                </div>
                <StarRating value={review.rating} size={13} />
              </div>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                &quot;{review.comment}&quot;
              </p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No reviews yet" description="Reviews clients leave will appear here." />
      )}
    </section>
  )
}
