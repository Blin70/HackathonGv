import Link from "next/link"
import { ArrowRight, BadgeCheck, MapPin, Users } from "lucide-react"

import { EmptyState } from "@/components/EmptyState"
import { StarRating } from "@/components/StarRating"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Company } from "@/lib/data"

interface RepairWorkerMatchesProps {
  companies: Company[]
  city: string
  tradeCategory: string
  loading: boolean
  error: string | null
}

export function RepairWorkerMatches({ companies, city, tradeCategory, loading, error }: RepairWorkerMatchesProps) {
  const normalize = (value: string) => value.trim().toLocaleLowerCase()
  const matches = companies.filter((company) =>
    normalize(company.city) === normalize(city) && normalize(company.type) === normalize(tradeCategory)
  )

  return (
    <Card className="rounded-3xl border-border/70 bg-white shadow-sm">
      <CardHeader className="px-5 pb-3 pt-5 sm:px-6 sm:pt-6">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Users className="size-5" />
          </span>
          <div className="min-w-0">
            <CardTitle className="text-lg font-bold">Matching {tradeCategory} workers</CardTitle>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" /> {city}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 px-5 pb-5 sm:px-6 sm:pb-6">
        {loading ? (
          <div className="space-y-3" aria-label="Loading local workers" aria-live="polite">
            {[0, 1].map((item) => <div key={item} className="h-24 animate-pulse rounded-2xl bg-muted" />)}
          </div>
        ) : error ? (
          <EmptyState title="Workers could not be loaded" description={error} />
        ) : matches.length === 0 ? (
          <EmptyState
            title={`No matching listings in ${city} yet`}
            description="You can still browse all available trades and cities on the marketplace."
            action={<Button asChild variant="outline" className="mt-2 rounded-xl"><Link href="/book">Browse all workers</Link></Button>}
          />
        ) : (
          <>
            <ul className="space-y-3">
              {matches.slice(0, 5).map((company) => (
                <li key={company.id}>
                  <article className="rounded-2xl border border-border/70 p-4 transition-colors hover:border-primary/30 hover:bg-primary/[0.02]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate font-bold text-foreground">{company.name}</h3>
                          {company.isVerified && (
                            <Badge variant="outline" className="gap-1 rounded-full border-emerald-200 bg-emerald-50 text-[10px] text-emerald-800">
                              <BadgeCheck className="size-3" /> Registered
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{company.desc}</p>
                      </div>
                      {company.reviews > 0 ? (
                        <div className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-foreground" aria-label={`${company.rating.toFixed(1)} out of 5 from ${company.reviews} reviews`}>
                          <StarRating value={company.rating} size={12} />
                          <span>{company.rating.toFixed(1)} <span className="font-normal text-muted-foreground">({company.reviews})</span></span>
                        </div>
                      ) : (
                        <Badge variant="secondary" className="shrink-0 rounded-full text-[10px]">New</Badge>
                      )}
                    </div>
                    <div className="mt-3 flex flex-col gap-3 border-t border-border/60 pt-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Starting from</p>
                        <p className="font-bold text-foreground">{company.price}<span className="ml-1 text-xs font-normal text-muted-foreground">/hr</span></p>
                      </div>
                      <Button asChild size="sm" className="w-full rounded-xl sm:w-auto">
                        <Link href={`/book/${company.id}`}>View profile <ArrowRight className="ml-1.5 size-3.5" /></Link>
                      </Button>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Suggestions match the worker&apos;s listed trade and city. Confirm availability, scope, and final pricing with them directly.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
