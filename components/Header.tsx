"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Menu, Sparkles, UserPlus, Briefcase, LogOut, User } from "lucide-react"

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
    SheetHeader,
    SheetTitle,
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
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

const navLinks = [
    { title: "Home", href: "/", icon: null },
    { title: "Book", href: "/book", icon: null },
    { title: "AI", href: "/ai", icon: <Sparkles className="h-4 w-4 text-primary" /> }
]

const authLinks = [
    { title: "Register", href: "/auth/signup", icon: <UserPlus className="h-4 w-4" />, variant: "outline" as const },
    { title: "Register as Tradesman", href: "/auth/signup/tradesman", icon: <Briefcase className="h-4 w-4" />, variant: "default" as const },
]

export default function Header() {
    const router = useRouter()
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

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-24 items-center justify-between px-4 md:px-8">
               
                <Link
      href="/"
      className="group inline-flex items-center gap-4 transition-all duration-300 hover:opacity-90"
    >
      {/* Logo circle with enhanced animations */}
      <div className="relative flex-shrink-0 transform transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 group-active:scale-95">
        {/* Glow effect on hover */}
        <div className="absolute -inset-3 rounded-full bg-[#1a7a4a]/0 blur-lg transition-all duration-500 group-hover:bg-[#1a7a4a]/20" />
        
        <Image
          src="/image.svg"
          alt="Book A Fixer"
          width={80}
          height={80}
          className="relative h-20 w-20 transition-all duration-300 group-hover:drop-shadow-lg group-hover:brightness-110"
          priority
        />
      </div>

      {/* Brand text */}
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold uppercase tracking-widest text-[#1a7a4a]/70 transition-all duration-300 group-hover:tracking-wider group-hover:text-[#1a7a4a]">
          Book A
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-foreground transition-all duration-300 group-hover:text-[#1a7a4a]">
          Fixer
        </h1>
      </div>
    </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex md:items-center md:space-x-4">
                    <NavigationMenu>
                        <NavigationMenuList className="gap-2">
                            {navLinks.map((link) => (
                                <NavigationMenuItem key={link.href}>
                                    <NavigationMenuLink asChild>
                                        <Link 
                                            href={link.href} 
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                "flex items-center gap-2 font-semibold text-base transition-colors hover:text-primary hover:bg-primary/5 bg-transparent"
                                            )}
                                        >
                                            {link.icon}
                                            {link.title}
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>

                    <div className="flex items-center space-x-3 ml-6">
                        {loading ? (
                            <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
                        ) : user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="focus:outline-hidden">
                                    <Avatar className="h-10 w-10 cursor-pointer border border-primary/20 transition-all hover:scale-105 hover:shadow-md">
                                        <AvatarImage src={user.user_metadata?.avatar_url || ""} />
                                        <AvatarFallback className="bg-primary/10 font-bold text-primary">
                                            {user.user_metadata?.firstName 
                                                ? `${user.user_metadata.firstName.charAt(0)}${user.user_metadata.lastName?.charAt(0) || ""}`.toUpperCase()
                                                : user.email?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 p-2 mt-2">
                                    <div className="px-2 py-2 text-xs text-muted-foreground break-all">
                                        <span className="block font-bold text-foreground truncate break-all mb-0.5 text-sm">
                                            {user.user_metadata?.full_name || (user.user_metadata?.firstName ? `${user.user_metadata.firstName} ${user.user_metadata.lastName}` : "User")}
                                        </span>
                                        {user.email}
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile" className="flex items-center gap-2 py-2 cursor-pointer font-semibold text-sm w-full">
                                            <User className="h-4 w-4" />
                                            My Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer font-semibold gap-2 py-2 text-sm">
                                        <LogOut className="h-4 w-4" />
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            authLinks.map((link) => (
                                <Button
                                    key={link.href}
                                    variant={link.variant}
                                    asChild
                                    className={cn(
                                        "font-bold px-6 py-5 text-base transition-all duration-300",
                                        link.variant === "default"
                                            ? "bg-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
                                            : "border-primary text-primary hover:bg-primary/10"
                                    )}
                                >
                                    <Link href={link.href} className="flex items-center gap-2">
                                        {link.icon}
                                        {link.title}
                                    </Link>
                                </Button>
                            ))
                        )}
                    </div>
                </div>

                {/* Mobile Navigation */}
<div className="md:hidden">
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-11 w-11 rounded-xl hover:bg-primary/15 text-primary transition-all duration-300 hover:scale-105 active:scale-95"
            >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
            </Button>
        </SheetTrigger>
        <SheetContent 
            side="right" 
            className="w-full sm:w-[420px] border-l border-border/30 bg-white p-0 overflow-y-auto"
        >
            {/* Header with logo and close button */}
            <div className="sticky top-0 z-10 bg-white border-b border-border/30 px-6 py-5">
                <div className="flex items-center justify-between">
                    <Image
                        src="/image.svg"
                        alt="Logo"
                        width={120}
                        height={40}
                        className="h-10 w-auto"
                    />
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setIsOpen(false)}
                        className="h-9 w-9 rounded-lg hover:bg-muted"
                    >
                        <span className="text-2xl">×</span>
                    </Button>
                </div>
            </div>

            {/* Navigation content */}
            <div className="px-4 py-6 space-y-2">
                {/* Main nav links */}
                <nav className="space-y-1 mb-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-semibold text-foreground/80 transition-all duration-200 hover:text-primary hover:bg-primary/8 active:bg-primary/12"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all group-hover:bg-primary/20">
                                {link.icon || <Sparkles className="h-5 w-5" />}
                            </div>
                            <span>{link.title}</span>
                            <span className="ml-auto text-muted-foreground/50">→</span>
                        </Link>
                    ))}
                </nav>

                {/* Auth section */}
                <div className="space-y-3 border-t border-border/30 pt-6">
                    {loading ? (
                        <div className="space-y-3">
                            <div className="h-16 animate-pulse rounded-xl bg-muted" />
                            <div className="h-12 animate-pulse rounded-xl bg-muted" />
                            <div className="h-12 animate-pulse rounded-xl bg-muted" />
                        </div>
                    ) : user ? (
                        <>
                            {/* User info card */}
                            <div className="rounded-xl bg-gradient-to-br from-primary/8 to-primary/3 border border-primary/20 p-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12 border-2 border-primary/30 ring-2 ring-primary/10">
                                        <AvatarImage src={user.user_metadata?.avatar_url || ""} />
                                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 font-bold text-white text-sm">
                                            {user.user_metadata?.firstName 
                                                ? `${user.user_metadata.firstName.charAt(0)}${user.user_metadata.lastName?.charAt(0) || ""}`.toUpperCase()
                                                : user.email?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-foreground truncate">
                                            {user.user_metadata?.full_name || (user.user_metadata?.firstName ? `${user.user_metadata.firstName} ${user.user_metadata.lastName}` : "User")}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <Button
                                variant="outline"
                                asChild
                                className="w-full h-12 rounded-xl font-semibold gap-3 border-primary/30 text-primary hover:bg-primary/12 hover:border-primary/50 transition-all"
                                onClick={() => setIsOpen(false)}
                            >
                                <Link href="/profile" className="justify-start">
                                    <User className="h-5 w-5" />
                                    My Profile
                                </Link>
                            </Button>
                            <Button
                                onClick={handleSignOut}
                                className="w-full h-12 rounded-xl font-semibold gap-3 bg-destructive/90 hover:bg-destructive text-white transition-all"
                            >
                                <LogOut className="h-5 w-5" />
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <>
                            {authLinks.map((link) => (
                                <Button
                                    key={link.href}
                                    variant={link.variant}
                                    asChild
                                    className={cn(
                                        "w-full h-12 rounded-xl justify-start gap-3 font-semibold text-base transition-all",
                                        link.variant === "default" 
                                            ? "bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg" 
                                            : "border-primary/30 text-primary hover:bg-primary/12 hover:border-primary/50"
                                    )}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Link href={link.href} className="flex items-center gap-3">
                                        <span className={cn(
                                            "flex h-9 w-9 items-center justify-center rounded-lg transition-all",
                                            link.variant === "default" 
                                                ? "bg-white/20" 
                                                : "bg-primary/12"
                                        )}>
                                            {link.icon}
                                        </span>
                                        {link.title}
                                    </Link>
                                </Button>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </SheetContent>
    </Sheet>
</div>

            </div>
        </header>
    )
}