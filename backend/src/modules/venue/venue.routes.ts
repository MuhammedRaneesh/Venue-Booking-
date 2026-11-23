import express from "express"
import { validateRequest } from "../../middleware/validateRequest.js";
import { venueQuerySchema } from "./venue.validation.js";
import { authorize } from "../../middleware/authMiddleware.js";
import { createVenueHandler  , updateVenueHandler , ownerVenueDeleteHandler , ownerVenueHandler , getAllVenueHandler , getVenueByIdHandler , getVenueOwnerHandler} from "./venue.controller.js";
import { createVenueSchema , updateVenueSchema , getVenueSchema } from "./venue.validation.js";
import { uploadVenueImages } from "../../middleware/upload.js";
import { protect } from "../../middleware/authMiddleware.js";
const router = express.Router(); 



router.get("/venues" , protect , authorize(["venue_owner"]), validateRequest( getVenueSchema ,  "query") , getVenueOwnerHandler )
router.post("/owner/venue" , protect , authorize(["venue_owner"]) , uploadVenueImages.array("photos") , createVenueHandler )
router.get("/owner/venue/:id" , protect , authorize(["venue_owner"]) , ownerVenueHandler)
router.put("/owner/venue/:id" , protect ,authorize(["venue_owner"]) ,uploadVenueImages.array("photos"), updateVenueHandler)
router.delete("/owner/venue/:id" , protect , authorize(["venue_owner"]) ,  ownerVenueDeleteHandler )


//public

router.get("/venues" , validateRequest(venueQuerySchema , "query") , getAllVenueHandler)
router.get("/venues/:id" , getVenueByIdHandler)

export default router   
