"use client";

import {
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { Category, CategoryListResponse } from "../types/category.types";
import { useToggleCategoryStatus } from "../hooks/useCategories";

interface CategoryTableProps {
  data?: CategoryListResponse;
  isLoading: boolean;
  isError: boolean;
  page: number;
  onPageChange: (newPage: number) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  onOpenCreateDrawer: () => void;
  onResetFilters?: () => void;
}

export function CategoryTable({
  data,
  isLoading,
  isError,
  page,
  onPageChange,
  onEditCategory,
  onDeleteCategory,
  onOpenCreateDrawer,
  onResetFilters,
}: CategoryTableProps) {
  const toggleMutation = useToggleCategoryStatus();
  const categories = data?.categories || [];
  const pagination = data?.pagination;
  const totalCount = data?.totalCount ?? 0;

  const handleToggle = async (id: string) => {
    try {
      await toggleMutation.mutateAsync(id);
    } catch {
      // Ignored: feedback handled in mutation state
    }
  };

  if (isError) {
    return (
      <div className="rounded-xl border border-[#2e1c1c] bg-[#140b0b] p-8 text-center text-xs text-[#D16B6B] space-y-2">
        <p className="font-semibold">Unable to fetch categories taxonomy.</p>
        <p className="text-[#888888]">
          Please check your connection and ensure the backend server is reachable.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#1a1a1a] bg-[#0c0c0c] overflow-hidden flex flex-col justify-between min-h-[580px]">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-xs">
          {/* Header */}
          <thead className="sticky top-0 z-10 border-b border-[#1a1a1a] bg-[#0f0f0f] text-[11px] font-semibold uppercase tracking-wider text-[#777777] select-none">
            <tr>
              <th className="py-3 px-4 sm:px-6">Category Taxonomy</th>
              <th className="py-3 px-4 hidden md:table-cell">Description</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 hidden lg:table-cell">Created</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-[#141414] text-[#F5F2EB]">
            {isLoading ? (
              // Loading Skeleton
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-16 rounded-lg bg-[#1a1a1a] shrink-0" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-32 rounded bg-[#1a1a1a]" />
                        <div className="h-2.5 w-24 rounded bg-[#161616]" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 hidden md:table-cell">
                    <div className="h-3 w-48 rounded bg-[#1a1a1a]" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-5 w-16 rounded bg-[#1a1a1a]" />
                  </td>
                  <td className="py-3.5 px-4 hidden lg:table-cell">
                    <div className="h-3 w-20 rounded bg-[#1a1a1a]" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="h-7 w-24 rounded bg-[#1a1a1a] ml-auto" />
                  </td>
                </tr>
              ))
            ) : categories.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="text-sm font-semibold text-[#F5F2EB]">
                      No categories found
                    </p>
                    <p className="text-xs text-[#888888]">
                      Create your first venue category taxonomy to organize listings.
                    </p>
                    <div className="pt-2 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={onOpenCreateDrawer}
                        className="rounded-lg bg-[#D6B77A] px-3.5 py-1.5 text-xs font-semibold text-[#111111] hover:bg-[#e0c58e] transition-colors"
                      >
                        Create Category
                      </button>
                      {onResetFilters && (
                        <button
                          type="button"
                          onClick={onResetFilters}
                          className="rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-1.5 text-xs text-[#A3A3A3] hover:text-[#F5F2EB] transition-colors"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              // Categories Rows
              categories.map((category) => {
                const isTogglingThis =
                  toggleMutation.isPending &&
                  toggleMutation.variables === category._id;

                return (
                  <tr
                    key={category._id}
                    className="group transition-colors hover:bg-[#101010]"
                  >
                    {/* Category Title + Image */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        {category.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={category.image}
                            alt={category.name}
                            className="h-12 w-16 rounded-lg object-cover border border-[#222222] shrink-0 bg-[#141414]"
                          />
                        ) : (
                          <div className="flex h-12 w-16 items-center justify-center rounded-lg border border-[#222222] bg-[#141414] text-[#666666] shrink-0">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                        )}

                        <div className="min-w-0 max-w-[200px] sm:max-w-xs">
                          <p className="truncate font-semibold text-[#F5F2EB] group-hover:text-[#D6B77A] transition-colors">
                            {category.name}
                          </p>
                          <span className="font-mono text-[10px] text-[#777777] truncate block">
                            /{category.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 hidden md:table-cell text-[#888888] max-w-xs">
                      <p className="truncate">
                        {category.description || "No description provided"}
                      </p>
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggle(category._id)}
                        disabled={isTogglingThis}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold border transition-all cursor-pointer ${
                          category.status === "active"
                            ? "bg-[#65A982]/10 text-[#65A982] border-[#65A982]/25 hover:bg-[#65A982]/20"
                            : "bg-[#222222] text-[#888888] border-[#303030] hover:text-[#F5F2EB]"
                        }`}
                        title="Click to toggle status"
                      >
                        {isTogglingThis ? (
                          <Loader2 className="h-2.5 w-2.5 animate-spin" />
                        ) : (
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              category.status === "active"
                                ? "bg-[#65A982]"
                                : "bg-[#888888]"
                            }`}
                          />
                        )}
                        <span className="capitalize">{category.status}</span>
                      </button>
                    </td>

                    {/* Created Date */}
                    <td className="py-3.5 px-4 text-[#888888] hidden lg:table-cell tabular-nums">
                      {category.createdAt
                        ? new Date(category.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "—"}
                    </td>

                    {/* Row Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit Button (Opens Slide-over Drawer) */}
                        <button
                          type="button"
                          onClick={() => onEditCategory(category)}
                          className="flex h-7 items-center gap-1.5 rounded-md border border-[#222222] bg-[#141414] px-2.5 text-[11px] font-medium text-[#A3A3A3] hover:border-[#D6B77A]/40 hover:text-[#F5F2EB] transition-colors"
                          title="Edit category in sidebar"
                        >
                          <Edit3 className="h-3 w-3" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => onDeleteCategory(category)}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-[#222222] bg-[#141414] text-[#888888] hover:border-[#D16B6B]/40 hover:text-[#D16B6B] transition-colors"
                          title="Delete category"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#1a1a1a] bg-[#0c0c0c] px-4 py-3 text-xs text-[#888888] select-none">
        <span className="tabular-nums">
          Showing Page <strong className="text-[#F5F2EB]">{page}</strong> of{" "}
          <strong className="text-[#F5F2EB]">{Math.max(pagination?.totalPages || 1, 1)}</strong>{" "}
          ({totalCount} total categories)
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={!pagination?.hasPreviousPage || isLoading}
            className="flex h-8 items-center gap-1 rounded-md border border-[#1f1f1f] bg-[#111111] px-2.5 text-xs text-[#F5F2EB] hover:border-[#D6B77A]/40 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={!pagination?.hasNextPage || isLoading}
            className="flex h-8 items-center gap-1 rounded-md border border-[#1f1f1f] bg-[#111111] px-2.5 text-xs text-[#F5F2EB] hover:border-[#D6B77A]/40 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

