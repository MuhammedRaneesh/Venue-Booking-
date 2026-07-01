import { z } from "zod";

export const ownerApplicationSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(3, "Full name must be at least 3 characters")
        .max(50, "Full name is too long"),

    phoneNumber: z
        .string()
        .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),

    businessName: z
        .string()
        .trim()
        .min(3, "Business name must be at least 3 characters")
        .max(100, "Business name is too long"),

    address: z
        .string()
        .trim()
        .min(5, "Enter your full address")
        .max(200, "Address is too long"),

    city: z
        .string()
        .trim()
        .min(2, "Enter your city")
        .max(50, "City name is too long"),

    state: z
        .string()
        .trim()
        .min(2, "Enter your state")
        .max(50, "State name is too long"),

    pincode: z
        .string()
        .regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
    gstNumber: z
        .string()
        .trim()
        .optional()
})



const CATEGORIES = [
    "Wedding Hall",
    "Convention Center",
    "Conference Hall",
    "Banquet Hall",
    "Party Hall",
    "Outdoor Venue",
    "Resort",
    "Auditorium",
] as const;

const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
] as const;




export const createVenueFormSchema = z.object({
    venueName: z.string().trim().min(3, "Venue name must be at least 3 characters"),
    description: z.string().trim().min(20, "Description must be at least 20 characters"),
    category: z.enum(CATEGORIES),
    capacity: z.coerce
    .number()
    .min(1, "Capacity must be at least 1"),
    pricing: z.object({
        pricePerHour: z.coerce.number().min(0),
        pricePerDay: z.coerce.number().min(0),
    }),
    location: z.object({
        address: z.object({
            place: z.string().min(1, "Place is required"),
            city: z.string().min(1, "City is required"),
            district: z.string().min(1, "District is required"),
            state: z.string().min(1, "State is required"),
            pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
        }),
    }),
    availability: z.object({
        workingDays: z.array(z.enum(DAYS)).min(1, "Select at least one working day"),
        openTime: z.string().min(1, "Open time is required"),
        closeTime: z.string().min(1, "Close time is required"),
    }),
    amenities: z.array(z.string().min(1, "Amenity cannot be empty")).default([]),
    paymentPolicy: z.object({

        acceptsFullPayment: z.boolean().default(true),
    }),

    venueRules: z.string().optional().default(""),
    photos: z.array(z.instanceof(File)).min(1, "At least one image is required").max(10, "Maximum 10 images allowed"),
});

export type OwnerApplicationSchema = z.infer<typeof ownerApplicationSchema>;
export type VenueAddSchema = z.infer<typeof createVenueFormSchema>
