import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { User } from "../types/auth.types";
import { ApiError } from "@/lib/api";

export const USER_QUERY_KEY = ["auth", "currentUser"];

export function useCurrentUser() {
  return useQuery<{ success: boolean; user: User }, ApiError>({
    queryKey: USER_QUERY_KEY,
    queryFn: () => authService.getMe(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, ApiError>({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(USER_QUERY_KEY, null);
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}
