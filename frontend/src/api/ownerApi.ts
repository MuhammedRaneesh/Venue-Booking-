import { api } from "@/api/baseApi";
import { ResponseApplication, ApplicationFormData, ResponseVenueAdd, GetVenue, UpdateVenue, getVenueOwnerQuery } from "@/features/owner/types/owner.type";
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
        getOwnerDashboard: builder.query({
            query: () => ({
                url: "/owner/dashboard"
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
    useGetOwnerVenuesQuery, useGetOwnerDashboardQuery , useGetOwnerProfileQuery
} = OwnerApi;
