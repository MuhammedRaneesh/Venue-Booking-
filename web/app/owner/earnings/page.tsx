"use client";

import React from "react";
import { useOwnerDashboardSummary } from "@/features/owner/Dashbored/hooks/useOwnerDashboard";

export default function OwnerEarningsPage() {
  const { data: summary } = useOwnerDashboardSummary();
  const totalEarnings = summary?.totalEarnings ?? 0;
  const netEarnings = Math.round(totalEarnings * 0.92);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1B18]">
          Earnings
        </h1>
        <p className="text-[14px] text-[#7A7169] mt-1">
          Revenue, platform fees, and host payouts
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="rounded-2xl bg-white border border-[#EFECE8] p-5 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7A7169]">
            Total Gross Revenue
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-[#1E1B18] mt-2">
            ₹{totalEarnings.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-[#7A7169] mt-1">
            All-time completed reservations
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-[#EFECE8] p-5 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7A7169]">
            Net Host Payout (92%)
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-coral-700 mt-2">
            ₹{netEarnings.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-[#7A7169] mt-1">
            After 8% standard platform service fee
          </p>
        </div>
      </div>
    </div>
  );
}
