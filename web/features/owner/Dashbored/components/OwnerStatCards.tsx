"use client";

import React from "react";
import Link from "next/link";
import { Banknote, Clock, Ticket, Store, ArrowUpRight } from "lucide-react";

interface OwnerStatCardsProps {
  totalEarnings: number;
  pendingBookings: number;
  totalBookings: number;
  totalVenues: number;
}

export function OwnerStatCards({
  totalEarnings,
  pendingBookings,
  totalBookings,
  totalVenues,
}: OwnerStatCardsProps) {
  const statCards = [
    {
      label: "Total Earnings",
      value: `₹${totalEarnings.toLocaleString("en-IN")}`,
      icon: Banknote,
      iconBg: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      href: "/owner/earnings",
    },
    {
      label: "Pending Requests",
      value: pendingBookings,
      icon: Clock,
      iconBg: "bg-amber-50 text-amber-700 border-amber-200/60",
      href: "/owner/bookings",
    },
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: Ticket,
      iconBg: "bg-coral-50 text-coral-700 border-coral-200/60",
      href: "/owner/bookings",
    },
    {
      label: "Listed Venues",
      value: totalVenues,
      icon: Store,
      iconBg: "bg-[#F3ECE2] text-[#54483B] border-[#E8DFC8]/60",
      href: "/owner/venues",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {statCards.map((stat) => {
        const IconComp = stat.icon;
        return (
          <Link
            key={stat.label}
            href={stat.href}
            className="group block rounded-2xl bg-white border border-[#EFECE8] p-5 hover:border-coral-300 hover:shadow-xs transition-all duration-150"
          >
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-[#7A7169]">
                {stat.label}
              </span>
              <div
                className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${stat.iconBg}`}
              >
                <IconComp className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3.5 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1B18]">
                {stat.value}
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#B0A79E] group-hover:text-coral-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
