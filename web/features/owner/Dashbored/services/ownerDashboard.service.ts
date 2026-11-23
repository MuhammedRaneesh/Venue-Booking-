import { apiClient } from "@/lib/api";
import { OwnerDashboardSummary, OwnerVenue } from "../types/dashboard.types";

export const ownerDashboardService = {
  getSummary: async (): Promise<OwnerDashboardSummary> => {
    try {
      const response = await apiClient.get<{
        success: boolean;
        totalVenues: number;
        activeVenues: number;
        inactiveVenues: number;
        totalBookings: number;
        pendingBookings: number;
        totalEarnings: number;
        recentBookings?: any[];
      }>("/owner/dashboard/summary");

      return {
        totalVenues: response.data.totalVenues ?? 0,
        activeVenues: response.data.activeVenues ?? 0,
        inactiveVenues: response.data.inactiveVenues ?? 0,
        totalBookings: response.data.totalBookings ?? 0,
        pendingBookings: response.data.pendingBookings ?? 0,
        totalEarnings: response.data.totalEarnings ?? 0,
        recentBookings: response.data.recentBookings ?? [],
      };
    } catch {
      return {
        totalVenues: 0,
        activeVenues: 0,
        inactiveVenues: 0,
        totalBookings: 0,
        pendingBookings: 0,
        totalEarnings: 0,
        recentBookings: [],
      };
    }
  },

  getVenues: async (): Promise<{ venues: OwnerVenue[]; totalCount: number }> => {
    try {
      const response = await apiClient.get<{
        success: boolean;
        venue: OwnerVenue[];
        totalCount: number;
      }>("/owner/venues");
      return {
        venues: response.data.venue ?? [],
        totalCount: response.data.totalCount ?? 0,
      };
    } catch {
      return {
        venues: [],
        totalCount: 0,
      };
    }
  },
};
