import type { Metadata } from "next"

// The page is a client component and cannot export metadata, so its
// title lives here. This layout adds no markup.
export const metadata: Metadata = {
  title: "Register your business | Book A Fixer",
  description:
    "List your trade business on Book A Fixer and receive booking requests.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
