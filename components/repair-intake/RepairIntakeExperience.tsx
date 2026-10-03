"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, House, Sparkles } from "lucide-react"

import { EmptyState } from "@/components/EmptyState"
import { RepairAssessmentPanel } from "@/components/repair-intake/RepairAssessmentPanel"
import { RepairConversation } from "@/components/repair-intake/RepairConversation"
import { RepairWorkerMatches } from "@/components/repair-intake/RepairWorkerMatches"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRepairIntake } from "@/hooks/use-repair-intake"
import { getMarketplaceCompanies } from "@/lib/workers"
import type { Company } from "@/lib/data"

export function RepairIntakeExperience() {
  const { messages, assessment, loading: analyzing, error, submit, reset } = useRepairIntake()
  const [companies, setCompanies] = useState<Company[]>([])
  const [workersLoading, setWorkersLoading] = useState(true)
  const [workersError, setWorkersError] = useState<string | null>(null)
  const [assessmentCity, setAssessmentCity] = useState("")

  useEffect(() => {
    let active = true

    getMarketplaceCompanies()
      .then((listings) => {
        if (active) setCompanies(listings)
      })
      .catch((caught: unknown) => {
        if (active) setWorkersError(caught instanceof Error ? caught.message : "Please try again later.")
      })
      .finally(() => {
        if (active) setWorkersLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="min-h-[70vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.07] via-background to-background">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <section className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-3.5 py-1.5 text-xs font-bold text-primary shadow-sm">
            <Sparkles className="size-3.5" /> AI repair assistant
          </div>
          <h1 className="text-balance text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Tell us what needs fixing.
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Get a practical repair summary, safety guidance, and local tradespeople matched to the work and city.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-5 rounded-full bg-white">
            <Link href="/home"><House className="mr-2 size-4" /> Go to home</Link>
          </Button>
        </section>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)] lg:gap-6">
          <RepairConversation
            messages={messages}
            loading={analyzing}
            error={error}
            onSubmit={async (input) => {
              const succeeded = await submit(input)
              if (succeeded) setAssessmentCity(input.city)
              return succeeded
            }}
            onReset={reset}
          />

          <div className="space-y-5">
            {assessment ? (
              <>
                <RepairAssessmentPanel assessment={assessment} />
                {assessment.isHomeRepair && assessment.tradeCategory && (
                  <RepairWorkerMatches
                    companies={companies}
                    city={assessmentCity}
                    tradeCategory={assessment.tradeCategory}
                    loading={workersLoading}
                    error={workersError}
                  />
                )}
              </>
            ) : (
              <>
                <Card className="rounded-3xl border-border/70 bg-white shadow-sm">
                  <CardContent className="p-5 sm:p-6">
                    <h2 className="text-base font-bold text-foreground">What you&apos;ll get</h2>
                    <ul className="mt-4 space-y-4">
                      {[
                        ["A useful first assessment", "Your description is organized into a trade and urgency level."],
                        ["Safety guidance", "The assistant highlights practical precautions when they matter."],
                        ["Relevant local listings", "We match the trade and city against current marketplace listings."],
                      ].map(([title, description]) => (
                        <li key={title} className="flex gap-3">
                          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><ArrowUpRight className="size-4" /></span>
                          <div><p className="text-sm font-semibold">{title}</p><p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{description}</p></div>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 border-t border-border/60 pt-4 text-xs leading-relaxed text-muted-foreground">
                      AI suggestions are a starting point, not an on-site inspection or a guarantee of a worker&apos;s availability.
                    </p>
                  </CardContent>
                </Card>
                {workersError && <EmptyState title="Marketplace listings are unavailable" description={workersError} />}
              </>
            )}
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-muted-foreground">
          For immediate danger, move to a safe place and contact local emergency services. Do not wait for an online assessment.
        </p>
      </div>
    </div>
  )
}
