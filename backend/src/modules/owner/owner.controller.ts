import { Request, Response } from "express"
import { ownerOnboarding, getOwnerBooking, updateBookingStatus, getVenueOwner, getDashboard, getOwnerProfile } from "./owner.service.js"

export const ownerOnboardingHandler = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id
        console.log(userId)
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const data = req.body
        console.log(data)
        const result = await ownerOnboarding(userId, data);
        return res.status(200).json({
            success: true,
            message: result?.message,
        })
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message })
    }
}

export const ownerGetBookingHandler = async (req: Request, res: Response) => {
    try {
        const ownerId = req.user?._id!
        const result = await getOwnerBooking(ownerId, req.validatedQuery)
        res.status(200).json({
            success: true,
            booking: result.bookings,
            totalcount: result.totalCount,
            pagination: result.pagination
        })
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message
        }
        )
    }
}

export const updateBookingStatusHandler = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id!
        const result = await updateBookingStatus(userId, req.validatedBody)
        res.status(200).json({
            success: true,
            message: "status updated succesfully"
        })
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message
        }
        )
    }
}


export const getVenueHandler = async (req: Request, res: Response) => {
    try {
        const ownerId = req.user?._id!
        const result = await getVenueOwner(ownerId, req.validatedQuery)
        res.status(200).json({
            success: true,
            venue: result.venues,
            totalCount: result.totalCount,
            pagination: result.pagination
        })
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const getDashboardHandler = async (req: Request, res: Response) => {
    try {
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
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const getOwnerProfileHandler = async (req: Request, res: Response) => {
    try {
        const ownerId = req.user?._id!
        const result = await getOwnerProfile(ownerId)
        res.status(200).json({
            success : true ,
            data : result
        })
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

