"use client";

import React from "react";
import Link from "next/link";
import { Ticket, Search, Inbox, Plus } from "lucide-react";
import { useOwnerDashboardSummary } from "@/features/owner/Dashbored/hooks/useOwnerDashboard";

export default function OwnerBookingsPage() {
  const { data: summary } = useOwnerDashboardSummary();
  const bookings = summary?.recentBookings ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1B18]">
            Bookings
          </h1>
          <p className="text-[14px] text-[#7A7169] mt-1">
            Track and manage guest reservations across your venues
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8C837A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search bookings..."
              className="pl-9 pr-4 py-2 rounded-full border border-[#E0D8D0] bg-white text-sm focus:outline-hidden focus:border-coral-500 w-48 sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Bookings List / Empty State */}
      <div className="rounded-3xl border border-[#EFECE8] bg-white overflow-hidden shadow-xs p-6">
        {bookings.length > 0 ? (
          <div className="divide-y divide-[#F2ECE6]">
            {bookings.map((bkg) => (
              <div
                key={bkg._id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <p className="font-semibold text-[#1E1B18]">
                    {bkg.user?.fullName || "Guest"}
                  </p>
                  <p className="text-xs text-[#7A7169] mt-0.5">
                    {bkg.venue?.venueName} · {bkg.eventDate || bkg.createdAt}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-[#1E1B18]">
                    ₹{bkg.totalAmount?.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F4] border border-[#EFECE8] text-[#9A9188] flex items-center justify-center mx-auto">
              <Inbox className="w-5 h-5" />
            </div>
            <p className="text-[15px] font-semibold text-[#1E1B18]">
              No bookings yet
            </p>
            <p className="text-[13px] text-[#7A7169] max-w-sm mx-auto">
              Guest reservation requests and confirmed bookings will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
