import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface StatCardProps {
  icon: ReactNode
  label: string
  value: ReactNode
  sublabel?: string
  /** Tailwind classes for the icon chip, e.g. "bg-amber-100 text-amber-700". */
  accent?: string
}

/** Metric tile used on the worker dashboard. */
export function StatCard({ icon, label, value, sublabel, accent }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-border bg-white p-5 shadow-sm">
      <div
        className={cn(
          "h-10 w-10 rounded-2xl flex items-center justify-center mb-4",
          accent ?? "bg-secondary text-foreground"
        )}
      >
        {icon}
      </div>
      <p className="text-2xl font-black text-foreground leading-none">{value}</p>
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1.5">
        {label}
      </p>
      {sublabel && <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>}
    </div>
  )
}
