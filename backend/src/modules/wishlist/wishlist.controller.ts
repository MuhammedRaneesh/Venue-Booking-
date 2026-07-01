import { Request, Response } from "express"
import { Wishlist } from "./wishlist.schema.js"
export const addWishlist = async (req: Request, res: Response) => {
    try {

        const userId = req.user?._id!
        const { venueId } = req.body;

        const existingWishlist = await Wishlist.findOne({
            userId,
            venueId,
        });

        if (existingWishlist) {
            return res.status(400).json({
                success: false,
                message: "Venue already exists in wishlist",
            });
        }

        const result = await Wishlist.create({
            userId,
            venueId,
        });

        res.status(201).json({
            success: true,
            message: "wishlist is added"
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getWishlist = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;

        const wishlist = await Wishlist.find({ userId, }).populate("venueId", "venueName category capacity pricing photos").sort({ createdAt: -1 }).lean();

        return res.status(200).json({
            success: true,
            data: wishlist,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const removeWishlist = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id!;
        const { venueId } = req.params;

        const result = await Wishlist.findOneAndDelete({
            userId,
            venueId,
        });

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Venue not found in wishlist",
            });
        }

        res.status(200).json({
            success: true,
            message: "Removed from wishlist"
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
