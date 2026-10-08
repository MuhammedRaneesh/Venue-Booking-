import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ArrowUpRight } from "lucide-react";

// TODO: Replace placeholder category distribution metrics with live backend analytics
interface CategoryDistribution {
  category: string;
  count: number;
  total: number;
}

const CATEGORY_STATS: CategoryDistribution[] = [
  { category: "Boutique Cafés", count: 140, total: 500 },
  { category: "Creative Studios", count: 195, total: 500 },
  { category: "Event & Banquet Halls", count: 165, total: 500 },
];

export function BentoRow() {
  return (
    <section
      className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
      aria-label="Features and spaces preview"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        
        {/* Card 1: Dark Charcoal - Secure Payments */}
        <div className="bg-foreground text-background rounded-[24px] p-7 sm:p-8 flex flex-col justify-between min-h-[320px] sm:min-h-[340px] shadow-sm">
          {/* Top: Icon */}
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
            <ShieldCheck className="w-5 h-5 text-coral-500" />
          </div>

          {/* Middle: Core Value Proposition */}
          <div className="space-y-2 py-4">
            <h3 className="font-serif text-2xl sm:text-[26px] font-bold leading-snug">
              Book instantly, pay securely. Advance now, balance later.
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed">
              Transparent payment protection with partial advances and flexible settlement terms.
            </p>
          </div>

          {/* Bottom: Link */}
          <div>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-300 hover:text-white transition-colors group"
            >
              <span>How payments work</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Card 2: Space Photo with Glass Pill */}
        <div className="relative rounded-[24px] overflow-hidden min-h-[320px] sm:min-h-[340px] flex items-end p-6 sm:p-7 shadow-sm group">
          <Image
            src="/images/Sunset Dining Terrace Overlooking the Bay.png"
            alt="Scenic dining terrace overlooking the waterside"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

          {/* Glass Pill Label */}
          <div className="relative z-10">
            <div className="rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs sm:text-sm font-semibold px-4.5 py-2 shadow-xs inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-coral-500 animate-pulse" />
              <span>Cafés, studios, halls and more</span>
            </div>
          </div>
        </div>

        {/* Card 3: Light - Spaces Metrics and Progress Rows */}
        <div className="bg-muted/50 border border-border rounded-[24px] p-7 sm:p-8 flex flex-col justify-between min-h-[320px] sm:min-h-[340px] shadow-sm md:col-span-2 lg:col-span-1">
          {/* Top: Big number and label */}
          <div>
            {/* TODO: Replace placeholder 500+ with dynamic total spaces API count */}
            <span className="font-serif text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
              500+
            </span>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">
              Spaces listed
            </p>
          </div>

          {/* Middle: Divider */}
          <div className="border-t border-border/80 my-4" />

          {/* Bottom: Progress Rows with Dot Bars */}
          <div className="space-y-3.5">
            {CATEGORY_STATS.map((item) => {
              const dotsCount = 5;
              const filledDots = Math.round((item.count / item.total) * dotsCount);

              return (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">
                      {item.category}
                    </span>
                    <span className="font-semibold text-muted-foreground">
                      {item.count} spaces
                    </span>
                  </div>

                  {/* Dot bar indicator */}
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    {Array.from({ length: dotsCount }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          idx < filledDots ? "bg-coral-500" : "bg-border"
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
