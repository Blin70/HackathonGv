import { CheckCircle2, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { Company } from "@/lib/data"

interface BookingPanelProps {
  company: Company
  isLoggedIn: boolean
  booked: boolean
  submitting: boolean
  bookingError: string | null
  onBook: () => void
}

const GUARANTEES = ["No hidden fees", "Cancel anytime before 24h", "100% Satisfaction Guarantee"]

export function BookingPanel({
  company,
  isLoggedIn,
  booked,
  submitting,
  bookingError,
  onBook,
}: BookingPanelProps) {
  return (
    <div className="sticky top-24 bg-white rounded-3xl p-6 border border-border shadow-xl">
      {!isLoggedIn && (
        <div className="mb-6 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs font-semibold flex items-center gap-2.5 leading-snug">
          <Lock size={18} className="text-amber-600 shrink-0" />
          <span>Browsing as Guest — Sign in as a client to book or review this fixer.</span>
        </div>
      )}

      <div className="text-center mb-6">
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">
          Starting Rate
        </p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-5xl font-black text-foreground">{company.price}</span>
          <span className="text-lg text-muted-foreground font-medium">/hr</span>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {GUARANTEES.map((item) => (
          <div key={item} className="flex items-center gap-3 text-sm font-medium text-foreground">
            <CheckCircle2 className="text-green-500" size={18} />
            {item}
          </div>
        ))}
      </div>

      <Button
        onClick={onBook}
        disabled={booked || submitting}
        className="w-full h-14 rounded-2xl font-bold text-base shadow-lg shadow-[#1a7a4a]/20 hover:scale-[1.02] transition-transform gap-2 text-white"
        style={{ background: "#1a7a4a" }}
      >
        {!isLoggedIn && <Lock size={16} />}
        {booked
          ? "Booking Request Sent!"
          : submitting
            ? "Sending Request..."
            : isLoggedIn
              ? "Book This Pro"
              : "Sign In to Book"}
      </Button>

      {bookingError && (
        <p className="text-xs text-center text-red-600 font-semibold mt-3">{bookingError}</p>
      )}

      <p className="text-xs text-center text-muted-foreground mt-4 leading-relaxed">
        {isLoggedIn
          ? "You won't be charged yet. The tradesman will review your request and confirm."
          : "Sign in or register as a client to submit your booking request."}
      </p>
    </div>
  )
}
