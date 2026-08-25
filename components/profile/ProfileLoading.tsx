import { RefreshCw } from "lucide-react"

export function ProfileLoading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
      <RefreshCw className="h-8 w-8 text-primary animate-spin mb-4" />
      <p className="text-muted-foreground font-semibold tracking-wider uppercase text-sm">
        Loading Profile...
      </p>
    </div>
  )
}
