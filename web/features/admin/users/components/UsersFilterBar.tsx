"use client";

import { Search, X, RotateCcw, ChevronDown } from "lucide-react";
import { UsersQueryParams } from "../types/user.types";

interface UsersFilterBarProps {
  filters: UsersQueryParams;
  onFilterChange: (newFilters: Partial<UsersQueryParams>) => void;
  onReset: () => void;
}

export function UsersFilterBar({
  filters,
  onFilterChange,
  onReset,
}: UsersFilterBarProps) {
  const isFiltered = Boolean(
    filters.search || filters.role || filters.isActive !== undefined
  );

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border border-[#1a1a1a] bg-[#0c0c0c] p-3">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#666666]" />
        <input
          type="text"
          value={filters.search || ""}
          onChange={(e) =>
            onFilterChange({ search: e.target.value || undefined, page: 1 })
          }
          placeholder="Search members by name or email..."
          className="h-9 w-full rounded-lg border border-[#1f1f1f] bg-black pl-9 pr-8 text-xs text-[#F5F2EB] placeholder-[#666666] outline-none transition-colors focus:border-[#D6B77A]/40 focus:ring-1 focus:ring-[#D6B77A]/30"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => onFilterChange({ search: undefined, page: 1 })}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-[#666666] hover:text-[#F5F2EB]"
            aria-label="Clear search"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Role and Status Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Role Filter */}
        <div className="relative">
          <select
            value={filters.role || ""}
            onChange={(e) =>
              onFilterChange({
                role: (e.target.value as "user" | "venue_owner") || undefined,
                page: 1,
              })
            }
            className="h-9 appearance-none cursor-pointer rounded-lg border border-[#1f1f1f] bg-black pl-3 pr-8 text-xs text-[#F5F2EB] outline-none transition-colors hover:border-[#2f2f2f] focus:border-[#D6B77A]/40"
          >
            <option value="" className="bg-[#111111]">
              All Roles
            </option>
            <option value="user" className="bg-[#111111]">
              Customers
            </option>
            <option value="venue_owner" className="bg-[#111111]">
              Venue Owners
            </option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#777777]" />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={
              filters.isActive === undefined
                ? ""
                : filters.isActive
                ? "true"
                : "false"
            }
            onChange={(e) =>
              onFilterChange({
                isActive:
                  e.target.value === ""
                    ? undefined
                    : e.target.value === "true",
                page: 1,
              })
            }
            className="h-9 appearance-none cursor-pointer rounded-lg border border-[#1f1f1f] bg-black pl-3 pr-8 text-xs text-[#F5F2EB] outline-none transition-colors hover:border-[#2f2f2f] focus:border-[#D6B77A]/40"
          >
            <option value="" className="bg-[#111111]">
              All Status
            </option>
            <option value="true" className="bg-[#111111]">
              Active
            </option>
            <option value="false" className="bg-[#111111]">
              Suspended
            </option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#777777]" />
        </div>

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 text-xs font-medium text-[#A3A3A3] hover:border-[#D6B77A]/30 hover:text-[#F5F2EB] transition-colors"
            title="Reset all filters"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}

