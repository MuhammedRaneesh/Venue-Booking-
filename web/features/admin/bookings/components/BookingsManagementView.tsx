"use client";

import { useState, useEffect } from "react";
import { BookingsStatsCards } from "./BookingsStatsCards";
import { BookingsFilterBar } from "./BookingsFilterBar";
import { BookingsTable } from "./BookingsTable";
import { BookingDetailModal } from "./BookingDetailModal";
import { BookingCancelModal } from "./BookingCancelModal";
import {
  useBookingsList,
  useAdminCancelBooking,
} from "../hooks/useBookings";
import {
  AdminBooking,
  BookingsQueryParams,
  BookingStatus,
} from "../types/booking.types";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function BookingsManagementView() {
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(
    null
  );
  const [cancellingBooking, setCancellingBooking] =
    useState<AdminBooking | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [filters, setFilters] = useState<BookingsQueryParams>({
    page: 1,
    limit: 10,
  });

  // Debounced search query
  const [debouncedSearch, setDebouncedSearch] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      const clean = filters.search?.trim();
      setDebouncedSearch(clean && clean.length > 0 ? clean : undefined);
    }, 300);

    return () => clearTimeout(handler);
  }, [filters.search]);

  // Query bookings with debounced search
  const queryParams: BookingsQueryParams = {
    page: filters.page,
    limit: filters.limit,
    bookingStatus: filters.bookingStatus,
    paymentStatus: filters.paymentStatus,
    search: debouncedSearch,
  };

  const { data, isLoading, isError } = useBookingsList(queryParams);
  const cancelMutation = useAdminCancelBooking();

  // Show auto-dismissing toast notification
  const showFeedback = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFilterChange = (newFilters: Partial<BookingsQueryParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: undefined,
      bookingStatus: undefined,
      paymentStatus: undefined,
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleSelectStatus = (status?: BookingStatus) => {
    setFilters((prev) => ({
      ...prev,
      bookingStatus: status,
      page: 1,
    }));
  };

  // Open cancellation modal
  const handleInitiateCancel = (booking: AdminBooking) => {
    setCancellingBooking(booking);
  };

  // Confirm cancellation
  const handleConfirmCancel = async (booking: AdminBooking, reason: string) => {
    try {
      const res = await cancelMutation.mutateAsync({
        id: booking._id,
        reason,
      });
      showFeedback("success", res.message || "Booking cancelled successfully.");
      setCancellingBooking(null);
      if (selectedBooking?._id === booking._id) {
        setSelectedBooking((prev) =>
          prev
            ? {
                ...prev,
                bookingStatus: "cancelled",
                cancellationReason: reason,
                cancelledAt: new Date().toISOString(),
              }
            : null
        );
      }
    } catch (err: any) {
      showFeedback(
        "error",
        err?.response?.data?.message || "Failed to cancel booking."
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#1a1a1a] pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#F5F2EB]">
            Booking Management
          </h1>
          <p className="mt-1 text-xs text-[#888888]">
            Monitor reservations, financial settlements, and platform commissions.
          </p>
        </div>
      </div>

      {/* Floating Notification Banner */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className={`flex items-center gap-2.5 rounded-xl border p-3.5 text-xs transition-all animate-in fade-in duration-200 ${
            notification.type === "success"
              ? "border-[#65A982]/30 bg-[#65A982]/10 text-[#65A982]"
              : "border-[#D16B6B]/30 bg-[#D16B6B]/10 text-[#D16B6B]"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span className="font-medium text-[#F5F2EB]">
            {notification.message}
          </span>
        </div>
      )}

      {/* Metric Stats Cards */}
      <BookingsStatsCards
        currentStatus={filters.bookingStatus}
        onSelectStatus={handleSelectStatus}
      />

      {/* Filter and Search Bar */}
      <BookingsFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Fixed-Height Data Table */}
      <BookingsTable
        data={data}
        isLoading={isLoading}
        isError={isError}
        page={filters.page || 1}
        onPageChange={handlePageChange}
        onSelectBooking={(b) => setSelectedBooking(b)}
        onCancelBooking={handleInitiateCancel}
        onResetFilters={handleResetFilters}
      />

      {/* Booking Detail Dossier Modal */}
      <BookingDetailModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onInitiateCancel={handleInitiateCancel}
        isActionPending={cancelMutation.isPending}
      />

      {/* Booking Cancellation Notice Modal */}
      <BookingCancelModal
        booking={cancellingBooking}
        onClose={() => setCancellingBooking(null)}
        onConfirmCancel={handleConfirmCancel}
        isActionPending={cancelMutation.isPending}
      />
    </div>
  );
}

