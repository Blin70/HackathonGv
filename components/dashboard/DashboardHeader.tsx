"use client"

import Link from "next/link"
import { BadgeCheck, ExternalLink, Pencil, Sparkles } from "lucide-react"

import { StarRating } from "@/components/StarRating"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { WorkerProfileRow } from "@/lib/workers"

interface DashboardHeaderProps {
  listing: WorkerProfileRow
  userId: string
  rating: string
  reviewCount: number
}

/** Identity card at the top of the dashboard — who the worker is to clients. */
export function DashboardHeader({ listing, userId, rating, reviewCount }: DashboardHeaderProps) {
  const name = listing.display_name || listing.business_name || "Your listing"

  return (
    <div className="rounded-3xl border border-border bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
      <div className="flex items-center gap-4 min-w-0">
        <div className="h-14 w-14 shrink-0 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-2xl">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl md:text-2xl font-extrabold text-foreground truncate">{name}</h1>
            {listing.is_verified && (
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 gap-1 text-xs font-bold">
                <BadgeCheck size={12} /> Registered
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {listing.trade_type || "Trade not set"}
            {listing.city ? ` · ${listing.city}` : ""}
          </p>
          {reviewCount > 0 ? (
            <div className="flex items-center gap-1.5 mt-1.5">
              <StarRating value={Number(rating)} size={14} />
              <span className="text-xs font-bold text-foreground">{rating}</span>
              <span className="text-xs text-muted-foreground">({reviewCount})</span>
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1a7a4a] mt-1.5">
              <Sparkles size={12} /> New — no reviews yet
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2 shrink-0">
        <Button asChild variant="outline" className="rounded-2xl font-bold gap-2 border-border">
          <Link href="/profile?tab=worker">
            <Pencil size={16} /> Edit
          </Link>
        </Button>
        <Button
          asChild
          className="rounded-2xl font-bold gap-2 bg-[#1a7a4a] text-white hover:opacity-90"
        >
          <Link href={`/book/${userId}`} target="_blank">
            <ExternalLink size={16} /> View
          </Link>
        </Button>
      </div>
    </div>
  )
}
