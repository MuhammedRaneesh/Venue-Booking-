import { RegisterInput } from "./user.validation.js"
import { User } from "./user.schema.js"
import { generateOtp } from "../../utils/generateOtp.js"
import bcrypt from "bcryptjs"
import redisClient from "../../config/redis.js"
import { sendOtpEmail, sendForgotPasswordEmail, sendWelcomeEmail } from "../../utils/email.service.js"
import { accessToken, refreshToken } from "../../utils/tokenGenerating.js"
import Jwt from "jsonwebtoken"
import { AppError } from "../../utils/AppError.js"


export const registerUser = async (userData: RegisterInput) => {

    const existingUser = await User.findOne({ email: userData.email })

    if (existingUser) {
        throw new AppError("User already exists", 409)
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const otp = generateOtp()
    const redisKey = `otp:register:${userData.email}`

    await redisClient.setEx(redisKey, 600, JSON.stringify({ otp, userData: { ...userData, password: hashedPassword } }))
    await sendOtpEmail(userData.email, otp)
    return { message: "OTP sent to your email. Please verify." }
}


export const verifyOtp = async (email: string, otpNumber: string) => {
    const redisKey = `otp:register:${email}`;
    const redisStore = await redisClient.get(redisKey);

    if (!redisStore) {
        throw new AppError("OTP expired or invalid. Please register again.", 401);
    }
    const { otp, userData } = JSON.parse(redisStore)
    if (String(otp) !== otpNumber) {
        throw new AppError("Invalid OTP", 401)
    }

    const user = await User.create({ ...userData, isVerified: true })
    await redisClient.del(redisKey)
    const token = accessToken(String(user._id), user.role)!
    const generateRefreshToken = refreshToken(String(user._id))

    user.refreshToken = generateRefreshToken
    await user.save()
    sendWelcomeEmail(user.email, user.fullName)
    return {
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
        },
        token,
        generateRefreshToken
    }
}

export const resendOtp = async (email: string) => {

    const existing = await redisClient.get(`otp:register:${email}`)

    if (!existing) throw new AppError("Session expired. Please register again.", 401)

    const { userData } = JSON.parse(existing)

    await redisClient.del(`otp:register:${email}`)

    const otp = generateOtp()

    await redisClient.setEx(`otp:register:${email}`, 600, JSON.stringify({ otp, userData }))

    await sendOtpEmail(email, otp)

    return { message: "New OTP sent to your email." }
}

export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email: email, isActive: true }).select("+password")
    if (!user || !user.password) {
        throw new AppError("Invalid email or password", 401)
    }
    if (!user.isActive) {
        throw new AppError("Your account has been blocked by the administrator. Please contact support.", 403);
    }
    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) {
        throw new AppError("Invalid password", 401)
    }
    if (!user.isVerified) {
        throw new AppError("Please verify your email first", 401)
    }

    const token = accessToken(String(user._id), user.role)
    const generateRefreshToken = refreshToken(String(user._id))

    user.refreshToken = generateRefreshToken
    await user.save()
    sendWelcomeEmail(user.email, user.fullName)
    return {
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
        },
        token,
        generateRefreshToken
    }
}

export const refreshAccessToken = async (refreshTokenParam: string) => {
    if (!refreshTokenParam) {
        throw new AppError("no token provided", 401)
    }
    try {
        const decode = Jwt.verify(refreshTokenParam, process.env.JWT_REFRESH_TOKEN as string) as { userId: string }
        const user = await User.findById(decode.userId)
        if (!user || !user.isActive) throw new AppError("user not found", 404)
        if (user.refreshToken !== refreshTokenParam) {
            throw new AppError("Refresh token is expired or already used", 401)
        }
        const newToken = accessToken(String(user._id), user.role)
        return { Token: newToken }
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Invalid or expired refresh token", 401)
    }
}

export const forgotPassword = async (email: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        return { message: "If this email exists, an OTP has been sent." }
    }
    const otp = generateOtp()
    await redisClient.setEx(`otp:${email}:forgot_password`, 180, otp);
    await sendForgotPasswordEmail(email, otp)
    return { message: "If this email exists, an OTP has been sent" }
}

export const verifyForgotOtp = async (email: string, otp: string) => {
    const redisKey = `otp:${email}:forgot_password`
    const storedOtp = await redisClient.get(redisKey)
    if (!storedOtp) {
        throw new AppError("OTP expired or invalid. Please request a new one.", 401)
    }
    if (String(storedOtp) !== String(otp)) {
        throw new AppError("Invalid OTP", 401)
    }
    await redisClient.setEx(`verified:${email}:forgot_password`, 300, "true")
    await redisClient.del(redisKey)
    return { message: "OTP verified. You can now reset your password." }
}

export const resetPassword = async (email: string, newPassword: string) => {
    const verifiedKey = `verified:${email}:forgot_password`
    const isVerified = await redisClient.get(verifiedKey)
    if (!isVerified) {
        throw new AppError("Please verify your OTP first.", 403)
    }
    const user = await User.findOne({ email })
    if (!user) throw new AppError("User not found", 404)
    const hashed = await bcrypt.hash(newPassword, 10)
    user.password = hashed
    user.refreshToken = ""
    await user.save()
    await redisClient.del(verifiedKey)
    return { message: "Password reset successfully. Please login." }
}

export const googleLogin = async (userId: string) => {
    const user = await User.findById(userId)
    if (!user || !user.isActive) throw new AppError("User not found or Account is deactivated", 403)
    const token = accessToken(String(user._id), user.role)
    const generateRefreshToken = refreshToken(String(user._id))
    user.refreshToken = generateRefreshToken
    await user.save()
    return { token, generateRefreshToken }
}

export const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) throw new AppError("User not found", 404)
    return user
}
