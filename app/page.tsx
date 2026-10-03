import type { Metadata } from "next"

import { RepairIntakeExperience } from "@/components/repair-intake/RepairIntakeExperience"

export const metadata: Metadata = {
  title: "Describe a Repair | Book A Fixer",
  description: "Describe a home repair, get practical safety guidance, and find local tradespeople in North Macedonia.",
}

export default function HomePage() {
  return <RepairIntakeExperience />
}
