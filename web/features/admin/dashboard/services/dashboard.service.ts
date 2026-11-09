import { apiClient } from "@/lib/api";
import {
  DashboardPeriod,
  DashboardSummary,
  DashboardSummaryResponse,
} from "../types/dashboard.types";

export const adminDashboardService = {
  getSummary: async (
    period: DashboardPeriod = "all"
  ): Promise<DashboardSummary> => {
    const response = await apiClient.get<DashboardSummaryResponse>(
      "/admin/dashboard/summary",
      {
        params: { period },
      }
    );
    return response.data.data;
  },
};

