import { RegisterInput } from "./user.validation.js"
import { User } from "./user.schema.js"
import { generateOtp } from "../../utils/generateOtp.js"
import bcrypt from "bcryptjs"
import redisClient from "../../config/redis.js"
import { sendOtpEmail, sendForgotPasswordEmail, sendWelcomeEmail } from "../../utils/email.service.js"
import { accessToken, refreshToken } from "../../utils/tokenGenerating.js"
import Jwt from "jsonwebtoken"

export const registerUser = async (userData: RegisterInput) => {

    const existingUser = await User.findOne({
        email: userData.email
    })

    if (existingUser) {
        throw new Error("User already exists")
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
        throw new Error("OTP expired or invalid. Please register again.");
    }

    const { otp, userData } = JSON.parse(redisStore)

    if (String(otp) !== otpNumber) {
        throw new Error("Invalid OTP")
    }

    const user = await User.create({
        ...userData,
        isVerified: true
    })

    await redisClient.del(redisKey)
    const token = accessToken(String(user._id), user.role)
    const generateRefreshToken = refreshToken(String(user._id))

    user.refreshToken = generateRefreshToken
    await user.save()
    sendWelcomeEmail(user.email, user.userName)
    return {
        user: {
            id: user._id,
            userName: user.userName,
            email: user.email,
            role: user.role
        },
        token,
        generateRefreshToken
    }
}

export const resendOtp = async (email: string) => {

    const existing = await redisClient.get(`otp:register:${email}`)

    if (!existing) throw new Error("Session expired. Please register again.")

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
        throw new Error("Invalid email or password")
    }
    if (!user.isActive) {
        throw new Error(
            "Your account has been blocked by the administrator. Please contact support."
        );
    }
    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
        throw new Error("Invalid password")
    }
    if (!user.isVerified) {
        throw new Error("Please verify your email first")
    }

    const token = accessToken(String(user._id), user.role)
    const generateRefreshToken = refreshToken(String(user._id))

    user.refreshToken = generateRefreshToken
    await user.save()
    sendWelcomeEmail(user.email, user.userName)
    return {
        user: {
            id: user._id,
            userName: user.userName,
            email: user.email,
            role: user.role
        },
        token,
        generateRefreshToken
    }
}

export const refreshAccessToken = async (refreshToken: string) => {

    if (!refreshToken) {
        throw new Error("no token provided")
    }

    const decode = Jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN as string) as { userId: string }

    const user = await User.findById(decode.userId)
    if (!user || !user.isActive) throw new Error("user not found")

    if (user.refreshToken !== refreshToken) {
        throw new Error("Refresh token is expired or already used")
    }

    const newToken = accessToken(String(user._id), user.role)

    return { Token: newToken }
}

export const forgotPassword = async (email: string) => {
    console.log(email)
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
        throw new Error("OTP expired or invalid. Please request a new one.")
    }

    if (String(storedOtp) !== String(otp)) {
        throw new Error("Invalid OTP")
    }

    await redisClient.setEx(`verified:${email}:forgot_password`, 300, "true")
    await redisClient.del(redisKey)

    return { message: "OTP verified. You can now reset your password." }
}

export const resetPassword = async (email: string, newPassword: string) => {

    const verifiedKey = `verified:${email}:forgot_password`
    const isVerified = await redisClient.get(verifiedKey)

    if (!isVerified) {
        throw new Error("Please verify your OTP first.")
    }

    const user = await User.findOne({ email })
    if (!user) throw new Error("User not found")

    const hashed = await bcrypt.hash(newPassword, 10)
    user.password = hashed
    user.refreshToken = ""
    await user.save()

    await redisClient.del(verifiedKey)

    return { message: "Password reset successfully. Please login." }
}


export const googleLogin = async (userId: string) => {

    const user = await User.findById(userId)

    if (!user || !user.isActive) throw new Error("User not found  or Account is deactivated")

    const token = accessToken(String(user._id), user.role)
    const generateRefreshToken = refreshToken(String(user._id))

    user.refreshToken = generateRefreshToken

    await user.save()
    return { token, generateRefreshToken }
}

export const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password -refreshToken");
    return user
}
