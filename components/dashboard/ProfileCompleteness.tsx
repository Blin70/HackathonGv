"use client"

import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

import { Progress } from "@/components/ui/progress"
import type { ProfileChecklistItem } from "@/lib/workers"

interface ProfileCompletenessProps {
  checklist: ProfileChecklistItem[]
  completeness: number
}

/** Nudges the worker to finish the listing fields clients actually search on. */
export function ProfileCompleteness({ checklist, completeness }: ProfileCompletenessProps) {
  const missing = checklist.filter((item) => !item.done)

  return (
    <div className="rounded-3xl border border-border bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-black text-foreground">Profile completeness</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            A complete profile ranks higher and wins more bookings.
          </p>
        </div>
        <span className="text-2xl font-black text-[#1a7a4a]">{completeness}%</span>
      </div>

      <Progress value={completeness} className="h-2" />

      {missing.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {missing.map((item) => (
            <Link
              key={item.label}
              href="/profile?tab=worker"
              className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1 hover:bg-amber-100 transition-colors"
            >
              + {item.label}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-xs font-bold text-emerald-700 flex items-center gap-1 pt-1">
          <CheckCircle2 size={14} /> Your profile is complete.
        </p>
      )}
    </div>
  )
}
