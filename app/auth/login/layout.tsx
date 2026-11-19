import type { Metadata } from "next"

// The page is a client component and cannot export metadata, so its
// title lives here. This layout adds no markup.
export const metadata: Metadata = {
  title: "Sign in | Book A Fixer",
  description:
    "Sign in to request repairs or manage your tradesperson listing.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
