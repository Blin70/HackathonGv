import { CalendarCheck, CheckCheck, Inbox, Percent } from "lucide-react"

import { StatCard } from "./StatCard"

interface StatGridProps {
  pending: number
  scheduled: number
  completed: number
  /** Share of decided requests that were accepted, or null when none were decided. */
  acceptanceRate: number | null
}

/** The worker's headline numbers, all derived from their real booking history. */
export function StatGrid({ pending, scheduled, completed, acceptanceRate }: StatGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<Inbox size={18} />}
        accent="bg-amber-100 text-amber-700"
        label="Pending"
        value={pending}
        sublabel="awaiting response"
      />
      <StatCard
        icon={<CalendarCheck size={18} />}
        accent="bg-blue-100 text-blue-700"
        label="Scheduled"
        value={scheduled}
        sublabel="accepted, not done"
      />
      <StatCard
        icon={<CheckCheck size={18} />}
        accent="bg-emerald-100 text-emerald-700"
        label="Completed"
        value={completed}
        sublabel="jobs finished"
      />
      <StatCard
        icon={<Percent size={18} />}
        accent="bg-blue-100 text-blue-700"
        label="Acceptance"
        value={acceptanceRate === null ? "—" : `${acceptanceRate}%`}
        sublabel={acceptanceRate === null ? "no data yet" : "of decided requests"}
      />
    </div>
  )
}
