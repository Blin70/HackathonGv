"use client"

import type { LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"

export interface TimelineStep {
  icon: LucideIcon
  title: string
  body: string
  /** Short label for a step that isn't live yet, e.g. "Coming soon". */
  badge?: string
}

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

/** Fades and lifts its children in the first time they scroll into view. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none",
        inView
          ? "translate-y-0 opacity-100"
          : "translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100",
        className
      )}
    >
      {children}
    </div>
  )
}

function StepItem({ step, index, isLast, tone }: { step: TimelineStep; index: number; isLast: boolean; tone: "light" | "dark" }) {
  const { ref, inView } = useInView<HTMLLIElement>({ threshold: 0.6 })
  const Icon = step.icon
  const dark = tone === "dark"

  return (
    <li ref={ref} className="relative flex gap-5 pb-10 last:pb-0">
      {/* Connector to the next step; it "draws" downward once this step is reached. */}
      {!isLast && (
        <span aria-hidden className={cn("absolute left-6 top-14 bottom-2 w-0.5 -translate-x-1/2 rounded-full", dark ? "bg-slate-800" : "bg-border")}>
          <span
            className={cn(
              "block h-full w-full origin-top rounded-full bg-primary transition-transform duration-1000 ease-out motion-reduce:transition-none",
              inView ? "scale-y-100" : "scale-y-0"
            )}
          />
        </span>
      )}

      <span
        className={cn(
          "relative z-10 flex size-12 shrink-0 items-center justify-center rounded-2xl border transition-all duration-500 motion-reduce:transition-none",
          inView
            ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25"
            : dark
              ? "border-slate-800 bg-slate-900 text-slate-500"
              : "border-border bg-white text-muted-foreground"
        )}
      >
        <Icon className="size-5" />
      </span>

      <div
        className={cn(
          "pt-1 transition-all duration-700 ease-out motion-reduce:transition-none",
          inView ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0 motion-reduce:translate-x-0 motion-reduce:opacity-100"
        )}
      >
        <p className={cn("text-xs font-bold uppercase tracking-widest", dark ? "text-emerald-400" : "text-primary")}>
          Step {index + 1}
        </p>
        <h3 className={cn("mt-1 flex flex-wrap items-center gap-2 text-lg font-bold", dark ? "text-white" : "text-foreground")}>
          {step.title}
          {step.badge && (
            <Badge variant="outline" className={cn("rounded-full text-[10px] font-bold uppercase tracking-wide", dark ? "border-amber-400/40 bg-amber-400/10 text-amber-300" : "border-amber-200 bg-amber-50 text-amber-800")}>
              {step.badge}
            </Badge>
          )}
        </h3>
        <p className={cn("mt-1.5 max-w-xl text-sm leading-relaxed", dark ? "text-slate-400" : "text-muted-foreground")}>{step.body}</p>
      </div>
    </li>
  )
}

/** A vertical, numbered walkthrough whose steps light up as the reader scrolls. */
export function StepTimeline({ steps, tone = "light" }: { steps: TimelineStep[]; tone?: "light" | "dark" }) {
  return (
    <ol className="relative">
      {steps.map((step, index) => (
        <StepItem key={step.title} step={step} index={index} isLast={index === steps.length - 1} tone={tone} />
      ))}
    </ol>
  )
}
