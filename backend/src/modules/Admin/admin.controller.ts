import { Request, Response } from "express";
import {
    getDashboardSummary, getAllusers, toggleUserStatus, adminGetUserDetails,
    adminGetAllVenues, adminGetVenueDetail, adminUpdateVenueStatus, AdminToggleStatus, adminGetAllBookings, adminGetOwnerApplicationDetail,
    adminGetOwnerApplications, adminUpdateOwnerApplicationStatus
} from "./admin.service.js";

export const dashboardSummaryHandler = async (req: Request, res: Response) => {
    try {
        const {period} = req.validatedQuery
        const result = await getDashboardSummary(period);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error: any) {
        console.error("Admin dashboard error:", error);
        res.status(500).json({
            success: false,
            message: error?.message || "Failed to fetch dashboard summary",
        });
    }
};

export const getAllusersHandler = async (req: Request, res: Response) => {
    try {
        const result = await getAllusers(req.validatedQuery)
        res.status(200).json({
            success: true,
            user: result.users,
            totalcount: result.totalCount,
            pagination: result.pagination
        })
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const toggleUserStatusHandler = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id as  string
        const result = await toggleUserStatus(userId)
        res.status(200).json({
            success: true,
            message: result.message
        })
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const adminGetUserDetailsHandler = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id as string
        console.log(req.params.id)
        const result = await adminGetUserDetails(userId)
        res.status(200).json({
            success: true,
            user: result.user
        })
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}


export const adminGetAllVenuesHandler = async (req: Request, res: Response) => {
    try {
        const result = await adminGetAllVenues(req.validatedQuery);
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

export const adminGetVenueDetailHandler = async (req: Request, res: Response) => {
    try {
        const venueId = req.params.id as string
        const result = await adminGetVenueDetail(venueId)
        res.status(200).json({
            success: true,
            venue: result.venue
        })
    } catch (error: any) {
        return res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

export const adminUpdateVenueStatusHandler = async (req: Request, res: Response) => {
    try {
        const venueid = req.params.id as string
        const result = await adminUpdateVenueStatus(venueid, req.validatedBody)
        res.status(200).json({
            success: true,
            message: result.message
        })
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const AdminToggleStatusHandler = async (req: Request, res: Response) => {
    try {
        const venueId = req.params.id as string
        const result = await AdminToggleStatus(venueId)
        res.status(200).json({
            success: false,
        })
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}


export const adminGetAllBookingsHandler = async (req: Request, res: Response) => {
    try {
        const result = await adminGetAllBookings(req.validatedQuery)
        res.status(200).json({
            success: true,
            bookings: result.bookings,
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

export const adminGetOwnerApplicationsHandler = async (req: Request, res: Response) => {
    try {
        const result = await adminGetOwnerApplications(req.validatedQuery)
        res.status(200).json({
            success: true,
            applications: result.applications,
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

export const adminGetOwnerApplicationDetailHandler = async (req: Request, res: Response) => {
    try {
        const ownerId = req.params.id as string
        const result = await adminGetOwnerApplicationDetail(ownerId)
        res.status(200).json({
            success: true,
            application: result.application
        })
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const adminUpdateOwnerApplicationStatusHandler = async (req: Request, res: Response) => {
    try {
        const ownerId = req.params.id as string
        const result = await adminUpdateOwnerApplicationStatus(ownerId, req.validatedBody)
        res.status(200).json({
            success: true,
            message: result.message
        })
    } catch (error: any) {

        return res.status(400).json({
            success: false,
            message: error.message
        })
    }

}
