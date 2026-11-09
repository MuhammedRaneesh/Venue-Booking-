"use client";

import { Calendar, RotateCw } from "lucide-react";
import { DashboardPeriod } from "../types/dashboard.types";

interface DashboardHeaderProps {
  period: DashboardPeriod;
  onPeriodChange: (period: DashboardPeriod) => void;
  onRefresh: () => void;
  isFetching?: boolean;
}

export function DashboardHeader({
  period,
  onPeriodChange,
  onRefresh,
  isFetching,
}: DashboardHeaderProps) {
  const periods: { label: string; value: DashboardPeriod }[] = [
    { label: "All Time", value: "all" },
    { label: "This Year", value: "this_year" },
    { label: "This Month", value: "this_month" },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1a1a1a] pb-5">
      <div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#F5F2EB]">
          Executive Dashboard
        </h1>
        <p className="mt-1 text-xs text-[#888888]">
          Real-time platform performance, commission ledger, and live operations.
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Period Selector Segmented Tabs */}
        <div className="flex items-center rounded-xl border border-[#222222] bg-[#0c0c0c] p-1 text-xs">
          {periods.map((p) => {
            const isActive = period === p.value;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => onPeriodChange(p.value)}
                className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
                  isActive
                    ? "bg-[#1f1f1f] text-[#F5F2EB] shadow-xs"
                    : "text-[#888888] hover:text-[#D4D4D4]"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isFetching}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#222222] bg-[#0c0c0c] text-[#A3A3A3] hover:border-[#333333] hover:text-[#F5F2EB] disabled:opacity-50 transition-colors"
          aria-label="Refresh dashboard data"
        >
          <RotateCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}

