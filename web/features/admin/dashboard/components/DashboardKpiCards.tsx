"use client";

import {
  TrendingUp,
  IndianRupee,
  CalendarCheck,
  Building2,
  BadgePercent,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { DashboardSummary } from "../types/dashboard.types";

interface DashboardKpiCardsProps {
  data?: DashboardSummary;
  isLoading: boolean;
}

export function DashboardKpiCards({ data, isLoading }: DashboardKpiCardsProps) {
  const revenue = data?.revenue;
  const bookings = data?.bookings;
  const venues = data?.venues;

  const totalFees = revenue?.totalPlatformFees ?? 0;
  const totalGMV = revenue?.totalRevenue ?? 0;

  const cards = [
    {
      title: "Net Platform Commission",
      value: `₹${totalFees.toLocaleString()}`,
      badge: "8% Fee",
      badgeColor: "bg-[#65A982]/15 text-[#65A982] border-[#65A982]/30",
      description: "Net retained commission from bookings",
      icon: TrendingUp,
      iconColor: "text-[#65A982]",
      iconBg: "bg-[#65A982]/10 border-[#65A982]/20",
      accentBorder: "hover:border-[#65A982]/40",
      link: "/admin/bookings",
    },
    {
      title: "Gross Booking Volume (GMV)",
      value: `₹${totalGMV.toLocaleString()}`,
      badge: "Settled",
      badgeColor: "bg-[#D6B77A]/15 text-[#D6B77A] border-[#D6B77A]/30",
      description: "Lifetime transaction flow across venues",
      icon: IndianRupee,
      iconColor: "text-[#D6B77A]",
      iconBg: "bg-[#D6B77A]/10 border-[#D6B77A]/20",
      accentBorder: "hover:border-[#D6B77A]/40",
      link: "/admin/bookings",
    },
    {
      title: "Total Reservations",
      value: (bookings?.totalBooking ?? 0).toLocaleString(),
      badge: `${bookings?.active ?? 0} active`,
      badgeColor: "bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30",
      description: `${bookings?.completed ?? 0} completed • ${bookings?.cancelled ?? 0} cancelled`,
      icon: CalendarCheck,
      iconColor: "text-[#38BDF8]",
      iconBg: "bg-[#38BDF8]/10 border-[#38BDF8]/20",
      accentBorder: "hover:border-[#38BDF8]/40",
      link: "/admin/bookings",
    },
    {
      title: "Venue Catalog",
      value: (venues?.totalVenue ?? 0).toLocaleString(),
      badge: `${venues?.approved ?? 0} live`,
      badgeColor: "bg-[#A78BFA]/15 text-[#A78BFA] border-[#A78BFA]/30",
      description: `${venues?.pending ?? 0} awaiting moderation approval`,
      icon: Building2,
      iconColor: "text-[#A78BFA]",
      iconBg: "bg-[#A78BFA]/10 border-[#A78BFA]/20",
      accentBorder: "hover:border-[#A78BFA]/40",
      link: "/admin/venues",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Link
            key={card.title}
            href={card.link}
            className={`group relative flex flex-col justify-between rounded-xl border border-[#1a1a1a] bg-[#0c0c0c] p-4 text-left transition-all hover:bg-[#121212] ${card.accentBorder}`}
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
                <div className="h-8 w-24 animate-pulse rounded bg-[#1a1a1a]" />
              ) : (
                <span className="font-serif text-2xl font-bold tracking-tight text-[#F5F2EB] tabular-nums">
                  {card.value}
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

            <div className="mt-3 flex items-center justify-between border-t border-[#1a1a1a]/60 pt-2.5 text-[11px] text-[#737373]">
              <span className="truncate">{card.description}</span>
              <ArrowUpRight className="h-3 w-3 text-[#666666] group-hover:text-[#F5F2EB] transition-colors shrink-0" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

