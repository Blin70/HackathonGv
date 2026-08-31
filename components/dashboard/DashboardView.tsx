"use client"

import Link from "next/link"
import {
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  ExternalLink,
  Inbox,
  Pencil,
  Percent,
  Sparkles,
  Star,
} from "lucide-react"

import { EmptyState } from "@/components/EmptyState"
import { LoadingState } from "@/components/LoadingState"
import { StarRating } from "@/components/StarRating"
import { BookingCard } from "@/components/bookings/BookingCard"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useWorkerDashboard } from "@/hooks/use-worker-dashboard"

import { StatCard } from "./StatCard"

export function DashboardView() {
  const { loading, userId, listing, pending, reviews, stats, busyId, confirmBooking, declineBooking } =
    useWorkerDashboard()

  if (loading) {
    return <LoadingState label="Loading dashboard..." />
  }

  if (!listing) {
    return (
      <div className="flex-1 container max-w-3xl mx-auto px-4 py-16">
        <EmptyState
          icon={<Sparkles className="h-8 w-8" />}
          title="You don't have a worker listing yet"
          description="Set up your worker profile to appear in the marketplace and start receiving bookings."
          action={
            <Button asChild className="rounded-2xl font-bold bg-[#1a7a4a] text-white hover:opacity-90">
              <Link href="/profile?tab=worker">Set up your profile</Link>
            </Button>
          }
        />
      </div>
    )
  }

  const name = listing.display_name || listing.business_name || "Your listing"

  const checklist = [
    { label: "Trade category", done: Boolean(listing.trade_type) },
    { label: "Starting rate", done: Boolean(listing.price) },
    { label: "Tagline", done: Boolean(listing.tagline) },
    { label: "About", done: Boolean(listing.about_us) },
    { label: "Services", done: (listing.services?.length ?? 0) > 0 },
    { label: "Cover image", done: Boolean(listing.banner_image) },
    { label: "Verified business", done: listing.is_verified },
  ]
  const completeness = Math.round((checklist.filter((c) => c.done).length / checklist.length) * 100)
  const missing = checklist.filter((c) => !c.done)

  const recentReviews = reviews.slice(0, 3)

  return (
    <div className="flex-1 container max-w-4xl mx-auto px-4 py-10 md:py-14 space-y-6">
      {/* Profile header */}
      <div className="rounded-3xl border border-border bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4 min-w-0">
          <div className="h-14 w-14 shrink-0 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-2xl">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl md:text-2xl font-extrabold text-foreground truncate">{name}</h1>
              {listing.is_verified && (
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 gap-1 text-xs font-bold">
                  <BadgeCheck size={12} /> Registered
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {listing.trade_type || "Trade not set"}
              {listing.city ? ` · ${listing.city}` : ""}
            </p>
            {stats.reviewCount > 0 ? (
              <div className="flex items-center gap-1.5 mt-1.5">
                <StarRating value={Number(stats.rating)} size={14} />
                <span className="text-xs font-bold text-foreground">{stats.rating}</span>
                <span className="text-xs text-muted-foreground">({stats.reviewCount})</span>
              </div>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1a7a4a] mt-1.5">
                <Sparkles size={12} /> New — no reviews yet
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button asChild variant="outline" className="rounded-2xl font-bold gap-2 border-border">
            <Link href="/profile?tab=worker">
              <Pencil size={16} /> Edit
            </Link>
          </Button>
          <Button asChild className="rounded-2xl font-bold gap-2 bg-[#1a7a4a] text-white hover:opacity-90">
            <Link href={`/book/${userId}`} target="_blank">
              <ExternalLink size={16} /> View
            </Link>
          </Button>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Inbox size={18} />}
          accent="bg-amber-100 text-amber-700"
          label="Pending"
          value={stats.pending}
          sublabel="awaiting response"
        />
        <StatCard
          icon={<CalendarCheck size={18} />}
          accent="bg-emerald-100 text-emerald-700"
          label="Confirmed"
          value={stats.confirmed}
          sublabel="jobs booked"
        />
        <StatCard
          icon={<CalendarCheck size={18} />}
          accent="bg-primary/10 text-primary"
          label="Total requests"
          value={stats.total}
          sublabel="all time"
        />
        <StatCard
          icon={<Percent size={18} />}
          accent="bg-blue-100 text-blue-700"
          label="Acceptance"
          value={stats.acceptanceRate === null ? "—" : `${stats.acceptanceRate}%`}
          sublabel={stats.acceptanceRate === null ? "no data yet" : "of decided requests"}
        />
      </div>

      {/* Profile completeness */}
      <div className="rounded-3xl border border-border bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-black text-foreground">Profile completeness</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              A complete profile ranks higher and wins more bookings.
            </p>
          </div>
          <span className="text-2xl font-black text-[#1a7a4a]">{completeness}%</span>
        </div>
        <Progress value={completeness} className="h-2" />
        {missing.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {missing.map((item) => (
              <Link
                key={item.label}
                href="/profile?tab=worker"
                className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1 hover:bg-amber-100 transition-colors"
              >
                + {item.label}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-xs font-bold text-emerald-700 flex items-center gap-1 pt-1">
            <CheckCircle2 size={14} /> Your profile is complete.
          </p>
        )}
      </div>

      {/* Incoming requests */}
      <section className="space-y-4">
        <h2 className="text-lg font-black flex items-center gap-2">
          <Inbox size={18} className="text-primary" /> Incoming Requests
          {stats.pending > 0 && (
            <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs font-bold">
              {stats.pending}
            </Badge>
          )}
        </h2>
        {pending.length > 0 ? (
          <div className="space-y-4">
            {pending.map((booking) => (
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
        ) : (
          <EmptyState
            title="No pending requests"
            description="New booking requests from clients will show up here."
          />
        )}
      </section>

      {/* Recent reviews */}
      <section className="space-y-4">
        <h2 className="text-lg font-black flex items-center gap-2">
          <Star size={18} className="text-amber-500" /> Recent Reviews
        </h2>
        {recentReviews.length > 0 ? (
          <div className="space-y-3">
            {recentReviews.map((review) => (
              <div key={review.id} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className={`text-xs font-bold ${review.color}`}>
                        {review.initial}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-sm text-foreground">{review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                  <StarRating value={review.rating} size={13} />
                </div>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  &quot;{review.comment}&quot;
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No reviews yet" description="Reviews clients leave will appear here." />
        )}
      </section>
    </div>
  )
}
