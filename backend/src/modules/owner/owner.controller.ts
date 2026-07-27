import { Request, Response } from "express"
import { ownerOnboarding, getOwnerBooking, updateBookingStatus, getVenueOwner, getDashboard, getOwnerProfile } from "./owner.service.js"
import { catchAsync } from "../../utils/catchAsync.js"
import { AppError } from "../../utils/AppError.js"

export const ownerOnboardingHandler = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id
    if (!userId) {
        throw new AppError("Unauthorized", 401);
    }
    const data = req.body
    const result = await ownerOnboarding(userId, data);
    res.status(200).json({
        success: true,
        message: result?.message,
    })
})

export const ownerGetBookingHandler = catchAsync(async (req: Request, res: Response) => {
    const ownerId = req.user?._id!
    const result = await getOwnerBooking(ownerId, req.validatedQuery)
    res.status(200).json({
        success: true,
        booking: result.bookings,
        totalcount: result.totalCount,
        pagination: result.pagination
    })
})

export const updateBookingStatusHandler = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id!
    const result = await updateBookingStatus(userId, req.validatedBody)
    res.status(200).json({
        success: true,
        message: "status updated succesfully"
    })
})

export const getVenueHandler = catchAsync(async (req: Request, res: Response) => {
    const ownerId = req.user?._id!
    const result = await getVenueOwner(ownerId, req.validatedQuery)
    res.status(200).json({
        success: true,
        venue: result.venues,
        totalCount: result.totalCount,
        pagination: result.pagination
    })
})

export const getDashboardHandler = catchAsync(async (req: Request, res: Response) => {
    const owner = req.user?._id as string
    const { totalVenues, activeVenues, inactiveVenues, totalBookings, pendingBookings, totalEarnings, recentBookings, } = await getDashboard(owner)
    res.status(200).json({
        success: true,
        totalVenues,
        activeVenues,
        inactiveVenues,
        totalBookings,
        pendingBookings,
        totalEarnings,
        recentBookings
    })
})

export const getOwnerProfileHandler = catchAsync(async (req: Request, res: Response) => {
    const ownerId = req.user?._id!
    const result = await getOwnerProfile(ownerId)
    res.status(200).json({
        success: true,
        data: result
    })
})
