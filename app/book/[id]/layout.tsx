import type { Metadata } from "next"

// The page is a client component and cannot export metadata, so its
// title lives here. This layout adds no markup.
export const metadata: Metadata = {
  title: "Tradesperson profile | Book A Fixer",
  description:
    "Services, rates, availability and reviews for a tradesperson on Book A Fixer.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
