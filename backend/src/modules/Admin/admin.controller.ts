import { Request, Response } from "express";
import {
    getDashboardSummary, getAllusers, toggleUserStatus, adminGetUserDetails,
    adminGetAllVenues, adminGetVenueDetail, adminUpdateVenueStatus, AdminToggleStatus, adminGetAllBookings, adminGetOwnerApplicationDetail,
    adminGetOwnerApplications, adminUpdateOwnerApplicationStatus
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
    const result = await getAllusers(req.validatedQuery)
    res.status(200).json({
        success: true,
        user: result.users,
        totalcount: result.totalCount,
        pagination: result.pagination
    })
})

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
        success: false,
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
    const result = await adminUpdateOwnerApplicationStatus(ownerId, req.validatedBody)
    res.status(200).json({
        success: true,
        message: result.message
    })
})
