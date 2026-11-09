"use client";

import { AlertCircle, Clock, CheckCircle2, ChevronRight, UserCheck, Building } from "lucide-react";
import Link from "next/link";
import { DashboardSummary } from "../types/dashboard.types";

interface ActionRequiredStripProps {
  data?: DashboardSummary;
}

export function ActionRequiredStrip({ data }: ActionRequiredStripProps) {
  const pendingHosts = data?.users?.pendingOwnerApplications ?? 0;
  const pendingVenues = data?.venues?.pending ?? 0;
  const pendingBookings = data?.bookings?.active ?? 0;

  const totalActionNeeded = pendingHosts + pendingVenues;

  if (totalActionNeeded === 0) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-[#65A982]/20 bg-[#09140e] p-3 text-xs text-[#65A982]">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>
            Operational Queue Clear: No pending host onboarding dossiers or venue reviews currently pending triage.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#D9A441]/25 bg-[#141008] p-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#D9A441]/30 bg-[#D9A441]/10 text-[#D9A441] shrink-0">
            <Clock className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-xs text-[#F5F2EB]">
              Administrative Triage Queue ({totalActionNeeded} pending items)
            </h3>
            <p className="text-[11px] text-[#A3A3A3] mt-0.5">
              Review and approve partner applications and venue catalog submissions.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {pendingHosts > 0 && (
            <Link
              href="/admin/applications"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9A441]/40 bg-[#D9A441]/15 px-3 py-1.5 text-xs font-medium text-[#D9A441] hover:bg-[#D9A441]/25 transition-colors"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>{pendingHosts} Host KYC {pendingHosts === 1 ? "Dossier" : "Dossiers"}</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          )}

          {pendingVenues > 0 && (
            <Link
              href="/admin/venues"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D6B77A]/40 bg-[#D6B77A]/15 px-3 py-1.5 text-xs font-medium text-[#D6B77A] hover:bg-[#D6B77A]/25 transition-colors"
            >
              <Building className="h-3.5 w-3.5" />
              <span>{pendingVenues} Venue {pendingVenues === 1 ? "Listing" : "Listings"}</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

