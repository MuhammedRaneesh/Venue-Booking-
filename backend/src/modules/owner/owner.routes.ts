import express from "express"
import {
    ownerOnboardingHandler,
    getOwnerProfileHandler,
    getDashboardHandler,
    getDashboardChartHandler,
    dashboardSummaryHandler,
    dashboardRevenueHandler,
    dashboardBreakdownHandler,
    ownerGetBookingHandler,
    updateBookingStatusHandler,
    getVenueHandler,
} from "./owner.controller.js"
import { authorize, protect } from "../../middleware/authMiddleware.js"
import { validateRequest } from "../../middleware/validateRequest.js"
import {
    ownerApplicationSchema,
    getDashboardChartSchema,
    dashboardSummaryQuerySchema,
    dashboardRevenueQuerySchema,
    dashboardBreakdownQuerySchema,
    ownerGetBooking,
    updateBookingStatusSchema,
    getVenueSchema,
} from "./owner.validation.js"

const router = express.Router()

router.post("/onboarding", protect, validateRequest(ownerApplicationSchema, "body"), ownerOnboardingHandler)

// booking routes
router.get("/booking", protect, authorize(["venue_owner"]), validateRequest(ownerGetBooking, "query"), ownerGetBookingHandler)
router.patch("/booking/status", protect, authorize(["venue_owner"]), validateRequest(updateBookingStatusSchema, "body"), updateBookingStatusHandler)

// venue routes
router.get("/venues", protect, authorize(["venue_owner"]), validateRequest(getVenueSchema, "query"), getVenueHandler)

// dashboard routes
router.get("/dashboard/summary", protect, authorize(["venue_owner"]), getDashboardHandler)
router.get("/dashboard/chart", protect, authorize(["venue_owner"]), validateRequest(getDashboardChartSchema, "query"), getDashboardChartHandler)

// dashboard v2 analytics
router.get("/dashboard/v2/summary", protect, authorize(["venue_owner"]), validateRequest(dashboardSummaryQuerySchema, "query"), dashboardSummaryHandler)
router.get("/dashboard/v2/revenue", protect, authorize(["venue_owner"]), validateRequest(dashboardRevenueQuerySchema, "query"), dashboardRevenueHandler)
router.get("/dashboard/v2/breakdown", protect, authorize(["venue_owner"]), validateRequest(dashboardBreakdownQuerySchema, "query"), dashboardBreakdownHandler)

router.get("/profile", protect, authorize(["venue_owner"]), getOwnerProfileHandler)

export default router
