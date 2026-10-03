"use client"

import { use, useState } from "react"
import { notFound } from "next/navigation"

import { LoadingState } from "@/components/LoadingState"
import { AuthRequiredDialog } from "@/components/book/AuthRequiredDialog"
import { BookingConfirmationDialog } from "@/components/book/BookingConfirmationDialog"
import { BookingPanel } from "@/components/book/BookingPanel"
import { BookingRequestDialog } from "@/components/book/BookingRequestDialog"
import { WorkerDetails } from "@/components/book/WorkerDetails"
import { WorkerHero } from "@/components/book/WorkerHero"
import { WorkerReviews } from "@/components/book/WorkerReviews"
import { WriteReviewDialog } from "@/components/book/WriteReviewDialog"
import { useBookingRequest } from "@/hooks/use-booking-request"
import { useWorkerDetail } from "@/hooks/use-worker-detail"
import { useWorkerReviews } from "@/hooks/use-worker-reviews"

export default function TradesmanProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { company, loading, user } = useWorkerDetail(id)
  const reviews = useWorkerReviews(company, user)

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [requestOpen, setRequestOpen] = useState(false)
  const booking = useBookingRequest(company, user, requestOpen)

  if (loading) {
    return <LoadingState label="Loading worker profile..." />
  }
  if (!company) {
    return notFound()
  }

  const reviewerName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || ""

  const handleBook = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    setRequestOpen(true)
  }

  /** Dismissing the success dialog clears the form so it's clean if reopened. */
  const handleConfirmationClose = () => {
    setRequestOpen(false)
    booking.reset()
  }

  const handleWriteReview = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    reviews.setDialogOpen(true)
  }

  return (
    <main className="min-h-screen bg-[#f3f6f4] pb-24">
      <WorkerHero company={company} averageRating={reviews.average} reviewCount={reviews.items.length} />

      <div className="max-w-5xl mx-auto px-6 mt-8 md:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          <div className="lg:col-span-2 space-y-10">
            <WorkerDetails company={company} />
            <div className="h-px w-full bg-border" />
            <WorkerReviews
              reviews={reviews.items}
              averageRating={reviews.average}
              hasReviewed={Boolean(reviews.myReview)}
              onWriteReview={handleWriteReview}
            />
          </div>

          <div className="lg:col-span-1">
            <BookingPanel
              company={company}
              isLoggedIn={Boolean(user)}
              booked={booking.booked}
              onBook={handleBook}
            />
          </div>
        </div>
      </div>

      {/* The form yields to the success dialog the moment the request lands. */}
      <BookingRequestDialog
        open={requestOpen && !booking.booked}
        onOpenChange={setRequestOpen}
        companyName={company.name}
        form={booking.form}
        errors={booking.errors}
        submitting={booking.submitting}
        submitError={booking.submitError}
        alreadyOpen={booking.alreadyOpen}
        onFieldChange={booking.setField}
        onSubmit={booking.submit}
      />
      <BookingConfirmationDialog
        open={booking.booked}
        onClose={handleConfirmationClose}
        companyName={company.name}
      />
      <AuthRequiredDialog
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        companyName={company.name}
      />
      <WriteReviewDialog
        key={reviews.myReview?.id ?? user?.id ?? "anon"}
        open={reviews.dialogOpen}
        onOpenChange={reviews.setDialogOpen}
        companyName={company.name}
        editing={Boolean(reviews.myReview)}
        defaultName={reviewerName}
        defaultRating={reviews.myReview?.rating ?? 5}
        defaultComment={reviews.myReview?.comment ?? ""}
        onSubmit={reviews.submitReview}
      />
    </main>
  )
}
