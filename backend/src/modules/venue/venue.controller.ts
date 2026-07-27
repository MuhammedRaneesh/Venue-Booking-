import { getAllVenues, createVenue, updateVenue, ownerVenue, getvenueById } from "./venue.service.js";
import { Request, Response } from "express";
import { ownerVenueDelete } from "./venue.service.js";
import { createVenueSchema, updateVenueSchema } from "./venue.validation.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/AppError.js";

export const createVenueHandler = catchAsync(async (req: Request, res: Response) => {
    const ownerId = req.user?._id
    if (!ownerId) {
        throw new AppError("Unauthorized", 401);
    }

    if (!req.body.data) {
        throw new AppError("Venue data is missing from the request", 400);
    }

    const files = Array.isArray(req.files) ? req.files as Express.Multer.File[] : []
    if (!files.length) {
        throw new AppError("At least one photo is required", 400);
    }

    let parsed: unknown
    try {
        parsed = JSON.parse(req.body.data)
    } catch {
        throw new AppError("Venue data must be valid JSON", 400);
    }

    const photoUrls = files.map((file) => file.path)
    
    // Validate parsed JSON against the Zod schema
    const result = createVenueSchema.safeParse(parsed)
    if (!result.success) {
        const errors = result.error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
        }))
        return res.status(400).json({ success: false, message: "Validation failed", errors })
    }
    
    const venue = await createVenue(ownerId, result.data, photoUrls)
    res.status(201).json({
        success: true,
        message: "Venue submitted for review. You will be notified once approved.",
    })
})

export const updateVenueHandler = catchAsync(async (req: Request, res: Response) => {
    const venueid = req.params.id as string;
    const ownerId = req.user!._id
    const parsed = JSON.parse(req.body.data)
    const hasExistingPhotos = parsed.existingPhotos && Array.isArray(parsed.existingPhotos) && parsed.existingPhotos.length > 0;

    const files = req.files as Express.Multer.File[]
    if (!files?.length && !hasExistingPhotos) {
        throw new AppError("At least one photo is required", 400);
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
    res.status(200).json({
        success: true,
        message: "venue updated successfully",
    })
})

export const ownerVenueHandler = catchAsync(async (req: Request, res: Response) => {
    const venueId = req.params.id as string
    const venue = await ownerVenue(venueId)
    res.status(200).json({
        success: true,
        venue
    })
})

export const ownerVenueDeleteHandler = catchAsync(async (req: Request, res: Response) => {
    const venueId = req.params.id as string
    const ownerId = req.user!._id
    const result = await ownerVenueDelete(venueId, ownerId)
    res.status(200).json({
        success: true,
        message: result.message
    })
})

export const getAllVenueHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await getAllVenues(req.validatedQuery)

    res.status(200).json({
        success: true,
        venue: result.venues,
        totalCount: result.totalCount,
        pagination: result.pagination
    })
})

export const getVenueByIdHandler = catchAsync(async (req: Request, res: Response) => {
    const venueId = req.params.id as string
    const venue = await getvenueById(venueId)
    res.status(200).json({
        success: true,
        venue
    })
})
