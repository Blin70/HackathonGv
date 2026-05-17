"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ClipboardList, Search, CalendarCheck, Star, Sparkles, Quote, Droplets, Zap, Paintbrush, Hammer, Wind, Leaf, Truck, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function HomeContent() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* SECTION 1: Hero */}
      <section className="w-full bg-[#1e1b2e] relative flex flex-col md:flex-row min-h-[600px]">
        {/* Left Side */}
        <div className="flex-1 px-6 py-20 md:px-16 md:py-32 flex flex-col justify-center z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
            The reliable way to hire a tradesman
          </h1>
          <p className="text-xl text-white mb-4 font-semibold">
            Describe your job
          </p>
          <div className="relative max-w-md w-full mb-12 shadow-2xl">
            <Input
              className="h-16 pl-5 pr-16 bg-white text-black text-lg rounded-sm border-0 focus-visible:ring-2 focus-visible:ring-primary"
              placeholder="e.g. Painting work"
            />
            <Button className="absolute right-1.5 top-1.5 bottom-1.5 h-13 w-14 bg-primary hover:bg-primary/90 rounded-sm p-0 flex items-center justify-center transition-all hover:scale-105">
              <ArrowRight className="h-6 w-6 text-white" />
            </Button>
          </div>
        </div>

        {/* Right Side (Image & Bounding Box) */}
        <div className="flex-1 relative min-h-[400px] md:min-h-full w-full">
          <img
            src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop"
            alt="Tradesman at work"
            className="w-full h-full object-cover object-center absolute inset-0"
          />
          {/* Dark overlay for better blend on mobile */}
          <div className="absolute inset-0 bg-black/20 md:hidden" />

          {/* AI Tag */}
          <div className="absolute top-[20%] left-[15%] pointer-events-none animate-in fade-in zoom-in duration-1000 delay-300">
            <div className="bg-[#00FF00] text-black font-bold text-xs md:text-sm px-2.5 py-1.5 flex items-center gap-1 shadow-lg rounded-sm">
              Simon <Star className="h-3 w-3 fill-black text-black ml-0.5" /> 5/5
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION: Popular Services Categories */}
      <section className="w-full py-24 bg-background border-t border-border/40">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-sm font-bold">
                <ShieldCheck className="h-4 w-4" /> Fully Vetted Professionals
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Explore Popular Services</h2>
              <p className="text-muted-foreground text-lg">From urgent repairs to full renovations, find exactly the right expert for your home projects.</p>
            </div>
            <Button variant="outline" className="hidden md:flex rounded-full h-12 px-6 border-border hover:bg-secondary">
              View all services <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: "Plumbing", icon: <Droplets className="h-8 w-8" />, color: "bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white", jobs: "1,200+ Pros" },
              { name: "Electrical", icon: <Zap className="h-8 w-8" />, color: "bg-yellow-500/10 text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white", jobs: "850+ Pros" },
              { name: "Painting", icon: <Paintbrush className="h-8 w-8" />, color: "bg-pink-500/10 text-pink-500 group-hover:bg-pink-500 group-hover:text-white", jobs: "640+ Pros" },
              { name: "Carpentry", icon: <Hammer className="h-8 w-8" />, color: "bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white", jobs: "430+ Pros" },
              { name: "Cleaning", icon: <Sparkles className="h-8 w-8" />, color: "bg-teal-500/10 text-teal-500 group-hover:bg-teal-500 group-hover:text-white", jobs: "2,100+ Pros" },
              { name: "HVAC", icon: <Wind className="h-8 w-8" />, color: "bg-cyan-500/10 text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white", jobs: "320+ Pros" },
              { name: "Landscaping", icon: <Leaf className="h-8 w-8" />, color: "bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-white", jobs: "550+ Pros" },
              { name: "Moving", icon: <Truck className="h-8 w-8" />, color: "bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white", jobs: "780+ Pros" },
            ].map((service, idx) => (
              <div key={idx} className="group cursor-pointer flex flex-col items-start p-6 rounded-[2rem] bg-secondary/20 border border-border/50 hover:bg-secondary/60 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${service.color}`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{service.name}</h3>
                <p className="text-sm text-muted-foreground font-medium">{service.jobs}</p>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-8 md:hidden rounded-full h-14 border-border hover:bg-secondary">
            View all services <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* SECTION 2: How it Works */}
      <section className="w-full py-24 bg-background relative overflow-hidden">
        <div className="container px-4 md:px-8 mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">How it Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Get your home projects completed by trusted professionals in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16">
            {/* Card 1 */}
            <div className="group flex flex-col items-center text-center p-8 rounded-3xl bg-secondary/40 border border-border/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 hover:bg-secondary/60">
              <div className="h-20 w-20 bg-white dark:bg-zinc-800 shadow-md rounded-2xl flex items-center justify-center mb-8 rotate-3 transition-transform group-hover:rotate-6 group-hover:scale-110">
                <ClipboardList className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Post Your Job</h3>
              <p className="text-muted-foreground leading-relaxed">
                Describe what you need done — whether it's fixing a leak, painting a room, or wiring an outlet. It takes less than 2 minutes.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group flex flex-col items-center text-center p-8 rounded-3xl bg-secondary/40 border border-border/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 hover:bg-secondary/60">
              <div className="h-20 w-20 bg-white dark:bg-zinc-800 shadow-md rounded-2xl flex items-center justify-center mb-8 -rotate-3 transition-transform group-hover:-rotate-6 group-hover:scale-110">
                <Search className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Get Matched with a Pro</h3>
              <p className="text-muted-foreground leading-relaxed">
                We instantly connect you with verified, local tradespeople who are available and ready for the job. Compare reviews, ratings, and prices.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group flex flex-col items-center text-center p-8 rounded-3xl bg-secondary/40 border border-border/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 hover:bg-secondary/60">
              <div className="h-20 w-20 bg-white dark:bg-zinc-800 shadow-md rounded-2xl flex items-center justify-center mb-8 rotate-3 transition-transform group-hover:rotate-6 group-hover:scale-110">
                <CalendarCheck className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Book & Relax</h3>
              <p className="text-muted-foreground leading-relaxed">
                Confirm your booking in one click. Your fixer shows up, gets the job done, and you pay securely through the platform. Simple as that.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <Button size="lg" className="h-16 px-10 text-lg font-bold rounded-full group shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              Ask our AI for more!
              <Sparkles className="ml-3 h-5 w-5 transition-transform group-hover:rotate-12 group-hover:scale-125" />
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 3: Statistics */}
      <section className="w-full py-20 bg-primary/5 flex justify-center relative">
        <div className="container px-4 md:px-8 mx-auto relative z-10">
          <div className="max-w-5xl mx-auto bg-white dark:bg-zinc-950 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-border/50 p-12 lg:p-16 flex flex-col md:flex-row justify-around items-center gap-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <span className="text-5xl lg:text-7xl font-black text-primary drop-shadow-sm">1500+</span>
              <span className="text-sm lg:text-base font-bold tracking-widest text-muted-foreground uppercase">Orders Delivered</span>
            </div>
            {/* Divider for Desktop */}
            <div className="hidden md:block w-px h-24 bg-border/60" />
            <div className="flex flex-col items-center gap-3">
              <span className="text-5xl lg:text-7xl font-black text-primary drop-shadow-sm">500+</span>
              <span className="text-sm lg:text-base font-bold tracking-widest text-muted-foreground uppercase">Satisfied Customers</span>
            </div>
            {/* Divider for Desktop */}
            <div className="hidden md:block w-px h-24 bg-border/60" />
            <div className="flex flex-col items-center gap-3">
              <span className="text-5xl lg:text-7xl font-black text-primary drop-shadow-sm">25+</span>
              <span className="text-sm lg:text-base font-bold tracking-widest text-muted-foreground uppercase">Partner Tradesmen</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Reviews */}
      <section className="w-full py-24 bg-background">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Trusted by thousands</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Don't just take our word for it. Here is what our users have to say.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="p-8 lg:p-10 rounded-[2rem] bg-secondary/30 border border-border/50 transition-all hover:bg-secondary/50 hover:shadow-lg relative overflow-hidden group">
              <Quote className="absolute -top-4 -right-4 h-32 w-32 text-primary/5 -rotate-12 transition-transform group-hover:rotate-0" />
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-5 w-5 text-[#FFC107] fill-[#FFC107]" />)}
              </div>
              <p className="italic text-muted-foreground text-lg mb-8 leading-relaxed relative z-10">
                "The fastest and most reliable way to get things fixed around the house! The plumber arrived on time and the pricing was completely transparent. Highly recommend this to everyone."
              </p>
              <div className="flex items-center gap-4 relative z-10">
                <div className="h-12 w-12 rounded-full bg-[#FFEBF0] text-[#FF5A82] font-bold flex items-center justify-center text-xl shrink-0">
                  E
                </div>
                <div>
                  <p className="font-bold text-foreground">Elvira K.</p>
                  <p className="text-xs text-muted-foreground font-medium">Verified Buyer • Plumbing Repair</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="p-8 lg:p-10 rounded-[2rem] bg-secondary/30 border border-border/50 transition-all hover:bg-secondary/50 hover:shadow-lg relative overflow-hidden group">
              <Quote className="absolute -top-4 -right-4 h-32 w-32 text-primary/5 -rotate-12 transition-transform group-hover:rotate-0" />
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-5 w-5 text-[#FFC107] fill-[#FFC107]" />)}
              </div>
              <p className="italic text-muted-foreground text-lg mb-8 leading-relaxed relative z-10">
                "I had heard a lot about this platform and it truly lives up to the hype. The electrician was extremely professional and the job was done flawlessly. The delivery of service was superb!"
              </p>
              <div className="flex items-center gap-4 relative z-10">
                <div className="h-12 w-12 rounded-full bg-[#F0E6FF] text-[#8A2BE2] font-bold flex items-center justify-center text-xl shrink-0">
                  A
                </div>
                <div>
                  <p className="font-bold text-foreground">Arjan M.</p>
                  <p className="text-xs text-muted-foreground font-medium">Verified Buyer • Electrical Work</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="p-8 lg:p-10 rounded-[2rem] bg-secondary/30 border border-border/50 transition-all hover:bg-secondary/50 hover:shadow-lg relative overflow-hidden group">
              <Quote className="absolute -top-4 -right-4 h-32 w-32 text-primary/5 -rotate-12 transition-transform group-hover:rotate-0" />
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4].map(i => <Star key={i} className="h-5 w-5 text-[#FFC107] fill-[#FFC107]" />)}
                <Star className="h-5 w-5 text-muted-foreground/30 fill-muted-foreground/30" />
              </div>
              <p className="italic text-muted-foreground text-lg mb-8 leading-relaxed relative z-10">
                "I love it endlessly! My go-to platform for any daily repairs. The customer service is excellent when I contacted them via WhatsApp. Great job!"
              </p>
              <div className="flex items-center gap-4 relative z-10">
                <div className="h-12 w-12 rounded-full bg-[#FFEBF0] text-[#FF5A82] font-bold flex items-center justify-center text-xl shrink-0">
                  S
                </div>
                <div>
                  <p className="font-bold text-foreground">Sara D.</p>
                  <p className="text-xs text-muted-foreground font-medium">Verified Buyer • Home Painting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
