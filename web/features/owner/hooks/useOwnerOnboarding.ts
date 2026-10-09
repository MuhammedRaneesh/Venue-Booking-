import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ownerService } from "../services/owner.service";
import {
  OwnerApplicationPayload,
  OwnerApplicationResponse,
} from "../types/owner.types";
import { USER_QUERY_KEY } from "@/features/auth/hooks/useAuth";
import { ApiError } from "@/lib/api";

export function useOwnerOnboardingMutation() {
  const queryClient = useQueryClient();

  return useMutation<OwnerApplicationResponse, ApiError, OwnerApplicationPayload>({
    mutationFn: (data: OwnerApplicationPayload) =>
      ownerService.submitOnboarding(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}
