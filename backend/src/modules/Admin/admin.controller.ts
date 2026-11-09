import { Request, Response } from "express";
import {
    getDashboardSummary, getAllusers, toggleUserStatus, adminGetUserDetails,
    adminGetAllVenues, adminGetVenueDetail, adminUpdateVenueStatus, AdminToggleStatus, adminGetAllBookings, adminGetOwnerApplicationDetail,
    adminGetOwnerApplications, adminUpdateOwnerApplicationStatus, getUserStats, getOwnerApplicationStats, getVenueStats,
    getBookingStats, adminGetBookingDetail, adminCancelBooking
} from "./admin.service.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/AppError.js";

export const dashboardSummaryHandler = catchAsync(async (req: Request, res: Response) => {
    const {period} = req.validatedQuery
    const result = await getDashboardSummary(period);
    res.status(200).json({
        success: true,
        data: result,
    });
});

export const getAllusersHandler = catchAsync(async (req: Request, res: Response) => {

    const result = await getAllusers(req.validatedQuery);
    
    res.status(200).json({
        success: true,
        user: result.users,
        totalcount: result.totalCount,
        pagination: result.pagination
    })
})

export const getUserStatsHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await getUserStats();
    res.status(200).json({
        success: true,
        data: result
    });
});

export const toggleUserStatusHandler = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id as  string
    const result = await toggleUserStatus(userId)
    res.status(200).json({
        success: true,
        message: result.message
    })
})

export const adminGetUserDetailsHandler = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id as string
    const result = await adminGetUserDetails(userId)
    res.status(200).json({
        success: true,
        user: result.user
    })
})

export const adminGetAllVenuesHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await adminGetAllVenues(req.validatedQuery);
    res.status(200).json({
        success: true,
        venue: result.venues,
        totalCount: result.totalCount,
        pagination: result.pagination
    })
})

export const adminGetVenueDetailHandler = catchAsync(async (req: Request, res: Response) => {
    const venueId = req.params.id as string
    const result = await adminGetVenueDetail(venueId)
    res.status(200).json({
        success: true,
        venue: result.venue
    })
})

export const getVenueStatsHandler = catchAsync(async (req: Request, res: Response) => {
    const stats = await getVenueStats()
    res.status(200).json({
        success: true,
        stats
    })
})

export const adminUpdateVenueStatusHandler = catchAsync(async (req: Request, res: Response) => {
    const venueid = req.params.id as string
    const result = await adminUpdateVenueStatus(venueid, req.validatedBody)
    res.status(200).json({
        success: true,
        message: result.message
    })
})

export const AdminToggleStatusHandler = catchAsync(async (req: Request, res: Response) => {
    const venueId = req.params.id as string
    const result = await AdminToggleStatus(venueId)
    res.status(200).json({
        success: true,
        message: result.message,
        isActive: result.isActive
    })
})

export const getBookingStatsHandler = catchAsync(async (req: Request, res: Response) => {
    const stats = await getBookingStats()
    res.status(200).json({
        success: true,
        stats
    })
})

export const adminGetBookingDetailHandler = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.id as string
    const result = await adminGetBookingDetail(bookingId)
    res.status(200).json({
        success: true,
        booking: result.booking
    })
})

export const adminCancelBookingHandler = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.id as string
    const { reason } = req.body || {}
    const result = await adminCancelBooking(bookingId, reason)
    res.status(200).json({
        success: true,
        message: result.message
    })
})

export const adminGetAllBookingsHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await adminGetAllBookings(req.validatedQuery)
    res.status(200).json({
        success: true,
        bookings: result.bookings,
        totalCount: result.totalCount,
        pagination: result.pagination
    })
})

export const adminGetOwnerApplicationsHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await adminGetOwnerApplications(req.validatedQuery)
    res.status(200).json({
        success: true,
        applications: result.applications,
        totalCount: result.totalCount,
        pagination: result.pagination
    })
})

export const adminGetOwnerApplicationStatsHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await getOwnerApplicationStats()
    res.status(200).json({
        success: true,
        data: result
    })
})

export const adminGetOwnerApplicationDetailHandler = catchAsync(async (req: Request, res: Response) => {
    const ownerId = req.params.id as string
    const result = await adminGetOwnerApplicationDetail(ownerId)
    res.status(200).json({
        success: true,
        application: result.application
    })
})

export const adminUpdateOwnerApplicationStatusHandler = catchAsync(async (req: Request, res: Response) => {
    const ownerId = req.params.id as string
    
    const result = await adminUpdateOwnerApplicationStatus(ownerId, req.body)
    res.status(200).json({
        success: true,
        message: result.message
    })
})
