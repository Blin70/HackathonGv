"use client"

import Link from "next/link"
import { BadgeCheck, Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { FALLBACK_BANNER_IMAGE, formatPrice, type WorkerProfileForm } from "@/lib/profile"

interface WorkerCardPreviewProps {
  form: WorkerProfileForm
  workerId: string
  isVerified: boolean
}

export function WorkerCardPreview({ form, workerId, isVerified }: WorkerCardPreviewProps) {
  return (
    <div className="lg:col-span-4 space-y-6">
      <div className="sticky top-24 space-y-6">
        <Card className="border border-border/60 bg-white shadow-xl rounded-3xl overflow-hidden p-0">
          <div className="bg-gradient-to-r from-[#1a7a4a] to-[#25c26e] p-4 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between">
            <span>Live Card Preview</span>
            <span className="bg-white/20 text-white px-2.5 py-0.5 rounded-full text-[10px]">Real-time</span>
          </div>

          <div className="relative w-full h-44 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary user-supplied URLs can't be pre-configured for next/image */}
            <img
              src={form.bannerImage || FALLBACK_BANNER_IMAGE}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <Badge className="absolute top-3 left-3 bg-white text-[#1a7a4a] font-bold text-xs rounded-full px-3 py-1 border-0">
              {form.tradeType}
            </Badge>
          </div>

          <CardContent className="p-5 space-y-3">
            <h3 className="font-extrabold text-xl leading-snug text-foreground">
              {form.businessName || "Your Company Name"}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {form.tagline || "Your short tagline..."}
            </p>

            <div className="flex items-center justify-between text-xs pt-2">
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span className="font-bold">4.9</span>
                <span className="text-muted-foreground">(189 reviews)</span>
              </div>
              {isVerified && (
                <span className="flex items-center gap-1 text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <BadgeCheck size={12} /> Registered
                </span>
              )}
            </div>
          </CardContent>

          <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-border/30 mt-2">
            <div>
              <span className="text-xs text-muted-foreground block">Starting rate</span>
              <span className="text-2xl font-black text-foreground">{formatPrice(form.price)}</span>
              <span className="text-xs text-muted-foreground">/hr</span>
            </div>

            <Button asChild size="sm" className="rounded-xl font-bold bg-[#1a7a4a] text-white">
              <Link href={`/book/${workerId}`} target="_blank">
                View Page →
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Quick tip box */}
        <div className="p-5 rounded-3xl bg-secondary/40 border border-border/50 text-xs text-muted-foreground space-y-2">
          <p className="font-bold text-foreground text-sm flex items-center gap-2">💡 How this works</p>
          <p className="leading-relaxed">
            When you save this form, your company is immediately published to the <strong>/book</strong>{" "}
            market directory and generates your dedicated public page at{" "}
            <strong>/book/{workerId}</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}
