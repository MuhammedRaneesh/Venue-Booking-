import { Request, Response } from "express";
import { getUserProfile, updateUserProfile } from "./userProfile.service.js";

export const getUserProfileHandler = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const user = await getUserProfile(userId);

        res.status(200).json({
            success: true,
            user
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to fetch user profile"
        });
    }
};

export const updateUserProfileHandler = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const updateData = { ...req.validatedBody };
        if (req.file) {
            updateData.profileImage = req.file.path;
        }

        const updatedUser = await updateUserProfile(userId, updateData);

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to update profile"
        });
    }
};
