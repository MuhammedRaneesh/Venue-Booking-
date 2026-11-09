"use client";

import {
  Building2,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  MoreVertical,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  OwnerApplication,
  OwnerApplicationsListResponse,
  OwnerApplicationStatus,
} from "../types/application.types";

interface ApplicationTableProps {
  data?: OwnerApplicationsListResponse;
  isLoading: boolean;
  isError: boolean;
  page: number;
  onPageChange: (newPage: number) => void;
  onSelectApplication: (application: OwnerApplication) => void;
  onQuickApprove: (application: OwnerApplication) => void;
  onQuickReject: (application: OwnerApplication) => void;
  onResetFilters?: () => void;
  isActionPending?: boolean;
}

export function ApplicationTable({
  data,
  isLoading,
  isError,
  page,
  onPageChange,
  onSelectApplication,
  onQuickApprove,
  onQuickReject,
  onResetFilters,
  isActionPending,
}: ApplicationTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const applications = data?.applications || [];
  const pagination = data?.pagination;
  const totalCount = data?.totalCount ?? 0;

  const handleCopyGst = (e: React.MouseEvent, gst: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(gst);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const getStatusBadge = (status: OwnerApplicationStatus | string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#65A982]/25 bg-[#65A982]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#65A982]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#65A982]" />
            Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D16B6B]/25 bg-[#D16B6B]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#D16B6B]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D16B6B]" />
            Rejected
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D9A441]/30 bg-[#D9A441]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#D9A441]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#D9A441]" />
            Pending Review
          </span>
        );
    }
  };

  if (isError) {
    return (
      <div className="rounded-xl border border-[#2e1c1c] bg-[#140b0b] p-8 text-center text-xs text-[#D16B6B] space-y-2">
        <p className="font-semibold text-sm">Failed to load host applications.</p>
        <p className="text-[#888888]">
          Please ensure your backend service is running and your administrative session is active.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#1a1a1a] bg-[#0c0c0c] overflow-hidden flex flex-col justify-between min-h-[580px]">
      {/* Table Scroller */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-xs">
          {/* Header */}
          <thead className="sticky top-0 z-10 border-b border-[#1a1a1a] bg-[#0f0f0f] text-[11px] font-semibold uppercase tracking-wider text-[#777777] select-none">
            <tr>
              <th className="py-3 px-4 sm:px-6">Host & Business</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4 hidden md:table-cell">Location</th>
              <th className="py-3 px-4 hidden lg:table-cell">Tax ID / GSTIN</th>
              <th className="py-3 px-4 hidden sm:table-cell">Submitted</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right w-16">Actions</th>
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
                      <div className="h-10 w-10 rounded-full bg-[#1a1a1a]" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-32 rounded bg-[#1a1a1a]" />
                        <div className="h-2.5 w-40 rounded bg-[#161616]" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-3.5 w-24 rounded bg-[#1a1a1a]" />
                  </td>
                  <td className="py-3.5 px-4 hidden md:table-cell">
                    <div className="h-3.5 w-20 rounded bg-[#1a1a1a]" />
                  </td>
                  <td className="py-3.5 px-4 hidden lg:table-cell">
                    <div className="h-3.5 w-28 rounded bg-[#1a1a1a]" />
                  </td>
                  <td className="py-3.5 px-4 hidden sm:table-cell">
                    <div className="h-3 w-16 rounded bg-[#1a1a1a]" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-5 w-24 rounded-full bg-[#1a1a1a]" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="h-7 w-20 rounded bg-[#1a1a1a] ml-auto" />
                  </td>
                </tr>
              ))
            ) : applications.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={7} className="py-14 text-center">
                  <div className="max-w-xs mx-auto space-y-2">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#222222] bg-[#141414] text-[#666666]">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold text-[#F5F2EB]">
                      No host applications found
                    </p>
                    <p className="text-xs text-[#888888]">
                      No registration dossiers matched your filter or search query.
                    </p>
                    {onResetFilters && (
                      <button
                        type="button"
                        onClick={onResetFilters}
                        className="mt-3 inline-flex items-center rounded-lg border border-[#2a2a2a] bg-[#141414] px-3.5 py-1.5 text-xs text-[#D6B77A] hover:bg-[#1a1a1a] transition-colors"
                      >
                        Reset filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              // Applications Rows
              applications.map((application) => {
                const hostUser = application.user;
                const status = hostUser?.ownerStatus || "PENDING";
                const isPending = status === "PENDING";

                return (
                  <tr
                    key={application._id}
                    onClick={() => onSelectApplication(application)}
                    className="group cursor-pointer transition-colors hover:bg-[#111111]"
                  >
                    {/* Host & Business */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        {hostUser?.profileImage || application.profileImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={hostUser?.profileImage || application.profileImage}
                            alt={hostUser?.fullName || application.businessName}
                            className="h-10 w-10 rounded-lg border border-[#222222] object-cover shrink-0"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#D6B77A]/25 bg-[#141414] text-xs font-bold text-[#D6B77A] shrink-0">
                            {application.businessName?.slice(0, 2).toUpperCase() || "VN"}
                          </div>
                        )}
                        <div className="min-w-0 max-w-[200px] sm:max-w-xs">
                          <p className="truncate font-semibold text-[#F5F2EB] group-hover:text-[#D6B77A] transition-colors">
                            {application.businessName}
                          </p>
                          <p className="truncate text-[11px] text-[#777777]">
                            {hostUser?.fullName || "Applicant"} • {hostUser?.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-[#A3A3A3]">
                        <Phone className="h-3 w-3 text-[#666666] shrink-0" />
                        <span className="font-mono text-[11px]">{application.phone}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-[#888888]">
                        <MapPin className="h-3 w-3 text-[#555555] shrink-0" />
                        <span className="truncate max-w-[140px]">
                          {application.city}, {application.state}
                        </span>
                      </div>
                    </td>

                    {/* GSTIN / Tax ID */}
                    <td className="py-3.5 px-4 hidden lg:table-cell">
                      {application.gstNumber ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] text-[#D6B77A] tracking-wider">
                            {application.gstNumber}
                          </span>
                          <button
                            type="button"
                            onClick={(e) =>
                              handleCopyGst(e, application.gstNumber!, application._id)
                            }
                            className="rounded p-1 text-[#666666] hover:bg-[#1a1a1a] hover:text-[#F5F2EB] transition-colors"
                            title="Copy GSTIN"
                          >
                            {copiedId === application._id ? (
                              <Check className="h-3 w-3 text-[#65A982]" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#555555] italic">Not provided</span>
                      )}
                    </td>

                    {/* Submitted Date */}
                    <td className="py-3.5 px-4 hidden sm:table-cell text-[#777777] tabular-nums">
                      {application.createdAt
                        ? new Date(application.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(status)}
                    </td>

                    {/* Actions Menu (⋮ / ;) */}
                    <td className="py-3.5 px-4 text-right">
                      <div
                        className="relative inline-flex items-center justify-end"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === application._id ? null : application._id
                            )
                          }
                          className={`flex h-7 w-7 items-center justify-center rounded-md border transition-colors ${
                            openMenuId === application._id
                              ? "border-[#D6B77A] bg-[#1a160f] text-[#D6B77A]"
                              : "border-[#222222] bg-[#141414] text-[#888888] hover:border-[#D6B77A]/40 hover:text-[#F5F2EB]"
                          }`}
                          title="Actions menu"
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                        </button>

                        {/* Dropdown Popover */}
                        {openMenuId === application._id && (
                          <div
                            ref={menuRef}
                            className="absolute right-0 top-8 z-40 w-44 rounded-xl border border-[#222222] bg-[#121212] p-1.5 text-left text-xs shadow-2xl shadow-black/90 animate-in fade-in zoom-in-95 duration-100"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                onSelectApplication(application);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 font-medium text-[#F5F2EB] hover:bg-[#1a1a1a] hover:text-[#D6B77A] transition-colors"
                            >
                              <Eye className="h-3.5 w-3.5 text-[#D6B77A]" />
                              <span>View Dossier</span>
                            </button>

                            {isPending && (
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  onQuickApprove(application);
                                }}
                                disabled={isActionPending}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 font-medium text-[#65A982] hover:bg-[#65A982]/10 transition-colors disabled:opacity-50"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Approve Host</span>
                              </button>
                            )}

                            {isPending && (
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  onQuickReject(application);
                                }}
                                disabled={isActionPending}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 font-medium text-[#D16B6B] hover:bg-[#D16B6B]/10 transition-colors disabled:opacity-50"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                <span>Reject Application</span>
                              </button>
                            )}

                            {status === "REJECTED" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  onQuickApprove(application);
                                }}
                                disabled={isActionPending}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 font-medium text-[#D6B77A] hover:bg-[#D6B77A]/10 transition-colors disabled:opacity-50"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Re-evaluate & Approve</span>
                              </button>
                            )}
                          </div>
                        )}
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
      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#1a1a1a] bg-[#0c0c0c] px-4 py-3 sm:px-6 gap-3 select-none">
        <p className="text-xs text-[#777777]">
          Showing{" "}
          <span className="font-medium text-[#F5F2EB] tabular-nums">
            {totalCount === 0 ? 0 : (page - 1) * (pagination?.totalPages ? 10 : 10) + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium text-[#F5F2EB] tabular-nums">
            {Math.min(page * 10, totalCount)}
          </span>{" "}
          of{" "}
          <span className="font-medium text-[#F5F2EB] tabular-nums">
            {totalCount}
          </span>{" "}
          applications
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={!pagination?.hasPreviousPage || isLoading}
            className="inline-flex items-center gap-1 rounded-lg border border-[#222222] bg-[#141414] px-3 py-1.5 text-xs font-medium text-[#F5F2EB] hover:bg-[#1a1a1a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-[#888888] tabular-nums px-1">
            Page {page} of {Math.max(pagination?.totalPages || 1, 1)}
          </span>

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={!pagination?.hasNextPage || isLoading}
            className="inline-flex items-center gap-1 rounded-lg border border-[#222222] bg-[#141414] px-3 py-1.5 text-xs font-medium text-[#F5F2EB] hover:bg-[#1a1a1a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
