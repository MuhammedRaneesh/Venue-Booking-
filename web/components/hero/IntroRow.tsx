import React from "react";

export function IntroRow() {
  return (
    <section
      className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col md:flex-row md:items-start justify-between gap-6 md:gap-12"
      aria-label="About Venuo overview"
    >
      {/* Left Column: Outlined Pill Label */}
      <div className="shrink-0 pt-1">
        <span className="inline-flex items-center rounded-full border border-border px-3.5 py-1 text-xs font-semibold text-foreground tracking-wider uppercase select-none">
          About Venuo
        </span>
      </div>

      {/* Right Column: Statement in Charcoal (at ~28px) */}
      <div className="max-w-4xl">
        <p className="font-serif text-2xl sm:text-[28px] text-foreground font-semibold leading-snug sm:leading-snug">
          Venuo is a marketplace for discovering and booking spaces for work,
          creativity, and celebration, with verified hosts and secure payments.
        </p>
      </div>
    </section>
  );
}

export default IntroRow;
