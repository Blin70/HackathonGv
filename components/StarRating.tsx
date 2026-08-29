"use client"

import { useState } from "react"
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

interface StarRatingProps {
  value: number
  /** When provided, the stars become interactive (hover + click to set). */
  onChange?: (value: number) => void
  size?: number
  className?: string
}

const STARS = [1, 2, 3, 4, 5]

/** Reusable 5-star rating — display-only, or interactive when `onChange` is given. */
export function StarRating({ value, onChange, size = 16, className }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)
  const interactive = Boolean(onChange)
  const active = hovered || value

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {STARS.map((star) => (
        <Star
          key={star}
          size={size}
          className={cn(
            active >= star ? "fill-amber-400 text-amber-400" : "fill-transparent text-gray-300",
            interactive && "cursor-pointer transition-transform hover:scale-110"
          )}
          onMouseEnter={interactive ? () => setHovered(star) : undefined}
          onMouseLeave={interactive ? () => setHovered(0) : undefined}
          onClick={interactive ? () => onChange?.(star) : undefined}
        />
      ))}
    </div>
  )
}
