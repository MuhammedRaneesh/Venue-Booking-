import { Request, Response } from "express"
import { Wishlist } from "./wishlist.schema.js"
import { catchAsync } from "../../utils/catchAsync.js"
import { AppError } from "../../utils/AppError.js"

export const addWishlist = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id!
    const { venueId } = req.body;

    const existingWishlist = await Wishlist.findOne({
        userId,
        venueId,
    });

    if (existingWishlist) {
        throw new AppError("Venue already exists in wishlist", 400);
    }

    const result = await Wishlist.create({
        userId,
        venueId,
    });

    res.status(201).json({
        success: true,
        message: "wishlist is added"
    })
})

export const getWishlist = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const wishlist = await Wishlist.find({ userId, }).populate("venueId", "venueName category capacity pricing photos").sort({ createdAt: -1 }).lean();

    res.status(200).json({
        success: true,
        data: wishlist,
    });
});

export const removeWishlist = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id!;
    const { venueId } = req.params;

    const result = await Wishlist.findOneAndDelete({
        userId,
        venueId,
    });

    if (!result) {
        throw new AppError("Venue not found in wishlist", 404);
    }

    res.status(200).json({
        success: true,
        message: "Removed from wishlist"
    });
});
