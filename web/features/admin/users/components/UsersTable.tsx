"use client";

import { Eye, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AdminUser, UsersListResponse } from "../types/user.types";
import { useToggleUserStatus } from "../hooks/useUsers";

interface UsersTableProps {
  data?: UsersListResponse;
  isLoading: boolean;
  isError: boolean;
  page: number;
  onPageChange: (newPage: number) => void;
  onSelectUser: (userId: string) => void;
  onResetFilters?: () => void;
}

export function UsersTable({
  data,
  isLoading,
  isError,
  page,
  onPageChange,
  onSelectUser,
  onResetFilters,
}: UsersTableProps) {
  const toggleMutation = useToggleUserStatus();
  const users = data?.user || [];
  const pagination = data?.pagination;
  const totalCount = data?.totalcount ?? 0;

  const handleToggle = async (userId: string) => {
    try {
      await toggleMutation.mutateAsync(userId);
    } catch {
      // Ignored
    }
  };

  if (isError) {
    return (
      <div className="rounded-xl border border-[#2e1c1c] bg-[#140b0b] p-8 text-center text-xs text-[#D16B6B] space-y-2">
        <p className="font-semibold">Unable to fetch users list.</p>
        <p className="text-[#888888]">
          Please check that your backend server is running and your session is active.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#1a1a1a] bg-[#0c0c0c] overflow-hidden flex flex-col justify-between min-h-[580px]">
      {/* Table Container */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-xs">
          {/* Header */}
          <thead className="sticky top-0 z-10 border-b border-[#1a1a1a] bg-[#0f0f0f] text-[11px] font-semibold uppercase tracking-wider text-[#777777] select-none">
            <tr>
              <th className="py-3 px-4 sm:px-6">Member</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 hidden md:table-cell">Contact</th>
              <th className="py-3 px-4 hidden lg:table-cell">Joined</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-[#141414] text-[#F5F2EB]">
            {isLoading ? (
              // Loading Skeleton
              Array.from({ length: 6 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#1a1a1a]" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-28 rounded bg-[#1a1a1a]" />
                        <div className="h-2.5 w-36 rounded bg-[#161616]" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-5 w-16 rounded bg-[#1a1a1a]" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-5 w-14 rounded bg-[#1a1a1a]" />
                  </td>
                  <td className="py-3.5 px-4 hidden md:table-cell">
                    <div className="h-3 w-20 rounded bg-[#1a1a1a]" />
                  </td>
                  <td className="py-3.5 px-4 hidden lg:table-cell">
                    <div className="h-3 w-16 rounded bg-[#1a1a1a]" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="h-6 w-16 rounded bg-[#1a1a1a] ml-auto" />
                  </td>
                </tr>
              ))
            ) : users.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="text-sm font-semibold text-[#F5F2EB]">
                      No members found
                    </p>
                    <p className="text-xs text-[#888888]">
                      No accounts matched your search or active filter criteria.
                    </p>
                    {onResetFilters && (
                      <button
                        type="button"
                        onClick={onResetFilters}
                        className="mt-3 inline-flex items-center rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-1.5 text-xs text-[#D6B77A] hover:bg-[#1a1a1a] transition-colors"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              // Users Rows
              users.map((user: AdminUser) => {
                const isMutatingThis =
                  toggleMutation.isPending &&
                  toggleMutation.variables === user._id;

                return (
                  <tr
                    key={user._id}
                    className="group transition-colors hover:bg-[#101010]"
                  >
                    {/* Member Info */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        {user.profileImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={user.profileImage}
                            alt={user.fullName}
                            className="h-9 w-9 rounded-full object-cover border border-[#222222] shrink-0"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D6B77A]/25 bg-[#141414] text-xs font-bold text-[#D6B77A] shrink-0">
                            {user.fullName?.slice(0, 2).toUpperCase() || "US"}
                          </div>
                        )}
                        <div className="min-w-0 max-w-[200px] sm:max-w-xs">
                          <p className="truncate font-medium text-[#F5F2EB]">
                            {user.fullName}
                          </p>
                          <p className="truncate text-[11px] text-[#777777]">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium border ${
                          user.role === "venue_owner"
                            ? "bg-[#D6B77A]/10 text-[#D6B77A] border-[#D6B77A]/25"
                            : "bg-[#181818] text-[#A3A3A3] border-[#262626]"
                        }`}
                      >
                        {user.role === "venue_owner" ? "Venue Owner" : "Customer"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border ${
                          user.isActive
                            ? "bg-[#65A982]/10 text-[#65A982] border-[#65A982]/25"
                            : "bg-[#D16B6B]/10 text-[#D16B6B] border-[#D16B6B]/25"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            user.isActive ? "bg-[#65A982]" : "bg-[#D16B6B]"
                          }`}
                        />
                        {user.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>

                    {/* Phone Contact */}
                    <td className="py-3.5 px-4 text-[#888888] hidden md:table-cell">
                      {user.phoneNumber || "—"}
                    </td>

                    {/* Joined Date */}
                    <td className="py-3.5 px-4 text-[#888888] hidden lg:table-cell tabular-nums">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Details */}
                        <button
                          type="button"
                          onClick={() => onSelectUser(user._id)}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-[#222222] bg-[#141414] text-[#A3A3A3] hover:border-[#D6B77A]/40 hover:text-[#F5F2EB] transition-colors"
                          title="View user details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        {/* Toggle Status */}
                        <button
                          type="button"
                          onClick={() => handleToggle(user._id)}
                          disabled={isMutatingThis}
                          className={`flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors disabled:opacity-50 ${
                            user.isActive
                              ? "border-[#2a2a2a] bg-[#141414] text-[#888888] hover:border-[#D16B6B]/40 hover:text-[#D16B6B]"
                              : "border-[#65A982]/30 bg-[#65A982]/10 text-[#65A982] hover:bg-[#65A982]/20"
                          }`}
                          title={
                            user.isActive
                              ? "Suspend user access"
                              : "Reactivate user account"
                          }
                        >
                          {isMutatingThis ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : user.isActive ? (
                            <span>Block</span>
                          ) : (
                            <span>Unblock</span>
                          )}
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
          ({totalCount} total members)
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
