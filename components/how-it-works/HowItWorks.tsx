"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Camera,
  ClipboardList,
  Hammer,
  House,
  Inbox,
  ListChecks,
  Search,
  Send,
  ShieldCheck,
  Star,
  Store,
  UserPlus,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import { Reveal, StepTimeline, type TimelineStep } from "@/components/how-it-works/StepTimeline"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TRADE_CATEGORIES } from "@/lib/data"

const PILLARS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Search,
    title: "Find the right trade",
    body: "Browse local fixers by trade and city, or snap a photo and let the AI Concierge tell you which trade you need and what to do in the meantime.",
  },
  {
    icon: ClipboardList,
    title: "Book with the details up front",
    body: "Every request says what's wrong, where it is, and when suits you, so the fixer knows what they're taking on before they say yes.",
  },
  {
    icon: ShieldCheck,
    title: "Trust on both sides",
    body: "Registered badges for workers who've verified their business, reviews from real customers, and a booking record both sides can see.",
  },
]

const CUSTOMER_STEPS: TimelineStep[] = [
  {
    icon: UserPlus,
    title: "Create your customer account",
    body: "Anyone can browse fixers without an account. Sign up when you're ready to book, so your requests and bookings are kept in one place.",
  },
  {
    icon: Camera,
    title: "Describe the problem, or snap a photo",
    body: "Not sure who to call? Show the AI Concierge the leak, crack, or broken fitting. It suggests the right trade, how urgent it looks, and safe steps you can take right now.",
  },
  {
    icon: Search,
    title: "Compare local fixers",
    body: "Filter by trade, city, and rating. Each profile shows the services offered, a starting hourly rate, and reviews from previous customers.",
  },
  {
    icon: Send,
    title: "Send a booking request",
    body: "Tell the fixer what needs doing, the address, and your preferred date. They confirm or decline, so you're never left guessing.",
  },
  {
    icon: ListChecks,
    title: "Follow the job in My Bookings",
    body: "See each booking move from pending to confirmed, in progress, and completed. Plans changed? Cancel any time before the work starts.",
  },
  {
    icon: Star,
    title: "Pay securely and leave a review",
    body: "Pay for the job through Book A Fixer instead of handing over cash, then rate your fixer to help the next homeowner choose.",
    badge: "Payments coming soon",
  },
]

const WORKER_STEPS: TimelineStep[] = [
  {
    icon: Briefcase,
    title: "Register as a worker or a company",
    body: "Sign up as an individual tradesperson or as a registered company, and choose the trade and city you work in.",
  },
  {
    icon: BadgeCheck,
    title: "Get verified",
    body: "Show us you're legitimate: add your business registration number and the documents your trade requires, such as licences and certificates. Once checked, your listing carries the Registered badge customers look for.",
  },
  {
    icon: Store,
    title: "Build a profile that wins work",
    body: "List your services, your starting hourly rate, and a description of your work. Your dashboard shows how complete your profile is and what to add next.",
  },
  {
    icon: Inbox,
    title: "Receive booking requests",
    body: "Requests arrive in your dashboard with the job details, the address, and the customer's preferred date. You decide which jobs to confirm and which to decline.",
  },
  {
    icon: Hammer,
    title: "Do the job and keep it updated",
    body: "Mark the job in progress when you start and completed when you're done. Customers see every update, and each finished job can earn you a review.",
  },
  {
    icon: Wallet,
    title: "Get paid through the platform",
    body: "Customers pay through Book A Fixer and you receive your earnings minus a small service fee. That fee is how we run the platform and keep bringing you customers.",
    badge: "Coming soon",
  },
]

const FAQS = [
  {
    q: "Do I need an account to look for a fixer?",
    a: "No. The marketplace and the AI Concierge are open to everyone. You only need a customer account when you want to send a booking request.",
  },
  {
    q: "What does the Registered badge mean?",
    a: "It means the worker or company has verified their business with us, for example with a business registration number. Workers without the badge can still be listed, so check their profile and reviews before you book.",
  },
  {
    q: "What happens if a fixer declines my request?",
    a: "Nothing is charged and your request is closed. Pick another fixer from the marketplace and send them a new request.",
  },
  {
    q: "How does Book A Fixer make money?",
    a: "Book A Fixer keeps a small service fee from each job paid through the platform. Payments through the platform are still being rolled out.",
  },
  {
    q: "Some listings say “Example listing”. Are they real?",
    a: "No. While real tradespeople join, a few clearly labelled example listings show how the marketplace works. They aren't real businesses, so book a listing without that label.",
  },
]

function scrollToSection(id: string) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" })
}

function TradeMarquee() {
  // Rendered twice so the -50% translate loops seamlessly.
  const trades = [...TRADE_CATEGORIES, ...TRADE_CATEGORIES]

  return (
    <div className="group relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <ul className="flex w-max gap-3 animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {trades.map((trade, index) => (
          <li key={`${trade}-${index}`} aria-hidden={index >= TRADE_CATEGORIES.length}>
            <Link
              href={`/book?type=${encodeURIComponent(trade)}`}
              tabIndex={index >= TRADE_CATEGORIES.length ? -1 : undefined}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-primary"
            >
              <span className="size-1.5 rounded-full bg-primary" /> {trade}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function HowItWorks() {
  return (
    <div className="flex flex-col bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 py-16 text-white md:py-24">
        {/* Decorative photo, dimmed and darkened toward the centre so the headline stays readable. */}
        <Image
          src="/how_it_works_background.jpg"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="pointer-events-none object-cover opacity-25"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgb(2_6_23/0.85)_0%,_rgb(2_6_23/0.55)_60%,_rgb(2_6_23/0.75)_100%)]" />
        <div aria-hidden className="pointer-events-none absolute -left-32 -top-32 size-[500px] rounded-full bg-primary/20 blur-[120px]" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 size-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />

        <div className="container relative z-10 mx-auto max-w-5xl px-6 text-center">
          <Reveal>
            
            <h1 className="mx-auto mt-5 max-w-3xl text-balance text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Home repairs, made simple for{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-primary bg-clip-text text-transparent">everyone involved</span>.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-slate-300 md:text-lg">
              Book A Fixer is a marketplace for North Macedonia. It connects homeowners and businesses with local plumbers, electricians, carpenters, and other tradespeople, and gives those tradespeople a straightforward way to find work.
            </p>
          </Reveal>

          <Reveal delay={150} className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
            {[
              { id: "customers", icon: House, title: "I need something fixed", body: "See how booking a fixer works" },
              { id: "workers", icon: Briefcase, title: "I'm a worker or company", body: "See how you get work through us" },
            ].map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="group flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-left backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-emerald-400 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-white">{item.title}</span>
                    <span className="block text-sm text-slate-400">{item.body}</span>
                  </span>
                  <ArrowDown className="size-4 shrink-0 text-slate-500 transition-transform group-hover:translate-y-1 group-hover:text-emerald-400 motion-reduce:transition-none" />
                </button>
              )
            })}
          </Reveal>
        </div>
      </section>

      {/* WHAT WE'RE ABOUT */}
      <section className="border-b border-border/40 py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">What we&apos;re about</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-foreground md:text-4xl">One marketplace, two sides</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Finding a reliable tradesperson usually means asking around and hoping. Finding steady customers is just as hard. Book A Fixer puts both sides in one place, with clear details and a record of every job.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PILLARS.map((pillar, index) => {
              const Icon = pillar.icon
              return (
                <Reveal key={pillar.title} delay={index * 120}>
                  <div className="group h-full rounded-3xl border border-border/70 bg-secondary/30 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-white hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                    <span className="flex size-12 items-center justify-center rounded-2xl border border-border/40 bg-white text-primary shadow-sm transition-transform group-hover:scale-110 motion-reduce:transition-none">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-5 text-lg font-bold text-foreground">{pillar.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>

          <Reveal delay={200} className="mt-14">
            <p className="mb-4 text-center text-sm font-semibold text-muted-foreground">
              {TRADE_CATEGORIES.length} trades and counting. Pick one to browse fixers.
            </p>
            <TradeMarquee />
          </Reveal>
        </div>
      </section>

      {/* FOR CUSTOMERS */}
      <section id="customers" className="scroll-mt-24 bg-secondary/30 py-20">
        <div className="container mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <Reveal className="lg:sticky lg:top-32 lg:self-start">
            <Badge variant="outline" className="rounded-full border-primary/20 bg-primary/5 px-3 py-1 text-primary">
              <House className="size-3.5" /> For customers
            </Badge>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-4xl">Get it fixed without the guesswork</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Whether it&apos;s a dripping tap or a full bathroom refit, here&apos;s how you go from &ldquo;something&apos;s wrong&rdquo; to &ldquo;job done&rdquo;.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Button asChild size="lg" className="h-12 rounded-2xl px-6 font-bold">
                <Link href="/auth/signup"><UserPlus className="size-4" /> Create a customer account</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-2xl bg-white px-6 font-bold">
                <Link href="/ai"><Camera className="size-4" /> Try the AI Concierge</Link>
              </Button>
            </div>
          </Reveal>

          <StepTimeline steps={CUSTOMER_STEPS} />
        </div>
      </section>

      {/* FOR WORKERS & COMPANIES */}
      {/* overflow-clip, not overflow-hidden: hidden makes the section a scroll container, which stops the sticky intro from sticking. */}
      <section id="workers" className="relative scroll-mt-24 overflow-clip bg-slate-950 py-20 text-white">
        <div aria-hidden className="pointer-events-none absolute -right-40 top-20 size-[500px] rounded-full bg-primary/15 blur-[120px]" />

        <div className="container relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
            <Reveal className="lg:sticky lg:top-32 lg:self-start">
              <Badge variant="outline" className="rounded-full border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-emerald-300">
                <Briefcase className="size-3.5" /> For workers &amp; companies
              </Badge>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">Spend your time on the work, not finding it</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Individual tradespeople and registered companies use Book A Fixer to reach customers nearby, manage requests in one dashboard, and build a reputation that follows their work.
              </p>
              <Button asChild size="lg" className="mt-8 h-12 rounded-2xl px-6 font-bold">
                <Link href="/auth/signup/tradesman"><Briefcase className="size-4" /> Register as a worker or company</Link>
              </Button>
            </Reveal>

            <StepTimeline steps={WORKER_STEPS} tone="dark" />
          </div>

        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto max-w-3xl px-6">
          <Reveal className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Questions</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-foreground md:text-4xl">Good to know</h2>
          </Reveal>
          <Reveal delay={100} className="mt-10">
            <Accordion type="single" collapsible className="rounded-3xl border border-border/70 bg-white px-6 shadow-sm">
              {FAQS.map((faq) => (
                <AccordionItem key={faq.q} value={faq.q}>
                  <AccordionTrigger className="py-5 text-left text-base font-semibold">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 py-16 text-white">
        <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 text-center lg:flex-row lg:text-left">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-black tracking-tight md:text-3xl">Ready when you are</h2>
            <p className="mt-2 text-base leading-relaxed text-slate-300">Find a fixer for the job in front of you, or start getting booked for your trade.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-2xl bg-white px-6 font-bold text-slate-950 hover:bg-slate-100">
              <Link href="/book">Find a fixer <ArrowRight className="size-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-2xl border-slate-700 bg-slate-900 px-6 font-bold text-white hover:bg-slate-800 hover:text-white">
              <Link href="/auth/signup/tradesman">Join as a worker</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
