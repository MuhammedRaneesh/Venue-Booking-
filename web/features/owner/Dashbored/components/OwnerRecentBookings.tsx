"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Inbox } from "lucide-react";
import { OwnerDashboardSummary } from "../types/dashboard.types";

interface OwnerRecentBookingsProps {
  recentBookings: NonNullable<OwnerDashboardSummary["recentBookings"]>;
}

export function OwnerRecentBookings({ recentBookings }: OwnerRecentBookingsProps) {
  return (
    <div className="rounded-3xl bg-white border border-[#EFECE8] p-6 sm:p-8 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[17px] font-bold text-[#1E1B18]">
            Recent Bookings
          </h2>
          <p className="text-[13px] text-[#7A7169] mt-0.5">
            Latest reservation requests for your spaces
          </p>
        </div>

        <Link
          href="/owner/bookings"
          className="text-[13px] font-semibold text-coral-700 hover:text-coral-800 inline-flex items-center gap-1 group"
        >
          <span>View all</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {recentBookings.length > 0 ? (
        <div className="divide-y divide-[#F2ECE6]">
          {recentBookings.map((bkg) => (
            <div
              key={bkg._id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <p className="text-[14.5px] font-semibold text-[#1E1B18]">
                  {bkg.user?.fullName || "Guest"}
                </p>
                <p className="text-[12.5px] text-[#7A7169] mt-0.5">
                  {bkg.venue?.venueName} · {bkg.eventDate || bkg.createdAt}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[14px] font-bold text-[#1E1B18]">
                  ₹{bkg.totalAmount?.toLocaleString("en-IN")}
                </p>
                <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold border bg-neutral-50 text-neutral-700 border-neutral-200">
                  {bkg.bookingStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF7F4] border border-[#EFECE8] text-[#9A9188] flex items-center justify-center mx-auto">
            <Inbox className="w-5 h-5" />
          </div>
          <p className="text-[14px] font-medium text-[#1E1B18]">
            No booking requests yet
          </p>
          <p className="text-[13px] text-[#7A7169] max-w-sm mx-auto">
            When guests reserve or inquire about your spaces, their details and requests will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
