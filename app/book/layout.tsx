import type { Metadata } from "next"

// The page is a client component and cannot export metadata, so its
// title lives here. This layout adds no markup.
export const metadata: Metadata = {
  title: "Find a tradesperson | Book A Fixer",
  description:
    "Browse local plumbers, electricians, carpenters and painters, and send a booking request.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
