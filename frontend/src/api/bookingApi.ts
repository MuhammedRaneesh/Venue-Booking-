import { api } from "./baseApi"
import { AvailabilityParams, AvailabilityResponse , CreateBookingPayload , AddBookingResponse  , CreatePaymentOrderPayload , CreatePaymentOrderResponse , VerifyPaymentPayload , VerifyPaymentResponse} from "@/features/booking/types/booking.type"
const BookingApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAvailability: builder.query<AvailabilityResponse, AvailabilityParams>({
            query: ({ venueId, date }) => ({
                url: "/booking/availability",
                params: {
                    venueId,
                    date
                }
            }),
            providesTags: ["Availability"],
        }),
        CreateBooking: builder.mutation<AddBookingResponse, CreateBookingPayload >({
            query: (data) => ({
                url: "/booking/create-booking",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Availability" , "MyBookings"]
        }),
        MyBooking : builder.query({
            query : () => `/booking` ,
            providesTags : ["MyBookings"]
        }),
        createPaymentOrder : builder.mutation<CreatePaymentOrderResponse , CreatePaymentOrderPayload>({
            query : (data) => ({
                url : "/booking/create-payment-order",
                method : "POST" ,
                body : data
                
            })
        }),
        verifyPayment : builder.mutation<VerifyPaymentResponse , VerifyPaymentPayload>({
            query : (data) =>({
                url : "/booking/verify-payment",
                method : "POST",
                body : data
            })
        }),
        cancelBooking : builder.mutation({
            query : ({bookingId , cancellationReason}) => ({
                url : `/booking/cancel/${bookingId}`,
                method : "PATCH" ,
                body : cancellationReason
            }) ,
            invalidatesTags : ["MyBookings"]
        })  
    })
})


export const { useGetAvailabilityQuery , useCreateBookingMutation , useMyBookingQuery , useCreatePaymentOrderMutation ,
    useVerifyPaymentMutation , useCancelBookingMutation
} = BookingApi
