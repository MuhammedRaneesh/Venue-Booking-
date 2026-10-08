"use client";

import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { HeroSearchBar } from "./HeroSearchBar";
import { MobileSearchSheet } from "./MobileSearchSheet";

export function Hero() {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <>
      {/* Aligned container matching the exact navbar horizontal grid */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 my-2 sm:my-4">
        <section
          className="relative rounded-[24px] overflow-hidden min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex flex-col justify-center items-center px-4 sm:px-8 py-16 sm:py-20 text-center shadow-sm"
          aria-label="Hero section"
        >
          {/* Fixed Single Background Image: Hilltop Village Overlooking a Blue Lake */}
          <div className="absolute inset-0" aria-hidden="true">
            <Image
              src="/images/Hilltop Village Overlooking a Blue Lake.png"
              alt="Panoramic hilltop village overlooking a tranquil blue lake and mountains"
              fill
              priority
              sizes="(max-width: 1536px) 100vw, 1400px"
              className="object-cover object-center"
            />
            {/* Soft dark gradient overlay for optimal text legibility and contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
          </div>

          {/* Centered Editorial Content */}
          <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[58px] font-bold tracking-tight text-white leading-[1.14] drop-shadow-md">
              Find a space that fits the{" "}
              <span className="text-coral-500 italic font-serif">moment.</span>
            </h1>

            {/* Subtitle with refined typography and breathing room */}
            <p className="mt-4 sm:mt-5 text-base sm:text-lg lg:text-[19px] text-white/95 font-normal leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
              From boutique cafés and creative studios to meeting rooms and event halls,
              discover and book exceptional spaces.
            </p>

            {/* Desktop Search Bar (positioned lower down with comfortable spacing) */}
            <div className="hidden sm:block mt-10 sm:mt-14 w-full">
              <HeroSearchBar />
            </div>

            {/* Mobile Search Button Trigger */}
            <div className="sm:hidden mt-8 w-full max-w-md">
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(true)}
                className="w-full h-12 rounded-full bg-white/95 backdrop-blur-md text-foreground font-medium text-sm flex items-center justify-between px-5 shadow-lg border border-white/40"
                aria-label="Open space search"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Search className="w-4 h-4 text-coral-500" />
                  <span>Where would you like to host?</span>
                </div>
                <span className="px-3.5 py-1 bg-coral-500 text-white rounded-full text-xs font-semibold shadow-xs">
                  Search
                </span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile Search Bottom Sheet */}
      <MobileSearchSheet
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
      />
    </>
  );
}

export default Hero;
