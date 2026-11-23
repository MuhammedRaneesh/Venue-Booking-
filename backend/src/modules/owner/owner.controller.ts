import { Request, Response } from "express"
import {
    ownerOnboarding,
    getOwnerProfile,
    getDashboard,
    getDashboardChart,
    getOwnerBooking,
    updateBookingStatus,
    getVenueOwner,
} from "./owner.service.js"
import {
    getOwnerDashboardSummary,
    getOwnerRevenueSeries,
    getOwnerBreakdown,
} from "./owner.dashboard.service.js"
import { catchAsync } from "../../utils/catchAsync.js"
import { AppError } from "../../utils/AppError.js"

export const ownerOnboardingHandler = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id
    if (!userId) {
        throw new AppError("Unauthorized", 401)
    }
    const data = req.body
    const result = await ownerOnboarding(userId, data)
    res.status(200).json({
        success: true,
        message: result?.message,
    })
})

export const getOwnerProfileHandler = catchAsync(async (req: Request, res: Response) => {
    const ownerId = req.user?._id!
    const result = await getOwnerProfile(ownerId)
    res.status(200).json({
        success: true,
        data: result,
    })
})

export const getDashboardHandler = catchAsync(async (req: Request, res: Response) => {
    const owner = req.user?._id as string
    const result = await getDashboard(owner)
    res.status(200).json({
        success: true,
        ...result,
    })
})

export const getDashboardChartHandler = catchAsync(async (req: Request, res: Response) => {
    const ownerId = req.user?._id!
    const { period } = req.validatedQuery
    const data = await getDashboardChart(ownerId, period)
    res.status(200).json({ success: true, data })
})

export const ownerGetBookingHandler = catchAsync(async (req: Request, res: Response) => {
    const ownerId = req.user?._id!
    const result = await getOwnerBooking(ownerId, req.validatedQuery)
    res.status(200).json({
        success: true,
        booking: result.bookings,
        totalcount: result.totalCount,
        pagination: result.pagination,
    })
})

export const updateBookingStatusHandler = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id!
    await updateBookingStatus(userId, req.body)
    res.status(200).json({
        success: true,
        message: "status updated succesfully",
    })
})

export const getVenueHandler = catchAsync(async (req: Request, res: Response) => {
    const ownerId = req.user?._id!
    const result = await getVenueOwner(ownerId, req.validatedQuery)
    res.status(200).json({
        success: true,
        venue: result.venues,
        totalCount: result.totalCount,
        pagination: result.pagination,
    })
})



export const dashboardSummaryHandler = catchAsync(async (req: Request, res: Response) => {
    const { venueId } = req.validatedQuery
    const data = await getOwnerDashboardSummary(req.user!._id, venueId)
    res.status(200).json({ success: true, data })
})

export const dashboardRevenueHandler = catchAsync(async (req: Request, res: Response) => {
    const { venueId, range } = req.validatedQuery
    const data = await getOwnerRevenueSeries(req.user!._id, range, venueId)
    res.status(200).json({ success: true, data })
})

export const dashboardBreakdownHandler = catchAsync(async (req: Request, res: Response) => {
    const { venueId, range } = req.validatedQuery
    const data = await getOwnerBreakdown(req.user!._id, range, venueId)
    res.status(200).json({ success: true, data })
})
