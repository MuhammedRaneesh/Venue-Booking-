import express from "express"
import { getAllNotificationHandler, readOneNotificationHandler, deleteOneNotificationHandler, getUnreadCountHandler, readAllNotificationHandler, deleteAllNotificationHandler } from "./Notification.controller.js";
import { protect } from "../../middleware/authMiddleware.js";
const router = express.Router();


router.get("/", protect, getAllNotificationHandler)
router.get("/unread-count", protect, getUnreadCountHandler)

router.patch("/read-all", protect, readAllNotificationHandler)
router.patch("/:id/read", protect, readOneNotificationHandler)

router.delete("/clear-all", protect, deleteAllNotificationHandler)
router.delete("/:id", protect, deleteOneNotificationHandler)

export default router