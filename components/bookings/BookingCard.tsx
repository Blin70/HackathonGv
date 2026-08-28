"use client"

import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Check, Clock, ExternalLink, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Booking, BookingStatus } from "@/lib/bookings"

const STATUS_STYLES: Record<BookingStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-800 border-amber-200" },
  confirmed: { label: "Confirmed", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  declined: { label: "Declined", className: "bg-red-100 text-red-700 border-red-200" },
  cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-600 border-gray-200" },
}

interface BookingCardProps {
  booking: Booking
  perspective: "sent" | "received"
  busy: boolean
  onConfirm?: (id: string) => void
  onDecline?: (id: string) => void
  onCancel?: (id: string) => void
}

function formatWhen(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true })
  } catch {
    return ""
  }
}

export function BookingCard({
  booking,
  perspective,
  busy,
  onConfirm,
  onDecline,
  onCancel,
}: BookingCardProps) {
  const status = STATUS_STYLES[booking.status]
  const isReceived = perspective === "received"
  const counterparty = isReceived ? booking.client_name : booking.worker_name
  const initial = (counterparty || "?").charAt(0).toUpperCase()

  return (
    <div className="rounded-3xl border border-border bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-11 w-11 shrink-0 rounded-full bg-primary/10 text-primary font-extrabold flex items-center justify-center">
            {initial}
          </div>
          <div className="min-w-0">
            <h3 className="font-extrabold text-foreground leading-snug truncate">
              {isReceived ? counterparty || "A client" : counterparty || "Fixer"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isReceived ? "requested" : "you requested"}
              {booking.trade_type ? ` · ${booking.trade_type}` : ""}
            </p>
          </div>
        </div>

        <span
          className={cn(
            "shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-bold",
            status.className
          )}
        >
          {status.label}
        </span>
      </div>

      {booking.message && (
        <p className="text-sm text-muted-foreground leading-relaxed bg-secondary/30 rounded-2xl p-3">
          &quot;{booking.message}&quot;
        </p>
      )}

      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock size={13} /> {formatWhen(booking.created_at)}
        </span>

        <div className="flex items-center gap-2">
          {!isReceived && (
            <Button asChild size="sm" variant="ghost" className="h-8 rounded-xl text-xs font-bold gap-1">
              <Link href={`/book/${booking.worker_id}`}>
                <ExternalLink size={13} /> View
              </Link>
            </Button>
          )}

          {isReceived && booking.status === "pending" && (
            <>
              <Button
                size="sm"
                onClick={() => onDecline?.(booking.id)}
                disabled={busy}
                variant="outline"
                className="h-8 rounded-xl text-xs font-bold gap-1 border-border"
              >
                <X size={13} /> Decline
              </Button>
              <Button
                size="sm"
                onClick={() => onConfirm?.(booking.id)}
                disabled={busy}
                className="h-8 rounded-xl text-xs font-bold gap-1 bg-[#1a7a4a] text-white hover:opacity-90"
              >
                <Check size={13} /> Confirm
              </Button>
            </>
          )}

          {!isReceived && booking.status === "pending" && (
            <Button
              size="sm"
              onClick={() => onCancel?.(booking.id)}
              disabled={busy}
              variant="outline"
              className="h-8 rounded-xl text-xs font-bold gap-1 border-border text-red-600 hover:bg-red-50"
            >
              <X size={13} /> Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
