"use client"

import Link from "next/link"
import { AlertCircle, CalendarCheck, Inbox, Send } from "lucide-react"

import { EmptyState } from "@/components/EmptyState"
import { LoadingState } from "@/components/LoadingState"
import { Button } from "@/components/ui/button"
import { useBookings } from "@/hooks/use-bookings"

import { BookingCard } from "./BookingCard"

export function BookingsView() {
  const {
    loading,
    error,
    sent,
    received,
    busyId,
    reload,
    confirmBooking,
    declineBooking,
    cancelBooking,
  } = useBookings()

  if (loading) {
    return <LoadingState label="Loading bookings..." />
  }

  const pendingReceived = received.filter((b) => b.status === "pending").length

  return (
    <div className="flex-1 container max-w-3xl mx-auto px-4 py-10 md:py-16 space-y-10">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <CalendarCheck className="text-primary" /> My Bookings
        </h1>
        <p className="text-muted-foreground text-base mt-1.5">
          Track the fixers you&apos;ve requested and respond to requests from clients.
        </p>
      </div>

      {error ? (
        <EmptyState
          icon={<AlertCircle className="h-8 w-8" />}
          title="Couldn't load your bookings"
          description={error}
          action={
            <Button onClick={reload} className="rounded-2xl font-bold bg-[#1a7a4a] text-white hover:opacity-90">
              Try again
            </Button>
          }
        />
      ) : (
        <>
          {/* Worker inbox — only shown to users who have received requests */}
          {received.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-black flex items-center gap-2">
                <Inbox size={18} className="text-primary" /> Requests Received
                {pendingReceived > 0 && (
                  <span className="rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold px-2 py-0.5">
                    {pendingReceived} pending
                  </span>
                )}
              </h2>
              <div className="space-y-4">
                {received.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    perspective="received"
                    busy={busyId === booking.id}
                    onConfirm={confirmBooking}
                    onDecline={declineBooking}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Client's own requests */}
          <section className="space-y-4">
            <h2 className="text-lg font-black flex items-center gap-2">
              <Send size={18} className="text-primary" /> Requests You Sent
            </h2>

            {sent.length > 0 ? (
              <div className="space-y-4">
                {sent.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    perspective="sent"
                    busy={busyId === booking.id}
                    onCancel={cancelBooking}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No booking requests yet"
                description="Find a trusted local fixer and send your first request."
                action={
                  <Button asChild className="rounded-2xl font-bold bg-[#1a7a4a] text-white hover:opacity-90">
                    <Link href="/book">Browse Fixers</Link>
                  </Button>
                }
              />
            )}
          </section>
        </>
      )}
    </div>
  )
}
