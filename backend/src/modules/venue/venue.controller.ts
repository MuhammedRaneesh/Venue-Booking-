import { getAllVenues, createVenue, updateVenue, ownerVenue, getvenueById } from "./venue.service.js";
import { Request, Response } from "express";
import { ownerVenueDelete } from "./venue.service.js";
import { createVenueSchema, updateVenueSchema } from "./venue.validation.js";

export const createVenueHandler = async (req: Request, res: Response) => {
    try {
        const ownerId = req.user?._id
        if (!ownerId) {
            throw new Error("Unauthorized");
        }
        const files = req.files as Express.Multer.File[]
        const photoUrls = files.map((file: any) => file.path)

        if (!req.body.data) {
            throw new Error("Venue data is missing from the request");
        }
        const parsed = JSON.parse(req.body.data)
        console.log(parsed)
        console.log(req.body)
        // Validate parsed JSON against the Zod schema
        const result = createVenueSchema.safeParse(parsed)
        if (!result.success) {
            const errors = result.error.issues.map((err) => ({
                field: err.path.join("."),
                message: err.message,
            }))
            return res.status(400).json({ success: false, message: "Validation failed", errors })
            console.log(errors)
        }
        console.log(result.error)
        const venue = await createVenue(ownerId, result.data, photoUrls)
        return res.status(201).json({
            success: true,
            message: "Venue submitted for review. You will be notified once approved.",
        })
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message })
    }
}


export const updateVenueHandler = async (req: Request, res: Response) => {
    try {
        const venueid = req.params.id as string;
        const ownerId = req.user!._id
        const parsed = JSON.parse(req.body.data)
        const hasExistingPhotos = parsed.existingPhotos && Array.isArray(parsed.existingPhotos) && parsed.existingPhotos.length > 0;

        const files = req.files as Express.Multer.File[]
        if (!files?.length && !hasExistingPhotos) {
            throw new Error("At least one photo is required");
        }
        const photoUrls = files?.length ? files.map((file: any) => file.path) : []

        const result = updateVenueSchema.safeParse(parsed)
        if (!result.success) {
            const errors = result.error.issues.map((err) => ({
                field: err.path.join("."),
                message: err.message,
            }))
            return res.status(400).json({ success: false, message: "Validation failed", errors })
        }

        const venue = await updateVenue(venueid, result.data, ownerId, photoUrls)
        return res.status(200).json({
            success: true,
            message: "venue updated successfully",
        })
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message })
    }
}

export const ownerVenueHandler = async (req: Request, res: Response) => {
    try {   
        const venueId = req.params.id as string
        const venue = await ownerVenue(venueId)
        res.status(200).json({
            success: true,
            venue
        })
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message })
    }
}

export const ownerVenueDeleteHandler = async (req: Request, res: Response) => {

    try {
        const venueId = req.params.id as string
        const ownerId = req.user!._id
        const result = await ownerVenueDelete(venueId, ownerId)
        return res.status(200).json({
            success: true,
            message: result.message
        })
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message })
    }
}

export const getAllVenueHandler = async (req: Request, res: Response) => {
    try {
        const result = await getAllVenues(req.validatedQuery )

        res.status(200).json({
            success: true,
            venue: result.venues,
            totalCount: result.totalCount,
            pagination : result.pagination
        })
    } catch (error: any) {
        console.log(error)
        return res.status(400).json({ success: false, message: error.message })
    }
}
export const getVenueByIdHandler = async (req: Request, res: Response) => {
    try {
        const venueId = req.params.id as string
        
        const venue = await getvenueById(venueId)
        return res.status(200).json({
            success: true,
            venue
        })
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}