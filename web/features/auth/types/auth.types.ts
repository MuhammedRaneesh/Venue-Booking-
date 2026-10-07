export type UserRole = "user" | "venue_owner" | "admin";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
  profileImage?: string;
  isVerified?: boolean;
  authProvider?: "local" | "google";
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  role?: UserRole;
  phoneNumber?: string;
}

export interface RegisterResponse {
  success: boolean;
  result: {
    message: string;
  };
}

export interface VerifyOtpPayload {
  email: string;
  otpNumber: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  user: User;
}

export interface ResendOtpPayload {
  email: string;
}

export interface ResendOtpResponse {
  success: boolean;
  result: {
    message: string;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  result?: {
    message: string;
  };
  message?: string;
}

export interface VerifyForgotOtpPayload {
  email: string;
  otp: string;
}

export interface VerifyForgotOtpResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordPayload {
  email: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  result?: {
    message: string;
  };
  message?: string;
}

