"use client"

import { use, useState } from "react"
import { notFound } from "next/navigation"

import { LoadingState } from "@/components/LoadingState"
import { AuthRequiredDialog } from "@/components/book/AuthRequiredDialog"
import { BookingConfirmationDialog } from "@/components/book/BookingConfirmationDialog"
import { BookingPanel } from "@/components/book/BookingPanel"
import { WorkerDetails } from "@/components/book/WorkerDetails"
import { WorkerHero } from "@/components/book/WorkerHero"
import { WorkerReviews } from "@/components/book/WorkerReviews"
import { WriteReviewDialog } from "@/components/book/WriteReviewDialog"
import { createBooking } from "@/lib/bookings"
import { useWorkerDetail } from "@/hooks/use-worker-detail"
import { useWorkerReviews } from "@/hooks/use-worker-reviews"

export default function TradesmanProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { company, loading, user } = useWorkerDetail(id)
  const reviews = useWorkerReviews(company, user)

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [booked, setBooked] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)

  if (loading) {
    return <LoadingState label="Loading worker profile..." />
  }
  if (!company) {
    return notFound()
  }

  const reviewerName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || ""

  const handleBook = async () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    if (submitting) return

    setSubmitting(true)
    setBookingError(null)

    const { error } = await createBooking({
      clientId: user.id,
      clientName: reviewerName || "Client",
      workerId: String(company.id),
      workerName: company.name,
      tradeType: company.type,
    })

    setSubmitting(false)

    if (error) {
      console.error(error)
      setBookingError("Couldn't send your request. Please try again.")
    } else {
      setBooked(true)
    }
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
              onWriteReview={handleWriteReview}
            />
          </div>

          <div className="lg:col-span-1">
            <BookingPanel
              company={company}
              isLoggedIn={Boolean(user)}
              booked={booked}
              submitting={submitting}
              bookingError={bookingError}
              onBook={handleBook}
            />
          </div>
        </div>
      </div>

      <BookingConfirmationDialog
        open={booked}
        onClose={() => setBooked(false)}
        companyName={company.name}
      />
      <AuthRequiredDialog
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        companyName={company.name}
      />
      <WriteReviewDialog
        open={reviews.dialogOpen}
        onOpenChange={reviews.setDialogOpen}
        companyName={company.name}
        defaultName={reviewerName}
        onSubmit={reviews.addReview}
      />
    </main>
  )
}
