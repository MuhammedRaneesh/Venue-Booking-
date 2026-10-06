import express from "express"
import { ownerOnboardingHandler  ,ownerGetBookingHandler  , updateBookingStatusHandler , getVenueHandler , getDashboardHandler , getOwnerProfileHandler
    ,getDashboardChartHandler
} from "./owner.controller.js"
import { authorize, protect } from "../../middleware/authMiddleware.js"
import { validateRequest } from "../../middleware/validateRequest.js"
import { ownerApplicationSchema , ownerGetBooking , updateBookingStatusSchema , getVenueSchema , getDashboardChartSchema} from "./owner.validation.js"

const router = express.Router()

router.post("/onboarding", protect , validateRequest(ownerApplicationSchema , "body"), ownerOnboardingHandler)

// booking routes 
router.get("/booking" , protect , authorize(["venue_owner"]), validateRequest(ownerGetBooking , "query") , ownerGetBookingHandler)
router.patch("/booking/status"  , protect , authorize(["venue_owner"]) , validateRequest(updateBookingStatusSchema , "body") , updateBookingStatusHandler )

// venue Routes 
router.get("/venues" , protect , authorize(["venue_owner"]), validateRequest( getVenueSchema ,  "query") , getVenueHandler )

// dasbored routes 
router.get("/dashboard/summary" , protect , authorize(["venue_owner"]) , getDashboardHandler)
router.get("/dashboard/chart", protect, authorize(["venue_owner"]), validateRequest(getDashboardChartSchema, "query"), getDashboardChartHandler)

router.get("/profile" , protect , authorize(["venue_owner"]) , getOwnerProfileHandler)

export default router 
