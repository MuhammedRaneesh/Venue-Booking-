import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminVenuesService } from "../services/venues.service";
import {
  VenuesQueryParams,
  UpdateVenueStatusPayload,
} from "../types/venue.types";
import { ApiError } from "@/lib/api";

export const ADMIN_VENUES_KEYS = {
  all: ["admin", "venues"] as const,
  stats: () => [...ADMIN_VENUES_KEYS.all, "stats"] as const,
  list: (params?: VenuesQueryParams) =>
    [...ADMIN_VENUES_KEYS.all, "list", params] as const,
  detail: (id: string) => [...ADMIN_VENUES_KEYS.all, "detail", id] as const,
};

// Hook for fetching aggregated venue statistics
export function useVenueStats() {
  return useQuery({
    queryKey: ADMIN_VENUES_KEYS.stats(),
    queryFn: () => adminVenuesService.getStats(),
    staleTime: 30 * 1000,
  });
}

// Hook for fetching paginated venues list
export function useVenuesList(params?: VenuesQueryParams) {
  return useQuery({
    queryKey: ADMIN_VENUES_KEYS.list(params),
    queryFn: () => adminVenuesService.getVenues(params),
    staleTime: 30 * 1000,
  });
}

// Hook for fetching single venue detail dossier
export function useVenueDetail(id: string | null) {
  return useQuery({
    queryKey: ADMIN_VENUES_KEYS.detail(id || ""),
    queryFn: () => adminVenuesService.getVenueDetail(id || ""),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

// Hook for updating venue moderation status (approved, rejected, suspended)
export function useUpdateVenueStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string },
    ApiError,
    { id: string; payload: UpdateVenueStatusPayload }
  >({
    mutationFn: ({ id, payload }) =>
      adminVenuesService.updateVenueStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_VENUES_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

// Hook for toggling venue active/deactivated status
export function useToggleVenueActiveStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string; isActive?: boolean },
    ApiError,
    string
  >({
    mutationFn: (id: string) =>
      adminVenuesService.toggleVenueActiveStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_VENUES_KEYS.all });
    },
  });
}

