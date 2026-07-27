import { z } from "zod"

const CATEGORIES = [
    "Wedding Hall", "Convention Center", "Conference Hall",
    "Banquet Hall", "Party Hall", "Outdoor Venue", "Resort", "Auditorium",
] as const

const DAYS = [
    "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday", "Sunday",
] as const

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/

const booleanFromForm = z.preprocess((value) => {
    if (value === "true") return true
    if (value === "false") return false
    return value
}, z.boolean())

const arrayFromForm = <T extends z.ZodTypeAny>(schema: T) =>
    z.preprocess((value) => {
        if (value === undefined) return []
        return Array.isArray(value) ? value : [value]
    }, z.array(schema))

export const createVenueSchema = z.object({
    venueName: z.string().trim().min(3).max(100),
    description: z.string().trim().min(20).max(1000),
    category: z.enum(CATEGORIES, { message: "Invalid category", }),
    capacity: z.coerce.number().int().min(1),
    pricing: z.object({
        pricePerHour: z.coerce.number().min(0).default(0),
        pricePerDay: z.coerce.number().min(0),
    }),
    amenities: arrayFromForm(z.string().min(1, "Amenity cannot be empty")).optional().default([]),
    photos: z.array(z.string().url()).optional(),
    existingPhotos: z.array(z.string().url()).optional(),
    location: z.object({
        type: z.literal("Point").default("Point"),
        coordinates: z.tuple([
            z.coerce.number(),
            z.coerce.number()
        ]).optional(),
        address: z.object({
            place: z.string().trim().min(1),
            city: z.string().trim().min(1),
            district: z.string().trim().min(1),
            state: z.string().trim().min(1),
            pincode: z.string().trim().regex(/^\d{6}$/, "Pincode must be 6 digits"),
        }),
    }),
    availability: z.object({
        workingDays: arrayFromForm(z.enum(DAYS)).pipe(z.array(z.enum(DAYS)).min(1, "Select at least one working day")),
        openTime: z.string().regex(TIME_REGEX, "Must be HH:MM format"),
        closeTime: z.string().regex(TIME_REGEX, "Must be HH:MM format"),
    }).refine(d => d.openTime < d.closeTime, {
        message: "closeTime must be after openTime",
        path: ["closeTime"],
    }),
    paymentPolicy: z.object({
        acceptsFullPayment: booleanFromForm.default(true),
    }),

})





export const venueQuerySchema = z.object({
    search: z.string().trim().max(100).optional(),
    category: z.enum([
        "Wedding Hall",
        "Convention Center",
        "Conference Hall",
        "Banquet Hall",
        "Party Hall",
        "Outdoor Venue",
        "Resort",
        "Auditorium",
    ]).optional(),
    city: z.string().trim().optional(),
    district: z.string().trim().optional(),
    minCapacity: z.coerce.number().int().min(1).optional(),
    maxCapacity: z.coerce.number().int().min(1).optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    minRating: z.coerce.number().min(0).max(5).optional(),
    amenities: z.string().trim().optional(),
    sort: z.enum([
        "price_asc",
        "price_desc",
        "rating",
        "newest",
    ]).optional(),
    page : z.string().optional(),
    limit : z.string().optional(),
}).refine(data => {
    if (data.minPrice !== undefined && data.maxPrice !== undefined) {
        return data.maxPrice >= data.minPrice
    }
    return true
}, {
    message: "maxPrice must be >= minPrice",
    path: ["maxPrice"],
}).refine(data => {
    if (data.minCapacity !== undefined && data.maxCapacity !== undefined) {
        return data.maxCapacity >= data.minCapacity
    }
    return true
}, {
    message: "maxCapacity must be >= minCapacity",
    path: ["maxCapacity"],
})

export const updateVenueSchema = createVenueSchema.partial()
export type UpdateVenue = z.infer<typeof updateVenueSchema>
export type VenueQuery = z.infer<typeof venueQuerySchema>
export type CreateVenue = z.infer<typeof createVenueSchema>
