"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function OwnerCalendarPage() {
  const [currentDate] = useState(new Date());
  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1B18]">
            Calendar
          </h1>
          <p className="text-[14px] text-[#7A7169] mt-1">
            Manage availability and reserved dates for your spaces
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-white border border-[#EFECE8] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#1E1B18]">{monthName}</h2>
          <div className="flex items-center gap-1 border border-[#E0D8D0] rounded-xl p-1 bg-[#FAF8F5]">
            <button
              type="button"
              className="p-1 rounded-lg hover:bg-white text-[#6E645D]"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-semibold text-[#1E1B18]">Today</span>
            <button
              type="button"
              className="p-1 rounded-lg hover:bg-white text-[#6E645D]"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-[#7A7169] mb-3">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i + 1}
              className="min-h-[70px] p-2 rounded-2xl border bg-[#FAF8F5]/40 border-[#EFECE8] text-left"
            >
              <span className="text-xs font-bold text-[#1E1B18]">{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
