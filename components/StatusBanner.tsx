import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type StatusBannerVariant = "success" | "error"

interface StatusBannerProps {
  variant: StatusBannerVariant
  /** The message body. */
  children: ReactNode
  /** Optional right-aligned slot, e.g. a call-to-action button. */
  action?: ReactNode
  className?: string
}

const VARIANT_STYLES: Record<StatusBannerVariant, string> = {
  success: "bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/30",
  error: "bg-red-500/10 text-red-600 border border-red-500/30",
}

/**
 * Inline success/error banner shared across the app (profile saves, review
 * submissions, etc.). Purely presentational — callers own the message and any
 * action node.
 */
export function StatusBanner({ variant, children, action, className }: StatusBannerProps) {
  return (
    <div
      role="status"
      className={cn(
        "p-4 rounded-2xl text-sm font-bold flex items-center justify-between gap-3",
        VARIANT_STYLES[variant],
        className
      )}
    >
      <span>{children}</span>
      {action}
    </div>
  )
}
