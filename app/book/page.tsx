"use client";

import { useState, useEffect } from "react";
import { Search, Star, CheckCircle2, Lock, UserPlus, ShieldCheck, HelpCircle, Sparkles, Filter, SlidersHorizontal, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import Link from "next/link";
import { TYPES, Company } from "@/lib/data";
import { getMarketplaceCompanies } from "@/lib/workers";
type RatingsMap = Record<string, number>;

const RATINGS = [
  { label: "All Ratings", value: "0" },
  { label: "5 Stars only", value: "5" },
  { label: "4+ Stars", value: "4" },
  { label: "3+ Stars", value: "3" },
];

function StarRating({
  companyId,
  baseRating,
  userRatings,
  onRate,
}: {
  companyId: number | string;
  baseRating: number;
  userRatings: RatingsMap;
  onRate: (id: number | string, stars: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const current = userRatings[companyId] ?? baseRating;
  const display = hovered || current;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={15}
          className="cursor-pointer transition-transform hover:scale-125"
          fill={s <= Math.round(display) ? "#f59e0b" : "transparent"}
          color={s <= Math.round(display) ? "#f59e0b" : "#d1d5db"}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRate(companyId, s);
          }}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">
        {current.toFixed(1)}
      </span>
    </div>
  );
}

function CompanyCard({
  company,
  userRatings,
  onRate,
  onBook,
  isLoggedIn,
}: {
  company: Company;
  userRatings: RatingsMap;
  onRate: (id: number | string, stars: number) => void;
  onBook: (name: string) => void;
  isLoggedIn: boolean;
}) {
  return (
    <Card className="overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-border/70 rounded-3xl p-0 bg-white h-full group">
      <Link href={`/book/${company.id}`} className="block flex-1">
        {/* Image */}
        <div className="relative w-full h-52 overflow-hidden">
          <img
            src={company.image}
            alt={company.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <Badge
            className="absolute top-4 left-4 text-xs font-bold rounded-full px-3.5 py-1 border-0 shadow-md"
            style={{ background: "white", color: "#145e38" }}
          >
            {company.type}
          </Badge>

          <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/45 backdrop-blur-md text-white font-extrabold text-[10px] rounded-full px-2.5 py-1 border border-white/10 shadow-sm">
            <ShieldCheck size={12} className="text-emerald-400" />
            <span>Verified</span>
          </div>
        </div>

        {/* Content */}
        <CardContent className="flex flex-col gap-3 p-5 flex-1">
          <div>
            <h3 className="font-extrabold text-[17px] leading-snug text-foreground group-hover:text-[#1a7a4a] transition-colors line-clamp-1">
              {company.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-2">
              {company.desc}
            </p>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
            <StarRating
              companyId={company.id}
              baseRating={company.rating}
              userRatings={userRatings}
              onRate={onRate}
            />
            <span className="text-xs text-muted-foreground font-semibold">
              {company.reviews.toLocaleString()} reviews
            </span>
          </div>
        </CardContent>
      </Link>

      {/* Footer */}
      <CardFooter className="px-5 pb-5 pt-0 flex items-center justify-between z-10 relative">
        <div>
          <p className="text-[10px] text-muted-foreground font-semibold">Starting from</p>
          <span className="text-xl font-black text-foreground">
            {company.price}
          </span>
          <span className="text-xs text-muted-foreground">/hr</span>
        </div>

        <Button
          onClick={(e) => { 
            e.preventDefault(); 
            e.stopPropagation(); 
            onBook(company.name); 
          }}
          className="rounded-2xl px-4 h-10 font-bold text-xs text-white hover:opacity-90 transition-opacity gap-1.5 shadow-sm"
          style={{ background: "#1a7a4a" }}
        >
          {!isLoggedIn && <Lock size={12} className="opacity-80" />}
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function TradesmanMarket() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [ratingFilter, setRatingFilter] = useState("0");
  const [userRatings, setUserRatings] = useState<RatingsMap>({});
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showAuthRequiredModal, setShowAuthRequiredModal] = useState<string | null>(null);
  const [companiesList, setCompaniesList] = useState<Company[]>([]);

  useEffect(() => {
    getMarketplaceCompanies().then(setCompaniesList);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleRate = (id: number | string, stars: number) => {
    if (!user) {
      const company = companiesList.find(c => c.id === id);
      setShowAuthRequiredModal(company?.name || "this fixer");
      return;
    }
    setUserRatings((prev) => ({ ...prev, [id]: stars }));
  };

  const handleBook = (name: string) => {
    if (!user) {
      setShowAuthRequiredModal(name);
      return;
    }
    setSelectedCompany(name);
  };

  const filtered = companiesList.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.type.toLowerCase().includes(q) ||
      c.desc.toLowerCase().includes(q);

    const matchType =
      typeFilter === "All Types" || c.type === typeFilter;

    const effectiveRating = userRatings[c.id] ?? c.rating;
    const matchRating =
      Number(ratingFilter) === 0 ||
      effectiveRating >= Number(ratingFilter);

    return matchSearch && matchType && matchRating;
  }).sort(
    (a, b) =>
      (userRatings[b.id] ?? b.rating) -
      (userRatings[a.id] ?? a.rating)
  );

  return (
    <div className="min-h-screen bg-[#f7f6f2]">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-20">

        {/* Header - Not Sticky */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Find a Tradesman
          </h1>
          <p className="text-base text-muted-foreground mt-2 max-w-xl mx-auto">
            Browse trusted local professionals, compare ratings & transparent prices. {!user && "(Sign in to book or message fixers)"}
          </p>
        </div>

        {/* static search bar (Not Sticky) */}
        <div className="w-full max-w-3xl mx-auto mb-10">
          <div className="flex items-center bg-white border border-border/80 shadow-lg rounded-3xl p-3 w-full">
            <Search size={18} className="text-slate-400 ml-3 mr-2" />
            <Input
              placeholder="Search trade, services, or fixer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 rounded-2xl bg-transparent border-0 focus-visible:ring-0 w-full font-semibold text-foreground text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-xs text-muted-foreground hover:text-foreground font-bold px-3 transition-colors mr-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Layout Grid: Left Area is Main Grid, Right Area is Sticky Filters Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Card Listings Area (9 columns) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Search results summary */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">
                {filtered.length} {filtered.length === 1 ? "Fixer" : "Fixers"} Available
              </p>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((company) => (
                  <CompanyCard
                    key={company.id}
                    company={company}
                    userRatings={userRatings}
                    onRate={handleRate}
                    onBook={handleBook}
                    isLoggedIn={!!user}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground bg-white border border-border/60 rounded-3xl max-w-md mx-auto p-8 shadow-sm">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-base font-bold text-foreground mb-1">
                  No matching fixers found
                </p>
                <p className="text-xs text-muted-foreground">
                  Try adjusting the filter options in the sidebar or change your search keywords.
                </p>
              </div>
            )}
          </div>

          {/* Sticky Sidebar filters (3 columns) - Stays sticky at the right side of viewport */}
          <div className="lg:col-span-3 lg:sticky lg:top-28 z-30">
            <div className="bg-white border border-border/70 rounded-3xl p-6 shadow-xl space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-border/50">
                <span className="font-black text-sm uppercase tracking-wider flex items-center gap-1.5 text-foreground">
                  <SlidersHorizontal size={16} className="text-[#1a7a4a]" />
                  Filters
                </span>
                
                {(typeFilter !== "All Types" || ratingFilter !== "0") && (
                  <button
                    onClick={() => {
                      setTypeFilter("All Types");
                      setRatingFilter("0");
                    }}
                    className="text-xs font-bold text-[#1a7a4a] hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Trade Profession filter */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Trade Category
                </label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full h-11 rounded-2xl font-bold text-sm bg-secondary/40 border-0 text-foreground">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => (
                      <SelectItem key={t} value={t} className="font-semibold">
                        {t === "All Types" ? "All Categories" : t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Minimum Rating filter */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Minimum Rating
                </label>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="w-full h-11 rounded-2xl font-bold text-sm bg-secondary/40 border-0 text-foreground">
                    <SelectValue placeholder="All Ratings" />
                  </SelectTrigger>
                  <SelectContent>
                    {RATINGS.map((r) => (
                      <SelectItem key={r.value} value={r.value} className="font-semibold">
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* AI diagnostic helper card in sidebar */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-2">
                <p className="text-xs font-bold text-[#145e38] flex items-center gap-1">
                  <Sparkles size={14} /> Need diagnostics?
                </p>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Describe your problem to our AI Concierge and get matched immediately.
                </p>
                <Link
                  href="/ai"
                  className="text-[11px] font-black text-[#1a7a4a] hover:underline flex items-center gap-0.5 pt-1"
                >
                  Start AI Diagnostic →
                </Link>
              </div>

            </div>
          </div>

        </div>

        {/* Booking Successful Modal */}
        <Dialog open={!!selectedCompany} onOpenChange={(open) => !open && setSelectedCompany(null)}>
          <DialogContent className="sm:max-w-md rounded-3xl p-8 border-0 shadow-2xl">
            <DialogHeader>
              <div className="h-16 w-16 bg-green-100 text-green-600 flex items-center justify-center rounded-full mb-4 mx-auto">
                <CheckCircle2 size={32} className="text-[#1a7a4a]" />
              </div>
              <DialogTitle className="text-2xl font-black mb-2 text-center text-foreground">Booking Requested!</DialogTitle>
              <DialogDescription className="text-base text-center text-muted-foreground leading-relaxed mt-2">
                Your request for <strong className="text-foreground">{selectedCompany}</strong> has been successfully sent. A professional will contact you shortly to confirm details.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-8 flex justify-center">
              <Button onClick={() => setSelectedCompany(null)} className="rounded-2xl w-full h-12 font-bold bg-[#1a7a4a] text-white hover:opacity-90 transition-all">
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog> 

        {/* Auth Required Modal */}
        <Dialog open={!!showAuthRequiredModal} onOpenChange={(open) => !open && setShowAuthRequiredModal(null)}>
          <DialogContent className="sm:max-w-md rounded-3xl p-8 border-0 shadow-2xl">
            <DialogHeader>
              <div className="h-16 w-16 bg-amber-100 text-amber-600 flex items-center justify-center rounded-full mb-4 mx-auto">
                <Lock size={32} className="text-amber-600" />
              </div>
              <DialogTitle className="text-2xl font-black mb-2 text-center text-foreground">Client Registration Required</DialogTitle>
              <DialogDescription className="text-base text-center text-muted-foreground leading-relaxed mt-2">
                You can freely browse worker pages and rates. To book <strong className="text-foreground">{showAuthRequiredModal}</strong>, message fixers, or leave ratings, please sign in or register as a client.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 flex flex-col gap-3">
              <Button asChild className="rounded-2xl w-full h-12 font-bold bg-[#1a7a4a] text-white hover:opacity-90 transition-all gap-2">
                <Link href="/auth/signup">
                  <UserPlus size={18} />
                  Sign In / Register as Client
                </Link>
              </Button>
              <Button variant="outline" onClick={() => setShowAuthRequiredModal(null)} className="rounded-2xl w-full h-12 font-bold border-border transition-all">
                Continue Browsing
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  )
}
