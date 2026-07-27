import { User } from "../auth/user.schema.js";
import { UpdateProfilePayload } from "./userProfile.validation.js";
import { AppError } from "../../utils/AppError.js";

export const getUserProfile = async (userId: string) => {
    const user = await User.findById(userId).select("-password -__v -refreshToken");
    if (!user) throw new AppError("User not found", 404);
    return user;
};

export const updateUserProfile = async (userId: string, data: UpdateProfilePayload) => {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    if (data.userName) user.userName = data.userName;
    if (data.phoneNumber) user.phoneNumber = data.phoneNumber;
    if (data.profileImage !== undefined) user.profileImage = data.profileImage;

    await user.save();

    // Return the updated user without sensitive fields
    const updatedUser = await User.findById(userId).select("-password -__v -refreshToken");
    return updatedUser;
};
