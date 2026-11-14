"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Search,
  Star,
  Sparkles,
  Droplets,
  Zap,
  Paintbrush,
  Hammer,
  Wind,
  Leaf,
  ShieldCheck,
  UserPlus,
  Briefcase,
  ChevronRight,
  MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DemoBadge } from "@/components/DemoBadge"
import type { Company } from "@/lib/data"
import { getMarketplaceCompanies } from "@/lib/workers"

const QUICK_SUGGESTIONS = [
  "Plumber",
  "Electrician",
  "Carpenter",
  "Painter",
  "Roofer",
  "Tiler",
  "HVAC"
]

export function LandingPage() {
  const [jobDescription, setJobDescription] = useState("")
  const [featuredWorkers, setFeaturedWorkers] = useState<Company[]>([])
  const router = useRouter()

  // Same source as /book, so a seeded example never outlives the real listing
  // that replaces it.
  useEffect(() => {
    let active = true
    getMarketplaceCompanies()
      .then((listings) => {
        if (active) setFeaturedWorkers(listings.slice(0, 3))
      })
      .catch(() => {
        // The marketplace section is not load-bearing; leaving it empty beats
        // showing an error on the landing page.
      })
    return () => {
      active = false
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (jobDescription.trim()) {
      router.push(`/book?search=${encodeURIComponent(jobDescription.trim())}`)
    } else {
      router.push("/book")
    }
  }

  const handleQuickCategory = (trade: string) => {
    router.push(`/book?type=${encodeURIComponent(trade)}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden">
      
      {/* ========================================================================= */}
      {/* HERO SECTION                                                              */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-slate-950 text-white overflow-hidden py-16 md:py-28">
        {/* Ambient Radial Lighting */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#1a7a4a]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Copy & Search Form */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Title & Subtitle */}
              <div className="space-y-4 pt-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                  The Fast & Trusted Way to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#1a7a4a]">Book a Fixer</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl">
                  Describe the job, compare local plumbers, electricians, carpenters and painters, and send a booking request. Rates are shown up front.
                </p>
              </div>

              {/* Instant Search Bar */}
              <form onSubmit={handleSearch} className="relative max-w-2xl w-full">
                <div className="flex flex-col sm:flex-row items-center gap-2.5 p-2 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="What fix do you need? (e.g. Leaking pipe, Rewiring)..."
                      className="h-14 pl-12 pr-4 bg-transparent text-white placeholder:text-slate-400 text-base rounded-2xl border-0 focus-visible:ring-0 w-full"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="h-14 px-8 w-full sm:w-auto font-black text-base rounded-2xl text-white shadow-xl shadow-emerald-950 transition-all hover:scale-[1.02]"
                    style={{ background: "#1a7a4a" }}
                  >
                    Search Fixers
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>

                {/* The single biggest fear of a lead form is being cold-called
                    by five contractors. Answer it right under the button. */}
                <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 pl-1 text-sm text-slate-400">
                  <span>No phone calls — you choose who to contact.</span>
                  <Link
                    href="/describe"
                    className="font-semibold text-emerald-400 underline-offset-4 hover:underline"
                  >
                    Not sure which trade you need?
                  </Link>
                </p>
              </form>

              {/* Quick Trade Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">Popular:</span>
                {QUICK_SUGGESTIONS.map((trade) => (
                  <button
                    key={trade}
                    type="button"
                    onClick={() => handleQuickCategory(trade)}
                    className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/50 hover:bg-slate-800 transition-all"
                  >
                    {trade}
                  </button>
                ))}
              </div>

            </div>

            {/* Right Visual Box (Fixer Card Showcase) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Featured Photo */}
                <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl h-[420px] md:h-[480px]">
                  <Image
                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop"
                    alt="Skilled Tradesman at work"
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* How the platform works, rather than an invented person
                      with an invented rating and rate. */}
                  <div className="absolute bottom-6 left-6 right-6 space-y-3 rounded-2xl border border-slate-800/80 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-start gap-3">
                      <ShieldCheck size={18} className="mt-0.5 shrink-0 text-emerald-400" />
                      <p className="text-sm font-semibold text-white">
                        Registered businesses are checked and labelled
                      </p>
                    </div>
                    {/* Deliberately not the no-phone-calls line: that now sits
                        under the search button, and repeating it in the same
                        viewport reads as filler. */}
                    <div className="flex items-start gap-3 border-t border-slate-800/80 pt-3">
                      <Star size={18} className="mt-0.5 shrink-0 text-emerald-400" />
                      <p className="text-sm font-semibold text-white">
                        Reviews come from completed bookings only
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* POPULAR SERVICES CATEGORIES                                               */}
      {/* ========================================================================= */}
      <section className="w-full py-20 bg-background border-b border-border/40">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                Browse Popular Trade Categories
              </h2>
              <p className="text-muted-foreground text-base mt-1">
                Browse local tradespeople by the work you need doing.
              </p>
            </div>

            <Button asChild variant="outline" className="rounded-2xl h-11 px-6 border-border font-bold text-sm">
              <Link href="/book">
                View All Categories <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Trade Category Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {[
              { name: "Plumbing", trade: "Plumber", icon: <Droplets className="h-7 w-7 text-blue-500" />, count: "Emergency Leak & Fittings" },
              { name: "Electrical", trade: "Electrician", icon: <Zap className="h-7 w-7 text-amber-500" />, count: "Rewiring & Panel Upgrades" },
              { name: "Carpentry", trade: "Carpenter", icon: <Hammer className="h-7 w-7 text-orange-600" />, count: "Built-ins & Framing" },
              { name: "Painting", trade: "Painter", icon: <Paintbrush className="h-7 w-7 text-emerald-500" />, count: "Interior & Exterior" },
              { name: "Roofing", trade: "Roofer", icon: <Wind className="h-7 w-7 text-cyan-500" />, count: "Repairs & Waterproofing" },
              { name: "Landscaping", trade: "Gardener", icon: <Leaf className="h-7 w-7 text-green-600" />, count: "Lawns & Patios" },
            ].map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => handleQuickCategory(cat.trade)}
                className="group p-5 rounded-3xl bg-secondary/30 border border-border/60 hover:bg-white hover:shadow-xl hover:border-[#1a7a4a]/40 transition-all duration-300 text-left flex flex-col justify-between min-h-[160px]"
              >
                <div className="p-3 rounded-2xl bg-white shadow-xs border border-border/40 w-fit group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-foreground group-hover:text-[#1a7a4a] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground font-medium mt-0.5 leading-tight">
                    {cat.count}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* AI DIAGNOSTIC CONCIERGE BANNER                                             */}
      {/* ========================================================================= */}
      <section className="w-full py-16 bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 text-white relative overflow-hidden">
        <div className="container max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-center lg:text-left">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Not sure what fixing service you need?
            </h3>
            <p className="text-slate-300 text-base leading-relaxed">
              Describe the problem in your own words. The assistant works out which trade it needs, how urgent it is, and any safety steps worth taking first, then points you at matching listings.
            </p>
          </div>

          <Button asChild size="lg" className="h-14 px-8 font-black text-base rounded-2xl bg-white text-slate-950 hover:bg-slate-100 shadow-2xl shrink-0 gap-2">
            <Link href="/describe">
              Describe the problem
              <Sparkles className="h-5 w-5 text-[#1a7a4a]" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FEATURED WORKERS / PROS DIRECTORY PREVIEW                                 */}
      {/* ========================================================================= */}
      <section className="w-full py-20 bg-background">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                Listings on Book A Fixer
              </h2>
              <p className="text-muted-foreground text-base mt-1">
                Tradespeople currently on the marketplace. Examples are labelled as such.
              </p>
            </div>

            <Button asChild variant="outline" className="rounded-2xl h-11 px-6 border-border font-bold text-sm">
              <Link href="/book">
                Browse Marketplace <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Worker Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredWorkers.map((worker) => (
              <div key={worker.id} className="rounded-3xl bg-white border border-border shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group">
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={worker.image}
                    alt={worker.name}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 flex flex-col items-start gap-1.5">
                    <Badge className="bg-white text-[#1a7a4a] font-bold text-xs rounded-full px-3 py-1 border-0">
                      {worker.type}
                    </Badge>
                    {worker.isDemo && <DemoBadge emphasis="card" />}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-extrabold text-xl text-foreground group-hover:text-[#1a7a4a] transition-colors">
                      {worker.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-2">
                      {worker.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Starting rate</p>
                      <p className="text-2xl font-black text-foreground">{worker.price}<span className="text-sm font-medium text-muted-foreground">/hr</span></p>
                    </div>

                    <Button asChild size="sm" className="rounded-xl font-bold bg-[#1a7a4a] text-white hover:opacity-90">
                      <Link href={`/book/${worker.id}`}>
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* HOW IT WORKS (3 SIMPLE STEPS)                                             */}
      {/* ========================================================================= */}
      <section className="w-full py-20 bg-secondary/30 border-y border-border/40">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-14 max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
              How Book A Fixer Works
            </h2>
            <p className="text-muted-foreground text-base">
              Get your home or business fixes resolved in 3 transparent steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-white border border-border shadow-md space-y-4 text-center md:text-left transition-all hover:shadow-xl">
              <div className="h-16 w-16 rounded-2xl bg-emerald-50 text-[#1a7a4a] border border-emerald-200 flex items-center justify-center font-black text-2xl mx-auto md:mx-0">
                1
              </div>
              <h3 className="font-extrabold text-xl text-foreground">Browse or Search Fixers</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Filter by trade type, compare hourly rates, inspect ratings, and check verified service offerings.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-white border border-border shadow-md space-y-4 text-center md:text-left transition-all hover:shadow-xl">
              <div className="h-16 w-16 rounded-2xl bg-emerald-50 text-[#1a7a4a] border border-emerald-200 flex items-center justify-center font-black text-2xl mx-auto md:mx-0">
                2
              </div>
              <h3 className="font-extrabold text-xl text-foreground">Select Pro & Request Booking</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sign in with a client account to submit your booking request directly to the professional fixer.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-white border border-border shadow-md space-y-4 text-center md:text-left transition-all hover:shadow-xl">
              <div className="h-16 w-16 rounded-2xl bg-emerald-50 text-[#1a7a4a] border border-emerald-200 flex items-center justify-center font-black text-2xl mx-auto md:mx-0">
                3
              </div>
              <h3 className="font-extrabold text-xl text-foreground">Job Done & Reviewed</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your fixer arrives at the agreed time. Once the job is marked complete you can
                review the work, which is what other customers will see next.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* REVIEWS & TESTIMONIALS                                                    */}
      {/* ========================================================================= */}
      <section className="w-full py-20 bg-background">
        <div className="container max-w-7xl mx-auto px-6">
          {/* We are pre-launch: there are no customers yet, so there is nothing
              honest to quote. This explains how reviews will work instead of
              inventing people who said nice things. */}
          <div className="text-center mb-14 max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
              Reviews you can actually trust
            </h2>
            <p className="text-muted-foreground text-base">
              Book A Fixer is new, so there are no reviews yet. When they arrive, here is
              what will and will not be behind them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <MessageSquare className="h-6 w-6 text-[#1a7a4a]" />,
                title: "Tied to a real booking",
                body: "A review can only be written by the customer who requested the job, against that specific booking. No anonymous submissions.",
              },
              {
                icon: <ShieldCheck className="h-6 w-6 text-[#1a7a4a]" />,
                title: "Only after the work is done",
                body: "Reviews open once a job is marked complete, so a rating always reflects work that actually happened.",
              },
              {
                icon: <Star className="h-6 w-6 text-[#1a7a4a]" />,
                title: "Shown with the count",
                body: "Every rating appears next to how many reviews it came from. A fixer with no reviews is labelled New, never padded out.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-8 rounded-3xl bg-secondary/20 border border-border/60 space-y-4"
              >
                <div className="p-3 rounded-2xl bg-white shadow-xs border border-border/40 w-fit">
                  {item.icon}
                </div>
                <h3 className="font-extrabold text-lg text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FINAL DUAL CALL TO ACTION BANNER                                          */}
      {/* ========================================================================= */}
      <section className="w-full py-16 bg-slate-950 text-white border-t border-slate-800">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Client Callout */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-2xl font-black text-white">Find a Pro Fixer Today</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Browse local tradespeople, compare hourly rates, and send a booking request. Registered businesses are labelled.
              </p>
              <Button asChild className="rounded-2xl h-12 px-6 bg-[#1a7a4a] hover:bg-[#145e38] text-white font-bold gap-2">
                <Link href="/auth/signup">
                  <UserPlus size={16} /> Sign In / Client Registration
                </Link>
              </Button>
            </div>

            {/* Worker Callout */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-2xl font-black text-white">Register as Worker or Company</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                List your business, showcase your services & hourly rates, and start receiving job requests directly.
              </p>
              <Button asChild variant="outline" className="rounded-2xl h-12 px-6 border-slate-700 bg-slate-800 text-white hover:bg-slate-700 font-bold gap-2">
                <Link href="/auth/signup/tradesman">
                  <Briefcase size={16} /> Worker & Company Sign Up
                </Link>
              </Button>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
