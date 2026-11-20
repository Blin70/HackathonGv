import type { Metadata } from "next"
import Link from "next/link"
import { Compass } from "lucide-react"

import { EmptyState } from "@/components/EmptyState"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Page not found | Book A Fixer",
  description: "That page does not exist.",
}

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-24">
      <EmptyState
        className="w-full max-w-md"
        icon={<Compass className="h-8 w-8" />}
        title="We can't find that page"
        description="The link may be out of date, or the listing it pointed to is no longer on the marketplace."
        action={
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild>
              <Link href="/">Back to home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/book">Browse fixers</Link>
            </Button>
          </div>
        }
      />
    </div>
  )
}
