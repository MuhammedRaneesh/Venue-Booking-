import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import {
  LoginPayload,
  LoginResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  VerifyForgotOtpPayload,
  VerifyForgotOtpResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
} from "../types/auth.types";
import { ApiError } from "@/lib/api";

export const useLoginMutation = (
  options?: UseMutationOptions<LoginResponse, ApiError, LoginPayload>
) => {
  return useMutation<LoginResponse, ApiError, LoginPayload>({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    ...options,
  });
};

export const useForgotPasswordMutation = (
  options?: UseMutationOptions<
    ForgotPasswordResponse,
    ApiError,
    ForgotPasswordPayload
  >
) => {
  return useMutation<ForgotPasswordResponse, ApiError, ForgotPasswordPayload>({
    mutationFn: (payload: ForgotPasswordPayload) =>
      authService.forgotPassword(payload),
    ...options,
  });
};

export const useVerifyForgotOtpMutation = (
  options?: UseMutationOptions<
    VerifyForgotOtpResponse,
    ApiError,
    VerifyForgotOtpPayload
  >
) => {
  return useMutation<VerifyForgotOtpResponse, ApiError, VerifyForgotOtpPayload>({
    mutationFn: (payload: VerifyForgotOtpPayload) =>
      authService.verifyForgotOtp(payload),
    ...options,
  });
};

export const useResetPasswordMutation = (
  options?: UseMutationOptions<
    ResetPasswordResponse,
    ApiError,
    ResetPasswordPayload
  >
) => {
  return useMutation<ResetPasswordResponse, ApiError, ResetPasswordPayload>({
    mutationFn: (payload: ResetPasswordPayload) =>
      authService.resetPassword(payload),
    ...options,
  });
};
