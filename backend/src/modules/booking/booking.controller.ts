import { Request, Response } from "express";
import { getAvailability, BookingVenue, userBooking, createPaymentBooking, verifyPaymentRazorpay, CancelBooking } from "./booking.service.js";
import { catchAsync } from "../../utils/catchAsync.js";

export const bookingsAvailabilityHandler = catchAsync(async (req: Request, res: Response) => {
    const { venueId, date } = req.validatedQuery || req.query;

    const { slots } = await getAvailability(venueId as string, date as string);

    res.status(200).json({
        success: true,
        slots
    });
});

export const BookingHandler = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id
    if (!userId) {
        return res.status(401).json({
            success: false,
            message: 'userNotfound'
        })
    }
    const result = await BookingVenue(userId, req.validatedBody)
    res.status(201).json({
        success: true,
        message: "booking added ",
    })
})

export const userBookingHandler = catchAsync(async (req: Request, res: Response) => {
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
})

export const createPaymentBookingHandler = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.body.bookingId as string
    const result = await createPaymentBooking(bookingId)
    res.status(200).json({
        success: true,
        key: result.key,
        data: result
    })
})

export const verifyPaymentHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await verifyPaymentRazorpay(req.validatedBody)
    res.status(200).json({
        success: true,
        data: result
    })
})

export const cancelBookingHandler = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id
    const bookingId = req.validatedParams.id as string
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" })
    const result = await CancelBooking(userId, bookingId, req.validatedBody)
    res.status(200).json({
        success: true,
        message: result.message
    })
})
