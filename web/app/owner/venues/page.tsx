"use client";

import React from "react";
import Link from "next/link";
import { Store, Plus, MapPin, Inbox } from "lucide-react";
import { useOwnerVenues } from "@/features/owner/Dashbored/hooks/useOwnerDashboard";

export default function OwnerVenuesPage() {
  const { data: venuesData } = useOwnerVenues();
  const venues = venuesData?.venues ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1B18]">
            My Venues
          </h1>
          <p className="text-[14px] text-[#7A7169] mt-1">
            Manage your listed venues, pricing, and availability
          </p>
        </div>

        <Link
          href="/onboarding/application"
          className="px-4 py-2 rounded-full bg-coral-600 hover:bg-coral-700 text-white text-[13.5px] font-medium shadow-xs inline-flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Venue</span>
        </Link>
      </div>

      {venues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {venues.map((venue) => (
            <div
              key={venue._id}
              className="rounded-3xl border border-[#EFECE8] bg-white overflow-hidden shadow-xs hover:border-coral-300 transition-all p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#1E1B18]">
                  {venue.venueName}
                </h2>
                {venue.pricePerDay && (
                  <span className="text-lg font-bold text-coral-700">
                    ₹{venue.pricePerDay.toLocaleString("en-IN")}/day
                  </span>
                )}
              </div>
              {venue.city && (
                <p className="text-sm text-[#7A7169] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {venue.city}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-[#EFECE8] p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#FAF7F4] border border-[#EFECE8] text-[#9A9188] flex items-center justify-center mx-auto">
            <Store className="w-5 h-5" />
          </div>
          <p className="text-[15px] font-semibold text-[#1E1B18]">
            No venues listed yet
          </p>
          <p className="text-[13px] text-[#7A7169] max-w-sm mx-auto">
            List your venue to start accepting guest bookings on Venuo.
          </p>
          <div className="pt-2">
            <Link
              href="/onboarding/application"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-coral-600 hover:bg-coral-700 text-white text-[13px] font-medium shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List your venue</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
