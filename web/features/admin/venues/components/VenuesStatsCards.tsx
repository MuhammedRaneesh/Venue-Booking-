"use client";

import { Building2, CheckCircle2, Clock, XCircle } from "lucide-react";
import { VenueStatus } from "../types/venue.types";
import { useVenueStats } from "../hooks/useVenues";

interface VenuesStatsCardsProps {
  currentStatus?: VenueStatus;
  onSelectStatus: (status?: VenueStatus) => void;
}

export function VenuesStatsCards({
  currentStatus,
  onSelectStatus,
}: VenuesStatsCardsProps) {
  const { data: stats, isLoading } = useVenueStats();

  const rejectedCount = (stats?.rejected ?? 0) + (stats?.suspended ?? 0);

  const cards = [
    {
      title: "Total Venues",
      count: stats?.total ?? 0,
      description: "All registered properties",
      icon: Building2,
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
      title: "Approved Listings",
      count: stats?.approved ?? 0,
      description: "Live on marketplace",
      icon: CheckCircle2,
      status: "approved" as VenueStatus,
      iconColor: "text-[#65A982]",
      iconBg: "bg-[#65A982]/10 border-[#65A982]/20",
      accentBorder: "hover:border-[#65A982]/40",
      activeRing:
        currentStatus === "approved"
          ? "border-[#65A982] bg-[#09140e]"
          : "",
    },
    {
      title: "Pending Approval",
      count: stats?.pending ?? 0,
      description: "Awaiting admin curation",
      icon: Clock,
      status: "pending" as VenueStatus,
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
      title: "Rejected & Suspended",
      count: rejectedCount,
      description: "Declined or suspended",
      icon: XCircle,
      status: "rejected" as VenueStatus,
      iconColor: "text-[#D16B6B]",
      iconBg: "bg-[#D16B6B]/10 border-[#D16B6B]/20",
      accentBorder: "hover:border-[#D16B6B]/40",
      activeRing:
        currentStatus === "rejected" || currentStatus === "suspended"
          ? "border-[#D16B6B] bg-[#140b0b]"
          : "",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isCurrentActive =
          card.status === undefined
            ? currentStatus === undefined
            : currentStatus === card.status ||
              (card.status === "rejected" && currentStatus === "suspended");

        return (
          <button
            key={card.title}
            type="button"
            onClick={() => onSelectStatus(card.status)}
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
                <div className="h-7 w-16 animate-pulse rounded bg-[#1a1a1a]" />
              ) : (
                <span className="font-serif text-2xl font-bold tracking-tight text-[#F5F2EB] tabular-nums">
                  {card.count.toLocaleString()}
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

