import type { Metadata } from "next"

import { LandingPage } from "@/components/landing/LandingPage"

export const metadata: Metadata = {
  title: "Book A Fixer | Find a local tradesperson in North Macedonia",
  description:
    "Describe the job, compare local plumbers, electricians, carpenters and painters, and send a booking request. No phone calls until you choose who to contact.",
}

export default function Page() {
  return <LandingPage />
}
