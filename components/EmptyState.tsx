import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  /** Optional call-to-action, e.g. a button or link. */
  action?: ReactNode
  className?: string
}

/** Reusable "nothing here / something went wrong" placeholder card. */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border/60 bg-secondary/20 p-8 text-center",
        className
      )}
    >
      {icon && <div className="mb-3 flex justify-center text-muted-foreground">{icon}</div>}
      <p className="font-bold text-foreground">{title}</p>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  )
}
