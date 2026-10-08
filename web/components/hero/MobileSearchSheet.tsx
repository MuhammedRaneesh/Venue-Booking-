"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Sparkles, MapPin, Calendar, Users, Search } from "lucide-react";

interface MobileSearchSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSearchSheet({ isOpen, onClose }: MobileSearchSheetProps) {
  const router = useRouter();
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (type.trim()) params.set("type", type.trim());
    if (location.trim()) params.set("location", location.trim());
    if (date.trim()) params.set("date", date.trim());
    if (guests.trim()) params.set("guests", guests.trim());

    onClose();
    const queryString = params.toString();
    router.push(queryString ? `/venues?${queryString}` : "/venues");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-search-title"
    >
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Sheet Content Card */}
      <div className="relative w-full max-w-lg bg-background rounded-t-[24px] p-6 shadow-2xl z-10 animate-in slide-in-from-bottom duration-250 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-foreground">
              Search spaces
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-neutral-200 transition-colors"
            aria-label="Close search sheet"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Fields Form */}
        <form onSubmit={handleSearch} className="mt-5 space-y-4">
          {/* Field 1: What */}
          <div className="p-3.5 rounded-xl border border-border focus-within:ring-2 focus-within:ring-coral-500/40 transition-all bg-muted/40">
            <label
              htmlFor="mobile-search-what"
              className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-coral-500" />
              <span>What space are you looking for?</span>
            </label>
            <input
              id="mobile-search-what"
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Boutique café, creative studio, hall..."
              className="w-full text-sm font-medium text-foreground placeholder:text-muted-foreground/60 bg-transparent outline-hidden"
            />
          </div>

          {/* Field 2: Where */}
          <div className="p-3.5 rounded-xl border border-border focus-within:ring-2 focus-within:ring-coral-500/40 transition-all bg-muted/40">
            <label
              htmlFor="mobile-search-where"
              className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1"
            >
              <MapPin className="w-3.5 h-3.5 text-coral-500" />
              <span>Where</span>
            </label>
            <input
              id="mobile-search-where"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or neighborhood in Kerala"
              className="w-full text-sm font-medium text-foreground placeholder:text-muted-foreground/60 bg-transparent outline-hidden"
            />
          </div>

          {/* Field 3: When */}
          <div className="relative p-3.5 rounded-xl border border-border focus-within:ring-2 focus-within:ring-coral-500/40 transition-all bg-muted/40 cursor-pointer">
            <label
              htmlFor="mobile-search-when"
              className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-coral-500" />
              <span>When</span>
            </label>
            <div className="text-sm font-medium text-foreground">
              {date ? (
                new Date(date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              ) : (
                <span className="text-muted-foreground/70">Select date</span>
              )}
            </div>
            <input
              id="mobile-search-when"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </div>

          {/* Field 4: Guests */}
          <div className="p-3.5 rounded-xl border border-border focus-within:ring-2 focus-within:ring-coral-500/40 transition-all bg-muted/40">
            <label
              htmlFor="mobile-search-guests"
              className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1"
            >
              <Users className="w-3.5 h-3.5 text-coral-500" />
              <span>Guests</span>
            </label>
            <input
              id="mobile-search-guests"
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              placeholder="Number of guests"
              className="w-full text-sm font-medium text-foreground placeholder:text-muted-foreground/60 bg-transparent outline-hidden"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-12 rounded-full bg-coral-500 hover:bg-coral-600 active:scale-[0.99] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-colors mt-2 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Search spaces</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default MobileSearchSheet;
