"use client"

import Link from "next/link"
import { AlertCircle, Sparkles } from "lucide-react"

import { EmptyState } from "@/components/EmptyState"
import { LoadingState } from "@/components/LoadingState"
import { Button } from "@/components/ui/button"
import { useWorkerDashboard } from "@/hooks/use-worker-dashboard"

import { ActivityChart } from "./ActivityChart"
import { DashboardHeader } from "./DashboardHeader"
import { ProfileCompleteness } from "./ProfileCompleteness"
import { RecentReviews } from "./RecentReviews"
import { RequestsPanel } from "./RequestsPanel"
import { StatGrid } from "./StatGrid"

export function DashboardView() {
  const {
    loading,
    error,
    reload,
    userId,
    listing,
    received,
    pending,
    scheduled,
    completed,
    reviews,
    checklist,
    stats,
    activity,
    busyId,
    transitionBooking,
  } = useWorkerDashboard()

  if (loading) {
    return <LoadingState label="Loading dashboard..." />
  }

  if (error) {
    return (
      <div className="flex-1 container max-w-3xl mx-auto px-4 py-16">
        <EmptyState
          icon={<AlertCircle className="h-8 w-8" />}
          title="Couldn't load your dashboard"
          description={error}
          action={
            <Button
              onClick={reload}
              className="rounded-2xl font-bold bg-[#1a7a4a] text-white hover:opacity-90"
            >
              Try again
            </Button>
          }
        />
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="flex-1 container max-w-3xl mx-auto px-4 py-16">
        <EmptyState
          icon={<Sparkles className="h-8 w-8" />}
          title="You don't have a worker listing yet"
          description="Set up your worker profile to appear in the marketplace and start receiving bookings."
          action={
            <Button
              asChild
              className="rounded-2xl font-bold bg-[#1a7a4a] text-white hover:opacity-90"
            >
              <Link href="/profile?tab=worker">Set up your profile</Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="flex-1 container max-w-4xl mx-auto px-4 py-10 md:py-14 space-y-6">
      <DashboardHeader
        listing={listing}
        userId={userId}
        rating={stats.rating}
        reviewCount={stats.reviewCount}
      />

      <StatGrid
        pending={stats.pending}
        scheduled={stats.scheduled}
        completed={stats.completed}
        acceptanceRate={stats.acceptanceRate}
      />

      <ProfileCompleteness checklist={checklist} completeness={stats.completeness} />

      {/* Only worth charting once there's history to plot. */}
      {received.length > 0 && <ActivityChart data={activity} />}

      <RequestsPanel
        pending={pending}
        scheduled={scheduled}
        completed={completed}
        all={received}
        busyId={busyId}
        onTransition={transitionBooking}
      />

      <RecentReviews reviews={reviews} />
    </div>
  )
}
