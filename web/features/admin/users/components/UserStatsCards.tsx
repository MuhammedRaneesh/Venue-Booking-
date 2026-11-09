"use client";

import { Users, UserCheck, UserX, Building2 } from "lucide-react";
import { useUserStats } from "../hooks/useUsers";

export function UserStatsCards() {
  const { data: stats, isLoading, isError } = useUserStats();

  const cards = [
    {
      title: "Total Members",
      value: stats?.total ?? 0,
      description: "Non-admin registered accounts",
      icon: Users,
      accent: "text-[#F5F2EB]",
      badge: "Platform",
      badgeColor: "bg-[#1f1f1f] text-[#A3A3A3] border-[#2e2e2e]",
    },
    {
      title: "Active Accounts",
      value: stats?.active ?? 0,
      description: "In good standing & enabled",
      icon: UserCheck,
      accent: "text-[#65A982]",
      badge: "Healthy",
      badgeColor: "bg-[#65A982]/10 text-[#65A982] border-[#65A982]/25",
    },
    {
      title: "Suspended",
      value: stats?.blocked ?? 0,
      description: "Blocked from platform access",
      icon: UserX,
      accent: "text-[#D16B6B]",
      badge: "Restricted",
      badgeColor: "bg-[#D16B6B]/10 text-[#D16B6B] border-[#D16B6B]/25",
    },
    {
      title: "Venue Owners",
      value: stats?.venueOwners ?? 0,
      description: "Approved listing hosts",
      icon: Building2,
      accent: "text-[#D6B77A]",
      badge: "Hosts",
      badgeColor: "bg-[#D6B77A]/10 text-[#D6B77A] border-[#D6B77A]/25",
    },
  ];

  if (isError) {
    return (
      <div className="rounded-xl border border-[#2e1d1d] bg-[#140b0b] p-4 text-xs text-[#D16B6B]">
        Unable to load user metrics. Please ensure backend services are active.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="group relative overflow-hidden rounded-xl border border-[#1a1a1a] bg-[#0c0c0c] p-4 sm:p-5 transition-all duration-150 hover:border-[#2a2a2a] hover:bg-[#0f0f0f]"
          >
            {/* Subtle glow effect on hover */}
            <div
              className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#D6B77A]/5 blur-xl transition-opacity group-hover:opacity-100 opacity-0"
              aria-hidden="true"
            />

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#888888]">
                {card.title}
              </span>
              <span
                className={`rounded border px-1.5 py-0.5 text-[10px] font-medium tracking-wide ${card.badgeColor}`}
              >
                {card.badge}
              </span>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              {isLoading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-[#1a1a1a]" />
              ) : (
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F2EB] tabular-nums">
                  {card.value.toLocaleString()}
                </span>
              )}

              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1f1f1f] bg-[#141414] text-[#A3A3A3] group-hover:border-[#333333]">
                <Icon className={`h-4 w-4 ${card.accent}`} />
              </div>
            </div>

            <p className="mt-2 text-[11px] text-[#666666] truncate">
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

