import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { socket } from "@/services/socket"
import { api } from "@/api/baseApi"
import {useGetNotificationsQuery,useGetUnreadCountQuery,useMarkAsReadMutation,useMarkAllAsReadMutation,useDeleteNotificationMutation,useClearAllNotificationsMutation
} from "@/features/owner/notificationApi"

export const useNotifications = () => {
    const dispatch = useDispatch()

    const { data: notifData, isLoading } = useGetNotificationsQuery()
    const { data: countData } = useGetUnreadCountQuery()
    const [markAsRead] = useMarkAsReadMutation()
    const [markAllAsRead] = useMarkAllAsReadMutation()
    const [deleteNotification] = useDeleteNotificationMutation()
    const [clearAll] = useClearAllNotificationsMutation()

    const notifications = notifData?.data || []
    const unreadCount = countData?.count || 0


    useEffect(() => {
        socket.on("notification", (data) => {
            console.log("Notification received:", data)
            dispatch(api.util.invalidateTags(["Notifications"]))
        })
        return () => {
            socket.off("notification")
        }
    }, [dispatch])

    const handleMarkAsRead = async (id: string, isRead: boolean) => {
        if (!isRead) await markAsRead(id)
    }

    return {
        notifications,
        unreadCount,
        isLoading,
        handleMarkAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll
    }
}
