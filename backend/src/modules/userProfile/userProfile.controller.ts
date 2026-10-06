import { Request, Response } from "express";
import { getUserProfile, updateUserProfile } from "./userProfile.service.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/AppError.js";

export const getUserProfileHandler = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const user = await getUserProfile(userId);

    res.status(200).json({
      success: true,
      user,
    });
  },
);

export const updateUserProfileHandler = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const updateData = { ...req.validatedBody };
    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    const updatedUser = await updateUserProfile(userId, updateData);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  },
);
