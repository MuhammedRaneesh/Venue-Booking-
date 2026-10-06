import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import {
  RegisterPayload,
  RegisterResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
  ResendOtpPayload,
  ResendOtpResponse,
} from "../types/auth.types";
import { ApiError } from "@/lib/api";

export const useRegisterMutation = (
  options?: UseMutationOptions<RegisterResponse, ApiError, RegisterPayload>
) => {
  return useMutation<RegisterResponse, ApiError, RegisterPayload>({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    ...options,
  });
};

export const useVerifyOtpMutation = (
  options?: UseMutationOptions<VerifyOtpResponse, ApiError, VerifyOtpPayload>
) => {
  return useMutation<VerifyOtpResponse, ApiError, VerifyOtpPayload>({
    mutationFn: (payload: VerifyOtpPayload) => authService.verifyOtp(payload),
    ...options,
  });
};

export const useResendOtpMutation = (
  options?: UseMutationOptions<ResendOtpResponse, ApiError, ResendOtpPayload>
) => {
  return useMutation<ResendOtpResponse, ApiError, ResendOtpPayload>({
    mutationFn: (payload: ResendOtpPayload) => authService.resendOtp(payload),
    ...options,
  });
};
