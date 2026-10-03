"use client"

import { Inbox } from "lucide-react"

import { EmptyState } from "@/components/EmptyState"
import { BookingCard } from "@/components/bookings/BookingCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Booking, BookingStatus, StatusChangeOptions } from "@/lib/bookings"

interface RequestsPanelProps {
  pending: Booking[]
  scheduled: Booking[]
  completed: Booking[]
  all: Booking[]
  busyId: string | null
  onTransition: (id: string, status: BookingStatus, options?: StatusChangeOptions) => void
}

/**
 * The worker's request inbox. Confirmed jobs stay reachable after they're
 * accepted, so the dashboard doubles as the worker's job list rather than only
 * showing work they haven't answered yet.
 */
export function RequestsPanel({
  pending,
  scheduled,
  completed,
  all,
  busyId,
  onTransition,
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
      value: "scheduled",
      label: "Scheduled",
      bookings: scheduled,
      emptyTitle: "No scheduled jobs yet",
      emptyDescription: "Requests you accept will be listed here as your upcoming work.",
    },
    {
      value: "completed",
      label: "Completed",
      bookings: completed,
      emptyTitle: "No completed jobs yet",
      emptyDescription: "Jobs you finish will be kept here as your work history.",
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
                  onTransition={onTransition}
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
