"use client";

import { useState } from "react";
import { TrendingUp, IndianRupee, Layers } from "lucide-react";
import { MonthlyStat } from "../types/dashboard.types";

interface RevenueTrendsChartProps {
  monthlyStats?: MonthlyStat[];
  isLoading: boolean;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export function RevenueTrendsChart({
  monthlyStats = [],
  isLoading,
}: RevenueTrendsChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // If monthlyStats is empty, create realistic mock fallback placeholder months so the chart always displays a polished timeline
  const now = new Date();
  const processedData: {
    label: string;
    revenue: number;
    platformFees: number;
    count: number;
  }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const yr = d.getFullYear();
    const mo = d.getMonth() + 1;
    const label = `${MONTH_NAMES[d.getMonth()]} ${String(yr).slice(-2)}`;

    const match = monthlyStats.find(
      (m) => m._id.year === yr && m._id.month === mo
    );

    processedData.push({
      label,
      revenue: match?.totalRevenue ?? 0,
      platformFees: match?.platformFees ?? 0,
      count: match?.bookingsCount ?? 0,
    });
  }

  const maxRevenue = Math.max(...processedData.map((d) => d.revenue), 10000);

  return (
    <div className="rounded-xl border border-[#1a1a1a] bg-[#0c0c0c] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#1a1a1a] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md border border-[#65A982]/20 bg-[#65A982]/10 text-[#65A982]">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
            <h2 className="font-serif text-base font-bold text-[#F5F2EB]">
              Revenue & Commission Trajectory
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-[#737373]">
            6-month gross transaction settlement & net platform earnings
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-[#888888]">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#D6B77A]" />
            <span>Gross Volume</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#65A982]" />
            <span>Platform Fee (8%)</span>
          </div>
        </div>
      </div>

      {/* Chart visualization viewport */}
      <div className="mt-6">
        {isLoading ? (
          <div className="h-48 w-full animate-pulse rounded-lg bg-[#141414]" />
        ) : (
          <div className="space-y-4">
            {/* Bar columns */}
            <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-44 pt-6 pb-2 border-b border-[#1f1f1f]">
              {processedData.map((item, idx) => {
                const heightPercent = Math.max(
                  (item.revenue / maxRevenue) * 100,
                  6
                );
                const feePercent = Math.max(
                  (item.platformFees / maxRevenue) * 100,
                  3
                );
                const isHovered = hoveredIdx === idx;

                return (
                  <div
                    key={item.label}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className="relative flex flex-col items-center justify-end h-full group cursor-pointer"
                  >
                    {/* Tooltip on hover */}
                    {isHovered && (
                      <div className="absolute -top-14 z-30 flex flex-col items-center rounded-lg border border-[#2a2a2a] bg-[#161616] px-2.5 py-1.5 text-[10px] text-[#F5F2EB] shadow-xl whitespace-nowrap animate-in fade-in duration-100">
                        <span className="font-semibold text-[#D6B77A]">
                          ₹{item.revenue.toLocaleString()} Volume
                        </span>
                        <span className="text-[#65A982]">
                          + ₹{item.platformFees.toLocaleString()} Fee ({item.count} bookings)
                        </span>
                      </div>
                    )}

                    {/* Bars Container */}
                    <div className="w-full max-w-[36px] flex items-end justify-center gap-1 h-full">
                      {/* GMV Bar */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-1/2 rounded-t-md transition-all duration-200 ${
                          isHovered
                            ? "bg-[#D6B77A] shadow-md shadow-[#D6B77A]/20"
                            : "bg-[#D6B77A]/80 hover:bg-[#D6B77A]"
                        }`}
                      />
                      {/* Platform Fee Bar */}
                      <div
                        style={{ height: `${feePercent}%` }}
                        className={`w-1/2 rounded-t-md transition-all duration-200 ${
                          isHovered
                            ? "bg-[#65A982] shadow-md shadow-[#65A982]/20"
                            : "bg-[#65A982]/80 hover:bg-[#65A982]"
                        }`}
                      />
                    </div>

                    {/* Month label */}
                    <span
                      className={`mt-2 text-[10px] font-medium transition-colors ${
                        isHovered ? "text-[#F5F2EB]" : "text-[#737373]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Quick Summary Pill Row */}
            <div className="flex flex-wrap items-center justify-between text-xs text-[#888888] pt-1">
              <span>Timeline: Last 6 calendar months</span>
              <div className="flex items-center gap-1 font-serif text-[#F5F2EB]">
                <IndianRupee className="h-3 w-3 text-[#D6B77A]" />
                <span>
                  Avg Month: ₹
                  {Math.round(
                    processedData.reduce((acc, d) => acc + d.revenue, 0) /
                      (processedData.length || 1)
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

