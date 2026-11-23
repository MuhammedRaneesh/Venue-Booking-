import { z } from "zod";

export const ownerApplicationSchema = z.object({
    fullName: z.string().trim().min(3, "Full name must be at least 3 characters").max(50, "Full name is too long"),
    phoneNumber: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
    businessName: z.string().trim().min(3, "Business name must be at least 3 characters").max(100, "Business name is too long"),
    address: z.string().trim().min(5, "Enter your full address").max(200, "Address is too long"),
    city: z.string().trim().min(2, "Enter your city").max(50, "City name is too long"),
    state: z.string().trim().min(2, "Enter your state").max(50, "State name is too long"),
    pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
    gstNumber: z
        .string()
        .trim()
        .transform(val => val.toUpperCase())
        .refine(val => !val || val.length === 15, "GST number must be exactly 15 characters")
        .optional(),
})

export const cancellationReasonSchema = z.object({
    cancellationReason: z.string().trim()
})

export const getDashboardChartSchema = z.object({
    period: z.enum(["month", "year", "all"]).optional().default("month"),
});

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid venueId")

export const dashboardSummaryQuerySchema = z.object({
    venueId: objectId.optional(),
})

export const dashboardRevenueQuerySchema = z.object({
    venueId: objectId.optional(),
    range: z.enum(["6m", "12m"]).default("6m"),
})

export const dashboardBreakdownQuerySchema = z.object({
    venueId: objectId.optional(),
    range: z.enum(["30d", "6m", "12m", "all"]).default("6m"),
})

export type OwnerApplicationSchema = z.infer<typeof ownerApplicationSchema>;

export { ownerGetBooking, updateBookingStatusSchema, type OwnerBookingGet, type UpdateBookingStatus } from "../booking/booking.validation.js";
export { getVenueSchema, type OwnerVenueGetSchema } from "../venue/venue.validation.js";
