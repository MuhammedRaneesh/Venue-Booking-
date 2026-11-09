"use client";

import { Clock, CheckCircle2, XCircle, FileText } from "lucide-react";
import { OwnerApplicationStatus } from "../types/application.types";
import { useOwnerApplicationStats } from "../hooks/useApplications";

interface ApplicationStatsCardsProps {
  currentStatus?: OwnerApplicationStatus;
  onSelectStatus: (status?: OwnerApplicationStatus) => void;
}

export function ApplicationStatsCards({
  currentStatus,
  onSelectStatus,
}: ApplicationStatsCardsProps) {
  const { data: stats, isLoading } = useOwnerApplicationStats();

  const cards = [
    {
      title: "Pending Review",
      count: stats?.pending ?? 0,
      description: "Awaiting KYC evaluation",
      icon: Clock,
      status: "PENDING" as OwnerApplicationStatus,
      iconColor: "text-[#D9A441]",
      iconBg: "bg-[#D9A441]/10 border-[#D9A441]/20",
      accentBorder: "hover:border-[#D9A441]/40",
      activeRing: currentStatus === "PENDING" ? "border-[#D9A441] bg-[#141008]" : "",
      badge: (stats?.pending ?? 0) > 0 ? "Action needed" : undefined,
      badgeColor: "bg-[#D9A441]/15 text-[#D9A441] border-[#D9A441]/30",
    },
    {
      title: "Approved Hosts",
      count: stats?.approved ?? 0,
      description: "Verified venue partners",
      icon: CheckCircle2,
      status: "APPROVED" as OwnerApplicationStatus,
      iconColor: "text-[#65A982]",
      iconBg: "bg-[#65A982]/10 border-[#65A982]/20",
      accentBorder: "hover:border-[#65A982]/40",
      activeRing: currentStatus === "APPROVED" ? "border-[#65A982] bg-[#09140e]" : "",
    },
    {
      title: "Rejected",
      count: stats?.rejected ?? 0,
      description: "Declined or ineligible",
      icon: XCircle,
      status: "REJECTED" as OwnerApplicationStatus,
      iconColor: "text-[#D16B6B]",
      iconBg: "bg-[#D16B6B]/10 border-[#D16B6B]/20",
      accentBorder: "hover:border-[#D16B6B]/40",
      activeRing: currentStatus === "REJECTED" ? "border-[#D16B6B] bg-[#140b0b]" : "",
    },
    {
      title: "Total Submissions",
      count: stats?.total ?? 0,
      description: "Lifetime registrations",
      icon: FileText,
      status: undefined,
      iconColor: "text-[#D6B77A]",
      iconBg: "bg-[#D6B77A]/10 border-[#D6B77A]/20",
      accentBorder: "hover:border-[#D6B77A]/40",
      activeRing: currentStatus === undefined ? "border-[#D6B77A]/50 bg-[#12100a]" : "",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isCurrentActive =
          card.status === undefined
            ? currentStatus === undefined
            : currentStatus === card.status;

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

              {card.badge && !isLoading && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${card.badgeColor}`}
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#D9A441]" />
                  {card.badge}
                </span>
              )}
            </div>

            <p className="mt-1 text-[11px] text-[#666666] truncate">
              {card.description}
            </p>

            {isCurrentActive && (
              <span className="absolute bottom-0 left-4 right-4 h-[2px] rounded-t-full bg-current opacity-70" />
            )}
          </button>
        );
      })}
    </div>
  );
}

