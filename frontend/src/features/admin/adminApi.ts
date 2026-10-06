import { api } from "@/api/baseApi"
import { AdminGetUser, AdminGetVenueOwner, AdminGetBooking , AdminGetVenuesParams ,AdminVenueStatusPayload } from "@/features/admin/types/adminType"

export const dashboardApi = api.injectEndpoints({
    endpoints: (builder) => ({
        
        AdminDashboard: builder.query<any, { period: 'this_month' | 'this_year' | 'all' }>({
            query: ({ period }) => ({
                url: `/admin/dashboard/summary?period=${period}`,
            }),
            providesTags: ["Dashboard"]
        }),
        getAdminUsers: builder.query<any, AdminGetUser>({
            query: (params) => ({
                url: "/admin/users/allusers",
                params: {
                    ...params,
                    limit: params.limit
                }
            }),
            providesTags: ["Users"]
        }),
        toggleUserStatus: builder.mutation<any, string>({
            query: (id) => ({
                url: `/admin/users/${id}/status-change`,
                method: "PATCH"
            }),
            invalidatesTags: ["Users"]
        }),
        getUserDetail: builder.query<any, string>({
            query: (id) => ({
                url: `/admin/users/${id}/details`
            }),
            providesTags: ["Users"]
        }),
        AdminGetVenueOwnerApplication: builder.query<any, AdminGetVenueOwner>({
            query: (data) => ({
                url: "/admin/owner-applications",
                params: data
            }),
            providesTags: ["OwnerApplications"]
        }),
        AdminOwnerApplicationDetail: builder.query({
            query: (id: string) => ({
                url: `/admin/owner-applications/${id}`
            })
        }),
        AdminOwnerApplicationUpdate: builder.mutation<any, { id: string; action: string; rejectionReason?: string }>({
            query: ({ id, action, rejectionReason }) => ({
                url: `/admin/owner-applications/${id}`,
                method: "PATCH",
                body: { action, rejectionReason }
            }),
            invalidatesTags: ["OwnerApplications"]
        }),
        AdminGetBooking: builder.query<any, AdminGetBooking>({
            query: (params) => ({
                url: "/admin/bookings",
                params,
            }),
            providesTags: ["Bookings"],
        }),
        getAdminVenues: builder.query<any, AdminGetVenuesParams>({
            query: (params) => ({
                url: "/admin/venues",
                params
            }),
            providesTags: ["Venue"]
        }),

        getAdminVenueDetail: builder.query<any, string>({
            query: (id) => ({
                url: `/admin/venues/${id}`
            }),
            providesTags: ["Venue"]
        }),

        updateAdminVenueStatus: builder.mutation<any, AdminVenueStatusPayload>({
            query: ({ id, ...body }) => ({
                url: `/admin/venues/${id}/status`,
                method: "PATCH",
                body
            }),
            invalidatesTags: ["Venue"]
        }),

        toggleAdminVenueActive: builder.mutation<any, string>({
            query: (id) => ({
                url: `/admin/venues/${id}/toggle-status`,
                method: "PATCH"
            }),
            invalidatesTags: ["Venue"]
        })
    })
})


export const { useAdminDashboardQuery, useGetUserDetailQuery, useGetAdminUsersQuery, useToggleUserStatusMutation,
    useAdminGetVenueOwnerApplicationQuery, useAdminOwnerApplicationDetailQuery, useAdminOwnerApplicationUpdateMutation, useAdminGetBookingQuery
    , useGetAdminVenueDetailQuery , useGetAdminVenuesQuery , useUpdateAdminVenueStatusMutation , useToggleAdminVenueActiveMutation
} = dashboardApi
