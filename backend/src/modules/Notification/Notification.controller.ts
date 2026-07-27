import { Request, Response } from "express";
import { getAllnotification, readOneNotification, deleteOneNotification, getUnreadCount, readAllNotification, ClearAllNotification } from "./Notification.service.js";
import { catchAsync } from "../../utils/catchAsync.js";

export const getAllNotificationHandler = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id!
    const resuit = await getAllnotification(userId)
    res.status(200).json({
        success: true,
        data: resuit
    })
})

export const getUnreadCountHandler = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id!
    const result = await getUnreadCount(userId)
    res.status(200).json({
        success: true,
        count: result
    })
})

export const readOneNotificationHandler = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id!
    const notificationId = req.params.id as string
    const result = await readOneNotification(notificationId, userId)
    res.status(200).json({
        success: true,
        message: "Notification marked as read",
        data: result
    })
})

export const readAllNotificationHandler = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id!
    const result = await readAllNotification(userId)
    res.status(200).json({
        success: true,
        message: "All notifications marked as read"
    })
})

export const deleteOneNotificationHandler = catchAsync(async (req: Request, res: Response) => {
    const notificationId = req.params.id as string
    const userId = req.user?._id!
    const result = await deleteOneNotification(notificationId, userId)
    res.status(200).json({
        success: true,
        message: "Notification deleted"
    })
})

export const deleteAllNotificationHandler = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id!
    const result = await ClearAllNotification(userId)
    res.status(200).json({
        success: true,
        message: "All notifications cleared"
    })
})