"use client";

import { Search, X, Plus, ChevronDown, RotateCcw } from "lucide-react";
import { CategoryQueryParams, CategoryStatus } from "../types/category.types";

interface CategoryFilterBarProps {
  filters: CategoryQueryParams;
  onFilterChange: (newFilters: Partial<CategoryQueryParams>) => void;
  onReset: () => void;
  onOpenCreateDrawer: () => void;
}

export function CategoryFilterBar({
  filters,
  onFilterChange,
  onReset,
  onOpenCreateDrawer,
}: CategoryFilterBarProps) {
  const isFiltered = Boolean(filters.search || filters.status);

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
          placeholder="Search categories by name..."
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

      {/* Status Filter & Add Action */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Dropdown */}
        <div className="relative">
          <select
            value={filters.status || ""}
            onChange={(e) =>
              onFilterChange({
                status: (e.target.value as CategoryStatus) || undefined,
                page: 1,
              })
            }
            className="h-9 appearance-none cursor-pointer rounded-lg border border-[#1f1f1f] bg-black pl-3 pr-8 text-xs text-[#F5F2EB] outline-none transition-colors hover:border-[#2f2f2f] focus:border-[#D6B77A]/40"
          >
            <option value="" className="bg-[#111111]">
              All Status
            </option>
            <option value="active" className="bg-[#111111]">
              Active Only
            </option>
            <option value="inactive" className="bg-[#111111]">
              Inactive Only
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
            title="Reset filters"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}

        {/* Create Category Trigger (Opens Slide-over Sidebar) */}
        <button
          type="button"
          onClick={onOpenCreateDrawer}
          className="flex h-9 items-center gap-1.5 rounded-lg bg-[#D6B77A] px-3.5 text-xs font-semibold text-[#111111] hover:bg-[#e0c58e] transition-colors shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Category</span>
        </button>
      </div>
    </div>
  );
}

