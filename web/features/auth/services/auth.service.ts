import { apiClient } from "@/lib/api";
import {
  RegisterPayload,
  RegisterResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
  ResendOtpPayload,
  ResendOtpResponse,
} from "../types/auth.types";

export const authService = {
  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>(
      "/auth/register",
      payload
    );
    return response.data;
  },

  verifyOtp: async (payload: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
    const response = await apiClient.post<VerifyOtpResponse>(
      "/auth/otp-verify",
      payload
    );
    return response.data;
  },

  resendOtp: async (payload: ResendOtpPayload): Promise<ResendOtpResponse> => {
    const response = await apiClient.post<ResendOtpResponse>(
      "/auth/resend-otp",
      payload
    );
    return response.data;
  },
};

export default authService;
