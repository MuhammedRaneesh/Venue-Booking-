import { api } from "@/api/baseApi";
import {
    ResponseApplication,
    ApplicationFormData,
    ResponseVenueAdd,
    GetVenue,
    UpdateVenue,
    getVenueOwnerQuery,
    OwnerDashboardChartPeriod,
    OwnerDashboardChartResponse,
    OwnerDashboardSummaryResponse,
} from "@/features/owner/types/owner.type";
export const OwnerApi = api.injectEndpoints({
    endpoints: (builder) => ({
        ApplicationForm: builder.mutation<ResponseApplication, ApplicationFormData>({
            query: (data) => ({
                url: "/owner/onboarding",
                method: "POST",
                body: data
            })
        }),
        AddVenueApi: builder.mutation<ResponseVenueAdd, FormData>({
            query: (data) => ({
                url: "/owner/venue",
                method: "POST",
                body: data
            })
        }),

        getVenueById: builder.query<GetVenue, string>({
            query: (venueId) => `/owner/venue/${venueId}`
        }),

        UpdateVenue: builder.mutation<UpdateVenue, { venueId: string, data: FormData }>({
            query: ({ venueId, data }) => ({
                url: `/owner/venue/${venueId}`,
                method: "PUT",
                body: data
            })
        }),
        getBookingUpdate: builder.query({
            query: ({ page, limit }) => ({
                url: "/owner/booking",
                params: {
                    page,
                    limit
                }
            }),
            providesTags: ["MyBookings"]
        }),
        updateBookingStatus: builder.mutation({
            query: ({ bookingId, status }) => ({
                url: "/owner/booking/status",
                method: "PATCH",
                body: { bookingId, status }
            }),
            invalidatesTags: ["MyBookings"]
        }),
        getOwnerVenues: builder.query<GetVenue, getVenueOwnerQuery>({
            query: (params) => {
                const cleanParams = Object.fromEntries(
                    Object.entries(params).filter(([, value]) => value !== undefined)
                );
                return {
                    url: "/owner/venues",
                    params: cleanParams
                }
            }
        }),
        getOwnerDashboardSummary: builder.query<OwnerDashboardSummaryResponse, Record<string, never> | void>({
            query: () => ({
                url: "/owner/dashboard/summary"
            })
        }),
        getOwnerDashboard: builder.query<OwnerDashboardSummaryResponse, Record<string, never> | void>({
            query: () => ({
                url: "/owner/dashboard/summary"
            })
        }),
        getOwnerDashboardChart: builder.query<OwnerDashboardChartResponse, { period?: OwnerDashboardChartPeriod } | void>({
            query: (params) => ({
                url: "/owner/dashboard/chart",
                params: params?.period ? { period: params.period } : undefined
            })
        }),
        getOwnerProfile: builder.query({
            query: () => ({
                url: "/owner/profile"
            })
        })
    })
})

export const { useApplicationFormMutation, useAddVenueApiMutation, useGetVenueByIdQuery, useUpdateVenueMutation, useGetBookingUpdateQuery, useUpdateBookingStatusMutation,
    useGetOwnerVenuesQuery, useGetOwnerDashboardSummaryQuery, useGetOwnerDashboardQuery, useGetOwnerDashboardChartQuery, useGetOwnerProfileQuery
} = OwnerApi;
