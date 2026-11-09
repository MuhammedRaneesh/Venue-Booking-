import { apiClient } from "@/lib/api";
import {
  OwnerApplicationActionPayload,
  OwnerApplicationActionResponse,
  OwnerApplicationDetailResponse,
  OwnerApplicationsListResponse,
  OwnerApplicationsQueryParams,
  OwnerApplicationStats,
} from "../types/application.types";

export const adminApplicationsService = {
  // Get aggregated application counts (total, pending, approved, rejected)
  getStats: async (): Promise<OwnerApplicationStats> => {
    const response = await apiClient.get<{
      success: boolean;
      data: OwnerApplicationStats;
    }>("/admin/owner-applications/stats");
    return response.data.data;
  },

  // Get paginated list of applications with optional status and search filters
  getApplications: async (
    params?: OwnerApplicationsQueryParams
  ): Promise<OwnerApplicationsListResponse> => {
    const response = await apiClient.get<OwnerApplicationsListResponse>(
      "/admin/owner-applications",
      {
        params,
      }
    );
    return response.data;
  },

  // Get single application dossier details by user or application ID
  getApplicationDetail: async (
    id: string
  ): Promise<OwnerApplicationDetailResponse> => {
    const response = await apiClient.get<OwnerApplicationDetailResponse>(
      `/admin/owner-applications/${id}`
    );
    return response.data;
  },

  // Approve or Reject an application with optional rejection reason
  updateApplicationStatus: async (
    id: string,
    payload: OwnerApplicationActionPayload
  ): Promise<OwnerApplicationActionResponse> => {
    const response = await apiClient.patch<OwnerApplicationActionResponse>(
      `/admin/owner-applications/${id}`,
      payload
    );
    return response.data;
  },
};

