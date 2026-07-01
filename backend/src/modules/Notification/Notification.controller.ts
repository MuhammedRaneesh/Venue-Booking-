import { Request, Response } from "express";
import { getAllnotification, readOneNotification, deleteOneNotification, getUnreadCount  , readAllNotification, ClearAllNotification} from "./Notification.service.js";

export const getAllNotificationHandler = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id!
        const resuit = await getAllnotification(userId)
        res.status(200).json({
            success: true,
            data: resuit
        })
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}



export const getUnreadCountHandler = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id!
        const result = await getUnreadCount(userId)
        res.status(200).json({
            success: true,
            count: result
        })
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const readOneNotificationHandler = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id!
        const notificationId = req.params.id as string
        const result = await readOneNotification(notificationId , userId)
        res.status(200).json({
            success: true,
            message: "Notification marked as read",
            data: result
        })
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const readAllNotificationHandler = async (req : Request , res :Response) =>{
    try {
        const userId = req.user?._id!
        const result = await readAllNotification(userId)
        res.status(200).json({
            success : true ,
            message : "All notifications marked as read"
        })
    } catch (error : any) {
        return res.status(400).json({
            success   : false, 
            message  : error.message 
        })
    }
}

export const deleteOneNotificationHandler = async (req: Request, res: Response) => {
    try {
        const notificationId = req.params.id as string
        const userId = req.user?._id!
        const result = await deleteOneNotification(notificationId, userId)
        res.status(200).json({
            success: true,
            message: "Notification deleted"
        })
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const deleteAllNotificationHandler = async (req : Request , res : Response) => {
    try {
        const userId = req.user?._id! 
        const result = await ClearAllNotification(userId)
        res.status(200).json({
            success : true , 
            message : "All notifications cleared"
        })
    } catch (error : any) {
        return res.status(400).json({
            success : false ,
            message : error.message 
        })
    }
}