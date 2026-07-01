import { z } from "zod"

export const adminUserSchema = z.object({
    search: z.string().trim().max(100).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    role: z.enum(["user", "venue_owner"]).optional(),
    isActive: z.enum(["true", "false"]).optional().transform(val =>
        val === undefined ? undefined : val === "true"
    ),
})

export const adminGetAllVenue = z.object({
    search: z.string().trim().max(100).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.enum(["pending", "approved", "rejected", "suspended"]).optional(),
    district: z.string().optional(),
    category: z.string().optional(),
})

export const adminVenueStatus = z.object({
    status: z.enum(["pending", "approved", "rejected", "suspended"]),
    reason: z.string().optional()
})


export const adminGetBookingsQuerySchema = z.object({
    bookingStatus: z.enum(["pending", "approved", "rejected", "cancelled", "completed", "expired"]).optional(),
    paymentStatus: z.enum(["unpaid", "fully_paid", "refunded"]).optional(),
    startDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
    endDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
})

export const adminGetOwnerApplicationsQuerySchema = z.object({
    ownerStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    search: z.string().optional(),
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
})

export const adminOwnerApplicationActionSchema = z.object({
    action: z.enum(["APPROVED", "REJECTED"]),
    rejectionReason: z.string().optional()
}).refine(data => {
    if (data.action === "REJECTED" && !data.rejectionReason) return false
    return true
}, {
    message: "Rejection reason is required when rejecting an application"
})

export const dashboardQuerySchema = z.object({
    period: z.enum(['this_month', 'this_year', 'all']).default('all')
})

export type DashboardQuery = z.infer<typeof dashboardQuerySchema>
export type AdminGetOwnerApplicationsQuery = z.infer<typeof adminGetOwnerApplicationsQuerySchema>
export type AdminOwnerApplicationAction = z.infer<typeof adminOwnerApplicationActionSchema>
export type AdminGetBookingsQuery = z.infer<typeof adminGetBookingsQuerySchema>
export type AdminVenueStatus = z.infer<typeof adminVenueStatus>
export type AdminGetAllVenue = z.infer<typeof adminGetAllVenue>
export type AdminUserSchema = z.infer<typeof adminUserSchema>