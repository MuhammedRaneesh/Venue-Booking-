"use client";

import { Layers, Sparkles, EyeOff } from "lucide-react";
import { Category } from "../types/category.types";

interface CategoryStatsCardsProps {
  categories?: Category[];
  totalCount?: number;
  isLoading: boolean;
}

export function CategoryStatsCards({
  categories = [],
  totalCount = 0,
  isLoading,
}: CategoryStatsCardsProps) {
  const activeCount = categories.filter((c) => c.status === "active").length;
  const inactiveCount = categories.filter((c) => c.status === "inactive").length;

  const cards = [
    {
      title: "Total Categories",
      value: totalCount,
      description: "Taxonomy occasion types",
      icon: Layers,
      accent: "text-[#D6B77A]",
      badge: "Taxonomy",
      badgeColor: "bg-[#D6B77A]/10 text-[#D6B77A] border-[#D6B77A]/25",
    },
    {
      title: "Active in Catalog",
      value: activeCount,
      description: "Visible to guests on storefront",
      icon: Sparkles,
      accent: "text-[#65A982]",
      badge: "Live",
      badgeColor: "bg-[#65A982]/10 text-[#65A982] border-[#65A982]/25",
    },
    {
      title: "Inactive / Draft",
      value: inactiveCount,
      description: "Hidden from venue filters",
      icon: EyeOff,
      accent: "text-[#888888]",
      badge: "Hidden",
      badgeColor: "bg-[#1f1f1f] text-[#888888] border-[#2e2e2e]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="group relative overflow-hidden rounded-xl border border-[#1a1a1a] bg-[#0c0c0c] p-4 sm:p-5 transition-all duration-150 hover:border-[#2a2a2a] hover:bg-[#0f0f0f]"
          >
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
                <div className="h-8 w-14 animate-pulse rounded bg-[#1a1a1a]" />
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

