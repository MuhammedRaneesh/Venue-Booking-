import express from "express";
import { getUserProfileHandler, updateUserProfileHandler, } from "./userProfile.controller.js";
import { protect } from "../../middleware/authMiddleware.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { updateProfileSchema } from "./userProfile.validation.js";

import { uploadAvatar } from "../../middleware/upload.js";

const router = express.Router();

router.get("/", protect, getUserProfileHandler);

router.put("/", protect, uploadAvatar.single("profileImage"), validateRequest(updateProfileSchema, "body"), updateUserProfileHandler,);

export default router;
