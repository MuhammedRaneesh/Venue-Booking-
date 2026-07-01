import { Request, Response } from "express";
import { getAvailability, BookingVenue, userBooking, createPaymentBooking, verifyPaymentRazorpay, CancelBooking } from "./booking.service.js";

export const bookingsAvailabilityHandler = async (req: Request, res: Response) => {
    try {
        const { venueId, date } = req.validatedQuery || req.query;

        const { slots } = await getAvailability(venueId as string, date as string);

        res.status(200).json({
            success: true,
            slots
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to fetch availability",
        });
    }
};

export const BookingHandler = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'userNotfound'
            })
        }
        const result = await BookingVenue(userId, req.validatedBody)
        return res.status(201).json({
            success: true,
            message: "booking added ",
        })
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const userBookingHandler = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: " no userid"
            })
        }
        const result = await userBooking(userId)
        res.status(200).json({
            success: true,
            booking: result.Bookings
        })
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const createPaymentBookingHandler = async (req: Request, res: Response) => {
    try {
        const bookingId = req.validatedBody.bookingId as string
        const result = await createPaymentBooking(bookingId)
        res.status(200).json({
            success: true,
            key : result.key ,
            data: result
        })
    } catch (error: any) {
        console.log("Razorpay Error:", error)
        return res.status(400).json({
            success: false,
            message : error.message
        })
    }
}

export const verifyPaymentHandler = async (req: Request, res: Response) => {
    try {
        const result = await verifyPaymentRazorpay(req.validatedBody)
        res.status(200).json({
            success: true,
            data: result
        })
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const cancelBookingHandler = async (req : Request , res : Response) => {
    try {
        const userId = req.user?._id
        const bookingId = req.validatedParams.id as string
        if(!userId) return res.status(401).json({ success: false, message: "Unauthorized" })
        const result = await CancelBooking(userId ,bookingId , req.validatedBody)
        res.status(200).json({
            success : true ,
            message : result.message
        })
    } catch (error : any ) {
        return res.status(400).json({
            success : false , 
            message : error.message
        })
    }
}
