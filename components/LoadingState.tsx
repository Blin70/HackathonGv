import { RefreshCw } from "lucide-react"

import { cn } from "@/lib/utils"

interface LoadingStateProps {
  label?: string
  className?: string
}

/** Full-height centered spinner used for route/page loading states. */
export function LoadingState({ label = "Loading...", className }: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex-1 flex flex-col items-center justify-center min-h-[60vh]",
        className
      )}
    >
      <RefreshCw className="h-8 w-8 text-primary animate-spin mb-4" />
      <p className="text-muted-foreground font-semibold tracking-wider uppercase text-sm">
        {label}
      </p>
    </div>
  )
}
