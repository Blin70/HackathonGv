"use client";

import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { getStoredCompanies, Company } from "@/lib/data";
import { Star, MapPin, Clock, ShieldCheck, CheckCircle2, Lock, UserPlus, MessageSquarePlus, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/client";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type ReviewItem = {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  trade: string;
  initial: string;
  color: string;
};

const DEFAULT_REVIEWS: Record<number, ReviewItem[]> = {
  4: [
    {
      id: "r1",
      name: "Elvira K.",
      rating: 5,
      date: "2 days ago",
      comment: "Master craftsmen indeed! Simon built custom oak shelving and fitted our exterior doors flawlessly. The attention to detail is remarkable.",
      trade: "Custom Built-ins",
      initial: "E",
      color: "bg-blue-100 text-blue-700"
    },
    {
      id: "r2",
      name: "Arjan M.",
      rating: 5,
      date: "1 week ago",
      comment: "Arrived exactly on time, brought all heavy duty tools, and completed our deck framing ahead of schedule. Very clean job site afterwards.",
      trade: "Deck Construction",
      initial: "A",
      color: "bg-amber-100 text-amber-800"
    },
    {
      id: "r3",
      name: "Sara D.",
      rating: 4.8,
      date: "3 weeks ago",
      comment: "Solid woodwork and fair pricing. The door frame installation looks fantastic. Will definitely hire again for future projects.",
      trade: "Door Installation",
      initial: "S",
      color: "bg-emerald-100 text-emerald-800"
    }
  ]
};

function getGenericReviews(companyName: string, tradeType: string): ReviewItem[] {
  return [
    {
      id: "r-gen-1",
      name: "Elvira K.",
      rating: 5,
      date: "3 days ago",
      comment: `Extremely professional ${tradeType.toLowerCase()} service! Arrived promptly and completed the job with great precision.`,
      trade: `${tradeType} Work`,
      initial: "E",
      color: "bg-blue-100 text-blue-700"
    },
    {
      id: "r-gen-2",
      name: "Arjan M.",
      rating: 5,
      date: "2 weeks ago",
      comment: `Fair pricing, transparent quote, and high-quality workmanship from ${companyName}. Highly recommended!`,
      trade: "Home Repair",
      initial: "A",
      color: "bg-amber-100 text-amber-800"
    },
    {
      id: "r-gen-3",
      name: "Sara D.",
      rating: 4.7,
      date: "1 month ago",
      comment: "Great experience overall. Friendly customer service and solid attention to detail throughout.",
      trade: "General Service",
      initial: "S",
      color: "bg-emerald-100 text-emerald-800"
    }
  ];
}

export default function TradesmanProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [company, setCompany] = useState<Company | null>(null);
  const [loadingCompany, setLoadingCompany] = useState(true);
  const [booked, setBooked] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Reviews state
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState(false);

  useEffect(() => {
    const all = getStoredCompanies();
    const found = all.find((c) => c.id === parseInt(id));
    if (found) {
      setCompany(found);

      // Load saved reviews from localStorage or fallback to default
      try {
        const stored = localStorage.getItem(`worker_reviews_${found.id}`);
        if (stored) {
          setReviewsList(JSON.parse(stored));
        } else {
          const initial = DEFAULT_REVIEWS[found.id] || getGenericReviews(found.name, found.type);
          setReviewsList(initial);
        }
      } catch (e) {
        setReviewsList(DEFAULT_REVIEWS[found.id] || getGenericReviews(found.name, found.type));
      }
    }
    setLoadingCompany(false);

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        setReviewerName(user.user_metadata?.full_name || user.email?.split("@")[0] || "");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setReviewerName(session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [id]);

  if (loadingCompany) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-[#f3f6f4]">
        <div className="h-8 w-8 text-[#1a7a4a] animate-spin border-4 border-[#1a7a4a] border-t-transparent rounded-full mb-4" />
        <p className="text-muted-foreground font-semibold">Loading Worker Profile...</p>
      </div>
    );
  }

  if (!company) {
    return notFound();
  }

  const handleBook = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setBooked(true);
  };

  const handleOpenWriteReview = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowReviewModal(true);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newReviewItem: ReviewItem = {
      id: `rev-${Date.now()}`,
      name: reviewerName.trim() || "Verified Client",
      rating: newRating,
      date: "Just now",
      comment: reviewComment.trim(),
      trade: company.type,
      initial: (reviewerName.trim() || "V")[0].toUpperCase(),
      color: "bg-emerald-100 text-emerald-800"
    };

    const updated = [newReviewItem, ...reviewsList];
    setReviewsList(updated);

    // Save to localStorage
    try {
      localStorage.setItem(`worker_reviews_${company.id}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    setReviewComment("");
    setShowReviewModal(false);
    setReviewSuccessMsg(true);
    setTimeout(() => setReviewSuccessMsg(false), 5000);
  };

  const currentAverageRating = reviewsList.length > 0
    ? (reviewsList.reduce((acc, r) => acc + r.rating, 0) / reviewsList.length).toFixed(1)
    : company.rating.toFixed(1);

  return (
    <main className="min-h-screen bg-[#f3f6f4] pb-24">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        <img
          src={company.image}
          alt={company.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 w-full">
          <div className="max-w-5xl mx-auto px-6 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="text-white">
              <Badge className="bg-[#1a7a4a] text-white border-0 mb-4 px-4 py-1.5 text-sm font-bold rounded-full shadow-lg">
                {company.type}
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2">
                {company.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-medium opacity-90">
                <div className="flex items-center gap-1.5">
                  <Star className="fill-yellow-400 text-yellow-400" size={18} />
                  <span className="font-bold">{currentAverageRating}</span>
                  <span className="opacity-75">({reviewsList.length} reviews)</span>
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-white/50" />
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={18} className="text-green-400" />
                  <span>Verified Professional</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-5xl mx-auto px-6 mt-8 md:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          
          {/* Left Column: Details & Reviews */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* About Section */}
            <section>
              <h2 className="text-2xl font-extrabold mb-4 text-foreground">About Us</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {company.aboutUs}
              </p>
            </section>

            <div className="h-px w-full bg-border" />

            {/* Services Section */}
            <section>
              <h2 className="text-2xl font-extrabold mb-4 text-foreground">Services Offered</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {company.services.map((service, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-border shadow-sm">
                    <CheckCircle2 className="text-[#1a7a4a] mt-0.5 shrink-0" size={20} />
                    <span className="font-semibold text-foreground">{service}</span>
                  </div>
                ))}
              </div>
            </section>

            <div className="h-px w-full bg-border" />

            {/* Quick Info */}
            <section>
              <h2 className="text-2xl font-extrabold mb-4 text-foreground">Availability</h2>
              <div className="flex items-center gap-3 text-lg text-muted-foreground bg-white p-5 rounded-2xl border border-border shadow-sm inline-flex">
                <Clock className="text-[#1a7a4a]" size={24} />
                <span className="font-medium">{company.availableDays}</span>
              </div>
            </section>

            <div className="h-px w-full bg-border" />

            {/* ========================================================================= */}
            {/* REVIEWS & RATINGS SECTION                                                 */}
            {/* ========================================================================= */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
                    Customer Reviews
                    <Badge className="bg-amber-100 text-amber-900 border-amber-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      ★ {currentAverageRating}
                    </Badge>
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Read genuine feedback from verified clients or leave your own review.
                  </p>
                </div>

                <Button
                  onClick={handleOpenWriteReview}
                  className="rounded-2xl h-11 px-5 font-bold text-sm bg-[#1a7a4a] text-white hover:opacity-90 transition-all gap-2 self-start sm:self-auto"
                >
                  <MessageSquarePlus size={18} />
                  Write a Review
                </Button>
              </div>

              {reviewSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-sm font-bold flex items-center gap-2">
                  <ThumbsUp size={18} className="text-[#1a7a4a]" />
                  Thank you! Your review has been submitted and published live.
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="p-6 rounded-3xl bg-white border border-border shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full font-bold flex items-center justify-center text-sm ${rev.color}`}>
                          {rev.initial}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-foreground text-sm">{rev.name}</h4>
                          <p className="text-xs text-muted-foreground font-medium">{rev.trade} • {rev.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={15}
                            className={s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                      &quot;{rev.comment}&quot;
                    </p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column: Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-3xl p-6 border border-border shadow-xl">
              
              {!user && (
                <div className="mb-6 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs font-semibold flex items-center gap-2.5 leading-snug">
                  <Lock size={18} className="text-amber-600 shrink-0" />
                  <span>Browsing as Guest — Sign in as a client to book or review this fixer.</span>
                </div>
              )}

              <div className="text-center mb-6">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Starting Rate</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-black text-foreground">{company.price}</span>
                  <span className="text-lg text-muted-foreground font-medium">/hr</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <CheckCircle2 className="text-green-500" size={18} />
                  No hidden fees
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <CheckCircle2 className="text-green-500" size={18} />
                  Cancel anytime before 24h
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <CheckCircle2 className="text-green-500" size={18} />
                  100% Satisfaction Guarantee
                </div>
              </div>

              <Button 
                onClick={handleBook}
                disabled={booked}
                className="w-full h-14 rounded-2xl font-bold text-base shadow-lg shadow-[#1a7a4a]/20 hover:scale-[1.02] transition-transform gap-2 text-white"
                style={{ background: "#1a7a4a" }}
              >
                {!user && <Lock size={16} />}
                {booked ? "Booking Request Sent!" : (user ? "Book This Pro" : "Sign In to Book")}
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4 leading-relaxed">
                {user ? "You won't be charged yet. The tradesman will review your request and confirm." : "Sign in or register as a client to submit your booking request."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Dialog (Logged in) */}
      <Dialog open={booked} onOpenChange={(open) => !open && setBooked(false)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-8 border-0 shadow-2xl">
          <DialogHeader>
            <div className="h-16 w-16 bg-green-100 text-green-600 flex items-center justify-center rounded-full mb-4 mx-auto">
              <CheckCircle2 size={32} className="text-[#1a7a4a]" />
            </div>
            <DialogTitle className="text-2xl font-black mb-2 text-center text-foreground">Booking Requested!</DialogTitle>
            <DialogDescription className="text-base text-center text-muted-foreground leading-relaxed mt-2">
              Your request for <strong className="text-foreground">{company.name}</strong> has been successfully sent. A professional will contact you shortly to confirm details.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-8 flex justify-center">
            <Button onClick={() => setBooked(false)} className="rounded-2xl w-full h-12 font-bold bg-[#1a7a4a] text-white hover:opacity-90 transition-all">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Auth Required Modal (Guest User) */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md rounded-3xl p-8 border-0 shadow-2xl">
          <DialogHeader>
            <div className="h-16 w-16 bg-amber-100 text-amber-600 flex items-center justify-center rounded-full mb-4 mx-auto">
              <Lock size={32} className="text-amber-600" />
            </div>
            <DialogTitle className="text-2xl font-black mb-2 text-center text-foreground">Sign In Required</DialogTitle>
            <DialogDescription className="text-base text-center text-muted-foreground leading-relaxed mt-2">
              You are currently browsing as a guest. To book <strong className="text-foreground">{company.name}</strong> or submit ratings & reviews, please sign in as a client.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex flex-col gap-3">
            <Button asChild className="rounded-2xl w-full h-12 font-bold bg-[#1a7a4a] text-white hover:opacity-90 transition-all gap-2">
              <Link href="/auth/signup">
                <UserPlus size={18} />
                Sign In / Register as Client
              </Link>
            </Button>
            <Button variant="outline" onClick={() => setShowAuthModal(false)} className="rounded-2xl w-full h-12 font-bold border-border transition-all">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Write a Review Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="sm:max-w-lg rounded-3xl p-8 border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black mb-1 text-foreground">
              Review {company.name}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Share your feedback and experience to help other clients on the platform.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddReview} className="space-y-5 mt-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={28}
                    className="cursor-pointer transition-transform hover:scale-125"
                    fill={(hoverRating || newRating) >= star ? "#f59e0b" : "transparent"}
                    color={(hoverRating || newRating) >= star ? "#f59e0b" : "#d1d5db"}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setNewRating(star)}
                  />
                ))}
                <span className="text-sm font-bold text-foreground ml-2">
                  {newRating} / 5 Stars
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="reviewerName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                Your Name
              </label>
              <Input
                id="reviewerName"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. John D."
                className="h-12 rounded-2xl bg-secondary/30 focus-visible:ring-[#1a7a4a]"
                required
              />
            </div>

            <div>
              <label htmlFor="reviewComment" className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                Your Review
              </label>
              <textarea
                id="reviewComment"
                rows={4}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Describe the service quality, punctuality, and overall experience..."
                className="w-full p-4 rounded-2xl bg-secondary/30 border border-border focus-visible:ring-2 focus-visible:ring-[#1a7a4a] text-sm leading-relaxed"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowReviewModal(false)} className="rounded-2xl h-11 px-5 font-bold border-border">
                Cancel
              </Button>
              <Button type="submit" className="rounded-2xl h-11 px-6 font-bold bg-[#1a7a4a] text-white hover:opacity-90">
                Publish Review
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </main>
  );
}
