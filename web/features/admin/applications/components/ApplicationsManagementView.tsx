"use client";

import { useState, useEffect } from "react";
import { ApplicationStatsCards } from "./ApplicationStatsCards";
import { ApplicationFilterBar } from "./ApplicationFilterBar";
import { ApplicationTable } from "./ApplicationTable";
import { ApplicationDetailModal } from "./ApplicationDetailModal";
import { ApplicationRejectModal } from "./ApplicationRejectModal";
import {
  useOwnerApplicationsList,
  useUpdateOwnerApplicationStatus,
} from "../hooks/useApplications";
import {
  OwnerApplication,
  OwnerApplicationsQueryParams,
  OwnerApplicationStatus,
} from "../types/application.types";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function ApplicationsManagementView() {
  const [selectedApplication, setSelectedApplication] =
    useState<OwnerApplication | null>(null);
  const [rejectingApplication, setRejectingApplication] =
    useState<OwnerApplication | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [filters, setFilters] = useState<OwnerApplicationsQueryParams>({
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

  // Query applications with debounced search
  const queryParams: OwnerApplicationsQueryParams = {
    page: filters.page,
    limit: filters.limit,
    ownerStatus: filters.ownerStatus,
    search: debouncedSearch,
  };

  const { data, isLoading, isError } = useOwnerApplicationsList(queryParams);
  const updateMutation = useUpdateOwnerApplicationStatus();

  // Show auto-dismissing notification
  const showFeedback = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFilterChange = (
    newFilters: Partial<OwnerApplicationsQueryParams>
  ) => {
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
      ownerStatus: undefined,
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleSelectStatus = (status?: OwnerApplicationStatus) => {
    setFilters((prev) => ({
      ...prev,
      ownerStatus: status,
      page: 1,
    }));
  };

  // Approve action
  const handleApprove = async (application: OwnerApplication) => {
    const targetId = application.user?._id || application._id;
    try {
      const res = await updateMutation.mutateAsync({
        id: targetId,
        payload: { action: "APPROVED" },
      });
      showFeedback(
        "success",
        res.message || `${application.businessName} approved successfully.`
      );
      setSelectedApplication(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to approve host application.";
      showFeedback("error", message);
    }
  };

  // Reject action triggers rejection modal
  const handleOpenReject = (application: OwnerApplication) => {
    setRejectingApplication(application);
  };

  // Confirm rejection with reason
  const handleConfirmReject = async (
    application: OwnerApplication,
    reason: string
  ) => {
    const targetId = application.user?._id || application._id;
    try {
      const res = await updateMutation.mutateAsync({
        id: targetId,
        payload: {
          action: "REJECTED",
          rejectionReason: reason,
        },
      });
      showFeedback(
        "success",
        res.message || `${application.businessName} application has been rejected.`
      );
      setSelectedApplication(null);
      setRejectingApplication(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to reject application.";
      showFeedback("error", message);
      throw err;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Operational Brief */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#F5F2EB]">
          Host Applications
        </h1>
        <p className="text-sm text-[#888888]">
          Review venue owner registration dossiers, verify business credentials, and manage host onboarding approvals.
        </p>
      </div>

      {/* Floating Feedback Notification */}
      {notification && (
        <div
          className={`flex items-center gap-2.5 rounded-xl border p-3.5 text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-200 ${
            notification.type === "success"
              ? "border-[#65A982]/30 bg-[#0c1811] text-[#65A982]"
              : "border-[#D16B6B]/30 bg-[#1f0f0f] text-[#D16B6B]"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* 1. Operational Metric Cards */}
      <ApplicationStatsCards
        currentStatus={filters.ownerStatus}
        onSelectStatus={handleSelectStatus}
      />

      {/* 2. Filter & Search Controls */}
      <ApplicationFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* 3. Applications Data Table */}
      <ApplicationTable
        data={data}
        isLoading={isLoading}
        isError={isError}
        page={filters.page || 1}
        onPageChange={handlePageChange}
        onSelectApplication={(app) => setSelectedApplication(app)}
        onQuickApprove={handleApprove}
        onQuickReject={handleOpenReject}
        onResetFilters={handleResetFilters}
        isActionPending={updateMutation.isPending}
      />

      {/* 4. Deep Inspection Dossier Modal */}
      <ApplicationDetailModal
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onApprove={handleApprove}
        onReject={handleOpenReject}
        isActionPending={updateMutation.isPending}
      />

      {/* 5. Rejection Reason Modal */}
      <ApplicationRejectModal
        application={rejectingApplication}
        isOpen={Boolean(rejectingApplication)}
        onClose={() => setRejectingApplication(null)}
        onConfirmReject={handleConfirmReject}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}

