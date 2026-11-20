import Link from "next/link"
import { CheckCircle2, Info, Lock, PencilLine } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { BookingBlockReason } from "@/lib/bookings"
import type { Company } from "@/lib/data"

interface BookingPanelProps {
  company: Company
  isLoggedIn: boolean
  booked: boolean
  /** Set when this listing cannot be booked at all — see `bookingBlockReason`. */
  blockReason: BookingBlockReason | null
  onBook: () => void
}

const GUARANTEES = [
  "No hidden fees",
  "Cancel any time before work starts",
  "Reviews come from completed jobs only",
]

export function BookingPanel({
  company,
  isLoggedIn,
  booked,
  blockReason,
  onBook,
}: BookingPanelProps) {
  return (
    <div className="sticky top-24 bg-white rounded-2xl p-6 border border-border shadow-md">
      {!isLoggedIn && !blockReason && (
        <div className="mb-6 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs font-semibold flex items-center gap-2.5 leading-snug">
          <Lock size={18} className="text-amber-600 shrink-0" />
          <span>Browsing as Guest — Sign in as a client to book or review this fixer.</span>
        </div>
      )}

      {blockReason === "own-listing" && (
        <div className="mb-6 p-3.5 rounded-2xl bg-primary/5 border border-primary/15 text-xs font-semibold flex items-center gap-2.5 leading-snug">
          <Info size={18} className="text-primary shrink-0" />
          <span>This is your own listing. It is what clients see when they find you.</span>
        </div>
      )}

      {blockReason === "example-listing" && (
        <div className="mb-6 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs font-semibold flex items-center gap-2.5 leading-snug">
          <Info size={18} className="text-amber-600 shrink-0" />
          <span>
            This is an example listing, not a real business, so it can&apos;t take bookings.
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">
          Starting Rate
        </p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-5xl font-bold text-foreground">{company.price}</span>
          <span className="text-lg text-muted-foreground font-medium">/hr</span>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {GUARANTEES.map((item) => (
          <div key={item} className="flex items-center gap-3 text-sm font-medium text-foreground">
            <CheckCircle2 className="text-primary" size={18} />
            {item}
          </div>
        ))}
      </div>

      {blockReason === "own-listing" ? (
        <Button
          asChild
          variant="outline"
          className="w-full h-14 rounded-2xl font-bold text-base gap-2"
        >
          <Link href="/profile">
            <PencilLine size={16} /> Edit your listing
          </Link>
        </Button>
      ) : blockReason === "example-listing" ? (
        <Button
          asChild
          variant="outline"
          className="w-full h-14 rounded-2xl font-bold text-base gap-2"
        >
          <Link href="/book">Browse real tradespeople</Link>
        </Button>
      ) : (
        <Button
          onClick={onBook}
          disabled={booked}
          className="w-full h-14 rounded-2xl font-bold text-base bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform gap-2"
        >
          {!isLoggedIn && <Lock size={16} />}
          {booked ? "Booking Request Sent!" : isLoggedIn ? "Request Booking" : "Sign In to Book"}
        </Button>
      )}

      <p className="text-xs text-center text-muted-foreground mt-4 leading-relaxed">
        {blockReason === "own-listing"
          ? "Changes you make to your profile show up here."
          : blockReason === "example-listing"
            ? "Example listings show how the marketplace works while real tradespeople join."
            : isLoggedIn
              ? "You won't be charged yet. The tradesman will review your request and confirm."
              : "Sign in or register as a client to submit your booking request."}
      </p>
    </div>
  )
}
