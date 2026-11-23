import express from "express";
import { bookingsAvailabilityHandler, BookingHandler , userBookingHandler , createPaymentBookingHandler , verifyPaymentHandler , cancelBookingHandler , ownerGetBookingHandler, updateBookingStatusHandler} from "./booking.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { availabilityQuerySchema, cancelBookingBodySchema, cancelBookingParamsSchema, createBookingSchema, createPaymentOrderSchema, verifyPaymentSchema , ownerGetBooking, updateBookingStatusSchema  } from "./booking.validation.js";
import { protect } from "../../middleware/authMiddleware.js";
import { authorize } from "../../middleware/authMiddleware.js";


const router = express.Router();

router.get("/availability" , validateRequest(availabilityQuerySchema , "query") , bookingsAvailabilityHandler)
router.post("/create-booking" , protect , validateRequest(createBookingSchema , "body"), BookingHandler )

// user side booking section 
router.get("/" , protect ,  userBookingHandler )
router.patch("/cancel/:id" , protect , validateRequest(cancelBookingParamsSchema , "params") , validateRequest(cancelBookingBodySchema , "body") , cancelBookingHandler )


// payment setUp 
router.post("/create-payment-order" , protect , validateRequest(createPaymentOrderSchema , "body") , createPaymentBookingHandler )
router.post("/verify-payment" , protect , validateRequest(verifyPaymentSchema , "body") , verifyPaymentHandler )


// owner Routes 
router.get("/owners" , protect , validateRequest(ownerGetBooking , "query") , ownerGetBookingHandler );
router.patch("/owners/status" , protect , authorize(["venue_owner"]) , validateRequest(updateBookingStatusSchema , "body") , updateBookingStatusHandler )


export default router;
