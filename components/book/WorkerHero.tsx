import { BadgeCheck, Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { Company } from "@/lib/data"

interface WorkerHeroProps {
  company: Company
  averageRating: string
  reviewCount: number
}

export function WorkerHero({ company, averageRating, reviewCount }: WorkerHeroProps) {
  return (
    <div className="relative h-[40vh] md:h-[50vh] w-full">
      {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary user-supplied URLs can't be pre-configured for next/image */}
      <img
        src={company.image}
        alt={company.name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      <div className="absolute bottom-0 w-full">
        <div className="max-w-5xl mx-auto px-6 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-white">
            <Badge className="bg-[#1a7a4a] text-white border-0 mb-4 px-4 py-1.5 text-sm font-bold rounded-full shadow-lg">
              {company.type}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2">
              {company.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-medium opacity-90">
              <div className="flex items-center gap-1.5">
                <Star className="fill-yellow-400 text-yellow-400" size={18} />
                <span className="font-bold">{averageRating}</span>
                <span className="opacity-75">({reviewCount} reviews)</span>
              </div>
              {company.isVerified && (
                <>
                  <div className="h-1.5 w-1.5 rounded-full bg-white/50" />
                  <div className="flex items-center gap-1.5">
                    <BadgeCheck size={18} className="text-emerald-400" />
                    <span>Registered Business</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
