import { MessageSquarePlus } from "lucide-react"

import { StarRating } from "@/components/StarRating"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ReviewItem } from "@/lib/reviews"

interface WorkerReviewsProps {
  reviews: ReviewItem[]
  averageRating: string
  onWriteReview: () => void
}

export function WorkerReviews({ reviews, averageRating, onWriteReview }: WorkerReviewsProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
            Customer Reviews
            <Badge className="bg-amber-100 text-amber-900 border-amber-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
              ★ {averageRating}
            </Badge>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Read genuine feedback from verified clients or leave your own review.
          </p>
        </div>

        <Button
          onClick={onWriteReview}
          className="rounded-2xl h-11 px-5 font-bold text-sm bg-[#1a7a4a] text-white hover:opacity-90 transition-all gap-2 self-start sm:self-auto"
        >
          <MessageSquarePlus size={18} />
          Write a Review
        </Button>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="p-6 rounded-3xl bg-white border border-border shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={`text-sm font-bold ${review.color}`}>
                    {review.initial}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-extrabold text-foreground text-sm">{review.name}</h4>
                  <p className="text-xs text-muted-foreground font-medium">
                    {review.trade} • {review.date}
                  </p>
                </div>
              </div>

              <StarRating value={review.rating} size={15} />
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed pt-1">
              &quot;{review.comment}&quot;
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
