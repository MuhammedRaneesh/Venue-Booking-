"use client";

import { useState, useEffect, useRef } from "react";
import {
  Building2,
  MapPin,
  Users,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  IndianRupee,
  Power,
} from "lucide-react";
import { AdminVenue, VenuesListResponse, VenueStatus } from "../types/venue.types";

interface VenuesTableProps {
  data?: VenuesListResponse;
  isLoading: boolean;
  isError: boolean;
  page: number;
  onPageChange: (newPage: number) => void;
  onSelectVenue: (venue: AdminVenue) => void;
  onQuickApprove: (venue: AdminVenue) => void;
  onQuickReject: (venue: AdminVenue) => void;
  onToggleActive: (venue: AdminVenue) => void;
  onResetFilters?: () => void;
  isActionPending?: boolean;
}

export function VenuesTable({
  data,
  isLoading,
  isError,
  page,
  onPageChange,
  onSelectVenue,
  onQuickApprove,
  onQuickReject,
  onToggleActive,
  onResetFilters,
  isActionPending,
}: VenuesTableProps) {
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

  const venues = data?.venues || [];
  const pagination = data?.pagination;
  const totalCount = data?.totalCount ?? 0;

  const getStatusBadge = (status: VenueStatus | string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#65A982]/25 bg-[#65A982]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#65A982]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#65A982]" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D16B6B]/25 bg-[#D16B6B]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#D16B6B]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D16B6B]" />
            Rejected
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#8B5CF6]/25 bg-[#8B5CF6]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#A78BFA]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A78BFA]" />
            Suspended
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D9A441]/30 bg-[#D9A441]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#D9A441]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#D9A441]" />
            Pending Approval
          </span>
        );
    }
  };

  return (
    <div className="relative min-h-[580px] flex flex-col justify-between rounded-xl border border-[#1a1a1a] bg-[#0c0c0c] overflow-hidden">
      {/* Scrollable table viewport */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-xs border-collapse">
          {/* Sticky Table Header */}
          <thead className="sticky top-0 z-10 border-b border-[#1f1f1f] bg-[#0c0c0c] text-[11px] font-medium tracking-wider text-[#737373] uppercase">
            <tr>
              <th scope="col" className="py-3 pl-4 pr-3 min-w-[240px]">
                Venue Property
              </th>
              <th scope="col" className="py-3 px-3 min-w-[170px]">
                Location
              </th>
              <th scope="col" className="py-3 px-3 min-w-[180px]">
                Host / Owner
              </th>
              <th scope="col" className="py-3 px-3 min-w-[160px]">
                Capacity & Rates
              </th>
              <th scope="col" className="py-3 px-3 min-w-[130px]">
                Status
              </th>
              <th scope="col" className="py-3 px-3 min-w-[100px] text-center">
                Active
              </th>
              <th scope="col" className="py-3 pl-3 pr-4 text-right min-w-[80px]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#171717] text-[#D4D4D4]">
            {/* Loading Skeletons */}
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-3.5 pl-4 pr-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-lg bg-[#1a1a1a] shrink-0" />
                      <div className="space-y-1.5">
                        <div className="h-3.5 w-32 rounded bg-[#1a1a1a]" />
                        <div className="h-2.5 w-20 rounded bg-[#171717]" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="h-3.5 w-28 rounded bg-[#1a1a1a]" />
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-[#1a1a1a]" />
                      <div className="space-y-1">
                        <div className="h-3 w-24 rounded bg-[#1a1a1a]" />
                        <div className="h-2.5 w-20 rounded bg-[#171717]" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="h-3.5 w-24 rounded bg-[#1a1a1a]" />
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="h-5 w-20 rounded-full bg-[#1a1a1a]" />
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <div className="h-5 w-10 mx-auto rounded-full bg-[#1a1a1a]" />
                  </td>
                  <td className="py-3.5 pl-3 pr-4 text-right">
                    <div className="h-7 w-7 rounded bg-[#1a1a1a] ml-auto" />
                  </td>
                </tr>
              ))}

            {/* Error State */}
            {!isLoading && isError && (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D16B6B]/30 bg-[#D16B6B]/10 text-[#D16B6B]">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-[#F5F2EB]">
                      Failed to load venues
                    </h3>
                    <p className="mt-1 text-xs text-[#888888]">
                      A connection issue occurred while fetching the venue catalog.
                    </p>
                    <button
                      type="button"
                      onClick={() => onPageChange(1)}
                      className="mt-4 rounded-lg border border-[#2a2a2a] bg-[#141414] px-3.5 py-1.5 text-xs font-medium text-[#F5F2EB] hover:bg-[#1f1f1f] transition-colors"
                    >
                      Retry request
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {/* Empty State */}
            {!isLoading && !isError && venues.length === 0 && (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#262626] bg-[#121212] text-[#888888]">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <h3 className="mt-3 text-sm font-medium text-[#F5F2EB]">
                      No venues found
                    </h3>
                    <p className="mt-1 text-xs text-[#737373]">
                      No properties match the currently selected search or status filters.
                    </p>
                    {onResetFilters && (
                      <button
                        type="button"
                        onClick={onResetFilters}
                        className="mt-4 rounded-lg border border-[#262626] bg-[#141414] px-3 py-1.5 text-xs text-[#D6B77A] hover:bg-[#1a1a1a] transition-colors"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}

            {/* Render Rows */}
            {!isLoading &&
              !isError &&
              venues.map((venue) => {
                const photoUrl = venue.photos?.[0];
                const address = venue.location?.address;
                const owner = venue.owner;
                const priceDay = venue.pricing?.pricePerDay;
                const priceHour = venue.pricing?.pricePerHour;

                return (
                  <tr
                    key={venue._id}
                    onClick={() => onSelectVenue(venue)}
                    className="group cursor-pointer hover:bg-[#121212]/80 transition-colors"
                  >
                    {/* Venue Property */}
                    <td className="py-3.5 pl-4 pr-3">
                      <div className="flex items-center gap-3">
                        {photoUrl ? (
                          <img
                            src={photoUrl}
                            alt={venue.venueName}
                            className="h-11 w-11 rounded-lg object-cover border border-[#262626] shrink-0 bg-[#141414]"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#262626] bg-[#141414] text-[#666666] shrink-0">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-[#F5F2EB] group-hover:text-[#D6B77A] transition-colors truncate">
                            {venue.venueName}
                          </p>
                          <span className="inline-block mt-0.5 rounded bg-[#1a1a1a] px-1.5 py-0.5 text-[10px] font-medium text-[#A3A3A3]">
                            {venue.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5 text-[#CCCCCC]">
                        <MapPin className="h-3.5 w-3.5 text-[#D6B77A] shrink-0" />
                        <span className="truncate">
                          {address?.city || address?.place || "Location not set"}
                          {address?.district ? `, ${address.district}` : ""}
                        </span>
                      </div>
                    </td>

                    {/* Host / Owner */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        {owner?.profileImage ? (
                          <img
                            src={owner.profileImage}
                            alt={owner.fullName || "Owner"}
                            className="h-7 w-7 rounded-full object-cover border border-[#262626] shrink-0"
                          />
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1c1c1c] text-[10px] font-semibold text-[#D6B77A] shrink-0">
                            {(owner?.fullName || owner?.email || "H")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-[#E5E5E5] truncate">
                            {owner?.fullName || "Host"}
                          </p>
                          <p className="text-[11px] text-[#737373] truncate">
                            {owner?.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Capacity & Rates */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[#B3B3B3]">
                          <Users className="h-3 w-3 text-[#737373] shrink-0" />
                          <span>{venue.capacity?.toLocaleString() || "—"} guests</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#F5F2EB] font-serif font-medium">
                          <IndianRupee className="h-3 w-3 text-[#D6B77A] shrink-0" />
                          <span>
                            {priceDay
                              ? `${priceDay.toLocaleString()}/day`
                              : priceHour
                              ? `${priceHour.toLocaleString()}/hr`
                              : "Price on req"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Moderation Status */}
                    <td className="py-3.5 px-3">
                      {getStatusBadge(venue.status)}
                    </td>

                    {/* Active State Toggle */}
                    <td
                      className="py-3.5 px-3 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => onToggleActive(venue)}
                        disabled={isActionPending}
                        aria-label={`Toggle active state for ${venue.venueName}`}
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium border transition-colors cursor-pointer ${
                          venue.isActive
                            ? "bg-[#65A982]/10 border-[#65A982]/30 text-[#65A982] hover:bg-[#65A982]/20"
                            : "bg-[#1f1f1f] border-[#333333] text-[#737373] hover:text-[#A3A3A3]"
                        }`}
                      >
                        <Power className="h-3 w-3" />
                        <span>{venue.isActive ? "Active" : "Inactive"}</span>
                      </button>
                    </td>

                    {/* Actions dropdown menu */}
                    <td
                      className="py-3.5 pl-3 pr-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative inline-block text-left">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === venue._id ? null : venue._id
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#222222] bg-[#141414] text-[#A3A3A3] hover:border-[#383838] hover:text-[#F5F2EB] transition-colors"
                          aria-label="Venue actions menu"
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                        </button>

                        {/* Dropdown Menu */}
                        {openMenuId === venue._id && (
                          <div
                            ref={menuRef}
                            className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-[#262626] bg-[#0c0c0c] p-1.5 shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-100"
                          >
                            {/* Inspect Dossier */}
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                onSelectVenue(venue);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-[#E5E5E5] hover:bg-[#1a1a1a] hover:text-[#D6B77A] transition-colors"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>Inspect Dossier</span>
                            </button>

                            {/* Approve Action */}
                            {venue.status !== "approved" && (
                              <button
                                type="button"
                                disabled={isActionPending}
                                onClick={() => {
                                  setOpenMenuId(null);
                                  onQuickApprove(venue);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-[#65A982] hover:bg-[#65A982]/10 transition-colors"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Approve Venue</span>
                              </button>
                            )}

                            {/* Reject Action */}
                            {venue.status !== "rejected" && (
                              <button
                                type="button"
                                disabled={isActionPending}
                                onClick={() => {
                                  setOpenMenuId(null);
                                  onQuickReject(venue);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-[#D16B6B] hover:bg-[#D16B6B]/10 transition-colors"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                <span>Reject Venue</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Anchored Pagination Dock */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#1a1a1a] bg-[#0c0c0c] px-4 py-3 text-xs text-[#737373]">
        <div>
          {totalCount > 0 ? (
            <span>
              Showing{" "}
              <strong className="text-[#F5F2EB]">
                {(page - 1) * (pagination?.totalPages ? 10 : 10) + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-[#F5F2EB]">
                {Math.min(page * 10, totalCount)}
              </strong>{" "}
              of <strong className="text-[#F5F2EB]">{totalCount}</strong> venues
            </span>
          ) : (
            <span>No records</span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={!pagination?.hasPreviousPage || isLoading}
            onClick={() => onPageChange(page - 1)}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#222222] bg-[#121212] px-2.5 text-xs font-medium text-[#D4D4D4] hover:bg-[#1a1a1a] hover:text-[#F5F2EB] disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Prev</span>
          </button>

          <span className="px-2 text-xs text-[#A3A3A3]">
            Page {pagination?.currentPage ?? page} of {pagination?.totalPages || 1}
          </span>

          <button
            type="button"
            disabled={!pagination?.hasNextPage || isLoading}
            onClick={() => onPageChange(page + 1)}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#222222] bg-[#121212] px-2.5 text-xs font-medium text-[#D4D4D4] hover:bg-[#1a1a1a] hover:text-[#F5F2EB] disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

