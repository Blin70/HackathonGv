import type { ReactNode } from "react"

interface LegalPageProps {
  /** A lucide icon, already sized by the caller. */
  icon: ReactNode
  title: string
  /** Rendered verbatim, so it stays a real date rather than today's render. */
  lastUpdated: string
  children: ReactNode
}

/**
 * Shared frame for the privacy policy and terms of service.
 *
 * The two pages had this markup written out twice and it had already drifted —
 * one tilted its icon tile left, the other right, and they carried different
 * "last updated" dates for content written the same day.
 */
export function LegalPage({ icon, title, lastUpdated, children }: LegalPageProps) {
  return (
    <div className="flex-1 bg-background">
      <div className="bg-primary/5 py-16 md:py-24 border-b border-border/40 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3 pointer-events-none" />
        <div className="container px-4 md:px-8 mx-auto flex flex-col items-center text-center relative z-10">
          <div className="h-16 w-16 bg-primary/10 flex items-center justify-center rounded-2xl mb-6 shadow-sm">
            {icon}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            {title}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl font-medium">
            Last updated: {lastUpdated}
          </p>
        </div>
      </div>

      <div className="container px-4 md:px-8 mx-auto py-16 max-w-3xl">
        <div className="space-y-12">{children}</div>
      </div>
    </div>
  )
}

interface LegalSectionProps {
  title: string
  children: ReactNode
}

/** One numbered section of a legal page. */
export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
      {children}
    </section>
  )
}

/** Body copy inside a legal section. */
export function LegalText({ children }: { children: ReactNode }) {
  return <p className="text-muted-foreground leading-relaxed text-lg">{children}</p>
}

/** Bulleted list inside a legal section. */
export function LegalList({ children }: { children: ReactNode }) {
  return (
    <ul className="list-disc list-outside ml-6 text-muted-foreground text-lg space-y-2">
      {children}
    </ul>
  )
}
