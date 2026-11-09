"use client";

import {
  CalendarCheck,
  Building2,
  Users,
  ChevronRight,
  IndianRupee,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { DashboardRecentBooking } from "../types/dashboard.types";

interface RecentBookingsFeedProps {
  recentBookings?: DashboardRecentBooking[];
  isLoading: boolean;
}

export function RecentBookingsFeed({
  recentBookings = [],
  isLoading,
}: RecentBookingsFeedProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center rounded-full border border-[#65A982]/25 bg-[#65A982]/10 px-2 py-0.5 text-[10px] font-medium text-[#65A982]">
            Approved
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center rounded-full border border-[#38BDF8]/25 bg-[#38BDF8]/10 px-2 py-0.5 text-[10px] font-medium text-[#38BDF8]">
            Completed
          </span>
        );
      case "cancelled":
      case "rejected":
        return (
          <span className="inline-flex items-center rounded-full border border-[#D16B6B]/25 bg-[#D16B6B]/10 px-2 py-0.5 text-[10px] font-medium text-[#D16B6B]">
            Cancelled
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center rounded-full border border-[#D9A441]/30 bg-[#D9A441]/10 px-2 py-0.5 text-[10px] font-medium text-[#D9A441]">
            Pending
          </span>
        );
    }
  };

  const formatDate = (isoDate?: string) => {
    if (!isoDate) return "—";
    try {
      return new Date(isoDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });
    } catch {
      return isoDate;
    }
  };

  return (
    <div className="rounded-xl border border-[#1a1a1a] bg-[#0c0c0c] p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md border border-[#38BDF8]/20 bg-[#38BDF8]/10 text-[#38BDF8]">
              <CalendarCheck className="h-3.5 w-3.5" />
            </div>
            <h2 className="font-serif text-base font-bold text-[#F5F2EB]">
              Recent Bookings
            </h2>
          </div>

          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#D6B77A] hover:text-[#e4caa0] transition-colors"
          >
            <span>View all</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* List Body */}
        <div className="mt-4 divide-y divide-[#171717]">
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="py-3 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[#1a1a1a]" />
                  <div className="space-y-1">
                    <div className="h-3.5 w-28 rounded bg-[#1a1a1a]" />
                    <div className="h-2.5 w-20 rounded bg-[#171717]" />
                  </div>
                </div>
                <div className="h-4 w-16 rounded bg-[#1a1a1a]" />
              </div>
            ))}

          {!isLoading && recentBookings.length === 0 && (
            <div className="py-12 text-center text-xs text-[#737373]">
              No reservations recorded yet.
            </div>
          )}

          {!isLoading &&
            recentBookings.map((b) => {
              const photo = b.venueId?.photos?.[0];
              return (
                <div
                  key={b._id}
                  className="py-3 flex items-center justify-between gap-3 group hover:bg-[#121212]/50 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {photo ? (
                      <img
                        src={photo}
                        alt={b.venueId?.venueName || "Venue"}
                        className="h-9 w-9 rounded-lg object-cover border border-[#222222] shrink-0"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#222222] bg-[#141414] text-[#666666] shrink-0">
                        <Building2 className="h-4 w-4" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#F5F2EB] truncate group-hover:text-[#D6B77A] transition-colors">
                        {b.venueId?.venueName || "Venue Property"}
                      </p>
                      <p className="text-[11px] text-[#737373] truncate">
                        {b.userId?.fullName || "Customer"} • {b.eventType || "Event"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center justify-end gap-1 font-serif text-xs font-semibold text-[#F5F2EB]">
                      <IndianRupee className="h-3 w-3 text-[#65A982]" />
                      <span>{b.totalAmount?.toLocaleString()}</span>
                    </div>
                    <div className="mt-0.5 flex items-center justify-end gap-1.5">
                      <span className="text-[10px] text-[#666666]">
                        {formatDate(b.bookingDate)}
                      </span>
                      {getStatusBadge(b.bookingStatus)}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#1a1a1a] text-center">
        <Link
          href="/admin/bookings"
          className="text-xs text-[#888888] hover:text-[#D6B77A] transition-colors"
        >
          Explore complete booking archive & ledger →
        </Link>
      </div>
    </div>
  );
}

