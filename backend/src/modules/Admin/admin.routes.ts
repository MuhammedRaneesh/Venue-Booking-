import express from "express"
import {
    dashboardSummaryHandler, getAllusersHandler, toggleUserStatusHandler, adminGetUserDetailsHandler, adminGetAllVenuesHandler
    , adminGetVenueDetailHandler, adminUpdateVenueStatusHandler, adminGetAllBookingsHandler, AdminToggleStatusHandler,
    adminGetOwnerApplicationDetailHandler, adminGetOwnerApplicationsHandler, adminGetOwnerApplicationStatsHandler, adminUpdateOwnerApplicationStatusHandler,
    getUserStatsHandler, getVenueStatsHandler, getBookingStatsHandler, adminGetBookingDetailHandler, adminCancelBookingHandler
} from "./admin.controller.js"
import { authorize, protect } from "../../middleware/authMiddleware.js"
import { validateRequest } from "../../middleware/validateRequest.js"
import {
    adminUserSchema, adminGetAllVenue, adminVenueStatus, adminGetBookingsQuerySchema
    , adminGetOwnerApplicationsQuerySchema, adminOwnerApplicationActionSchema , dashboardQuerySchema
} from "./admin.validation.js"
const router = express.Router()

// dashboard section 
router.get("/dashboard/summary", protect, authorize(["admin"]),validateRequest(dashboardQuerySchema, 'query'), dashboardSummaryHandler)

// user management section 
router.get("/users/allusers", protect, authorize(["admin"]), validateRequest(adminUserSchema, "query"), getAllusersHandler)
router.get("/users/stats", protect, authorize(["admin"]), getUserStatsHandler)
// change the status 
router.patch("/users/:id/status-change", protect, authorize(["admin"]), toggleUserStatusHandler)
// user details 
router.get("/users/:id/details", protect, authorize(["admin"]), adminGetUserDetailsHandler)

// owner application 

router.get('/owner-applications', protect, authorize(["admin"]), validateRequest(adminGetOwnerApplicationsQuerySchema, 'query'), adminGetOwnerApplicationsHandler)
router.get('/owner-applications/stats', protect, authorize(["admin"]), adminGetOwnerApplicationStatsHandler)
router.get('/owner-applications/:id', protect, authorize(["admin"]), adminGetOwnerApplicationDetailHandler)
router.patch('/owner-applications/:id', protect, authorize(["admin"]), validateRequest(adminOwnerApplicationActionSchema, 'body'), adminUpdateOwnerApplicationStatusHandler)

// venue section  

router.get("/venues", protect, authorize(["admin"]), validateRequest(adminGetAllVenue, "query"), adminGetAllVenuesHandler)
router.get("/venues/stats", protect, authorize(["admin"]), getVenueStatsHandler)
router.get("/venues/:id", protect, authorize(["admin"]), adminGetVenueDetailHandler)
router.patch("/venues/:id/status", protect, authorize(["admin"]), validateRequest(adminVenueStatus, "body"), adminUpdateVenueStatusHandler)
router.patch("/venues/:id/toggle-status", protect, authorize(["admin"]), AdminToggleStatusHandler)

// booking 

router.get('/bookings/stats', protect, authorize(["admin"]), getBookingStatsHandler)
router.get('/bookings/:id', protect, authorize(["admin"]), adminGetBookingDetailHandler)
router.patch('/bookings/:id/cancel', protect, authorize(["admin"]), adminCancelBookingHandler)
router.get('/bookings', protect, authorize(["admin"]), validateRequest(adminGetBookingsQuerySchema, 'query'), adminGetAllBookingsHandler)

export default router
