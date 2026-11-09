import { useQuery } from "@tanstack/react-query";
import { adminDashboardService } from "../services/dashboard.service";
import { DashboardPeriod } from "../types/dashboard.types";

export const ADMIN_DASHBOARD_KEYS = {
  all: ["admin", "dashboard"] as const,
  summary: (period: DashboardPeriod) =>
    [...ADMIN_DASHBOARD_KEYS.all, "summary", period] as const,
};

export function useDashboardSummary(period: DashboardPeriod = "all") {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_KEYS.summary(period),
    queryFn: () => adminDashboardService.getSummary(period),
    staleTime: 30 * 1000,
  });
}

