"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { COMPANIES } from "@/lib/data";
import { Star, MapPin, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function TradesmanProfilePage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the promise for params
  const { id } = use(params);
  
  const company = COMPANIES.find((c) => c.id === parseInt(id));
  const [booked, setBooked] = useState(false);

  if (!company) {
    return notFound();
  }

  const handleBook = () => {
    setBooked(true);
  };

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
              <Badge className="bg-primary hover:bg-primary text-white border-0 mb-4 px-4 py-1.5 text-sm rounded-full shadow-lg">
                {company.type}
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2">
                {company.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-medium opacity-90">
                <div className="flex items-center gap-1.5">
                  <Star className="fill-yellow-400 text-yellow-400" size={18} />
                  <span>{company.rating}</span>
                  <span className="opacity-75">({company.reviews} reviews)</span>
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
          
          {/* Left Column: Details */}
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
                    <CheckCircle2 className="text-primary mt-0.5 shrink-0" size={20} />
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
                <Clock className="text-primary" size={24} />
                <span className="font-medium">{company.availableDays}</span>
              </div>
            </section>
          </div>

          {/* Right Column: Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-3xl p-6 border border-border shadow-xl">
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
                className="w-full h-14 rounded-2xl font-black text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
              >
                {booked ? "Booking Request Sent!" : "Book This Pro"}
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4 leading-relaxed">
                You won't be charged yet. The tradesman will review your request and confirm.
              </p>
            </div>
          </div>
        </div>
      </div>

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
    </main>
  );
}
