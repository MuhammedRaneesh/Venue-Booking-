interface Notification {
    _id: string
    title: string
    message: string
    type: string
    isRead: boolean
    readAt: Date | null
    createdAt: string
}

export interface GetNotificationsResponse {
    success: boolean
    data: Notification[]
}