import mongoose from "mongoose"
import { OwnerApplicationSchema } from "./owner.validation.js"
import { OwnerProfile } from "./owner.schema.js"
import { User } from "../auth/user.schema.js"
import { Venue } from "../venue/venue.schema.js"
import { Booking } from "../booking/booking.schema.js"
import { createNotificationsForUsers } from "../Notification/Notification.service.js"
import { AppError } from "../../utils/AppError.js"

export { getOwnerBooking, updateBookingStatus } from "../booking/booking.service.js"
export { getVenueOwner } from "../venue/venue.service.js"
export {
    getOwnerDashboardSummary,
    getOwnerRevenueSeries,
    getOwnerBreakdown,
} from "./owner.dashboard.service.js"

export const ownerOnboarding = async (userId: string, data: OwnerApplicationSchema) => {
    const user = await User.findById(userId).select("ownerStatus email fullName phoneNumber")

    if (!user) throw new AppError("user not found", 404)

    if (user.ownerStatus === "PENDING") {
        throw new AppError("You already have a pending application under review", 409)
    }
    if (user.ownerStatus === "APPROVED") {
        throw new AppError("Your application has already been approved", 409)
    }
    if (user.ownerStatus === "REJECTED") {
        await OwnerProfile.findOneAndDelete({ user: userId })
    }
    const ownerProfile = await OwnerProfile.create({
        user: userId,
        businessName: data.businessName,
        phone: data.phoneNumber,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        gstNumber: data.gstNumber ?? "",
    })

    await User.findByIdAndUpdate(userId, {
        ownerStatus: "PENDING",
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
    })

    const admins = await User.find({ role: "admin", isActive: true }).select("_id").lean()
    await createNotificationsForUsers(
        admins.map((admin) => admin._id.toString()),
        {
            senderId: userId,
            type: "new_owner_application",
            title: "New Owner Application",
            message: `${data.fullName || user.fullName} submitted an owner application`,
            data: {
                applicationId: ownerProfile._id.toString(),
                userId,
            },
        }
    )

    return {
        message: "Application submitted successfully. We will review within 48 hours.",
        ownerProfile,
    }
}

export const getOwnerProfile = async (ownerId: string) => {
    const profile = await OwnerProfile.findOne({ user: ownerId }).populate("user", "fullName email profileImage createdAt")
    if (!profile) throw new AppError("Owner profile not found", 404)
    return profile
}

export const getDashboard = async (ownerId: string) => {
    const [venues, bookings] = await Promise.all([
        Venue.find({ owner: ownerId }).lean(),
        Booking.find({ ownerId }).populate("userId", "fullName email").populate("venueId", "venueName").sort({ createdAt: -1 }).lean(),
    ])

    const totalVenues = venues.length
    const activeVenues = venues.filter((v) => v.isActive === true).length
    const inactiveVenues = totalVenues - activeVenues

    const totalBookings = bookings.length
    const pendingBookings = bookings.filter((b) => b.bookingStatus === "pending").length

    const totalEarningsRaw = bookings
        .filter((b) => b.paymentStatus !== "unpaid" && b.paymentStatus !== "refunded")
        .reduce((sum, b) => sum + (b.amountPaid || 0), 0)
    const totalEarnings = Number((totalEarningsRaw * ((100 - 8) / 100)).toFixed(2))
    const recentBookings = bookings.slice(0, 5).map((b: any) => ({
        _id: b._id,
        bookingDate: b.bookingDate,
        bookingStatus: b.bookingStatus,
        paymentStatus: b.paymentStatus,
        totalAmount: b.totalAmount,
        amountPaid: b.amountPaid,
        createdAt: b.createdAt,
        user: b.userId ? { fullName: b.userId.fullName, email: b.userId.email } : null,
        venue: b.venueId ? { venueName: b.venueId.venueName } : null,
    }))

    return {
        totalVenues,
        activeVenues,
        inactiveVenues,
        totalBookings,
        pendingBookings,
        totalEarnings,
        recentBookings,
    }
}

type ChartPeriod = "month" | "year" | "all"

export const getDashboardChart = async (ownerId: string, period: ChartPeriod = "month") => {
    const ownerObjectId = new mongoose.Types.ObjectId(ownerId)

    let dateFormat: string
    const matchStage: Record<string, any> = { ownerId: ownerObjectId }

    if (period === "month") {
        dateFormat = "%Y-%m-%d"
        const from = new Date()
        from.setDate(from.getDate() - 30)
        matchStage.createdAt = { $gte: from }
    } else if (period === "year") {
        dateFormat = "%Y-%m"
        const from = new Date()
        from.setMonth(from.getMonth() - 12)
        matchStage.createdAt = { $gte: from }
    } else {
        dateFormat = "%Y-%m"
    }

    const results = await Booking.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
                bookingsCount: { $sum: 1 },
                earningsRaw: {
                    $sum: {
                        $cond: [
                            { $in: ["$paymentStatus", ["advance_paid", "fully_paid"]] },
                            "$amountPaid",
                            0,
                        ],
                    },
                },
            },
        },
        { $sort: { _id: 1 } },
    ])

    return results.map((r) => ({
        date: r._id,
        bookings: r.bookingsCount,
        earnings: Number((r.earningsRaw * ((100 - 8) / 100)).toFixed(2)),
    }))
}
