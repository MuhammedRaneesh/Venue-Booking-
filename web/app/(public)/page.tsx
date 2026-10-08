import React from "react";
import { Hero } from "@/components/hero/Hero";
import { IntroRow } from "@/components/hero/IntroRow";
import { BentoRow } from "@/components/hero/BentoRow";
import { StatsRow } from "@/components/hero/StatsRow";

export default function LandingPage() {
  return (
    <div className="w-full bg-background min-h-screen">
      {/* 2. Hero Panel */}
      <Hero />

      {/* 3. Intro Row */}
      <IntroRow />

      {/* 4. Bento Row */}
      <BentoRow />

      {/* 5. Stats Row */}
      <StatsRow />
    </div>
  );
}
