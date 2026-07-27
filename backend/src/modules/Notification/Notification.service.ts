import { Notification } from "./Notification.Schema.js"
import { createNotificationType } from "./Notification.type.js"
import { getIo } from "../../Socket/socket.js"
import { AppError } from "../../utils/AppError.js"

export const createNotification = async ({ userId, senderId, type, title, message, data = {}, }: createNotificationType) => {
    if (!userId) throw new AppError("User Id is required", 400)
    if (!type) throw new AppError("Notification type is required", 400)
    if (!title.trim()) throw new AppError("title is required", 400)
    if (!message.trim()) throw new AppError("message is required", 400)

    const notification = await Notification.create({
        userId,
        senderId,
        type,
        title,
        message,
        data
    })
    try {
        const io = getIo()
        io.to(userId).emit("notification", notification)
    } catch (error) {
        console.log(error, "create notificcation issue ")
    }

    return notification
}

export const createNotificationsForUsers = async (userIds: string[], notification: Omit<createNotificationType, "userId">) => {
    if (userIds.length === 0) return []
    return Promise.all(
        userIds.map((userId) =>
            createNotification({
                ...notification,
                userId,
            })
        )
    )
}

export const getAllnotification = async (userId: string) => {
    const notifiction = await Notification.find({ userId }).sort({ createdAt: -1 })
    if (!notifiction) throw new AppError("No notifications found", 404)
    return notifiction
}

export const readOneNotification = async (notificationId: string, userId: string) => {

    const notification = await Notification.findOne({ _id: notificationId, userId })

    if (!notification) throw new AppError("Notification not found", 404)

    notification.isRead = true
    notification.readAt = new Date()

    await notification.save()

    return notification
}
export const getUnreadCount = async (userId: string) => {
    const totalCount = await Notification.countDocuments({ userId, isRead: false })
    return totalCount
}

export const readAllNotification = async (userId: string) => {
    const notification = await Notification.updateMany({ userId, isRead: false }, { isRead: true, readAt: new Date() })
    return notification
}

export const deleteOneNotification = async (notificationId: string, userId: string) => {
    const notification = await Notification.findOneAndDelete({ _id: notificationId, userId })
    if (!notification) throw new AppError("Notification not found", 404)
    return notification
}

export const ClearAllNotification = async (userId: string) => {
    const notification = await Notification.deleteMany({ userId })
    return notification
}
