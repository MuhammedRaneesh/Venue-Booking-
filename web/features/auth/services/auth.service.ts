import { apiClient } from "@/lib/api";
import {
  RegisterPayload,
  RegisterResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
  ResendOtpPayload,
  ResendOtpResponse,
  LoginPayload,
  LoginResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  VerifyForgotOtpPayload,
  VerifyForgotOtpResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  User,
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

  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      payload
    );
    return response.data;
  },

  forgotPassword: async (payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> => {
    const response = await apiClient.post<ForgotPasswordResponse>(
      "/auth/forgot-password",
      payload
    );
    return response.data;
  },

  verifyForgotOtp: async (payload: VerifyForgotOtpPayload): Promise<VerifyForgotOtpResponse> => {
    const response = await apiClient.post<VerifyForgotOtpResponse>(
      "/auth/verify-forgot-otp",
      payload
    );
    return response.data;
  },

  resetPassword: async (payload: ResetPasswordPayload): Promise<ResetPasswordResponse> => {
    const response = await apiClient.post<ResetPasswordResponse>(
      "/auth/reset-password",
      payload
    );
    return response.data;
  },

  getMe: async (): Promise<{ success: boolean; user: User }> => {
    const response = await apiClient.get<{ success: boolean; user: User }>(
      "/auth/me"
    );
    return response.data;
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      "/auth/logout"
    );
    return response.data;
  },
};

export default authService;
