"use client";

import { useState } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { ActionRequiredStrip } from "./ActionRequiredStrip";
import { DashboardKpiCards } from "./DashboardKpiCards";
import { RevenueTrendsChart } from "./RevenueTrendsChart";
import { RecentBookingsFeed } from "./RecentBookingsFeed";
import { QuickActionsCard } from "./QuickActionsCard";
import { useDashboardSummary } from "../hooks/useDashboard";
import { DashboardPeriod } from "../types/dashboard.types";
import { AlertTriangle } from "lucide-react";

export function DashboardView() {
  const [period, setPeriod] = useState<DashboardPeriod>("all");

  const { data, isLoading, isError, refetch, isFetching } =
    useDashboardSummary(period);

  return (
    <div className="space-y-6">
      {/* Header with Period Switcher */}
      <DashboardHeader
        period={period}
        onPeriodChange={(newPeriod) => setPeriod(newPeriod)}
        onRefresh={() => refetch()}
        isFetching={isFetching}
      />

      {/* Error Banner if fetch fails */}
      {isError && (
        <div className="rounded-xl border border-[#D16B6B]/30 bg-[#D16B6B]/10 p-4 text-xs text-[#F5F2EB] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#D16B6B]">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              Failed to load real-time platform analytics. Please verify your connection or retry.
            </span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg border border-[#D16B6B]/40 bg-[#D16B6B]/20 px-3 py-1 text-xs font-medium text-[#F5F2EB] hover:bg-[#D16B6B]/30 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Action Required Queue Strip */}
      <ActionRequiredStrip data={data} />

      {/* KPI Cards Grid */}
      <DashboardKpiCards data={data} isLoading={isLoading} />

      {/* Trajectory / Trends Chart */}
      <RevenueTrendsChart
        monthlyStats={data?.monthlyStats}
        isLoading={isLoading}
      />

      {/* Two-Column Grid: Recent Bookings Feed + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <RecentBookingsFeed
          recentBookings={data?.recentBookings}
          isLoading={isLoading}
        />
        <QuickActionsCard data={data} isLoading={isLoading} />
      </div>
    </div>
  );
}

