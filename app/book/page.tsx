"use client";

import { useState } from "react";
import { Search, Star } from "lucide-react";
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

const COMPANIES = [
  {
    id: 1,
    name: "AquaFix Plumbing",
    type: "Plumber",
    desc: "Emergency repairs, pipe fitting & full bathroom installs. Available 24/7.",
    rating: 4.9,
    reviews: 312,
    price: "$90",
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "BrightWire Electrical",
    type: "Electrician",
    desc: "Certified electricians for rewiring, panels & smart home setups.",
    rating: 4.8,
    reviews: 278,
    price: "$110",
    image:
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Colour & Co. Painters",
    type: "Painter",
    desc: "Interior & exterior painting with premium eco-friendly paints.",
    rating: 4.7,
    reviews: 214,
    price: "$80",
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Oak & Timber Carpentry",
    type: "Carpenter",
    desc: "Custom built-ins, doors, decking & structural woodwork.",
    rating: 4.9,
    reviews: 189,
    price: "$120",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "GreenThumb Gardens",
    type: "Gardener",
    desc: "Landscaping, lawn care, hedge trimming & seasonal planting.",
    rating: 4.6,
    reviews: 301,
    price: "$70",
    image:
  "https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "TopSeal Roofing",
    type: "Roofer",
    desc: "Roof repairs, full replacements, gutters & waterproofing.",
    rating: 4.8,
    reviews: 156,
    price: "$150",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 7,
    name: "Perfect Tile Co.",
    type: "Tiler",
    desc: "Bathroom, kitchen & floor tiling with precision cutting.",
    rating: 4.7,
    reviews: 245,
    price: "$95",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 8,
    name: "CoolAir HVAC Services",
    type: "HVAC",
    desc: "Heating, cooling & ventilation installs, servicing & gas safety checks.",
    rating: 4.5,
    reviews: 198,
    price: "$130",
    image:
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 9,
    name: "Elite Masonry Works",
    type: "Mason",
    desc: "Stone walls, concrete work, patios & brick restoration services.",
    rating: 4.8,
    reviews: 173,
    price: "$115",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 10,
    name: "SafeLock Solutions",
    type: "Locksmith",
    desc: "24/7 emergency lockouts, smart locks & full security upgrades.",
    rating: 4.9,
    reviews: 142,
    price: "$85",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 11,
    name: "SparkClean Services",
    type: "Cleaner",
    desc: "Deep home cleaning, office cleaning & post-renovation cleanup.",
    rating: 4.6,
    reviews: 388,
    price: "$55",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 12,
    name: "Precision Flooring",
    type: "Flooring",
    desc: "Laminate, hardwood & luxury vinyl floor installation experts.",
    rating: 4.8,
    reviews: 221,
    price: "$105",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop",
  },
];

const TYPES = [
  "All Types",
  "Plumber",
  "Electrician",
  "Painter",
  "Carpenter",
  "Gardener",
  "Roofer",
  "Tiler",
  "HVAC",
  "Mason",
  "Locksmith",
  "Cleaner",
  "Flooring",
];

const RATINGS = [
  { label: "All Ratings", value: "0" },
  { label: "5 Stars only", value: "5" },
  { label: "4+ Stars", value: "4" },
  { label: "3+ Stars", value: "3" },
];

type RatingsMap = Record<number, number>;

type Company = {
  id: number;
  name: string;
  type: string;
  desc: string;
  rating: number;
  reviews: number;
  price: string;
  image: string;
};

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
    <Card className="overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-border rounded-3xl p-0 bg-white">

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

      {/* Footer */}
      <CardFooter className="px-6 pb-6 pt-0 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Starting from</p>

          <span className="text-2xl font-extrabold text-foreground">
            {company.price}
          </span>

          <span className="text-sm text-muted-foreground">/hr</span>
        </div>

        <Button
          onClick={() => onBook(company.name)}
          className="rounded-2xl px-6 h-11 font-bold text-sm text-white hover:opacity-90"
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

  const handleRate = (id: number, stars: number) =>
    setUserRatings((prev) => ({ ...prev, [id]: stars }));

  const handleBook = (name: string) =>
    alert(
      `Booking request sent for ${name}! A tradesman will contact you shortly.`
    );

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

        {/* Search bar */}
        <div className="sticky top-6 z-50 flex justify-center mb-10">
          <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md border border-border shadow-xl rounded-3xl px-4 py-3 w-full max-w-3xl">

            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <Input
                placeholder="Search trade or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 rounded-2xl bg-muted/40 border-border focus-visible:ring-green-600"
              />
            </div>

            {/* Type */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px] h-11 rounded-2xl font-semibold">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>

              <SelectContent>
                {TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Rating */}
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-[160px] h-11 rounded-2xl font-semibold">
                <SelectValue placeholder="All Ratings" />
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
      </div>
    </div>
  );
}