import { useQuery } from "@tanstack/react-query";
import { ownerDashboardService } from "../services/ownerDashboard.service";
import { OwnerDashboardSummary, OwnerVenue } from "../types/dashboard.types";

export const OWNER_KEYS = {
  all: ["owner"] as const,
  summary: () => [...OWNER_KEYS.all, "summary"] as const,
  venues: () => [...OWNER_KEYS.all, "venues"] as const,
};

export function useOwnerDashboardSummary() {
  return useQuery<OwnerDashboardSummary>({
    queryKey: OWNER_KEYS.summary(),
    queryFn: () => ownerDashboardService.getSummary(),
    staleTime: 60 * 1000,
  });
}

export function useOwnerVenues() {
  return useQuery<{ venues: OwnerVenue[]; totalCount: number }>({
    queryKey: OWNER_KEYS.venues(),
    queryFn: () => ownerDashboardService.getVenues(),
    staleTime: 5 * 60 * 1000,
  });
}
