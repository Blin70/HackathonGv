"use client"

import { useState } from "react"
import Link from "next/link"
import { format, formatDistanceToNow, parseISO } from "date-fns"
import {
  CalendarClock,
  Check,
  CheckCheck,
  ExternalLink,
  MapPin,
  Phone,
  PlayCircle,
  TriangleAlert,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  BOOKING_TRANSITIONS,
  formatBookingSchedule,
  type Booking,
  type BookingStatus,
  type StatusChangeOptions,
} from "@/lib/bookings"
import { formatPhoneForDisplay } from "@/lib/schemas/booking"

import { CancelJobDialog } from "./CancelJobDialog"

const STATUS_STYLES: Record<BookingStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 ring-amber-200" },
  confirmed: { label: "Accepted", className: "bg-blue-50 text-blue-700 ring-blue-200" },
  in_progress: { label: "In progress", className: "bg-violet-50 text-violet-700 ring-violet-200" },
  completed: { label: "Completed", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  declined: { label: "Declined", className: "bg-red-50 text-red-700 ring-red-200" },
  cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-600 ring-gray-200" },
}

/** How each reachable status is offered as a button. */
const ACTIONS: Record<
  BookingStatus,
  { label: string; icon: typeof Check; tone: "primary" | "quiet" | "danger" }
> = {
  pending: { label: "Reopen", icon: PlayCircle, tone: "quiet" },
  confirmed: { label: "Accept", icon: Check, tone: "primary" },
  in_progress: { label: "Start job", icon: PlayCircle, tone: "primary" },
  completed: { label: "Mark complete", icon: CheckCheck, tone: "primary" },
  declined: { label: "Decline", icon: X, tone: "quiet" },
  cancelled: { label: "Cancel", icon: X, tone: "danger" },
}

interface BookingCardProps {
  booking: Booking
  perspective: "sent" | "received"
  busy: boolean
  /** Moves the booking to a new status. Omit to render the card read-only. */
  onTransition?: (id: string, status: BookingStatus, options?: StatusChangeOptions) => void
}

function timeAgo(iso: string | null): string {
  if (!iso) return ""
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true })
  } catch {
    return ""
  }
}

/** One labelled fact about the job. */
function Detail({ icon: Icon, children }: { icon: typeof MapPin; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 min-w-0">
      <Icon size={15} className="text-muted-foreground shrink-0 mt-0.5" />
      <span className="text-sm text-foreground min-w-0 break-words leading-snug">{children}</span>
    </div>
  )
}

export function BookingCard({ booking, perspective, busy, onTransition }: BookingCardProps) {
  const [cancelOpen, setCancelOpen] = useState(false)

  const status = STATUS_STYLES[booking.status]
  const isReceived = perspective === "received"
  const counterparty = isReceived ? booking.client_name : booking.worker_name
  const schedule = formatBookingSchedule(booking)

  // The lifecycle decides which buttons exist, so the card can't offer a move
  // the domain doesn't allow.
  const available = onTransition
    ? BOOKING_TRANSITIONS[booking.status][isReceived ? "worker" : "client"]
    : []

  const handleAction = (next: BookingStatus) => {
    // A worker abandoning an accepted job owes the client an explanation.
    if (next === "cancelled" && isReceived) {
      setCancelOpen(true)
      return
    }
    onTransition?.(booking.id, next, next === "cancelled" ? { cancelledBy: "client" } : undefined)
  }

  return (
    <div className="rounded-3xl border border-border bg-white shadow-sm overflow-hidden">
      {/* Who + where it stands */}
      <div className="flex items-start justify-between gap-3 p-5 pb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-11 w-11 shrink-0 rounded-2xl bg-primary/10 text-primary font-extrabold flex items-center justify-center">
            {(counterparty || "?").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-extrabold text-foreground leading-snug truncate">
              {counterparty || (isReceived ? "A client" : "Fixer")}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {booking.trade_type ? `${booking.trade_type} · ` : ""}
              {isReceived ? "requested" : "you requested"} {timeAgo(booking.created_at)}
            </p>
          </div>
        </div>

        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1",
            status.className
          )}
        >
          {status.label}
        </span>
      </div>

      {/* The scheduled slot is the fact a worker plans their day around. */}
      {schedule && (
        <div className="mx-5 mb-4 rounded-2xl bg-secondary/40 px-4 py-3 flex items-center gap-2.5">
          <CalendarClock size={16} className="text-[#1a7a4a] shrink-0" />
          <span className="text-sm font-bold text-foreground">{schedule}</span>
        </div>
      )}

      <div className="px-5 pb-4 space-y-3">
        {booking.message && (
          <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-border pl-3">
            {booking.message}
          </p>
        )}

        {(booking.address || (isReceived && booking.client_phone)) && (
          <div className="grid gap-2.5 sm:grid-cols-2 pt-0.5">
            {booking.address && <Detail icon={MapPin}>{booking.address}</Detail>}
            {/* Only the assigned worker gets a tap-to-call link. */}
            {isReceived && booking.client_phone && (
              <Detail icon={Phone}>
                <a
                  href={`tel:${booking.client_phone}`}
                  className="font-semibold text-[#1a7a4a] hover:underline"
                >
                  {formatPhoneForDisplay(booking.client_phone)}
                </a>
              </Detail>
            )}
          </div>
        )}

        {booking.cancellation_reason && (
          <div className="rounded-2xl bg-amber-50 ring-1 ring-amber-200 px-3.5 py-2.5 flex items-start gap-2.5">
            <TriangleAlert size={15} className="text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 leading-relaxed">
              <span className="font-bold">
                Cancelled by the {booking.cancelled_by === "worker" ? "fixer" : "client"}:
              </span>{" "}
              {booking.cancellation_reason}
            </p>
          </div>
        )}
      </div>

      {/* Progress trail + what happens next */}
      {(available.length > 0 || !isReceived || booking.started_at) && (
        <div className="border-t border-border bg-secondary/20 px-5 py-3 flex items-center justify-between gap-3 flex-wrap">
          <span className="text-xs text-muted-foreground">
            {booking.completed_at
              ? `Completed ${format(parseISO(booking.completed_at), "d MMM 'at' HH:mm")}`
              : booking.started_at
                ? `Started ${format(parseISO(booking.started_at), "d MMM 'at' HH:mm")}`
                : ""}
          </span>

          <div className="flex items-center gap-2 flex-wrap ml-auto">
            {!isReceived && (
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="h-8 rounded-xl text-xs font-bold gap-1.5"
              >
                <Link href={`/book/${booking.worker_id}`}>
                  <ExternalLink size={13} /> View
                </Link>
              </Button>
            )}

            {available.map((next) => {
              const action = ACTIONS[next]
              const Icon = action.icon
              return (
                <Button
                  key={next}
                  size="sm"
                  onClick={() => handleAction(next)}
                  disabled={busy}
                  variant={action.tone === "primary" ? "default" : "outline"}
                  className={cn(
                    "h-8 rounded-xl text-xs font-bold gap-1.5",
                    action.tone === "primary" && "bg-[#1a7a4a] text-white hover:opacity-90",
                    action.tone === "quiet" && "border-border",
                    action.tone === "danger" && "border-border text-red-600 hover:bg-red-50"
                  )}
                >
                  <Icon size={13} /> {action.label}
                </Button>
              )
            })}
          </div>
        </div>
      )}

      <CancelJobDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        clientName={booking.client_name || "The client"}
        busy={busy}
        onConfirm={(reason) => {
          onTransition?.(booking.id, "cancelled", { cancelledBy: "worker", reason })
          setCancelOpen(false)
        }}
      />
    </div>
  )
}
