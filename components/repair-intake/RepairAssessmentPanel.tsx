import Link from "next/link"
import { CircleAlert, Clock3, House, ShieldCheck, Wrench } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { RepairAssessment } from "@/lib/schemas/repair-intake"

interface RepairAssessmentPanelProps {
  assessment: RepairAssessment
}

const URGENCY_PRESENTATION = {
  routine: { label: "Routine", className: "border-emerald-200 bg-emerald-50 text-emerald-800" },
  soon: { label: "Needs attention soon", className: "border-amber-200 bg-amber-50 text-amber-900" },
  urgent: { label: "Urgent", className: "border-orange-200 bg-orange-50 text-orange-900" },
  emergency: { label: "Possible emergency", className: "border-red-200 bg-red-50 text-red-800" },
} as const

export function RepairAssessmentPanel({ assessment }: RepairAssessmentPanelProps) {
  const urgency = URGENCY_PRESENTATION[assessment.urgency]

  return (
    <Card className="overflow-hidden rounded-3xl border-border/70 bg-white shadow-sm">
      <CardHeader className="space-y-3 border-b border-border/60 bg-slate-50/70 px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant="outline" className="gap-1.5 rounded-full border-primary/20 bg-primary/5 px-3 py-1 text-primary">
            <Wrench className="size-3.5" /> Repair assessment
          </Badge>
          <Badge variant="outline" className={`rounded-full px-3 py-1 ${urgency.className}`}>
            {assessment.urgency === "emergency" && <CircleAlert className="size-3.5" />}
            {assessment.urgency !== "emergency" && <Clock3 className="size-3.5" />}
            {urgency.label}
          </Badge>
        </div>
        <div>
          <CardTitle className="text-lg font-bold sm:text-xl">
            {assessment.isHomeRepair ? assessment.tradeCategory : "This may not be a home repair"}
          </CardTitle>
          <CardDescription className="mt-1 leading-relaxed">{assessment.summary}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 p-5 sm:p-6">
        <div className="space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Urgency</p>
          <p className="text-sm leading-relaxed text-foreground">{assessment.urgencyExplanation}</p>
        </div>

        {assessment.safetyGuidance.length > 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-amber-950">
              <ShieldCheck className="size-4 shrink-0" /> Safety guidance
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-amber-950/90">
              {assessment.safetyGuidance.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}
            </ul>
          </div>
        )}

        {assessment.followUpQuestion && (
          <div className="rounded-2xl bg-muted/50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">One detail that could help</p>
            <p className="mt-1 text-sm leading-relaxed text-foreground">{assessment.followUpQuestion}</p>
          </div>
        )}

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Suggested next step</p>
          <p className="mt-1 text-sm leading-relaxed text-foreground">{assessment.nextStep}</p>
        </div>

        {assessment.urgency === "emergency" && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium leading-relaxed text-red-900">
            If anyone may be in immediate danger, move to a safe place and contact local emergency services.
          </p>
        )}

        {!assessment.isHomeRepair && (
          <Button asChild variant="outline" className="w-full rounded-xl">
            <Link href="/home"><House className="mr-2 size-4" /> Go to home</Link>
          </Button>
        )}

        <p className="text-xs leading-relaxed text-muted-foreground">
          AI guidance can be incomplete and cannot inspect your home. If you are unsure, contact a qualified professional.
        </p>
      </CardContent>
    </Card>
  )
}
