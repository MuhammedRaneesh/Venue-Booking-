"use client";

import { useState, useEffect, useRef } from "react";
import {
  CalendarCheck,
  Building2,
  Users,
  Eye,
  XCircle,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  IndianRupee,
  Calendar,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  AdminBooking,
  BookingsListResponse,
  BookingStatus,
  PaymentStatus,
} from "../types/booking.types";

interface BookingsTableProps {
  data?: BookingsListResponse;
  isLoading: boolean;
  isError: boolean;
  page: number;
  onPageChange: (newPage: number) => void;
  onSelectBooking: (booking: AdminBooking) => void;
  onCancelBooking: (booking: AdminBooking) => void;
  onResetFilters?: () => void;
}

export function BookingsTable({
  data,
  isLoading,
  isError,
  page,
  onPageChange,
  onSelectBooking,
  onCancelBooking,
  onResetFilters,
}: BookingsTableProps) {
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

  const bookings = data?.bookings || [];
  const pagination = data?.pagination;
  const totalCount = data?.totalCount ?? 0;

  const getBookingStatusBadge = (status: BookingStatus | string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#65A982]/25 bg-[#65A982]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#65A982]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#65A982]" />
            Approved
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#38BDF8]/25 bg-[#38BDF8]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#38BDF8]">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </span>
        );
      case "cancelled":
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D16B6B]/25 bg-[#D16B6B]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#D16B6B]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D16B6B]" />
            {status === "rejected" ? "Rejected" : "Cancelled"}
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#737373]/25 bg-[#737373]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#A3A3A3]">
            Expired
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D9A441]/30 bg-[#D9A441]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#D9A441]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#D9A441]" />
            Pending
          </span>
        );
    }
  };

  const getPaymentStatusBadge = (status: PaymentStatus | string) => {
    switch (status) {
      case "fully_paid":
        return (
          <span className="inline-flex items-center rounded bg-[#65A982]/10 border border-[#65A982]/25 px-1.5 py-0.5 text-[10px] font-medium text-[#65A982]">
            Fully Paid
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center rounded bg-[#8B5CF6]/10 border border-[#8B5CF6]/25 px-1.5 py-0.5 text-[10px] font-medium text-[#A78BFA]">
            Refunded
          </span>
        );
      case "unpaid":
      default:
        return (
          <span className="inline-flex items-center rounded bg-[#D9A441]/10 border border-[#D9A441]/25 px-1.5 py-0.5 text-[10px] font-medium text-[#D9A441]">
            Unpaid
          </span>
        );
    }
  };

  const formatDate = (isoDate?: string) => {
    if (!isoDate) return "—";
    try {
      return new Date(isoDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return isoDate;
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
              <th scope="col" className="py-3 pl-4 pr-3 min-w-[190px]">
                Booking & Event
              </th>
              <th scope="col" className="py-3 px-3 min-w-[210px]">
                Target Venue
              </th>
              <th scope="col" className="py-3 px-3 min-w-[180px]">
                Customer
              </th>
              <th scope="col" className="py-3 px-3 min-w-[150px]">
                Event Schedule
              </th>
              <th scope="col" className="py-3 px-3 min-w-[170px]">
                Financials
              </th>
              <th scope="col" className="py-3 px-3 min-w-[120px]">
                Status
              </th>
              <th scope="col" className="py-3 pl-3 pr-4 text-right min-w-[70px]">
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
                    <div className="space-y-1.5">
                      <div className="h-3.5 w-24 rounded bg-[#1a1a1a]" />
                      <div className="h-2.5 w-32 rounded bg-[#171717]" />
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
                        <div className="h-2.5 w-16 rounded bg-[#171717]" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="h-3.5 w-20 rounded bg-[#1a1a1a]" />
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="h-3.5 w-24 rounded bg-[#1a1a1a]" />
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="h-5 w-20 rounded-full bg-[#1a1a1a]" />
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
                      Failed to load bookings
                    </h3>
                    <p className="mt-1 text-xs text-[#888888]">
                      A connection issue occurred while fetching the reservations.
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
            {!isLoading && !isError && bookings.length === 0 && (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#262626] bg-[#121212] text-[#888888]">
                      <CalendarCheck className="h-6 w-6" />
                    </div>
                    <h3 className="mt-3 text-sm font-medium text-[#F5F2EB]">
                      No bookings found
                    </h3>
                    <p className="mt-1 text-xs text-[#737373]">
                      No reservation records match the active status or search filters.
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
              bookings.map((booking) => {
                const user = booking.userId;
                const venue = booking.venueId;
                const venuePhoto = venue?.photos?.[0];
                const venueCity = venue?.location?.address?.city;

                return (
                  <tr
                    key={booking._id}
                    onClick={() => onSelectBooking(booking)}
                    className="group cursor-pointer hover:bg-[#121212]/80 transition-colors"
                  >
                    {/* Booking ID & Event */}
                    <td className="py-3.5 pl-4 pr-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] font-semibold text-[#D6B77A]">
                            #{booking._id.slice(-6).toUpperCase()}
                          </span>
                          <span className="text-[10px] text-[#666666]">
                            • {booking.bookingType || "full-day"}
                          </span>
                        </div>
                        <p className="font-medium text-[#F5F2EB] group-hover:text-[#D6B77A] transition-colors truncate mt-0.5">
                          {booking.eventType || "Event Reservation"}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-[#737373] mt-0.5">
                          <Users className="h-3 w-3 text-[#666666]" />
                          <span>{booking.guestCount || "—"} guests</span>
                        </div>
                      </div>
                    </td>

                    {/* Target Venue */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        {venuePhoto ? (
                          <img
                            src={venuePhoto}
                            alt={venue?.venueName || "Venue"}
                            className="h-10 w-10 rounded-lg object-cover border border-[#262626] shrink-0 bg-[#141414]"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#262626] bg-[#141414] text-[#666666] shrink-0">
                            <Building2 className="h-4 w-4" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-[#E5E5E5] truncate">
                            {venue?.venueName || "Venue Property"}
                          </p>
                          <p className="text-[11px] text-[#737373] truncate">
                            {venueCity || venue?.category || "Listing"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        {user?.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={user.fullName || "User"}
                            className="h-7 w-7 rounded-full object-cover border border-[#262626] shrink-0"
                          />
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1c1c1c] text-[10px] font-semibold text-[#D6B77A] shrink-0">
                            {(user?.fullName || user?.email || "U")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-[#E5E5E5] truncate">
                            {user?.fullName || "Customer"}
                          </p>
                          <p className="text-[11px] text-[#737373] truncate">
                            {user?.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Event Schedule */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[#E5E5E5] font-medium">
                          <Calendar className="h-3 w-3 text-[#D6B77A] shrink-0" />
                          <span>{formatDate(booking.bookingDate)}</span>
                        </div>
                        {booking.startDateTime && (
                          <p className="text-[11px] text-[#737373]">
                            {new Date(booking.startDateTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Financials */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 font-serif text-sm font-semibold text-[#F5F2EB]">
                          <IndianRupee className="h-3 w-3 text-[#65A982]" />
                          <span>{booking.totalAmount?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getPaymentStatusBadge(booking.paymentStatus)}
                          <span className="text-[10px] text-[#737373]">
                            Fee: ₹{booking.platformFee?.toLocaleString() || 0}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      {getBookingStatusBadge(booking.bookingStatus)}
                    </td>

                    {/* Actions Menu */}
                    <td
                      className="py-3.5 pl-3 pr-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative inline-block text-left">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === booking._id ? null : booking._id
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#222222] bg-[#141414] text-[#A3A3A3] hover:border-[#383838] hover:text-[#F5F2EB] transition-colors"
                          aria-label="Booking actions menu"
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                        </button>

                        {/* Dropdown Menu */}
                        {openMenuId === booking._id && (
                          <div
                            ref={menuRef}
                            className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-[#262626] bg-[#0c0c0c] p-1.5 shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-100"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                onSelectBooking(booking);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-[#E5E5E5] hover:bg-[#1a1a1a] hover:text-[#D6B77A] transition-colors"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>View Details</span>
                            </button>

                            {booking.bookingStatus !== "cancelled" &&
                              booking.bookingStatus !== "completed" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    onCancelBooking(booking);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-[#D16B6B] hover:bg-[#D16B6B]/10 transition-colors"
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                  <span>Cancel Booking</span>
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
                {(page - 1) * 10 + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-[#F5F2EB]">
                {Math.min(page * 10, totalCount)}
              </strong>{" "}
              of <strong className="text-[#F5F2EB]">{totalCount}</strong> bookings
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

