"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Sparkles, UserPlus, Briefcase } from "lucide-react"

import { cn } from "@/lib/utils"
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

const navLinks = [
    { title: "Home", href: "/", icon: null },
    { title: "Book", href: "/book", icon: null },
    { title: "AI", href: "/ai", icon: <Sparkles className="h-4 w-4 text-primary" /> }
]

const authLinks = [
    { title: "Register", href: "/register", icon: <UserPlus className="h-4 w-4" />, variant: "outline" as const },
    { title: "Register as Tradesman", href: "/register-tradesman", icon: <Briefcase className="h-4 w-4" />, variant: "default" as const },
]

export default function Header() {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-24 items-center justify-between px-4 md:px-8">
                {/* Logo */}
                <Link href="/" className="group flex items-center space-x-2">
                    <div className="relative overflow-hidden rounded-lg transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-primary/30 group-active:scale-95">
                        <Image
                            src="/image.svg"
                            alt="Book A Fixer Logo"
                            width={220}
                            height={70}
                            className="h-16 w-auto transition-all duration-300 group-hover:brightness-110"
                            priority
                        />
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
                        {authLinks.map((link) => (
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
                        ))}
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-12 w-12 hover:bg-primary/10 text-primary">
                                <Menu className="h-7 w-7" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l-primary/20">
                            <SheetHeader className="text-left border-b border-border/50 pb-6 mb-6">
                                <SheetTitle>
                                    <Image
                                        src="/image.svg"
                                        alt="Logo"
                                        width={180}
                                        height={60}
                                        className="h-12 w-auto"
                                    />
                                </SheetTitle>
                            </SheetHeader>
                            <nav className="flex flex-col space-y-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 text-xl font-bold py-2 transition-colors hover:text-primary"
                                    >
                                        <span className="p-2 rounded-md bg-primary/5">
                                            {link.icon || <Sparkles className="h-5 w-5 opacity-0" />}
                                        </span>
                                        {link.title}
                                    </Link>
                                ))}
                                <div className="pt-6 border-t border-border/50 flex flex-col space-y-4">
                                    {authLinks.map((link) => (
                                        <Button
                                            key={link.href}
                                            variant={link.variant}
                                            asChild
                                            className={cn(
                                                "w-full justify-start text-lg py-7 px-6 font-bold",
                                                link.variant === "default" ? "bg-primary shadow-md" : "border-primary text-primary"
                                            )}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Link href={link.href} className="flex items-center gap-4">
                                                <span className={cn("p-2 rounded-md", link.variant === "default" ? "bg-white/20" : "bg-primary/10")}>
                                                    {link.icon}
                                                </span>
                                                {link.title}
                                            </Link>
                                        </Button>
                                    ))}
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
