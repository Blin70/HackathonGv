"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  ClipboardList,
  Search,
  CalendarCheck,
  Star,
  Sparkles,
  Quote,
  Droplets,
  Zap,
  Paintbrush,
  Hammer,
  Wind,
  Leaf,
  ShieldCheck,
  CheckCircle2,
  Lock,
  UserPlus,
  Briefcase,
  ExternalLink,
  ChevronRight,
  Award
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { COMPANIES } from "@/lib/data"

const QUICK_SUGGESTIONS = [
  "Plumber",
  "Electrician",
  "Carpenter",
  "Painter",
  "Roofer",
  "Tiler",
  "HVAC"
]

export default function HomeContent() {
  const [jobDescription, setJobDescription] = useState("")
  const router = useRouter()

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

  const featuredWorkers = COMPANIES.slice(0, 3)

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
                  Connect instantly with certified plumbers, electricians, carpenters, painters & contractors in your area. Guaranteed transparent rates and zero hassle.
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
                  <img
                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop"
                    alt="Skilled Tradesman at work"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Floating Verified Worker Badge (Bottom Overlay) */}
                  <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl shadow-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="h-12 w-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-extrabold text-lg">
                        S
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-white text-base">Simon Kraja</h4>
                          <ShieldCheck size={16} className="text-emerald-400" />
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Master Carpenter & Joiner</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                        <Star size={14} className="fill-amber-400" />
                        <span>4.9</span>
                        <span className="text-slate-400 font-normal">(189)</span>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-400">$120/hr</span>
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
                Direct access to top-rated, certified local trade specialists.
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
              Describe your issue in plain language and our AI Diagnostic Concierge will identify the exact trade category, estimate labor cost, and match you with available fixers.
            </p>
          </div>

          <Button asChild size="lg" className="h-14 px-8 font-black text-base rounded-2xl bg-white text-slate-950 hover:bg-slate-100 shadow-2xl shrink-0 gap-2">
            <Link href="/ai">
              Try AI Concierge Diagnostic
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
                Featured Verified Professionals
              </h2>
              <p className="text-muted-foreground text-base mt-1">
                Explore real trade experts ready to handle your home repair and installation needs.
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
                  <img
                    src={worker.image}
                    alt={worker.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-white text-[#1a7a4a] font-bold text-xs rounded-full px-3 py-1 border-0">
                    {worker.type}
                  </Badge>
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
              <h3 className="font-extrabold text-xl text-foreground">Job Done & Satisfaction</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your fixer arrives on schedule, completes the job with excellence, backed by 100% satisfaction guarantee.
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
          <div className="text-center mb-14 max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1 text-amber-400 text-sm font-bold">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} className="fill-amber-400" />)}
              <span className="text-foreground ml-2">4.9 / 5 Average Customer Rating</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
              What Homeowners Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The fastest and most reliable way to get things fixed around the house! The plumber arrived on time and the pricing was completely transparent.",
                author: "Elvira K.",
                trade: "Plumbing Service",
                initial: "E",
                color: "bg-blue-100 text-blue-700"
              },
              {
                quote: "Extremely professional electrician. Panel upgrade was completed safely and flawlessly. Will definitely use Book A Fixer for future projects!",
                author: "Arjan M.",
                trade: "Electrical Rewiring",
                initial: "A",
                color: "bg-amber-100 text-amber-800"
              },
              {
                quote: "Outstanding experience! Registered, found a certified carpenter within 10 minutes, and got custom door frames installed perfectly.",
                author: "Sara D.",
                trade: "Custom Carpentry",
                initial: "S",
                color: "bg-emerald-100 text-emerald-800"
              }
            ].map((review, i) => (
              <div key={i} className="p-8 rounded-3xl bg-secondary/20 border border-border/60 flex flex-col justify-between space-y-6">
                <p className="italic text-muted-foreground text-sm leading-relaxed">
                  &quot;{review.quote}&quot;
                </p>

                <div className="flex items-center gap-3.5 pt-4 border-t border-border/40">
                  <div className={`h-10 w-10 rounded-full font-bold flex items-center justify-center text-base ${review.color}`}>
                    {review.initial}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{review.author}</h4>
                    <p className="text-xs text-muted-foreground">{review.trade}</p>
                  </div>
                </div>
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
                Browse verified local tradespeople, compare hourly rates, and submit booking requests with zero hassle.
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
