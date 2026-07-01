import { Request, Response } from "express";
import { registerSchema, verifyOtpSchema, loginSchema, forgotPasswordSchema, verifyForgotOtpSchema, resetPasswordSchema } from "./user.validation.js";
import { registerUser, verifyOtp, loginUser, refreshAccessToken, forgotPassword, resetPassword, verifyForgotOtp, resendOtp, googleLogin, getMe } from "./user.service.js";
import { User } from "./user.schema.js";

export const registerController = async (req: Request, res: Response) => {
    try {
        const validation = registerSchema.safeParse(req.body)

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: validation.error.format()
            })
        }

        const result = await registerUser(validation.data)
        return res.status(201).json({
            success: true,
            result
        })
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const verifyOtpController = async (req: Request, res: Response) => {

    try {
        const validation = verifyOtpSchema.safeParse(req.body)

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: validation.error.format()
            })
        }

        const { email, otpNumber } = validation.data;
        const { user, token, generateRefreshToken } = await verifyOtp(email, otpNumber)

        res.cookie("refreshToken", generateRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 14 * 24 * 60 * 60 * 1000,
        })
        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        })
        return res.status(201).json({
            success: true,
            user
        })
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const resendOtpController = async (req: Request, res: Response) => {
    try {
        const validation = forgotPasswordSchema.safeParse(req.body)
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: validation.error.format()
            })
        }

        const { email } = validation.data
        const result = await resendOtp(email)

        return res.status(200).json({ success: true, result })
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message })
    }
}

export const loginController = async (req: Request, res: Response) => {
    try {
        const validation = loginSchema.safeParse(req.body)

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: validation.error.format()
            })
        }

        const { email, password } = validation.data
        const { user, token, generateRefreshToken } = await loginUser(email, password)

        res.cookie("refreshToken", generateRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 14 * 24 * 60 * 60 * 1000,
        })
        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        })
        return res.status(200).json({
            success: true,
            user,
        })
    } catch (error: any) {
        const statusCode = [
            "Invalid credentials",
            "Invalid password",
            "Please verify your email first"
        ].includes(error.message) ? 401 : 500

        return res.status(statusCode).json({ message: error.message })
    }
}


export const logoutController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id
        if (userId) {
            await User.findByIdAndUpdate(userId, { refreshToken: null })
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        })
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const refreshTokenHandler = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies?.refreshToken
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "refresh token required"
            })
        }
        const { Token } = await refreshAccessToken(refreshToken)
        res.cookie("accessToken", Token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        })
        return res.status(200).json({
            success: true,
            message: "token created"
        })
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }

}


export const forgotPasswordHandler = async (req: Request, res: Response) => {
    try {
        const validation = forgotPasswordSchema.safeParse(req.body)
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: validation.error.format()
            })
        }
        const { email } = validation.data;

        const result = await forgotPassword(email)

        return res.status(200).json({ success: true, result })

    } catch (error: any) {

        return res.status(500).json({ success: false, message: error.message });

    }
}


export const verifyForgotOtpHandler = async (req: Request, res: Response) => {
    try {
        const validation = verifyForgotOtpSchema.safeParse(req.body)
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: validation.error.format()
            })
        }

        const { email, otp } = validation.data
        const { message } = await verifyForgotOtp(email, otp)

        return res.status(200).json({ success: true, message })
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message })
    }
}

export const resetPasswordHandler = async (req: Request, res: Response) => {
    try {
        const validation = resetPasswordSchema.safeParse(req.body)
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: validation.error.format()
            })
        }

        const { email, newPassword } = validation.data
        const result = await resetPassword(email, newPassword)

        return res.status(200).json({ success: true, result })
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message })
    }
}


export const googleCallbackHandler = async (req: Request, res: Response) => {
    try {
        const googleUser = req.user as any

        if (!googleUser) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_failed`)
        }

        const { token, generateRefreshToken } = await googleLogin(
            googleUser._id
        )


        res.cookie("refreshToken", generateRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 14 * 24 * 60 * 60 * 1000,
        })
        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        })
        return res.redirect(
            `${process.env.FRONTEND_URL}/auth/google/success?token=${token}`
        )

    } catch (error: any) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`)
    }
}

export const getMeHandler = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id as string
        const user = await getMe(userId)

        return res.status(200).json({ success: true, user })

    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

