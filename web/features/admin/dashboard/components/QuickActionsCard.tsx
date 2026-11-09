"use client";

import {
  Users,
  Building2,
  FolderTree,
  FileCheck,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { DashboardSummary } from "../types/dashboard.types";

interface QuickActionsCardProps {
  data?: DashboardSummary;
  isLoading: boolean;
}

export function QuickActionsCard({ data, isLoading }: QuickActionsCardProps) {
  const users = data?.users;
  const venues = data?.venues;

  const totalUsers = users?.total ?? 0;
  const totalHosts = users?.owners ?? 0;
  const liveVenues = venues?.approved ?? 0;

  const quickLinks = [
    {
      title: "Host Applications",
      description: "Review pending onboarding dossiers",
      href: "/admin/applications",
      icon: FileCheck,
      color: "text-[#D9A441] bg-[#D9A441]/10 border-[#D9A441]/20",
    },
    {
      title: "Venue Moderation",
      description: "Approve or decline venue catalog listings",
      href: "/admin/venues",
      icon: Building2,
      color: "text-[#65A982] bg-[#65A982]/10 border-[#65A982]/20",
    },
    {
      title: "Event Categories",
      description: "Manage venue classifications and badges",
      href: "/admin/categories",
      icon: FolderTree,
      color: "text-[#D6B77A] bg-[#D6B77A]/10 border-[#D6B77A]/20",
    },
    {
      title: "User Management",
      description: "Manage platform accounts and host permissions",
      href: "/admin/users",
      icon: Users,
      color: "text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/20",
    },
  ];

  return (
    <div className="rounded-xl border border-[#1a1a1a] bg-[#0c0c0c] p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md border border-[#D6B77A]/20 bg-[#D6B77A]/10 text-[#D6B77A]">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <h2 className="font-serif text-base font-bold text-[#F5F2EB]">
              Ecosystem & Quick Actions
            </h2>
          </div>
          <span className="text-[11px] text-[#666666]">Platform Controls</span>
        </div>

        {/* User Ecosystem Health Summary */}
        <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-[#1f1f1f] bg-[#121212] p-3 text-center">
          <div>
            <span className="text-[10px] text-[#737373] uppercase tracking-wider">
              Customers
            </span>
            <p className="mt-0.5 font-serif text-base font-bold text-[#F5F2EB] tabular-nums">
              {isLoading ? "—" : totalUsers.toLocaleString()}
            </p>
          </div>
          <div className="border-x border-[#1f1f1f]">
            <span className="text-[10px] text-[#737373] uppercase tracking-wider">
              Verified Hosts
            </span>
            <p className="mt-0.5 font-serif text-base font-bold text-[#D6B77A] tabular-nums">
              {isLoading ? "—" : totalHosts.toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-[10px] text-[#737373] uppercase tracking-wider">
              Live Spaces
            </span>
            <p className="mt-0.5 font-serif text-base font-bold text-[#65A982] tabular-nums">
              {isLoading ? "—" : liveVenues.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Operational Shortcut Links */}
        <div className="mt-4 space-y-2">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group flex items-center justify-between p-2.5 rounded-lg border border-[#1c1c1c] bg-[#121212]/60 hover:bg-[#161616] hover:border-[#2a2a2a] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border ${item.color} shrink-0`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-[#F5F2EB] group-hover:text-[#D6B77A] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-[#737373]">
                      {item.description}
                    </p>
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 text-[#666666] group-hover:text-[#F5F2EB] group-hover:translate-x-0.5 transition-all" />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#1a1a1a] flex items-center justify-between text-[11px] text-[#666666]">
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-[#65A982]" />
          Admin Session Authenticated
        </span>
        <span className="text-[#888888]">Venuo v1.0.0</span>
      </div>
    </div>
  );
}

