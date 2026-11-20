"use client"

import { useEffect } from "react"
import Link from "next/link"
import { TriangleAlert } from "lucide-react"

import { EmptyState } from "@/components/EmptyState"
import { Button } from "@/components/ui/button"

/**
 * Catches a render or data error anywhere under the root layout, so a thrown
 * exception shows the site's own page instead of the framework's.
 *
 * The message is deliberately plain: the error shape goes to the server log,
 * never onto the page, for the same reason the AI route handler does it.
 */
export default function Error({
  error,
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  reset: () => void
  /**
   * Next 16 passes both. `reset()` only clears the error and re-renders the
   * same children; `unstable_retry()` re-fetches the segment, which is what a
   * page that failed to load its data actually needs. Typed optional so an
   * upgrade that renames it degrades to `reset` instead of throwing.
   */
  unstable_retry?: () => void
}) {
  const retry = unstable_retry ?? reset

  useEffect(() => {
    console.error("Unhandled page error:", {
      name: error.name,
      message: error.message,
      digest: error.digest,
    })
  }, [error])

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-24">
      <EmptyState
        className="w-full max-w-md"
        icon={<TriangleAlert className="h-8 w-8" />}
        title="Something went wrong on our side"
        description="The page didn't load. Trying again usually works; if it doesn't, the problem is ours and not something you did."
        action={
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button onClick={retry}>Try again</Button>
            <Button asChild variant="outline">
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        }
      />
    </div>
  )
}
