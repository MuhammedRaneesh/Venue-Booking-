"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

interface OwnerWelcomeBannerProps {
  hostName: string;
}

export function OwnerWelcomeBanner({ hostName }: OwnerWelcomeBannerProps) {
  return (
    <div className="rounded-3xl bg-white border border-[#EFECE8] p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1B18]">
            Welcome back, {hostName}
          </h1>
          <p className="text-[14px] text-[#6E645D]">
            Manage your venue listings, track guest bookings, and view earnings.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/onboarding/application"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-coral-600 hover:bg-coral-700 text-white text-[13.5px] font-medium shadow-xs transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Venue</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
