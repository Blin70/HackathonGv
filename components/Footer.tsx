"use client"

import Link from "next/link"
import Image from "next/image"
import { Share2, Sparkles, UserPlus, Briefcase, Info, ShieldCheck, Mail, ArrowRight, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const navLinks = [
    { title: "Home", href: "/" },
    { title: "Book", href: "/book" },
    { title: "AI", href: "/ai", icon: <Sparkles className="h-4 w-4 text-primary" /> }
]

const authLinks = [
    { title: "Register", href: "/register", icon: <UserPlus className="h-4 w-4" /> },
    { title: "Register as Tradesman", href: "/register-tradesman", icon: <Briefcase className="h-4 w-4" /> },
]

export default function Footer() {
    return (
        <footer className="w-full bg-background border-t border-border/40 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container px-4 py-8 md:px-8 md:py-12 relative z-10">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-12 lg:gap-16">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-5 lg:col-span-4 space-y-5">
                        <Link href="/" className="inline-block transition-all hover:scale-105 active:scale-95">
                            <Image
                                src="/image.svg"
                                alt="Book A Fixer Logo"
                                width={240}
                                height={80}
                                className="h-16 w-auto"
                            />
                        </Link>
                        <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
                            Book a Fixer — the fastest way to find, compare, and hire skilled tradespeople near you.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="col-span-1 md:col-span-3 lg:col-span-2 space-y-4">
                        <h4 className="text-sm font-black tracking-widest text-foreground/50 uppercase">Navigation</h4>
                        <ul className="space-y-3">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary transition-all flex items-center gap-2 group"
                                    >
                                        <span className="h-1 w-1 rounded-full bg-primary opacity-0 transition-all group-hover:opacity-100 group-hover:scale-150" />
                                        {link.title}
                                        {link.icon}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter: The "Something Else" */}
                    <div className="col-span-1 md:col-span-4 lg:col-span-5 space-y-5">
                        <h4 className="text-sm font-black tracking-widest text-foreground/50 uppercase">Stay Updated</h4>
                        <p className="text-sm text-muted-foreground">Join our newsletter for the latest home repair tips and pro fixer matching.</p>
                        <div className="flex w-full max-w-sm items-center space-x-2">
                            <div className="relative flex-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="pl-10 h-11 bg-secondary/50 border-border/50 focus:border-primary/50 transition-all"
                                />
                            </div>
                            <Button className="h-11 px-5 group">
                                Join
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-10 pt-6 border-t border-border/40 flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <p className="text-muted-foreground text-sm font-semibold">
                            © {new Date().getFullYear()} Book A Fixer.
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 tracking-wider font-bold">BUILT FOR PROS BY FIXFORCE</p>
                    </div>

                    <div className="flex items-center space-x-6">
                        <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors font-bold uppercase tracking-tight flex items-center gap-2">
                            <ShieldCheck className="h-3 w-3" /> Terms
                        </Link>
                        <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors font-bold uppercase tracking-tight flex items-center gap-2">
                            <Info className="h-3 w-3" /> Privacy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
