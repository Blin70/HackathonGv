"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { UserPlus, Briefcase, ShieldCheck, Wrench, Hammer, Zap, Paintbrush, Home as HomeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const popularTrades = [
  { title: "Plumbers", href: "/book?type=Plumber", icon: <Wrench className="h-3.5 w-3.5 text-[#1a7a4a]" /> },
  { title: "Electricians", href: "/book?type=Electrician", icon: <Zap className="h-3.5 w-3.5 text-amber-500" /> },
  { title: "Carpenters", href: "/book?type=Carpenter", icon: <Hammer className="h-3.5 w-3.5 text-orange-600" /> },
  { title: "Painters", href: "/book?type=Painter", icon: <Paintbrush className="h-3.5 w-3.5 text-blue-500" /> },
  { title: "Roofers", href: "/book?type=Roofer", icon: <HomeIcon className="h-3.5 w-3.5 text-red-500" /> },
]

const mainNavLinks = [
  { title: "Home", href: "/" },
  { title: "Book a Fixer", href: "/book" },
  { title: "AI", href: "/ai", badge: "AI Powered" },
]

export default function Footer() {
  const pathname = usePathname()

  if (pathname?.startsWith('/auth')) return null

  return (
    <footer className="w-full bg-slate-950 text-slate-200 border-t border-slate-800/80 relative overflow-hidden">
      {/* Glow Orbs background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1a7a4a]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-6 py-12 md:py-16 relative z-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 pb-10 border-b border-slate-800/80">
          
          {/* Brand & Mission Section */}
          <div className="col-span-1 md:col-span-5 lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center transition-all hover:opacity-95 group" aria-label="Book A Fixer Home">
              <div className="relative flex-shrink-0">
                <Image
                  src="/image.svg"
                  alt="Book A Fixer Logo"
                  width={70}
                  height={70}
                  className="h-12 w-12 md:h-14 md:w-14 object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The premier platform connecting homeowners and businesses with vetted, top-rated local tradespeople and fixing companies instantly.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="col-span-1 md:col-span-3 lg:col-span-2 space-y-4">
            <h4 className="text-xs font-black tracking-widest text-emerald-400 uppercase">
              Platform
            </h4>
            <ul className="space-y-3">
              {mainNavLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white text-sm font-medium transition-colors inline-flex items-center gap-2 group"
                  >
                    <span>{link.title}</span>
                    {link.badge && (
                      <Badge className="bg-[#1a7a4a]/30 text-emerald-400 border border-[#1a7a4a]/40 text-[10px] px-1.5 py-0.5 font-bold">
                        {link.badge}
                      </Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trade Categories Grid */}
          <div className="col-span-1 md:col-span-4 lg:col-span-3 space-y-4">
            <h4 className="text-xs font-black tracking-widest text-emerald-400 uppercase">
              Popular Trades
            </h4>
            <ul className="space-y-2.5">
              {popularTrades.map((trade) => (
                <li key={trade.title}>
                  <Link
                    href={trade.href}
                    className="text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-2.5 group"
                  >
                    <span className="p-1 rounded-md bg-slate-900 border border-slate-800 group-hover:border-slate-700 transition-colors">
                      {trade.icon}
                    </span>
                    <span>{trade.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account CTAs */}
          <div className="col-span-1 md:col-span-12 lg:col-span-3 space-y-4">
            <h4 className="text-xs font-black tracking-widest text-emerald-400 uppercase">
              Get Started
            </h4>
            
            <div className="flex flex-col gap-2.5">
              <Button asChild variant="outline" className="w-full justify-start rounded-xl h-10 border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800 text-xs font-bold gap-2">
                <Link href="/auth/signup">
                  <UserPlus size={15} className="text-emerald-400" />
                  Sign In / Register as Client
                </Link>
              </Button>

              <Button asChild className="w-full justify-start rounded-xl h-10 bg-[#1a7a4a] hover:bg-[#145e38] text-white text-xs font-bold gap-2 shadow-md shadow-emerald-950">
                <Link href="/auth/signup/tradesman">
                  <Briefcase size={15} />
                  Register as Worker / Company
                </Link>
              </Button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span>© {new Date().getFullYear()} Book A Fixer. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <Link href="/terms-of-service" className="hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500" /> Terms of Service
            </Link>
            <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
