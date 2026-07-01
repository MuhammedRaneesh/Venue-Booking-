import { z } from "zod";

export const holdSlotSchema = z
    .object({
        venueId: z.string().min(1, "venueId is required"),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be in YYYY-MM-DD format"),
        guestCount: z.number().int().positive("guestCount must be a positive number"),

        bookingType: z.enum(["hourly", "full-day"]),
        startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
        endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    })
    .refine(
        (data) => {
            if (data.bookingType === "hourly") {
                return !!data.startTime && !!data.endTime;
            }
            return true;
        },
        { message: "startTime and endTime are required for hourly bookings", path: ["startTime"] }
    )
    .refine(
        (data) => {
            if (data.startTime && data.endTime) {
                return data.startTime < data.endTime;
            }
            return true;
        },
        { message: "endTime must be after startTime", path: ["endTime"] }
    );

export type HoldSlotInput = z.infer<typeof holdSlotSchema>;

export const availabilityQuerySchema = z.object({
    venueId: z.string().min(1, "venueId is required"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be in YYYY-MM-DD format"),
});


export const createBookingSchema = z.object({
    venueId: z.string().min(1, "Venue ID is required"),

    bookingType: z.enum(["hourly", "full-day"]),

    bookingDate: z.string().min(1, "Booking date is required"),

    startTime: z.string().optional(),

    endTime: z.string().optional(),

    guestCount: z.coerce
        .number()
        .int()
        .min(1, "Guest count must be at least 1"),

    eventType: z.enum([
        "Wedding",
        "Birthday",
        "Corporate",
        "Engagement",
        "Conference",
        "Other",
    ]),

    specialRequest: z.string().trim().max(500).optional(),

    totalAmount: z.coerce.number().min(0, "Invalid booking amount"),
    paymentType: z.enum([
        "full",
    ]),
    phoneNumber : z.string().min(1 , "phone number is required ")
})

export const createPaymentOrderSchema = z.object({
  bookingId: z.string().min(1, "bookingId is required"),
});

export const verifyPaymentSchema = z.object({
  bookingId: z.string().min(1),

  razorpay_order_id: z.string().min(1),

  razorpay_payment_id: z.string().min(1),

  razorpay_signature: z.string().min(1),
});

export const cancelBookingParamsSchema = z.object({
  id: z.string().min(1, "booking id is required"),
});

export const cancelBookingBodySchema = z.string().trim().min(1, "Cancellation reason is required");

export type VerifyPaymentSchema = z.infer<typeof verifyPaymentSchema>
export type CreateBooking = z.infer<typeof createBookingSchema>;    
