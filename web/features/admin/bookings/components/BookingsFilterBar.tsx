"use client";

import { Search, X, RotateCcw, ChevronDown } from "lucide-react";
import {
  BookingStatus,
  PaymentStatus,
  BookingsQueryParams,
} from "../types/booking.types";

interface BookingsFilterBarProps {
  filters: BookingsQueryParams;
  onFilterChange: (filters: Partial<BookingsQueryParams>) => void;
  onReset: () => void;
}

export function BookingsFilterBar({
  filters,
  onFilterChange,
  onReset,
}: BookingsFilterBarProps) {
  const isFiltered = Boolean(
    filters.search || filters.bookingStatus || filters.paymentStatus
  );

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border border-[#1a1a1a] bg-[#0c0c0c] p-3">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#666666]" />
        <input
          type="text"
          value={filters.search ?? ""}
          onChange={(e) =>
            onFilterChange({
              search: e.target.value.trim() ? e.target.value : undefined,
              page: 1,
            })
          }
          placeholder="Search by customer, venue, event type..."
          className="h-9 w-full rounded-lg border border-[#1f1f1f] bg-black pl-9 pr-8 text-xs text-[#F5F2EB] placeholder-[#666666] outline-none transition-colors focus:border-[#D6B77A]/40 focus:ring-1 focus:ring-[#D6B77A]/30"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => onFilterChange({ search: undefined, page: 1 })}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-[#666666] hover:text-[#F5F2EB] transition-colors"
            aria-label="Clear search"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Filter Dropdowns & Reset */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Payment Status Dropdown */}
        <div className="relative">
          <select
            value={filters.paymentStatus || ""}
            onChange={(e) =>
              onFilterChange({
                paymentStatus: (e.target.value as PaymentStatus) || undefined,
                page: 1,
              })
            }
            className="h-9 appearance-none cursor-pointer rounded-lg border border-[#1f1f1f] bg-black pl-3 pr-8 text-xs text-[#F5F2EB] outline-none transition-colors hover:border-[#2f2f2f] focus:border-[#D6B77A]/40"
          >
            <option value="" className="bg-[#111111]">
              All Payments
            </option>
            <option value="fully_paid" className="bg-[#111111]">
              Fully Paid
            </option>
            <option value="unpaid" className="bg-[#111111]">
              Unpaid
            </option>
            <option value="refunded" className="bg-[#111111]">
              Refunded
            </option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#777777]" />
        </div>

        {/* Booking Status Dropdown */}
        <div className="relative">
          <select
            value={filters.bookingStatus || ""}
            onChange={(e) =>
              onFilterChange({
                bookingStatus: (e.target.value as BookingStatus) || undefined,
                page: 1,
              })
            }
            className="h-9 appearance-none cursor-pointer rounded-lg border border-[#1f1f1f] bg-black pl-3 pr-8 text-xs text-[#F5F2EB] outline-none transition-colors hover:border-[#2f2f2f] focus:border-[#D6B77A]/40"
          >
            <option value="" className="bg-[#111111]">
              All Status
            </option>
            <option value="pending" className="bg-[#111111]">
              Pending
            </option>
            <option value="approved" className="bg-[#111111]">
              Approved
            </option>
            <option value="completed" className="bg-[#111111]">
              Completed
            </option>
            <option value="cancelled" className="bg-[#111111]">
              Cancelled
            </option>
            <option value="rejected" className="bg-[#111111]">
              Rejected
            </option>
            <option value="expired" className="bg-[#111111]">
              Expired
            </option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#777777]" />
        </div>

        {/* Clear Filters Button */}
        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#262626] bg-[#141414] px-3 text-xs text-[#A3A3A3] hover:border-[#333333] hover:text-[#F5F2EB] transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}

