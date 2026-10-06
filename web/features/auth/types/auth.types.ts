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
