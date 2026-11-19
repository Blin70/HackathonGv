"use client"

import Link from "next/link"
import { BadgeCheck, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { formatPrice } from "@/lib/currency"
import { FALLBACK_BANNER_IMAGE, type WorkerProfileForm } from "@/lib/profile"

interface WorkerCardPreviewProps {
  form: WorkerProfileForm
  workerId: string
  isVerified: boolean
}

export function WorkerCardPreview({ form, workerId, isVerified }: WorkerCardPreviewProps) {
  return (
    <div className="lg:col-span-4 space-y-6">
      <div className="sticky top-24 space-y-6">
        <Card className="border border-border/60 bg-white shadow-md rounded-2xl overflow-hidden p-0">
          <div className="bg-gradient-to-r from-primary to-primary-bright p-4 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-between">
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
            <Badge className="absolute top-3 left-3 bg-white text-primary font-semibold text-xs rounded-full px-3 py-1 border-0">
              {form.tradeType}
            </Badge>
          </div>

          <CardContent className="p-5 space-y-3">
            <h3 className="font-bold text-xl leading-snug text-foreground">
              {form.businessName || "Your Company Name"}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {form.tagline || "Your short tagline..."}
            </p>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="flex items-center gap-1 rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary">
                <Sparkles size={12} className="text-primary-bright" /> New
              </span>
              {isVerified && (
                <span className="flex items-center gap-1 text-xs text-primary font-bold bg-primary/5 px-2 py-0.5 rounded-md border border-primary/20">
                  <BadgeCheck size={12} /> Registered
                </span>
              )}
            </div>
          </CardContent>

          <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-border/30 mt-2">
            <div>
              <span className="text-xs text-muted-foreground block">Starting rate</span>
              <span className="text-2xl font-bold text-foreground">{formatPrice(form.price)}</span>
              <span className="text-xs text-muted-foreground">/hr</span>
            </div>

            <Button asChild size="sm" className="rounded-xl font-bold bg-primary text-white">
              <Link href={`/book/${workerId}`} target="_blank">
                View Page →
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Quick tip box */}
        <div className="p-5 rounded-2xl bg-secondary/40 border border-border/50 text-xs text-muted-foreground space-y-2">
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
