import { cva, type VariantProps } from "class-variance-authority"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/**
 * Marks a seeded example listing from `lib/data.ts`.
 *
 * The badge is the only thing separating an honest placeholder from a
 * fabricated business, so what it says lives here rather than being retyped at
 * each call site — four of them drifted apart the first time round.
 */
const demoBadge = cva("rounded-full border-0 font-bold", {
  variants: {
    emphasis: {
      /** Over a listing card, where space is tight. */
      card: "bg-amber-500 px-3 py-1 text-[10px] text-white shadow-md",
      /** On a detail page, where someone is about to try booking it. */
      detail: "bg-amber-500 px-4 py-1.5 text-sm text-white shadow-lg",
      /** Inside a dense list, next to other outline badges. */
      inline: "border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[10px] text-amber-900",
    },
  },
  defaultVariants: { emphasis: "card" },
})

const LABELS = {
  card: "Example listing",
  detail: "Example listing — not a real business",
  inline: "Example",
} as const

interface DemoBadgeProps extends VariantProps<typeof demoBadge> {
  className?: string
}

export function DemoBadge({ emphasis = "card", className }: DemoBadgeProps) {
  return (
    <Badge className={cn(demoBadge({ emphasis }), className)}>
      {LABELS[emphasis ?? "card"]}
    </Badge>
  )
}
