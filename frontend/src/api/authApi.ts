import { api } from "@/api/baseApi";
import type {
  RegisterFormData, RegisterResponse, VerifyOtpResponse, ResendOtpResponse, LoginFormData, LoginResponse, ForgotPasswordFormData, ForgotPasswordResponse, ForgotPasswordOtpResponse,
  ResetPasswordResponse,
  User,
} from "../features/auth/types/auth.types";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterFormData>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    verifyOtp: builder.mutation<VerifyOtpResponse, { email: string; otpNumber: string }>({
      query: (data) => ({
        url: "/auth/otp-verify",
        method: "POST",
        body: data,
      }),
    }),

    resendOtp: builder.mutation<ResendOtpResponse, { email: string }>({
      query: (data) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation<LoginResponse, LoginFormData>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordFormData>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    verifyForgotOtp: builder.mutation<ForgotPasswordOtpResponse, { otp: string; email: string }>({
      query: (data) => ({
        url: "/auth/verify-forgot-otp",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation<ResetPasswordResponse, { email: string; newPassword: string }>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    authme: builder.query<{ user: User }, void>({
      query: () => "/auth/me"
    }),
    userLogout : builder.mutation<{ success: boolean; message: string }, void>({
      query : ()=>({
        url : "/auth/logout" , 
        method : "DELETE"
      })
    })
  }),
});

export const { useRegisterMutation, useVerifyOtpMutation, useResendOtpMutation, useLoginMutation, useForgotPasswordMutation, useVerifyForgotOtpMutation, useResetPasswordMutation,
  useAuthmeQuery , useUserLogoutMutation
} = authApi;
