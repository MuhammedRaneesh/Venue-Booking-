"use client";

import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  XCircle,
  IndianRupee,
  TrendingUp,
} from "lucide-react";
import { BookingStatus } from "../types/booking.types";
import { useBookingStats } from "../hooks/useBookings";

interface BookingsStatsCardsProps {
  currentStatus?: BookingStatus;
  onSelectStatus: (status?: BookingStatus) => void;
}

export function BookingsStatsCards({
  currentStatus,
  onSelectStatus,
}: BookingsStatsCardsProps) {
  const { data: stats, isLoading } = useBookingStats();

  const totalRevenue = stats?.totalRevenue ?? 0;
  const platformFees = stats?.totalPlatformFees ?? 0;

  const cards = [
    {
      title: "Total Bookings",
      count: stats?.total ?? 0,
      description: "All lifetime reservations",
      icon: CalendarCheck,
      status: undefined,
      iconColor: "text-[#D6B77A]",
      iconBg: "bg-[#D6B77A]/10 border-[#D6B77A]/20",
      accentBorder: "hover:border-[#D6B77A]/40",
      activeRing:
        currentStatus === undefined
          ? "border-[#D6B77A]/60 bg-[#12100a]"
          : "",
    },
    {
      title: "Gross Volume & Fees",
      count: totalRevenue,
      isCurrency: true,
      description: `₹${platformFees.toLocaleString()} net commission (8%)`,
      icon: TrendingUp,
      status: undefined,
      iconColor: "text-[#65A982]",
      iconBg: "bg-[#65A982]/10 border-[#65A982]/20",
      accentBorder: "hover:border-[#65A982]/40",
      activeRing: "",
      badge: "8% Fee",
      badgeColor: "bg-[#65A982]/15 text-[#65A982] border-[#65A982]/30",
    },
    {
      title: "Pending Approval",
      count: stats?.pending ?? 0,
      description: "Awaiting host / admin confirmation",
      icon: Clock,
      status: "pending" as BookingStatus,
      iconColor: "text-[#D9A441]",
      iconBg: "bg-[#D9A441]/10 border-[#D9A441]/20",
      accentBorder: "hover:border-[#D9A441]/40",
      activeRing:
        currentStatus === "pending"
          ? "border-[#D9A441] bg-[#141008]"
          : "",
      badge: (stats?.pending ?? 0) > 0 ? "Action needed" : undefined,
      badgeColor: "bg-[#D9A441]/15 text-[#D9A441] border-[#D9A441]/30",
    },
    {
      title: "Confirmed & Active",
      count: (stats?.approved ?? 0) + (stats?.completed ?? 0),
      description: "Approved & completed events",
      icon: CheckCircle2,
      status: "approved" as BookingStatus,
      iconColor: "text-[#65A982]",
      iconBg: "bg-[#65A982]/10 border-[#65A982]/20",
      accentBorder: "hover:border-[#65A982]/40",
      activeRing:
        currentStatus === "approved" || currentStatus === "completed"
          ? "border-[#65A982] bg-[#09140e]"
          : "",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isCurrentActive =
          card.status !== undefined && currentStatus === card.status;

        return (
          <button
            key={card.title}
            type="button"
            onClick={() => {
              if (card.status !== undefined) {
                onSelectStatus(card.status);
              } else if (card.title === "Total Bookings") {
                onSelectStatus(undefined);
              }
            }}
            className={`group relative flex flex-col justify-between rounded-xl border border-[#1a1a1a] bg-[#0c0c0c] p-4 text-left transition-all hover:bg-[#121212] ${card.accentBorder} ${card.activeRing}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-[#888888] group-hover:text-[#A3A3A3] transition-colors">
                {card.title}
              </span>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg border ${card.iconBg} ${card.iconColor} shrink-0`}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between gap-2">
              {isLoading ? (
                <div className="h-7 w-20 animate-pulse rounded bg-[#1a1a1a]" />
              ) : (
                <span className="font-serif text-2xl font-bold tracking-tight text-[#F5F2EB] tabular-nums">
                  {card.isCurrency ? (
                    <span className="inline-flex items-center">
                      <span className="text-lg mr-0.5 text-[#65A982]">₹</span>
                      {card.count.toLocaleString()}
                    </span>
                  ) : (
                    card.count.toLocaleString()
                  )}
                </span>
              )}
              {card.badge && (
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${card.badgeColor}`}
                >
                  {card.badge}
                </span>
              )}
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-[#1a1a1a]/60 pt-2 text-[11px] text-[#666666]">
              <span>{card.description}</span>
              {isCurrentActive && (
                <span className="font-medium text-[#D6B77A]">Active filter</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

