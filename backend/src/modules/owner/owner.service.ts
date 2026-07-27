import { sendBookingAcceptedEmail, sendBookingRejectedEmail } from "../../utils/email.service.js"
import { OwnerApplicationSchema, OwnerBookingGet, UpdateBookingStatus, OwnerVenueGetSchema } from "./owner.validation.js"
import { OwnerProfile } from "./owner.schema.js"
import { User } from "../auth/user.schema.js"
import { Venue } from "../venue/venue.schema.js"
import { Booking } from "../booking/booking.schema.js"
import { createNotification, createNotificationsForUsers } from "../Notification/Notification.service.js"
import type { NotificationType } from "../Notification/Notification.type.js"
import { AppError } from "../../utils/AppError.js"

export const ownerOnboarding = async (userId: string, data: OwnerApplicationSchema) => {

    const user = await User.findById(userId).select(" ownerStatus email userName")
    if (!user) throw new AppError("user not found", 404)
    if (user.ownerStatus === "PENDING") {
        throw new AppError("You already have a pending application under review", 409)
    }
    if (user.ownerStatus === 'APPROVED') {
        throw new AppError("Your application has already been approved", 409)
    }
    if (user.ownerStatus === 'REJECTED') {
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
        ownerStatus: "PENDING"
    })

    const admins = await User.find({ role: "admin", isActive: true }).select("_id").lean()
    await createNotificationsForUsers(
        admins.map((admin) => admin._id.toString()),
        {
            senderId: userId,
            type: "new_owner_application",
            title: "New Owner Application",
            message: `${user.userName} submitted an owner application`,
            data: {
                applicationId: ownerProfile._id.toString(),
                userId,
            },
        }
    )

    return {
        message: "Application submitted successfully. We will review within 48 hours.",
        OwnerProfile
    }
}

export const getOwnerBooking = async (ownerId: string, data: OwnerBookingGet) => {

    const { page, limit } = data

    const Page = Number(page);
    const Limit = Number(limit);
    const Skip = (Page - 1) * Limit
    const [totalCount, bookings] = await Promise.all([
        Booking.countDocuments({ ownerId }),
        Booking.find({ ownerId })
            .sort({ createdAt: -1 })
            .populate("userId", "userName email phoneNumber")
            .populate(
                "venueId",
                "venueName photos category capacity pricing status"
            )
            .skip(Skip)
            .limit(Limit)
    ]);
    return {
        bookings,
        totalCount,
        pagination: {
            currentPage: Page,
            Limit,
            totalPages: Math.ceil(totalCount / Limit),
            hasNextPage: Page < Math.ceil(totalCount / Limit),
            hasPreviousPage: Page > 1
        }

    }
}


export const updateBookingStatus = async (userId: string, data: UpdateBookingStatus) => {

    const { bookingId, status } = data
    const booking = await Booking.findById(bookingId).populate("userId").populate("venueId", "venueName")
    if (!booking) throw new AppError("Booking not found", 404)

    const previousStatus = booking.bookingStatus;
    booking.bookingStatus = status
    await booking.save()

    if (previousStatus !== status) {
        const user = booking.userId as any
        const venue = booking.venueId as any
        const notificationConfigByStatus: Partial<Record<string, { type: NotificationType; title: string; message: string }>> = {
            approved: {
                type: "booking_approved",
                title: "Booking Approved",
                message: `Your booking for ${venue?.venueName || "the venue"} was approved`,
            },
            rejected: {
                type: "booking_rejected",
                title: "Booking Rejected",
                message: `Your booking for ${venue?.venueName || "the venue"} was rejected`,
            },
            cancelled: {
                type: "booking_cancelled",
                title: "Booking Cancelled",
                message: `Your booking for ${venue?.venueName || "the venue"} was cancelled`,
            },
            completed: {
                type: "booking_completed",
                title: "Booking Completed",
                message: `Your booking for ${venue?.venueName || "the venue"} was marked as completed`,
            },
        }
        const notificationConfig = notificationConfigByStatus[status]

        if (status === "approved" && user?.email) {
            await sendBookingAcceptedEmail(user.email, user.userName, venue.venueName);
        }

        if (status === "rejected" && user?.email) {
            await sendBookingRejectedEmail(user.email, user.userName, venue.venueName);
        }

        if (user && notificationConfig) {
            await createNotification({
                userId: user._id.toString(),
                senderId: userId,
                type: notificationConfig.type,
                title: notificationConfig.title,
                message: notificationConfig.message,
                data: {
                    bookingId: booking._id.toString(),
                    venueId: venue?._id?.toString(),
                    status,
                },
            })
        }
    }
}

export const getVenueOwner = async (ownerId: string, data: OwnerVenueGetSchema) => {

    const { search, sort, page, limit } = data;

    const filter: Record<string, any> = {
        owner: ownerId
    };

    if (search) {
        filter.$or = [
            { venueName: { $regex: search, $options: "i", }, },
            { description: { $regex: search, $options: "i", }, },
        ];
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort) {
        switch (sort) {
            case "price_asc":
                sortOption = { "pricing.pricePerDay": 1 };
                break;
            case "price_desc":
                sortOption = { "pricing.pricePerDay": -1 };
                break;
            case "rating":
                sortOption = { averageRating: -1 };
                break;
            case "newest":
                sortOption = { createdAt: -1 };
                break;
        }
    }
    const Page = Number(page) || 1;
    const Limit = Number(limit) || 10;
    const Skip = (Page - 1) * Limit;

    const [totalCount, venues] = await Promise.all([
        Venue.countDocuments({ owner: ownerId }),
        Venue.find(filter).sort(sortOption as any).skip(Skip).limit(Limit)
    ])

    return {
        venues,
        totalCount,
        pagination: {
            currentPage: Page,
            Limit,
            totalPages: Math.ceil(totalCount / Limit),
            hasNextPage: Page < Math.ceil(totalCount / Limit),
            hasPreviousPage: Page > 1,
        }
    };

}



export const getDashboard = async (ownerId: string) => {

    const [venues, bookings] = await Promise.all([
        Venue.find({ owner: ownerId }).lean(),
        Booking.find({ ownerId }).populate("userId", "userName email").populate("venueId", "venueName").sort({ createdAt: -1 }).lean(),
    ]);


    const totalVenues = venues.length;
    const activeVenues = venues.filter((v) => v.isActive === true).length;
    const inactiveVenues = totalVenues - activeVenues;

    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter((b) => b.bookingStatus === "pending").length;

    const totalEarningsRaw = bookings.filter((b) => ["advance_paid", "fully_paid"].includes(b.paymentStatus)).reduce((sum, b) => sum + (b.amountPaid || 0), 0);
    const totalEarnings = Number((totalEarningsRaw * ((100 - 8) / 100)).toFixed(2));
    const recentBookings = bookings.slice(0, 5).map((b: any) => ({
        _id: b._id,
        bookingDate: b.bookingDate,
        bookingStatus: b.bookingStatus,
        paymentStatus: b.paymentStatus,
        totalAmount: b.totalAmount,
        amountPaid: b.amountPaid,
        createdAt: b.createdAt,
        user: b.userId ? { userName: b.userId.userName, email: b.userId.email } : null,
        venue: b.venueId ? { venueName: b.venueId.venueName } : null,
    }));


    return {
        totalVenues,
        activeVenues,
        inactiveVenues,
        totalBookings,
        pendingBookings,
        totalEarnings,
        recentBookings,
    };
};


export const getOwnerProfile = async (ownerId: string) => {

    const profile = await OwnerProfile.findOne({ user: ownerId }).populate("user", "userName email profileImage createdAt")
    if (!profile) throw new AppError("Owner profile not found", 404)

    return profile
}
