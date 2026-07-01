import express from "express"
import { addWishlist , getWishlist, removeWishlist } from "./wishlist.controller.js"
import { protect } from "../../middleware/authMiddleware.js"

const router  = express.Router()

router.post("/wishlist/add" , protect , addWishlist)
router.get("/wishlist"  , protect , getWishlist)
router.delete("/wishlist/remove/:venueId", protect, removeWishlist)

export default router