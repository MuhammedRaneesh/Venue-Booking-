import React from "react";

export interface StatItem {
  value: string;
  label: string;
}

// TODO: Replace static numbers with real analytics metrics from backend endpoint
export const STATS_DATA: StatItem[] = [
  { value: "500+", label: "Spaces listed" },
  { value: "12,000+", label: "Bookings completed" },
  { value: "14", label: "Cities across Kerala" },
  { value: "98%", label: "Verified hosts" },
];

export function StatsRow() {
  return (
    <section
      className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 border-t border-border"
      aria-label="Platform metrics"
    >
      {/* Centered Heading */}
      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground text-center mb-10 sm:mb-14">
        Venuo in numbers
      </h2>

      {/* 4-Column Stats Grid (2 columns on mobile/tablet, 4 on desktop) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
        {STATS_DATA.map((stat) => (
          <div key={stat.label} className="space-y-1.5">
            <p className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              {stat.value}
            </p>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatsRow;
