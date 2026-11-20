import type { Metadata } from "next"

import { HowItWorks } from "@/components/how-it-works/HowItWorks"

export const metadata: Metadata = {
  title: "How it works | Book A Fixer",
  description:
    "How Book A Fixer connects homeowners in North Macedonia with local tradespeople — for customers booking a repair and for workers and companies offering their services.",
}

export default function HowItWorksPage() {
  return <HowItWorks />
}
