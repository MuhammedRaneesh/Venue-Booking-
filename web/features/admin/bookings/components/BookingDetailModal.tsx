"use client";

import {
  X,
  CalendarCheck,
  Building2,
  Users,
  IndianRupee,
  Calendar,
  Clock,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  BadgePercent,
  Receipt,
} from "lucide-react";
import { AdminBooking, BookingStatus, PaymentStatus } from "../types/booking.types";

interface BookingDetailModalProps {
  booking: AdminBooking | null;
  onClose: () => void;
  onInitiateCancel: (booking: AdminBooking) => void;
  isActionPending?: boolean;
}

export function BookingDetailModal({
  booking,
  onClose,
  onInitiateCancel,
  isActionPending,
}: BookingDetailModalProps) {
  if (!booking) return null;

  const user = booking.userId;
  const venue = booking.venueId;
  const venueAddress = venue?.location?.address;
  const venuePhoto = venue?.photos?.[0];
  const isCancelled = booking.bookingStatus === "cancelled";

  const getBookingStatusBadge = (status: BookingStatus | string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-[#65A982]/30 bg-[#65A982]/10 px-2.5 py-0.5 text-xs font-medium text-[#65A982]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Approved
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/10 px-2.5 py-0.5 text-xs font-medium text-[#38BDF8]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Completed
          </span>
        );
      case "cancelled":
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-[#D16B6B]/30 bg-[#D16B6B]/10 px-2.5 py-0.5 text-xs font-medium text-[#D16B6B]">
            <XCircle className="h-3.5 w-3.5" />
            {status === "rejected" ? "Rejected" : "Cancelled"}
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center rounded-full border border-[#737373]/30 bg-[#737373]/10 px-2.5 py-0.5 text-xs font-medium text-[#A3A3A3]">
            Expired
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-[#D9A441]/35 bg-[#D9A441]/10 px-2.5 py-0.5 text-xs font-medium text-[#D9A441]">
            <Clock className="h-3.5 w-3.5 animate-pulse" />
            Pending Approval
          </span>
        );
    }
  };

  const getPaymentBadge = (status: PaymentStatus | string) => {
    switch (status) {
      case "fully_paid":
        return (
          <span className="inline-flex items-center rounded bg-[#65A982]/15 border border-[#65A982]/30 px-2 py-0.5 text-xs font-medium text-[#65A982]">
            Fully Paid
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center rounded bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 px-2 py-0.5 text-xs font-medium text-[#A78BFA]">
            Refunded
          </span>
        );
      case "unpaid":
      default:
        return (
          <span className="inline-flex items-center rounded bg-[#D9A441]/15 border border-[#D9A441]/30 px-2 py-0.5 text-xs font-medium text-[#D9A441]">
            Payment Unpaid
          </span>
        );
    }
  };

  const formatDate = (isoDate?: string) => {
    if (!isoDate) return "—";
    try {
      return new Date(isoDate).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return isoDate;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-[#222222] bg-[#0c0c0c] text-[#F5F2EB] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1a1a1a] px-6 py-4 bg-[#0e0e0e] shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D6B77A]/20 bg-[#161616] text-[#D6B77A]">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-mono text-base font-bold text-[#F5F2EB]">
                  #{booking._id.slice(-6).toUpperCase()}
                </h2>
                <span className="rounded bg-[#1a1a1a] px-2 py-0.5 text-[10px] font-medium text-[#D6B77A]">
                  {booking.eventType || "Event"}
                </span>
              </div>
              <p className="text-xs text-[#777777]">
                Reservation dossier & financial ledger
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {getBookingStatusBadge(booking.bookingStatus)}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-[#888888] hover:bg-[#1a1a1a] hover:text-[#F5F2EB] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
          {/* Cancellation Notice if cancelled */}
          {isCancelled && (
            <div className="rounded-xl border border-[#D16B6B]/30 bg-[#D16B6B]/10 p-3.5 text-[#F5F2EB]">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-[#D16B6B] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-xs text-[#D16B6B]">
                    Reservation Cancelled
                  </h4>
                  <p className="mt-1 text-xs text-[#CCCCCC] leading-relaxed">
                    Reason: &ldquo;{booking.cancellationReason || "No explanation provided"}&rdquo;
                  </p>
                  {booking.cancelledAt && (
                    <p className="mt-1 text-[11px] text-[#888888]">
                      Timestamp: {new Date(booking.cancelledAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Schedule & Timing Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-[#1a1a1a] bg-[#121212] p-3">
              <span className="text-[11px] text-[#737373]">Event Date</span>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#F5F2EB]">
                <Calendar className="h-3.5 w-3.5 text-[#D6B77A]" />
                <span>{formatDate(booking.bookingDate)}</span>
              </div>
            </div>

            <div className="rounded-xl border border-[#1a1a1a] bg-[#121212] p-3">
              <span className="text-[11px] text-[#737373]">Time Slot</span>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#F5F2EB]">
                <Clock className="h-3.5 w-3.5 text-[#D6B77A]" />
                <span>
                  {booking.startDateTime
                    ? new Date(booking.startDateTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Full Day"}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-[#1a1a1a] bg-[#121212] p-3">
              <span className="text-[11px] text-[#737373]">Guest Count</span>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#F5F2EB]">
                <Users className="h-3.5 w-3.5 text-[#D6B77A]" />
                <span>{booking.guestCount?.toLocaleString() || "—"} guests</span>
              </div>
            </div>

            <div className="rounded-xl border border-[#1a1a1a] bg-[#121212] p-3">
              <span className="text-[11px] text-[#737373]">Booking Type</span>
              <div className="mt-1 text-xs font-semibold text-[#F5F2EB] capitalize">
                {booking.bookingType || "full-day"}
              </div>
            </div>
          </div>

          {/* Financial Breakdown Ledger */}
          <div className="rounded-xl border border-[#1a1a1a] bg-[#121212] p-4">
            <div className="flex items-center justify-between mb-3 border-b border-[#1f1f1f] pb-2.5">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-[#65A982]" />
                <h3 className="text-xs font-semibold text-[#F5F2EB] uppercase tracking-wider">
                  Financial Settlement Breakdown
                </h3>
              </div>
              {getPaymentBadge(booking.paymentStatus)}
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#888888]">Gross Venue Charge</span>
                <span className="font-serif text-[#F5F2EB] font-medium">
                  ₹{booking.totalAmount?.toLocaleString() || 0}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#888888] flex items-center gap-1">
                  <BadgePercent className="h-3.5 w-3.5 text-[#65A982]" />
                  <span>Platform Commission (8%)</span>
                </span>
                <span className="font-serif text-[#65A982] font-medium">
                  + ₹{booking.platformFee?.toLocaleString() || 0}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#888888]">Net Host Payout</span>
                <span className="font-serif text-[#D6B77A] font-medium">
                  ₹{booking.ownerPayout?.toLocaleString() || 0}
                </span>
              </div>

              <div className="border-t border-[#1f1f1f] pt-2 flex items-center justify-between text-xs font-semibold">
                <span className="text-[#F5F2EB]">Total Amount</span>
                <span className="font-serif text-sm text-[#F5F2EB]">
                  ₹{booking.totalAmount?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Venue & Customer Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Venue Profile Card */}
            <div className="rounded-xl border border-[#1a1a1a] bg-[#121212] p-4">
              <div className="flex items-center gap-2 mb-2 text-[#D6B77A]">
                <Building2 className="h-4 w-4" />
                <h4 className="text-xs font-semibold uppercase tracking-wider">
                  Venue Property
                </h4>
              </div>
              <div className="flex items-center gap-3">
                {venuePhoto ? (
                  <img
                    src={venuePhoto}
                    alt={venue?.venueName || "Venue"}
                    className="h-12 w-12 rounded-lg object-cover border border-[#262626] shrink-0"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#262626] bg-black text-[#666666] shrink-0">
                    <Building2 className="h-5 w-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-medium text-[#F5F2EB] truncate">
                    {venue?.venueName || "Venue"}
                  </p>
                  <p className="text-[11px] text-[#888888] truncate">
                    {venueAddress?.city || venue?.category}
                    {venueAddress?.district ? `, ${venueAddress.district}` : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Profile Card */}
            <div className="rounded-xl border border-[#1a1a1a] bg-[#121212] p-4">
              <div className="flex items-center gap-2 mb-2 text-[#D6B77A]">
                <Users className="h-4 w-4" />
                <h4 className="text-xs font-semibold uppercase tracking-wider">
                  Customer Details
                </h4>
              </div>
              <div className="flex items-center gap-3">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.fullName || "User"}
                    className="h-10 w-10 rounded-full object-cover border border-[#262626] shrink-0"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1c1c1c] text-xs font-bold text-[#D6B77A] shrink-0">
                    {(user?.fullName || user?.email || "U")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[#F5F2EB] truncate">
                    {user?.fullName || "Customer"}
                  </p>
                  <div className="mt-0.5 space-y-0.5 text-[11px] text-[#888888]">
                    <p className="truncate">{user?.email}</p>
                    {user?.phoneNumber && <p>{user.phoneNumber}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Special Requests Memo if present */}
          {booking.specialRequest && (
            <div className="rounded-xl border border-[#1a1a1a] bg-[#121212] p-4">
              <div className="flex items-center gap-2 text-[#D6B77A] mb-1.5">
                <FileText className="h-3.5 w-3.5" />
                <h4 className="text-xs font-semibold uppercase tracking-wider">
                  Special Notes & Requests
                </h4>
              </div>
              <p className="text-xs text-[#CCCCCC] leading-relaxed">
                &ldquo;{booking.specialRequest}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-[#1a1a1a] bg-[#0e0e0e] px-6 py-4 shrink-0">
          <div>
            {!isCancelled && booking.bookingStatus !== "completed" ? (
              <button
                type="button"
                disabled={isActionPending}
                onClick={() => onInitiateCancel(booking)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#D16B6B]/40 bg-[#D16B6B]/15 px-3 py-1.5 text-xs font-medium text-[#D16B6B] hover:bg-[#D16B6B]/25 disabled:opacity-50 transition-colors cursor-pointer"
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>Cancel Reservation</span>
              </button>
            ) : (
              <span className="text-xs text-[#666666]">
                Reservation is archived / finalized
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#262626] bg-[#141414] px-4 py-2 text-xs font-medium text-[#CCCCCC] hover:bg-[#1a1a1a] hover:text-[#F5F2EB] transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}

