"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Menu, Sparkles, UserPlus, Briefcase, LogOut, User, CalendarCheck, Home, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { createClient } from "@/lib/client"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

const navLinks = [
    { title: "Home", href: "/", icon: <Home className="h-4 w-4" /> },
    { title: "Book a Fixer", href: "/book", icon: <CalendarCheck className="h-4 w-4" /> },
    { 
        title: "AI Concierge", 
        href: "/ai", 
        icon: <Sparkles className="h-4 w-4 text-primary animate-pulse" />,
        badge: "AI Powered"
    }
]

export default function Header() {
    const router = useRouter()
    const pathname = usePathname()
    const [isOpen, setIsOpen] = React.useState(false)
    const [user, setUser] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const supabase = createClient()

        // Fetch current session and user
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        setUser(null)
        setIsOpen(false)
        router.push('/')
        router.refresh()
    }

    if (pathname?.startsWith('/auth')) return null

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 transition-all">
            <div className="container flex h-20 md:h-24 items-center justify-between px-4 md:px-8 mx-auto">

                {/* Brand Logo Only */}
                <Link
                    href="/"
                    className="group inline-flex items-center transition-all duration-300 hover:opacity-95"
                    aria-label="Book A Fixer Home"
                >
                    <div className="relative flex-shrink-0 transform transition-all duration-500 group-hover:scale-105 group-active:scale-95">
                        <div className="absolute -inset-2 rounded-full bg-[#1a7a4a]/0 blur-md transition-all duration-500 group-hover:bg-[#1a7a4a]/25" />

                        <Image
                            src="/image.svg"
                            alt="Book A Fixer Logo"
                            width={70}
                            height={70}
                            className="relative h-12 w-12 md:h-14 md:w-14 object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(26,122,74,0.4)]"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex lg:items-center lg:space-x-2">
                    <NavigationMenu>
                        <NavigationMenuList className="gap-1.5">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href
                                return (
                                    <NavigationMenuItem key={link.href}>
                                        <NavigationMenuLink asChild>
                                            <Link
                                                href={link.href}
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    "relative flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 bg-transparent",
                                                    isActive 
                                                        ? "bg-primary/10 text-primary font-bold shadow-xs" 
                                                        : "text-foreground/75 hover:text-primary hover:bg-primary/5"
                                                )}
                                            >
                                                {link.icon}
                                                <span>{link.title}</span>
                                                {link.badge && (
                                                    <span className="ml-1 rounded-full bg-primary/15 text-primary text-[10px] font-extrabold px-2 py-0.5 uppercase tracking-wider border border-primary/20">
                                                        {link.badge}
                                                    </span>
                                                )}
                                            </Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                )
                            })}
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Auth & CTA buttons */}
                    <div className="flex items-center space-x-3 ml-6 pl-4 border-l border-border/40">
                        {loading ? (
                            <div className="h-10 w-32 animate-pulse rounded-full bg-muted" />
                        ) : user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="focus:outline-none group">
                                    <div className="flex items-center gap-3 p-1.5 pr-3 rounded-full border border-border/50 hover:border-primary/40 bg-secondary/30 hover:bg-secondary/60 transition-all">
                                        <div className="relative">
                                            <Avatar className="h-9 w-9 border border-primary/30">
                                                <AvatarImage src={user.user_metadata?.avatar_url || ""} />
                                                <AvatarFallback className="bg-primary/15 font-bold text-primary text-xs">
                                                    {user.user_metadata?.firstName
                                                        ? `${user.user_metadata.firstName.charAt(0)}${user.user_metadata.lastName?.charAt(0) || ""}`.toUpperCase()
                                                        : user.email?.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                                        </div>
                                        <span className="text-sm font-semibold max-w-[120px] truncate text-foreground group-hover:text-primary transition-colors">
                                            {user.user_metadata?.firstName || user.email?.split('@')[0] || "Account"}
                                        </span>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-60 p-2 mt-2 shadow-xl border-border/60 backdrop-blur-md rounded-2xl">
                                    <div className="px-3 py-2.5 text-xs text-muted-foreground bg-primary/5 rounded-xl mb-1">
                                        <span className="block font-bold text-foreground truncate text-sm">
                                            {user.user_metadata?.full_name || (user.user_metadata?.firstName ? `${user.user_metadata.firstName} ${user.user_metadata.lastName}` : "User Account")}
                                        </span>
                                        <span className="truncate block mt-0.5 text-muted-foreground">{user.email}</span>
                                    </div>
                                    <DropdownMenuSeparator className="my-1" />
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile" className="flex items-center gap-2.5 py-2.5 px-3 rounded-lg cursor-pointer font-semibold text-sm w-full transition-colors hover:bg-primary/10 hover:text-primary">
                                            <User className="h-4 w-4 text-primary" />
                                            My Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/book" className="flex items-center gap-2.5 py-2.5 px-3 rounded-lg cursor-pointer font-semibold text-sm w-full transition-colors hover:bg-primary/10 hover:text-primary">
                                            <CalendarCheck className="h-4 w-4 text-primary" />
                                            My Bookings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="my-1" />
                                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer font-semibold gap-2.5 py-2.5 px-3 rounded-lg text-sm transition-colors">
                                        <LogOut className="h-4 w-4" />
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Button
                                    variant="ghost"
                                    asChild
                                    className="font-bold text-sm px-4 py-2.5 rounded-full hover:bg-primary/8 hover:text-primary transition-all"
                                >
                                    <Link href="/auth/signup" className="flex items-center gap-2">
                                        <UserPlus className="h-4 w-4 text-primary" />
                                        Sign In / Register
                                    </Link>
                                </Button>

                                <Button
                                    asChild
                                    className="font-bold px-5 py-2.5 text-sm rounded-full bg-primary text-white hover:bg-primary/95 shadow-md hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    <Link href="/auth/signup/tradesman" className="flex items-center gap-2">
                                        <Briefcase className="h-4 w-4" />
                                        Register as Worker or Company
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation Trigger */}
                <div className="lg:hidden flex items-center gap-2">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-11 w-11 rounded-full hover:bg-primary/10 text-primary transition-all duration-300 active:scale-95 border border-border/50"
                            >
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-full sm:w-[400px] border-l border-border/40 bg-background/95 backdrop-blur-2xl p-0 flex flex-col justify-between"
                        >
                            <div>
                                {/* Sheet Header */}
                                <div className="flex items-center justify-between px-6 py-5 border-b border-border/30">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src="/image.svg"
                                            alt="Logo"
                                            width={44}
                                            height={44}
                                            className="h-10 w-10 object-contain"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1a7a4a]">Book A</span>
                                            <span className="text-xl font-black text-foreground">Fixer</span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsOpen(false)}
                                        className="h-9 w-9 rounded-full hover:bg-muted"
                                    >
                                        <span className="text-xl font-bold">×</span>
                                    </Button>
                                </div>

                                {/* Main Mobile Nav Links */}
                                <div className="px-5 py-6 space-y-2">
                                    <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground px-3 mb-2">Navigation</p>
                                    <nav className="space-y-1.5">
                                        {navLinks.map((link) => {
                                            const isActive = pathname === link.href
                                            return (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className={cn(
                                                        "flex items-center gap-3.5 px-4 py-3 rounded-2xl text-base font-semibold transition-all duration-200",
                                                        isActive 
                                                            ? "bg-primary/12 text-primary font-bold border border-primary/20" 
                                                            : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "flex h-9 w-9 items-center justify-center rounded-xl transition-all",
                                                        isActive ? "bg-primary text-white" : "bg-primary/10 text-primary"
                                                    )}>
                                                        {link.icon}
                                                    </div>
                                                    <span>{link.title}</span>
                                                    {link.badge && (
                                                        <span className="ml-auto rounded-full bg-primary/15 text-primary text-[10px] font-extrabold px-2 py-0.5 uppercase tracking-wider">
                                                            {link.badge}
                                                        </span>
                                                    )}
                                                </Link>
                                            )
                                        })}
                                    </nav>

                                    {/* Mobile Auth Actions */}
                                    <div className="space-y-3 pt-6 mt-6 border-t border-border/30">
                                        <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground px-3 mb-2">Account & Access</p>
                                        {loading ? (
                                            <div className="space-y-2">
                                                <div className="h-14 animate-pulse rounded-2xl bg-muted" />
                                                <div className="h-12 animate-pulse rounded-2xl bg-muted" />
                                            </div>
                                        ) : user ? (
                                            <>
                                                <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-4 mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-11 w-11 border-2 border-primary/30">
                                                            <AvatarImage src={user.user_metadata?.avatar_url || ""} />
                                                            <AvatarFallback className="bg-primary text-white font-bold text-sm">
                                                                {user.user_metadata?.firstName
                                                                    ? `${user.user_metadata.firstName.charAt(0)}${user.user_metadata.lastName?.charAt(0) || ""}`.toUpperCase()
                                                                    : user.email?.charAt(0).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-foreground truncate">
                                                                {user.user_metadata?.full_name || (user.user_metadata?.firstName ? `${user.user_metadata.firstName} ${user.user_metadata.lastName}` : "User")}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Button
                                                    variant="outline"
                                                    asChild
                                                    className="w-full h-12 rounded-xl font-bold justify-start gap-3 border-primary/30 text-primary hover:bg-primary/10 transition-all"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <Link href="/profile">
                                                        <User className="h-5 w-5" />
                                                        My Profile
                                                    </Link>
                                                </Button>

                                                <Button
                                                    onClick={handleSignOut}
                                                    variant="destructive"
                                                    className="w-full h-12 rounded-xl font-bold justify-start gap-3 transition-all"
                                                >
                                                    <LogOut className="h-5 w-5" />
                                                    Sign Out
                                                </Button>
                                            </>
                                        ) : (
                                            <div className="space-y-2.5">
                                                <Button
                                                    variant="outline"
                                                    asChild
                                                    className="w-full h-12 rounded-2xl justify-center gap-2 font-bold text-sm border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <Link href="/auth/signup">
                                                        <UserPlus className="h-4 w-4 text-primary" />
                                                        Sign In / Client Account
                                                    </Link>
                                                </Button>

                                                <Button
                                                    asChild
                                                    className="w-full h-12 rounded-2xl justify-center gap-2 font-bold text-sm bg-primary text-white hover:bg-primary/95 shadow-md transition-all"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <Link href="/auth/signup/tradesman">
                                                        <Briefcase className="h-4 w-4" />
                                                        Register as Worker or Company
                                                        <ArrowRight className="h-4 w-4 ml-auto opacity-70" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Footer branding */}
                            <div className="p-6 border-t border-border/20 text-center">
                                <p className="text-xs text-muted-foreground font-medium">Book A Fixer — Fast & Reliable Tradespeople</p>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

            </div>
        </header>
    )
}