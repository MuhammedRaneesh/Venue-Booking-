import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUsersService } from "../services/users.service";
import { UsersQueryParams } from "../types/user.types";
import { ApiError } from "@/lib/api";

export const ADMIN_USERS_KEYS = {
  all: ["admin", "users"] as const,
  stats: () => [...ADMIN_USERS_KEYS.all, "stats"] as const,
  list: (params?: UsersQueryParams) =>
    [...ADMIN_USERS_KEYS.all, "list", params] as const,
  detail: (id: string) => [...ADMIN_USERS_KEYS.all, "detail", id] as const,
};

// Hook for fetching aggregated metrics for UI cards
export function useUserStats() {
  return useQuery({
    queryKey: ADMIN_USERS_KEYS.stats(),
    queryFn: () => adminUsersService.getUserStats(),
    staleTime: 60 * 1000,
  });
}

// Hook for fetching paginated user list with filters
export function useUsersList(params?: UsersQueryParams) {
  return useQuery({
    queryKey: ADMIN_USERS_KEYS.list(params),
    queryFn: () => adminUsersService.getUsers(params),
    staleTime: 30 * 1000,
  });
}

// Hook for toggling user active/block status
export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, ApiError, string>({
    mutationFn: (userId: string) => adminUsersService.toggleUserStatus(userId),
    onSuccess: () => {
      // Invalidate both user list and stats cards
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEYS.all });
    },
  });
}

// Hook for inspecting single user details
export function useUserDetails(userId: string) {
  return useQuery({
    queryKey: ADMIN_USERS_KEYS.detail(userId),
    queryFn: () => adminUsersService.getUserDetails(userId),
    enabled: Boolean(userId),
  });
}

