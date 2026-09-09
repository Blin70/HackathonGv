"use client"

import { Inbox } from "lucide-react"

import { EmptyState } from "@/components/EmptyState"
import { BookingCard } from "@/components/bookings/BookingCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Booking } from "@/lib/bookings"

interface RequestsPanelProps {
  pending: Booking[]
  confirmed: Booking[]
  all: Booking[]
  busyId: string | null
  onConfirm: (id: string) => void
  onDecline: (id: string) => void
}

/**
 * The worker's request inbox. Confirmed jobs stay reachable after they're
 * accepted, so the dashboard doubles as the worker's job list rather than only
 * showing work they haven't answered yet.
 */
export function RequestsPanel({
  pending,
  confirmed,
  all,
  busyId,
  onConfirm,
  onDecline,
}: RequestsPanelProps) {
  const tabs = [
    {
      value: "pending",
      label: "Pending",
      bookings: pending,
      emptyTitle: "No pending requests",
      emptyDescription: "New booking requests from clients will show up here.",
    },
    {
      value: "confirmed",
      label: "Confirmed",
      bookings: confirmed,
      emptyTitle: "No confirmed jobs yet",
      emptyDescription: "Requests you accept will be listed here as your upcoming work.",
    },
    {
      value: "all",
      label: "All",
      bookings: all,
      emptyTitle: "No requests yet",
      emptyDescription: "Every request you receive — accepted or not — is kept here.",
    },
  ]

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-black flex items-center gap-2">
        <Inbox size={18} className="text-primary" /> Requests
      </h2>

      <Tabs defaultValue="pending" className="gap-4">
        <TabsList className="rounded-2xl">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="rounded-xl font-bold text-xs">
              {tab.label}
              {tab.bookings.length > 0 && (
                <span className="ml-1.5 text-[10px] font-black text-muted-foreground">
                  {tab.bookings.length}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-4">
            {tab.bookings.length > 0 ? (
              tab.bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  perspective="received"
                  busy={busyId === booking.id}
                  onConfirm={onConfirm}
                  onDecline={onDecline}
                />
              ))
            ) : (
              <EmptyState title={tab.emptyTitle} description={tab.emptyDescription} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
