"use client";

import { useState } from "react";
import { Search, Star, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { COMPANIES, TYPES, Company } from "@/lib/data";
type RatingsMap = Record<number, number>;

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
  companyId: number;
  baseRating: number;
  userRatings: RatingsMap;
  onRate: (id: number, stars: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const current = userRatings[companyId] ?? baseRating;
  const display = hovered || current;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={16}
          className="cursor-pointer transition-transform hover:scale-125"
          fill={s <= Math.round(display) ? "#f59e0b" : "transparent"}
          color={s <= Math.round(display) ? "#f59e0b" : "#d1d5db"}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onRate(companyId, s)}
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
}: {
  company: Company;
  userRatings: RatingsMap;
  onRate: (id: number, stars: number) => void;
  onBook: (name: string) => void;
}) {
  return (
    <Card className="overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-border rounded-3xl p-0 bg-white h-full group">
      <Link href={`/book/${company.id}`} className="block flex-1">

      {/* Image */}
      <div className="relative w-full h-60 overflow-hidden">
        <img
          src={company.image}
          alt={company.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        <Badge
          className="absolute top-4 left-4 text-xs font-bold rounded-full px-3 py-1 border-0"
          style={{ background: "white", color: "#145e38" }}
        >
          {company.type}
        </Badge>
      </div>

      {/* Content */}
      <CardContent className="flex flex-col gap-3 p-6 flex-1">
        <div>
          <h3 className="font-extrabold text-[18px] leading-snug text-foreground">
            {company.name}
          </h3>

          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {company.desc}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <StarRating
            companyId={company.id}
            baseRating={company.rating}
            userRatings={userRatings}
            onRate={onRate}
          />

          <span className="text-xs text-muted-foreground">
            {company.reviews.toLocaleString()} reviews
          </span>
        </div>
      </CardContent>
      </Link>

      {/* Footer */}
      <CardFooter className="px-6 pb-6 pt-0 flex items-center justify-between z-10 relative">
        <div>
          <p className="text-xs text-muted-foreground">Starting from</p>

          <span className="text-2xl font-extrabold text-foreground">
            {company.price}
          </span>

          <span className="text-sm text-muted-foreground">/hr</span>
        </div>

        <Button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onBook(company.name); }}
          className="rounded-2xl px-6 h-11 font-bold text-sm text-white hover:opacity-90 transition-opacity"
          style={{ background: "#1a7a4a" }}
        >
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

  const handleRate = (id: number, stars: number) =>
    setUserRatings((prev) => ({ ...prev, [id]: stars }));

  const handleBook = (name: string) => setSelectedCompany(name);

  const filtered = COMPANIES.filter((c) => {
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
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-20">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Find a Tradesman
          </h1>

          <p className="text-sm text-muted-foreground mt-2">
            Browse trusted professionals, compare ratings and book instantly.
          </p>
        </div>

        {/* Search bar - Responsive Layout */}
        <div className="sticky top-6 z-50 flex justify-center mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 bg-white/95 backdrop-blur-md border border-border shadow-xl rounded-3xl p-4 w-full max-w-3xl">

            {/* Search - Full width */}
            <div className="relative flex-1 w-full">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <Input
                placeholder="Search trade or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 rounded-2xl bg-muted/40 border-border focus-visible:ring-green-600 w-full"
              />
            </div>

            {/* Filters - Stacked on mobile, side-by-side on desktop */}
            <div className="flex gap-3 w-full lg:w-auto">
              {/* Type Dropdown */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="flex-1 lg:flex-none lg:w-[140px] h-11 rounded-2xl font-semibold text-sm">
                  <SelectValue placeholder="Types" />
                </SelectTrigger>

                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Rating Dropdown */}
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="flex-1 lg:flex-none lg:w-[140px] h-11 rounded-2xl font-semibold text-sm">
                  <SelectValue placeholder="Ratings" />
                </SelectTrigger>

                <SelectContent>
                  {RATINGS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Count */}
        <p className="text-sm text-muted-foreground font-semibold mb-6">
          {filtered.length}{" "}
          {filtered.length === 1 ? "company" : "companies"} found
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                userRatings={userRatings}
                onRate={handleRate}
                onBook={handleBook}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-muted-foreground">
            <div className="text-6xl mb-4">🔍</div>

            <p className="text-base">
              No companies match your filters.
            </p>
          </div>
        )}

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
        </div>
        </div>
  )
}
