"use client"

import { useState } from "react"

import { StarRating } from "@/components/StarRating"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { NewReview } from "@/lib/reviews"

interface WriteReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyName: string
  editing: boolean
  defaultName: string
  defaultRating: number
  defaultComment: string
  onSubmit: (review: NewReview) => void
}

// The parent remounts this via a `key` when the defaults change (auth loads, or
// the user's existing review arrives), so plain useState initial values suffice.
export function WriteReviewDialog({
  open,
  onOpenChange,
  companyName,
  editing,
  defaultName,
  defaultRating,
  defaultComment,
  onSubmit,
}: WriteReviewDialogProps) {
  const [rating, setRating] = useState(defaultRating)
  const [name, setName] = useState(defaultName)
  const [comment, setComment] = useState(defaultComment)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!comment.trim()) return
    onSubmit({ rating, name, comment })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-3xl p-8 border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black mb-1 text-foreground">
            {editing ? "Edit your review" : `Review ${companyName}`}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Share your feedback and experience to help other clients on the platform.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Rating
            </Label>
            <div className="flex items-center gap-2">
              <StarRating value={rating} onChange={setRating} size={28} />
              <span className="text-sm font-bold text-foreground ml-2">{rating} / 5 Stars</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="reviewerName"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
            >
              Your Name
            </Label>
            <Input
              id="reviewerName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John D."
              className="h-12 rounded-2xl bg-secondary/30 focus-visible:ring-[#1a7a4a]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="reviewComment"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
            >
              Your Review
            </Label>
            <Textarea
              id="reviewComment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe the service quality, punctuality, and overall experience..."
              className="rounded-2xl bg-secondary/30 focus-visible:ring-[#1a7a4a] leading-relaxed"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-2xl h-11 px-5 font-bold border-border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-2xl h-11 px-6 font-bold bg-[#1a7a4a] text-white hover:opacity-90"
            >
              {editing ? "Update Review" : "Publish Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
