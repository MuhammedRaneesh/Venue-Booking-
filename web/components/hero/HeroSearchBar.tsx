"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, MapPin, Calendar, Users, Search } from "lucide-react";

export function HeroSearchBar() {
  const router = useRouter();
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (type.trim()) params.set("type", type.trim());
    if (location.trim()) params.set("location", location.trim());
    if (date.trim()) params.set("date", date.trim());
    if (guests.trim()) params.set("guests", guests.trim());

    const queryString = params.toString();
    router.push(queryString ? `/venues?${queryString}` : "/venues");
  };

  // Format date display nicely without showing raw browser mm/dd/yyyy
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-[860px] mx-auto bg-white rounded-full p-2 shadow-[0_16px_45px_rgba(0,0,0,0.25)] border border-white/60 transition-all duration-200 select-none"
      aria-label="Search available spaces"
    >
      <div className="flex items-center">
        {/* Cell 1: What */}
        <div className="flex-1 px-4 py-1.5 text-left min-w-0 rounded-full hover:bg-neutral-100/70 transition-colors group cursor-pointer">
          <label
            htmlFor="hero-search-what"
            className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-coral-500" />
            <span>What</span>
          </label>
          <input
            id="hero-search-what"
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Café, studio, hall..."
            className="w-full text-xs sm:text-[14px] font-medium text-neutral-900 placeholder:text-neutral-400/80 bg-transparent outline-none truncate"
          />
        </div>

        {/* Divider */}
        <div className="h-7 w-px bg-neutral-200/90 shrink-0" aria-hidden="true" />

        {/* Cell 2: Where */}
        <div className="flex-1 px-4 py-1.5 text-left min-w-0 rounded-full hover:bg-neutral-100/70 transition-colors group cursor-pointer">
          <label
            htmlFor="hero-search-where"
            className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-coral-500" />
            <span>Where</span>
          </label>
          <input
            id="hero-search-where"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City or neighborhood"
            className="w-full text-xs sm:text-[14px] font-medium text-neutral-900 placeholder:text-neutral-400/80 bg-transparent outline-none truncate"
          />
        </div>

        {/* Divider */}
        <div className="h-7 w-px bg-neutral-200/90 shrink-0" aria-hidden="true" />

        {/* Cell 3: When (Clean custom formatted display with seamless date picker) */}
        <div className="relative flex-1 px-4 py-1.5 text-left min-w-0 rounded-full hover:bg-neutral-100/70 transition-colors group cursor-pointer">
          <label
            htmlFor="hero-search-when"
            className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-coral-500" />
            <span>When</span>
          </label>
          <div className="text-xs sm:text-[14px] font-medium text-neutral-900 truncate">
            {formattedDate ? (
              <span className="text-neutral-900 font-semibold">{formattedDate}</span>
            ) : (
              <span className="text-neutral-400/80">Select date</span>
            )}
          </div>
          <input
            id="hero-search-when"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            aria-label="Select booking date"
          />
        </div>

        {/* Divider */}
        <div className="h-7 w-px bg-neutral-200/90 shrink-0" aria-hidden="true" />

        {/* Cell 4: Guests */}
        <div className="flex-1 px-4 py-1.5 text-left min-w-0 rounded-full hover:bg-neutral-100/70 transition-colors group cursor-pointer">
          <label
            htmlFor="hero-search-guests"
            className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-coral-500" />
            <span>Guests</span>
          </label>
          <input
            id="hero-search-guests"
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            placeholder="Add guests"
            className="w-full text-xs sm:text-[14px] font-medium text-neutral-900 placeholder:text-neutral-400/80 bg-transparent outline-none"
          />
        </div>

        {/* Coral Search Button */}
        <div className="pl-1 pr-1 shrink-0">
          <button
            type="submit"
            className="h-11 sm:h-12 px-6 sm:px-7 rounded-full bg-coral-500 hover:bg-coral-600 active:scale-95 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(250,90,85,0.35)] transition-all duration-150 cursor-pointer"
            aria-label="Search available spaces"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </div>
    </form>
  );
}

export default HeroSearchBar;
