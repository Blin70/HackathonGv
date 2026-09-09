import type { Metadata } from "next"

import { DashboardView } from "@/components/dashboard/DashboardView"

export const metadata: Metadata = {
  title: "Dashboard | Book A Fixer",
  description: "Track your booking requests, reviews, and listing performance.",
}

export default function DashboardPage() {
  return <DashboardView />
}
