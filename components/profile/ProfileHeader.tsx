"use client"

import { Briefcase, User as UserIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { ProfileRole, ProfileTab } from "@/lib/profile"

interface ProfileHeaderProps {
  role: ProfileRole
  activeTab: ProfileTab
  onTabChange: (tab: ProfileTab) => void
}

export function ProfileHeader({ role, activeTab, onTabChange }: ProfileHeaderProps) {
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Account &amp; Profile Setup
          </h1>
          <Badge className="bg-primary/15 text-primary border-primary/30 text-xs font-bold uppercase tracking-wider px-3 py-1">
            {role === "tradesman" ? "Worker / Company Account" : "Client Account"}
          </Badge>
        </div>
        <p className="text-muted-foreground text-base mt-1.5">
          Configure your personal details or build your public worker profile page.
        </p>
      </div>

      <div className="flex items-center p-1.5 rounded-2xl bg-secondary/50 border border-border/50 self-start md:self-auto">
        <button
          type="button"
          onClick={() => onTabChange("client")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
            activeTab === "client"
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <UserIcon size={16} /> Personal Info
        </button>
        <button
          type="button"
          onClick={() => onTabChange("worker")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
            activeTab === "worker"
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Briefcase size={16} /> Worker / Company Page Form
        </button>
      </div>
    </div>
  )
}
