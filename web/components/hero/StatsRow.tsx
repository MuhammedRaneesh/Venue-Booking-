import React from "react";

export interface StatItem {
  value: string;
  label: string;
}

export const STATS_DATA: StatItem[] = [
  { value: "500+", label: "Venues across Kerala" },
  { value: "12,000+", label: "Celebrations hosted" },
  { value: "14", label: "Districts covered" },
  { value: "98%", label: "Host approval rate" },
];

export function StatsRow() {
  return (
    <section
      className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 border-t border-border/80"
      aria-label="Platform metrics"
    >
      {/* Centered Heading */}
      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground text-center mb-8 sm:mb-14">
        Venuo in numbers
      </h2>

      {/* 4-Column Stats Grid (2x2 on mobile, 4 on desktop) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
        {STATS_DATA.map((stat) => (
          <div
            key={stat.label}
            className="p-4 sm:p-6 rounded-2xl bg-card border border-border shadow-2xs hover:shadow-xs transition-shadow"
          >
            <p className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              {stat.value}
            </p>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatsRow;
