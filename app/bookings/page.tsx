import type { Metadata } from "next"
import { BookingsView } from "@/components/bookings/BookingsView"

export const metadata: Metadata = {
  title: "Your bookings | Book A Fixer",
  description:
    "Track the repair jobs you have requested and their current status.",
}

export default function BookingsPage() {
  return <BookingsView />
}
