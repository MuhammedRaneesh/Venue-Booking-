import { Request, Response } from "express";
import { registerSchema, verifyOtpSchema, loginSchema, verifyForgotOtpSchema, resetPasswordSchema } from "./user.validation.js";
import { registerUser, verifyOtp, loginUser, refreshAccessToken, forgotPassword, resetPassword, verifyForgotOtp, resendOtp, googleLogin, getMe } from "./user.service.js";
import { User } from "./user.schema.js";
import { catchAsync } from "../../utils/catchAsync.js";

const isProduction = process.env.NODE_ENV === "production"

export const registerController = catchAsync(async (req: Request, res: Response) => {
    const result = await registerUser(req.body)
    res.status(201).json({
        success: true,
        result
    })
})

export const verifyOtpController = catchAsync(async (req: Request, res: Response) => {
    const { email, otpNumber } = req.body 
    const { user, token, generateRefreshToken } = await verifyOtp(email, otpNumber)
    res.cookie("refreshToken", generateRefreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 14 * 24 * 60 * 60 * 1000,
    })
    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 15 * 60 * 1000
    })
    res.status(201).json({success: true,user})
})

export const resendOtpController = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body ; 
    const result = await resendOtp(email)
    res.status(200).json({ success: true, result })
})

export const loginController = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body  ; 
    const { user, token, generateRefreshToken } = await loginUser(email, password)
    res.cookie("refreshToken", generateRefreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 14 * 24 * 60 * 60 * 1000,
    })
    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 15 * 60 * 1000
    })
    res.status(200).json({success: true,user})
})

export const logoutController = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id
    if (userId) {await User.findByIdAndUpdate(userId, { refreshToken: null })}
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    });
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax"
    })
    res.status(200).json({success: true,message: "Logged out successfully"});
})

export const refreshTokenHandler = catchAsync(async (req: Request, res: Response) => {
    const refreshTokenParam = req.cookies?.refreshToken
    if (!refreshTokenParam) {return res.status(401).json({success: false,message: "refresh token required"})}
    const { Token } = await refreshAccessToken(refreshTokenParam)
    res.cookie("accessToken", Token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 15 * 60 * 1000
    })
    res.status(200).json({success: true,message: "token created"})
})

export const forgotPasswordHandler = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body ;
    const result = await forgotPassword(email)
    res.status(200).json({ success: true, result })
})

export const verifyForgotOtpHandler = catchAsync(async (req: Request, res: Response) => {
    const validation = verifyForgotOtpSchema.safeParse(req.body)
    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: validation.error.issues.map((err) => ({
                field: err.path.join("."),
                message: err.message,
            }))
        })
    }

    const { email, otp } = validation.data
    const { message } = await verifyForgotOtp(email, otp)

    res.status(200).json({ success: true, message })
})

export const resetPasswordHandler = catchAsync(async (req: Request, res: Response) => {
    const validation = resetPasswordSchema.safeParse(req.body)
    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: validation.error.issues.map((err) => ({
                field: err.path.join("."),
                message: err.message,
            }))
        })
    }

    const { email, newPassword } = validation.data
    const result = await resetPassword(email, newPassword)

    res.status(200).json({ success: true, result })
})

export const googleCallbackHandler = catchAsync(async (req: Request, res: Response) => {
    const googleUser = req.user as any

    if (!googleUser) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_failed`)
    }

    const { token, generateRefreshToken } = await googleLogin(
        googleUser._id
    )

    res.cookie("refreshToken", generateRefreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 14 * 24 * 60 * 60 * 1000,
    })
    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 15 * 60 * 1000
    })
    res.redirect(
        `${process.env.FRONTEND_URL}/auth/google/success?token=${token}`
    )
})

export const getMeHandler = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    const user = await getMe(userId)

    res.status(200).json({ success: true, user })
})

