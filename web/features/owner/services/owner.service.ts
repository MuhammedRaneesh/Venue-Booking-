import { apiClient } from "@/lib/api";
import {
  OwnerApplicationPayload,
  OwnerApplicationResponse,
} from "../types/owner.types";

export const ownerService = {
  submitOnboarding: async (
    payload: OwnerApplicationPayload
  ): Promise<OwnerApplicationResponse> => {
    const response = await apiClient.post<OwnerApplicationResponse>(
      "/owner/onboarding",
      payload
    );
    return response.data;
  },
};

export default ownerService;
