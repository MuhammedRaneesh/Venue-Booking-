import { z } from "zod";

export const ownerApplicationSchema = z.object({
    fullName: z.string().trim().min(3, "Full name must be at least 3 characters").max(50, "Full name is too long"),
    phoneNumber: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
    businessName: z.string().trim().min(3, "Business name must be at least 3 characters").max(100, "Business name is too long"),
    address: z.string().trim().min(5, "Enter your full address").max(200, "Address is too long"),
    city: z.string().trim().min(2, "Enter your city").max(50, "City name is too long"),
    state: z.string().trim().min(2, "Enter your state").max(50, "State name is too long"),
    pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
    gstNumber: z.string().trim().optional(),
})

export const ownerGetBooking = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
})

export const updateBookingStatusSchema = z.object({
    bookingId: z.string(),
    status: z.enum([
        "pending",
        "approved",
        "rejected",
        "cancelled",
        "completed",
        "expired",
    ])
})

export const getVenueSchema = z.object({
    search: z.string().trim().max(100).optional(),
    sort: z.enum([
        "price_asc",
        "price_desc",
        "rating",
        "newest",
    ]).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
})

export const cancellationReasonSchema = z.object({
    cancellationReason : z.string().trim()
})

export const getDashboardChartSchema = z.object({
    period: z.enum(["month", "year", "all"]).optional().default("month"),
});

export type OwnerApplicationSchema = z.infer<typeof ownerApplicationSchema>;
export type OwnerBookingGet = z.infer<typeof ownerGetBooking>
export type UpdateBookingStatus = z.infer<typeof updateBookingStatusSchema>
export type OwnerVenueGetSchema = z.infer<typeof getVenueSchema>
