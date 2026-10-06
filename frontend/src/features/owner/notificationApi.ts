import { api } from "@/api/baseApi"
import { GetNotificationsResponse } from "@/types/types"
export const notificationApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query<GetNotificationsResponse , void >({
            query: () => ({
                url: `/notification`,
            }),
            providesTags: ["Notifications"]
        }),

        getUnreadCount: builder.query<{ count: number }, void>({
            query: () => "/notification/unread-count",
            providesTags: ["Notifications"]
        }),

        markAsRead: builder.mutation<any, string>({
            query: (id) => ({
                url: `/notification/${id}/read`,
                method: "PATCH"
            }),
            invalidatesTags: ["Notifications"]
        }),

        markAllAsRead: builder.mutation<any, void>({
            query: () => ({
                url: "/notification/read-all",
                method: "PATCH"
            }),
            invalidatesTags: ["Notifications"]
        }),

        deleteNotification: builder.mutation<any, string>({
            query: (id) => ({
                url: `/notification/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Notifications"]
        }),

        clearAllNotifications: builder.mutation<any, void>({
            query: () => ({
                url: "/notification/clear-all",
                method: "DELETE"
            }),
            invalidatesTags: ["Notifications"]
        }),
    })
})

export const {
    useGetNotificationsQuery,
    useGetUnreadCountQuery,
    useMarkAsReadMutation,
    useMarkAllAsReadMutation,
    useDeleteNotificationMutation,
    useClearAllNotificationsMutation
} = notificationApi