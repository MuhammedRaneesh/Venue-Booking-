"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ShieldCheck,
  CalendarCheck,
} from "lucide-react";

export function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden pt-4 pb-12 sm:pt-10 sm:pb-20 lg:pt-14 lg:pb-24"
      aria-label="Hero section"
    >
      {/* Soft warm ambient background glow for Kerala luxury celebration tone */}
      <div
        className="absolute top-1/4 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-coral-200/20 sm:bg-coral-200/25 rounded-full blur-3xl pointer-events-none -z-10 translate-x-1/4"
        aria-hidden="true"
      />
      <div
        className="absolute top-10 left-5 sm:left-10 w-[200px] sm:w-[320px] h-[200px] sm:h-[320px] bg-coral-100/25 sm:bg-coral-100/30 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Editorial Headline, Subtitle, CTAs and Trust badges */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-coral-100/70 border border-coral-200/60 text-[11.5px] sm:text-[13px] font-medium text-coral-700 w-fit mb-4 sm:mb-5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-coral-500 animate-pulse" />
              <span>Kerala&apos;s venue booking platform</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-[32px] xs:text-[36px] sm:text-5xl lg:text-[56px] xl:text-[62px] font-bold text-foreground leading-[1.14] sm:leading-[1.12] tracking-tight">
              Find the perfect venue <br className="hidden sm:inline" />
              for every celebration
            </h1>

            {/* Subtitle */}
            <p className="mt-3 sm:mt-5 text-[14.5px] sm:text-lg text-muted-foreground leading-relaxed max-w-xl font-normal">
              Discover verified wedding halls, banquet halls and event spaces
              across Kerala. Request, get approved, and pay securely, all in one
              place.
            </p>

            {/* Interactive Action Buttons (full-width on mobile, auto on tablet/desktop) */}
            <div className="mt-6 sm:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Link
                href="/venues"
                className="h-12 sm:h-[52px] px-6 sm:px-8 rounded-full bg-coral-500 hover:bg-coral-600 active:bg-coral-700 text-white font-medium text-[14.5px] sm:text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-coral-500/25 hover:shadow-coral-500/35 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] group w-full sm:w-auto"
              >
                <span>Browse venues</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/onboarding/application"
                className="h-12 sm:h-[52px] px-6 sm:px-8 rounded-full bg-card hover:bg-muted text-foreground border border-border hover:border-coral-300 font-medium text-[14.5px] sm:text-[15px] flex items-center justify-center shadow-xs hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] w-full sm:w-auto"
              >
                <span>List your venue</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-7 sm:mt-12 pt-4 sm:pt-6 border-t border-border/60 flex flex-wrap items-center gap-x-5 gap-y-2.5 sm:gap-8">
              <div className="flex items-center gap-2 text-[12.5px] sm:text-[13.5px] font-medium text-foreground/85">
                <span className="w-5 h-5 rounded-full bg-coral-100/90 text-coral-600 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
                <span>Verified venues</span>
              </div>

              <div className="flex items-center gap-2 text-[12.5px] sm:text-[13.5px] font-medium text-foreground/85">
                <span className="w-5 h-5 rounded-full bg-coral-100/90 text-coral-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
                <span>Secure payments</span>
              </div>

              <div className="flex items-center gap-2 text-[12.5px] sm:text-[13.5px] font-medium text-foreground/85">
                <span className="w-5 h-5 rounded-full bg-coral-100/90 text-coral-600 flex items-center justify-center shrink-0">
                  <CalendarCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
                <span>Easy cancellation</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Venue Showcase (clean, responsive aspect ratio) */}
          <div className="lg:col-span-6 xl:col-span-6 relative flex items-center justify-center mt-2 sm:mt-4 lg:mt-0">
            {/* Main Rounded Image Container */}
            <div className="relative w-full max-w-[580px] aspect-[4/3] rounded-[22px] sm:rounded-[34px] lg:rounded-[38px] overflow-hidden shadow-xl sm:shadow-2xl shadow-stone-900/10 border-2 sm:border-4 border-card/90 bg-muted">
              <Image
                src="/images/kerala-grand-venue.jpg"
                alt="Grand Kerala traditional wedding hall decorated with warm chandeliers and floral mandap"
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 580px"
                className="object-cover object-center transform hover:scale-[1.02] transition-transform duration-700 ease-out"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
