import { z } from "zod"

export const registerSchema = z.object({
    userName: z.string().min(3, 'Username must be at least 3 characters').max(20, "Username must be under 20 characters"),
    email: z.string().email("please enter valid email").regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|co)$/, "invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters").regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    role : z.string()
})

export const otpSchema = z.object({
    otpNumber: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
})

export const loginSchema = z.object({
    email: z.string().email("please enter valid email").regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|co)$/, "invalid email format"),
    password: z.string().min(6, "Password is required")
})

export const forgotEmailSchema = z.object({
    email: z.string().email("please enter valid email ").regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|co)$/, "invalid email format")
})

export const resetPasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters").regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password do  not match ",
    path: ["confirmPassword "]
})

export const forgotOtpSchema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits")
})
export type ForgotOtpSchema = z.infer<typeof forgotOtpSchema>

export type RegisterSchema = z.infer<typeof registerSchema>
export type OtpSchema = z.infer<typeof otpSchema>
export type LoginSchema = z.infer<typeof loginSchema>
export type ForgotEmailSchema = z.infer<typeof forgotEmailSchema>
export type ResetPasswordSchemaZ = z.infer<typeof resetPasswordSchema>
