import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApplicationsService } from "../services/applications.service";
import {
  OwnerApplicationsQueryParams,
  OwnerApplicationActionPayload,
} from "../types/application.types";
import { ApiError } from "@/lib/api";

export const ADMIN_APPLICATIONS_KEYS = {
  all: ["admin", "applications"] as const,
  stats: () => [...ADMIN_APPLICATIONS_KEYS.all, "stats"] as const,
  list: (params?: OwnerApplicationsQueryParams) =>
    [...ADMIN_APPLICATIONS_KEYS.all, "list", params] as const,
  detail: (id: string) => [...ADMIN_APPLICATIONS_KEYS.all, "detail", id] as const,
};

// Hook for fetching application stats (total, pending, approved, rejected)
export function useOwnerApplicationStats() {
  return useQuery({
    queryKey: ADMIN_APPLICATIONS_KEYS.stats(),
    queryFn: () => adminApplicationsService.getStats(),
    staleTime: 30 * 1000,
  });
}

// Hook for fetching paginated application list
export function useOwnerApplicationsList(params?: OwnerApplicationsQueryParams) {
  return useQuery({
    queryKey: ADMIN_APPLICATIONS_KEYS.list(params),
    queryFn: () => adminApplicationsService.getApplications(params),
    staleTime: 30 * 1000,
  });
}

// Hook for fetching full application detail
export function useOwnerApplicationDetail(id: string | null) {
  return useQuery({
    queryKey: ADMIN_APPLICATIONS_KEYS.detail(id || ""),
    queryFn: () => adminApplicationsService.getApplicationDetail(id || ""),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

// Hook for updating application approval or rejection
export function useUpdateOwnerApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string },
    ApiError,
    { id: string; payload: OwnerApplicationActionPayload }
  >({
    mutationFn: ({ id, payload }) =>
      adminApplicationsService.updateApplicationStatus(id, payload),
    onSuccess: () => {
      // Invalidate applications list, stats, and user tables
      queryClient.invalidateQueries({ queryKey: ADMIN_APPLICATIONS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

