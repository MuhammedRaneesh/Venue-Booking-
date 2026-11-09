import { apiClient } from "@/lib/api";
import {
  AdminVenue,
  VenueDetailResponse,
  VenuesListResponse,
  VenuesQueryParams,
  VenueStats,
  UpdateVenueStatusPayload,
} from "../types/venue.types";

export const adminVenuesService = {
  // Get aggregated venue counts (total, approved, pending, rejected, suspended, active)
  getStats: async (): Promise<VenueStats> => {
    const response = await apiClient.get<{
      success: boolean;
      stats: VenueStats;
    }>("/admin/venues/stats");
    return response.data.stats;
  },

  // Get paginated list of venues with filters
  getVenues: async (
    params?: VenuesQueryParams
  ): Promise<VenuesListResponse> => {
    const response = await apiClient.get<VenuesListResponse>(
      "/admin/venues",
      {
        params,
      }
    );
    return response.data;
  },

  // Get single venue dossier details
  getVenueDetail: async (id: string): Promise<AdminVenue> => {
    const response = await apiClient.get<VenueDetailResponse>(
      `/admin/venues/${id}`
    );
    return response.data.venue;
  },

  // Update venue moderation status (approved, rejected, suspended)
  updateVenueStatus: async (
    id: string,
    payload: UpdateVenueStatusPayload
  ): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
    }>(`/admin/venues/${id}/status`, payload);
    return response.data;
  },

  // Toggle venue active/deactivated state
  toggleVenueActiveStatus: async (
    id: string
  ): Promise<{ success: boolean; message: string; isActive?: boolean }> => {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
      isActive?: boolean;
    }>(`/admin/venues/${id}/toggle-status`);
    return response.data;
  },
};

