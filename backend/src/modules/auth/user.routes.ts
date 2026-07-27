import express from "express";
import { registerController, verifyOtpController, loginController, logoutController, refreshTokenHandler, forgotPasswordHandler, verifyForgotOtpHandler, resetPasswordHandler, resendOtpController, googleCallbackHandler, getMeHandler } from "./user.controller.js"
import { protect } from "../../middleware/authMiddleware.js";
import { registerSchema, verifyOtpSchema , resetOtpSchema , loginSchema } from "./user.validation.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import passport from "passport";
const router = express.Router()

// register 
router.post("/register",validateRequest(registerSchema , "body") ,registerController)
router.post("/otp-verify",validateRequest(verifyOtpSchema , "body")  , verifyOtpController)
router.post("/resend-otp",validateRequest(resetOtpSchema , "body"), resendOtpController )
// login 
router.post("/login",validateRequest(loginSchema , "body") , loginController)
router.post("/logout", logoutController)
router.post("/refresh-token", refreshTokenHandler)

// password 
router.post("/forgot-password", forgotPasswordHandler)
router.post("/verify-forgot-otp", verifyForgotOtpHandler)
router.post("/reset-password", resetPasswordHandler)

// google auth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }))
router.get("/google/callback", passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed`, session: false }), googleCallbackHandler)

// user details
router.get("/me", protect, getMeHandler)

// user logout 
router.delete("/logout", logoutController)
export default router
