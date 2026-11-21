import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ArrowUpRight, ArrowRight } from "lucide-react";

interface CategoryDistribution {
  category: string;
  count: number;
  total: number;
}

const CATEGORY_STATS: CategoryDistribution[] = [
  { category: "Grand Wedding Halls", count: 210, total: 500 },
  { category: "Banquet & Dining Halls", count: 185, total: 500 },
  { category: "Resorts & Open-Air Lawns", count: 105, total: 500 },
];

export function BentoRow() {
  return (
    <section
      className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"
      aria-label="Features and spaces preview"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Card 1: Dark Warm Charcoal - Secure Payments */}
        <div className="bg-foreground text-card rounded-[24px] sm:rounded-[28px] p-6 sm:p-8 flex flex-col justify-between min-h-[300px] sm:min-h-[350px] shadow-sm">
          {/* Top: Icon */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/10 flex items-center justify-center text-white">
            <ShieldCheck className="w-5 h-5 text-coral-500" />
          </div>

          {/* Middle: Core Value Proposition */}
          <div className="space-y-2 sm:space-y-2.5 py-3 sm:py-4">
            <h3 className="font-serif text-xl sm:text-2xl md:text-[26px] font-bold leading-snug">
              Book instantly, pay securely. Advance now, balance later.
            </h3>
            <p className="text-xs sm:text-[13.5px] text-stone-300 font-normal leading-relaxed">
              Transparent payment protection with partial booking advances and verified host settlement terms across Kerala.
            </p>
          </div>

          {/* Bottom: Link */}
          <div>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-medium text-stone-300 hover:text-white transition-colors group"
            >
              <span>How booking works</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Card 2: Space Photo with Glass Pill linking to /venues */}
        <Link
          href="/venues"
          className="relative rounded-[24px] sm:rounded-[28px] overflow-hidden min-h-[290px] sm:min-h-[350px] flex items-end p-5 sm:p-7 shadow-sm group cursor-pointer block"
        >
          <Image
            src="/images/Sunset Dining Terrace Overlooking the Bay.png"
            alt="Scenic Kerala luxury event and banquet terrace"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Glass Pill Label */}
          <div className="relative z-10 w-full flex items-center justify-between">
            <div className="rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs sm:text-[13px] font-semibold px-4 py-2 shadow-xs inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-coral-500 animate-pulse" />
              <span>Weddings, banquets &amp; lawns</span>
            </div>
            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>

        {/* Card 3: Light - Spaces Metrics and Progress Rows */}
        <div className="bg-card border border-border rounded-[24px] sm:rounded-[28px] p-6 sm:p-8 flex flex-col justify-between min-h-[300px] sm:min-h-[350px] shadow-2xs md:col-span-2 lg:col-span-1">
          {/* Top: Big number and label */}
          <div className="flex items-start justify-between">
            <div>
              <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
                500+
              </span>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">
                Verified spaces listed
              </p>
            </div>
            <Link
              href="/venues"
              className="text-xs font-semibold text-coral-600 hover:text-coral-700 transition-colors inline-flex items-center gap-1 mt-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Middle: Divider */}
          <div className="border-t border-border my-3.5 sm:my-4" />

          {/* Bottom: Progress Rows with Dot Bars */}
          <div className="space-y-3 sm:space-y-3.5">
            {CATEGORY_STATS.map((item) => {
              const dotsCount = 5;
              const filledDots = Math.round((item.count / item.total) * dotsCount);

              return (
                <div key={item.category} className="space-y-1 sm:space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">
                      {item.category}
                    </span>
                    <span className="font-semibold text-muted-foreground">
                      {item.count} venues
                    </span>
                  </div>

                  {/* Dot bar indicator */}
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    {Array.from({ length: dotsCount }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          idx < filledDots ? "bg-coral-500" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

export default BentoRow;
