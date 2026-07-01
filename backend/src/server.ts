import express from "express"
import dotenv from "dotenv";
import "./config/passport.js"
dotenv.config();
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import { initSocket } from "./Socket/socket.js";
import authRoutes from "./modules/auth/user.routes.js"
import passport from "passport";
import ownerRoutes from "./modules/owner/owner.routes.js"
import venueRoutes from "./modules/venue/venue.routes.js"
import bookingRoutes from "./modules/booking/booking.routes.js"
import userProfileRoutes from "./modules/userProfile/userProfile.routes.js"
import useWishlist from "./modules/wishlist/wishlist.routes.js"
import useAdminRoute from "./modules/Admin/admin.routes.js"
import useNotification from "./modules/Notification/Notification.routes.js"
connectDb()
const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use(passport.initialize())
app.use('/api/auth', authRoutes)
app.use("/api/owner", ownerRoutes)
app.use("/api", venueRoutes)
app.use("/api/booking", bookingRoutes)
app.use("/api/user/profile", userProfileRoutes)
app.use("/api/", useWishlist)
app.use("/api/admin", useAdminRoute)
app.use("/api/notification", useNotification)


const httpServer = createServer(app)

initSocket(httpServer)

const PORT = process.env.PORT

httpServer.listen(PORT, () => {
    console.log(`server running on the port number ${PORT}`)
})
