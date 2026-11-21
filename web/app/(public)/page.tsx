import React from "react";
import { Hero } from "@/components/hero/Hero";
import { BentoRow } from "@/components/hero/BentoRow";
import { StatsRow } from "@/components/hero/StatsRow";

export default function LandingPage() {
  return (
    <div className="w-full bg-background min-h-screen">
      {/* 2. Hero Panel */}
      <Hero />

      {/* 4. Category Showcase Section */}
      {/* 5. Bento Row */}
      <BentoRow />

      {/* 6. Stats Row */}
      <StatsRow />
    </div>
  );
}
