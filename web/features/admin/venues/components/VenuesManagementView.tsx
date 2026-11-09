"use client";

import { useState, useEffect } from "react";
import { VenuesStatsCards } from "./VenuesStatsCards";
import { VenuesFilterBar } from "./VenuesFilterBar";
import { VenuesTable } from "./VenuesTable";
import { VenueDetailModal } from "./VenueDetailModal";
import { VenueRejectModal } from "./VenueRejectModal";
import {
  useVenuesList,
  useUpdateVenueStatus,
  useToggleVenueActiveStatus,
} from "../hooks/useVenues";
import {
  AdminVenue,
  VenuesQueryParams,
  VenueStatus,
} from "../types/venue.types";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function VenuesManagementView() {
  const [selectedVenue, setSelectedVenue] = useState<AdminVenue | null>(null);
  const [rejectingVenue, setRejectingVenue] = useState<AdminVenue | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [filters, setFilters] = useState<VenuesQueryParams>({
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

  // Query venues with debounced search and active filters
  const queryParams: VenuesQueryParams = {
    page: filters.page,
    limit: filters.limit,
    status: filters.status,
    category: filters.category,
    district: filters.district,
    search: debouncedSearch,
  };

  const { data, isLoading, isError } = useVenuesList(queryParams);
  const updateStatusMutation = useUpdateVenueStatus();
  const toggleActiveMutation = useToggleVenueActiveStatus();

  // Show auto-dismissing toast/notification banner
  const showFeedback = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFilterChange = (newFilters: Partial<VenuesQueryParams>) => {
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
      status: undefined,
      category: undefined,
      district: undefined,
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleSelectStatus = (status?: VenueStatus) => {
    setFilters((prev) => ({
      ...prev,
      status,
      page: 1,
    }));
  };

  // One-click Approve action
  const handleApprove = async (venue: AdminVenue) => {
    try {
      const res = await updateStatusMutation.mutateAsync({
        id: venue._id,
        payload: { status: "approved" },
      });
      showFeedback("success", res.message || `${venue.venueName} approved successfully.`);
      if (selectedVenue?._id === venue._id) {
        setSelectedVenue(null);
      }
    } catch (err: any) {
      showFeedback(
        "error",
        err?.response?.data?.message || "Failed to approve venue."
      );
    }
  };

  // Open Rejection Dialog
  const handleInitiateReject = (venue: AdminVenue) => {
    setRejectingVenue(venue);
  };

  // Confirm Rejection with reason memo
  const handleConfirmReject = async (venue: AdminVenue, reason: string) => {
    try {
      const res = await updateStatusMutation.mutateAsync({
        id: venue._id,
        payload: {
          status: "rejected",
          reason,
        },
      });
      showFeedback("success", res.message || `${venue.venueName} rejected.`);
      setRejectingVenue(null);
      if (selectedVenue?._id === venue._id) {
        setSelectedVenue(null);
      }
    } catch (err: any) {
      showFeedback(
        "error",
        err?.response?.data?.message || "Failed to reject venue."
      );
    }
  };

  // Toggle Active/Inactive state
  const handleToggleActive = async (venue: AdminVenue) => {
    try {
      const res = await toggleActiveMutation.mutateAsync(venue._id);
      showFeedback(
        "success",
        res.message ||
          `${venue.venueName} ${
            venue.isActive ? "deactivated" : "activated"
          } successfully.`
      );
      if (selectedVenue?._id === venue._id) {
        setSelectedVenue((prev) =>
          prev ? { ...prev, isActive: !prev.isActive } : null
        );
      }
    } catch (err: any) {
      showFeedback(
        "error",
        err?.response?.data?.message || "Failed to update active state."
      );
    }
  };

  const isActionPending =
    updateStatusMutation.isPending || toggleActiveMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#1a1a1a] pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#F5F2EB]">
            Venue Management
          </h1>
          <p className="mt-1 text-xs text-[#888888]">
            Curate listings, review host submissions, and manage marketplace visibility.
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

      {/* Aggregated Stats Cards */}
      <VenuesStatsCards
        currentStatus={filters.status}
        onSelectStatus={handleSelectStatus}
      />

      {/* Filter and Search Bar */}
      <VenuesFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Fixed-Height Data Table */}
      <VenuesTable
        data={data}
        isLoading={isLoading}
        isError={isError}
        page={filters.page || 1}
        onPageChange={handlePageChange}
        onSelectVenue={(v) => setSelectedVenue(v)}
        onQuickApprove={handleApprove}
        onQuickReject={handleInitiateReject}
        onToggleActive={handleToggleActive}
        onResetFilters={handleResetFilters}
        isActionPending={isActionPending}
      />

      {/* Venue Detail Dossier Modal */}
      <VenueDetailModal
        venue={selectedVenue}
        onClose={() => setSelectedVenue(null)}
        onApprove={handleApprove}
        onReject={handleInitiateReject}
        onToggleActive={handleToggleActive}
        isActionPending={isActionPending}
      />

      {/* Venue Rejection Memo Modal */}
      <VenueRejectModal
        venue={rejectingVenue}
        onClose={() => setRejectingVenue(null)}
        onConfirmReject={handleConfirmReject}
        isActionPending={isActionPending}
      />
    </div>
  );
}

