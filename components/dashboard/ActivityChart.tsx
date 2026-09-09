"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { TrendingUp } from "lucide-react"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { BookingActivityPoint } from "@/lib/bookings"

const chartConfig = {
  confirmed: { label: "Confirmed", color: "var(--primary)" },
  other: { label: "Not confirmed", color: "var(--chart-1)" },
} satisfies ChartConfig

interface ActivityChartProps {
  data: BookingActivityPoint[]
}

/** Six-month request trend, so a worker can see demand building or dropping. */
export function ActivityChart({ data }: ActivityChartProps) {
  return (
    <div className="rounded-3xl border border-border bg-white p-6 shadow-sm space-y-4">
      <div>
        <h2 className="font-black text-foreground flex items-center gap-2">
          <TrendingUp size={16} className="text-primary" /> Request activity
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Booking requests you&apos;ve received over the last 6 months.
        </p>
      </div>

      <ChartContainer config={chartConfig} className="aspect-auto h-[200px] w-full">
        <BarChart data={data} margin={{ left: -20, right: 4, top: 4 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} allowDecimals={false} width={40} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {/* Animation off: bars grow from zero height, and a container that
              mounts at zero size (hydration, a hidden tab) leaves them stuck
              there — drawing nothing at all. */}
          <Bar
            dataKey="confirmed"
            stackId="a"
            fill="var(--color-confirmed)"
            radius={[0, 0, 4, 4]}
            isAnimationActive={false}
          />
          <Bar
            dataKey="other"
            stackId="a"
            fill="var(--color-other)"
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
