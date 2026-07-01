
export interface RegisterFormData {
  userName: string
  email: string
  password: string
}

export interface OtpFormData {
  otpNumber: string
}



export interface User1 {
  id: string
  userName: string
  email: string
  role: string
  ownerStatus: string
}

export interface AuthState {
  user: User | null
  token: string | null
}

export interface RegisterResponse {
  success: boolean
  result: {
    message: string
  }
  token: string
  user: User1
}
export interface User {
  id: string
  userName: string
  email: string
  role: string
  profileImage?: string
  phoneNumber?: string
  isVerified?: boolean
  authProvider?: 'local' | 'google',
  ownerStatus: string
  createdAt?: string
}

export interface VerifyOtpResponse {
  success: boolean
  user: User1
  token: string
}

export interface ResendOtpResponse {
  success: boolean
  result: {
    message: string
  }
}

export interface LoginResponse {
  success: boolean
  token: string
  user: User1
}

export interface LoginFormData {
  email: string
  password: string
}

export interface ForgotPasswordFormData {
  email: string
}

export interface ForgotPasswordResponse {
  success: boolean
  result: {
    message: string
  }
}

export interface ForgotPasswordOtpResponse {
  success: boolean,
  message: string
}



export interface ResetPasswordResponse {
  success: boolean,
  message: string
}

export interface UpdateUserProfilePayload {
  userName?: string;
  phoneNumber?: string;
  profileImage?: string;
}

export interface GetUserProfileResponse {
  success: boolean;
  user: User;
}

export interface UpdateUserProfileResponse {
  success: boolean;
  message: string;
  user: User;
}
