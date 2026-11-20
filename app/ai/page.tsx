import type { Metadata } from "next"

import { RepairIntakeExperience } from "@/components/repair-intake/RepairIntakeExperience"

export const metadata: Metadata = {
  title: "AI Concierge | Book A Fixer",
  description: "Snap a photo or describe a home repair, get step-by-step guidance, and find local tradespeople in North Macedonia.",
}

export default function AiConciergePage() {
  return <RepairIntakeExperience />
}
