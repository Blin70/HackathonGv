import type { Metadata } from "next"

// The page is a client component and cannot export metadata, so its
// title lives here. This layout adds no markup.
export const metadata: Metadata = {
  title: "Create an account | Book A Fixer",
  description:
    "Create a Book A Fixer account to request local tradespeople.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
