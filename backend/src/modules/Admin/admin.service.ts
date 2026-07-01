import { User } from "../auth/user.schema.js";
import { Booking } from "../booking/booking.schema.js";
import { Venue } from "../venue/venue.schema.js";
import { OwnerProfile } from "../owner/owner.schema.js";
import { AdminUserSchema, AdminGetAllVenue, AdminVenueStatus, AdminGetBookingsQuery, AdminGetOwnerApplicationsQuery, AdminOwnerApplicationAction, DashboardQuery } from "./admin.validation.js";
import { createNotification } from "../Notification/Notification.service.js";
export const COMMISSION_RATE = 0.08;

export const getDashboardSummary = async (period: 'this_month' | 'this_year' | 'all' = 'all') => {

    const now = new Date()
    let dateFilter: Record<string, any> = {}

    if (period === 'this_month') {
        dateFilter = {
            createdAt: {
                $gte: new Date(now.getFullYear(), now.getMonth(), 1),
                $lte: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
            }
        }
    } else if (period === 'this_year') {
        dateFilter = {
            createdAt: {
                $gte: new Date(now.getFullYear(), 0, 1),
                $lte: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999)
            }
        }
    }

    const [userSummary, venueSummary, bookingSummary] = await Promise.all([
        User.aggregate([
            {
                $facet: {
                    totalUsers: [
                        { $match: { role: "user", ...dateFilter } },
                        { $count: "count" }
                    ],
                    totalOwners: [
                        { $match: { role: "venue_owner", ownerStatus: "APPROVED", ...dateFilter } },
                        { $count: "count" }
                    ],
                    pendingOwnerApplications: [
                        { $match: { ownerStatus: "PENDING", ...dateFilter } },
                        { $count: "count" }
                    ]
                }
            }
        ]),

        Venue.aggregate([
            {
                $facet: {
                    approvedVenues: [
                        { $match: { status: "approved", ...dateFilter } },
                        { $count: "count" }
                    ],
                    pendingVenues: [
                        { $match: { status: "pending", ...dateFilter } },
                        { $count: "count" }
                    ],
                    totalVenues: [
                        { $match: { ...dateFilter } },
                        { $count: "count" }
                    ]
                }
            }
        ]),

        Booking.aggregate([
            {
                $facet: {
                    activeBookings: [
                        { $match: { bookingStatus: { $in: ["pending", "approved"] }, ...dateFilter } },
                        { $count: "count" }
                    ],
                    completedBookings: [
                        { $match: { bookingStatus: "completed", ...dateFilter } },
                        { $count: "count" }
                    ],
                    cancelledBookings: [
                        { $match: { bookingStatus: "cancelled", ...dateFilter } },
                        { $count: "count" }
                    ],
                    totalBooking: [
                        { $match: { ...dateFilter } },
                        { $count: "count" }
                    ],
                    totalRevenue: [
                        { $match: { paymentStatus: "fully_paid", ...dateFilter } },
                        {
                            $group: {
                                _id: null,
                                total: { $sum: "$totalAmount" }
                            }
                        }
                    ],
                    totalPlatformFees: [
                        { $match: { paymentStatus: "fully_paid", ...dateFilter } },
                        {
                            $group: {
                                _id: null,
                                total: { $sum: "$platformFee" }
                            }
                        }
                    ]
                }
            }
        ])
    ])

    const u = userSummary[0]
    const v = venueSummary[0]
    const b = bookingSummary[0]

    const totalRevenue = b.totalRevenue[0]?.total ?? 0
    const totalPlatformFees = b.totalPlatformFees[0]?.total ?? 0

    const recentBookings = await Booking.find(dateFilter)
        .populate("userId", "userName email")
        .populate("venueId", "venueName")
        .sort({ createdAt: -1 })
        .limit(5)

    return {
        users: {
            total: u.totalUsers[0]?.count ?? 0,
            owners: u.totalOwners[0]?.count ?? 0,
            pendingOwnerApplications: u.pendingOwnerApplications[0]?.count ?? 0
        },
        venues: {
            approved: v.approvedVenues[0]?.count ?? 0,
            pending: v.pendingVenues[0]?.count ?? 0,
            totalVenue: v.totalVenues[0]?.count ?? 0
        },
        bookings: {
            active: b.activeBookings[0]?.count ?? 0,
            completed: b.completedBookings[0]?.count ?? 0,
            cancelled: b.cancelledBookings[0]?.count ?? 0,
            totalBooking: b.totalBooking[0]?.count ?? 0
        },
        revenue: {
            totalRevenue,
            totalPlatformFees
        },
        recentBookings
    }

};


export const getAllusers = async (data: AdminUserSchema) => {
    const { search, limit, page, role } = data;

    const filter: Record<string, any> = {
        role: { $ne: "admin" }
    };

    if (role) filter.role = role
    if (search) {
        filter.$or = [
            { userName: { $regex: search, $options: "i", }, },
            { email: { $regex: search, $options: "i", }, },
        ];
    }

    const Page = Number(page) || 1;
    const Limit = Number(limit) || 10;
    const Skip = (Page - 1) * Limit;

    const [totalCount, users] = await Promise.all([
        User.countDocuments(filter),
        User.find(filter).sort({ createdAt: -1 }).select("-password -googleId -refreshToken").skip(Skip).limit(Limit)
    ])

    return {
        users,
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

export const toggleUserStatus = async (userId: string) => {

    const user = await User.findById(userId);

    if (!user) throw new Error("user Not found");

    user.isActive = !user.isActive
    await user.save()

    return {
        message: user.isActive ? 'User reactivated successfully' : 'User suspended successfully',
    }
}

export const adminGetUserDetails = async (userId: string) => {
    const user = await User.findById(userId).select("-password -refreshToken");
    return { user }
}

export const adminGetAllVenues = async (data: AdminGetAllVenue) => {
    const { search, limit, page, status, category, district } = data

    const filter: Record<string, any> = {}

    if (status) filter.status = status
    if (category) filter.category = category
    if (district) filter["location.address.district"] = district
    if (search) {
        filter.$or = [
            { venueName: { $regex: search, $options: 'i' } },
            { 'location.address.city': { $regex: search, $options: 'i' } },
            { 'location.address.district': { $regex: search, $options: 'i' } },
        ]
    }

    const Page = Number(page) || 1
    const Limit = Number(limit) || 10
    const Skip = (Page - 1) * Limit

    const [totalCount, venues] = await Promise.all([
        Venue.countDocuments(filter),
        Venue.find(filter).populate('owner', 'userName email profileImage').select('venueName category location.address status createdAt').sort({ createdAt: -1 }).skip(Skip)
            .limit(Limit)
    ])

    return {
        venues,
        totalCount,
        pagination: {
            currentPage: Page,
            totalPages: Math.ceil(totalCount / Limit),
            hasNextPage: Page < Math.ceil(totalCount / Limit),
            hasPreviousPage: Page > 1
        }
    }
}

export const adminGetVenueDetail = async (venueId: string) => {
    const venue = await Venue.findById(venueId).populate("owner", "userName email profileImage phoneNumber")
    if (!venue) throw new Error("venue not found")
    return { venue }
}

export const adminUpdateVenueStatus = async (venueId: string, data: AdminVenueStatus) => {
    const { status, reason } = data

    const venue = await Venue.findById(venueId)
    if (!venue) throw new Error("Venue not found")
    const previousStatus = venue.status

    if (status === 'rejected' && !reason) {
        throw new Error("Rejection reason is required")
    }

    venue.status = status
    venue.rejectionReason = status === 'rejected' ? reason! : null
    await venue.save()

    if (previousStatus !== status && (status === "approved" || status === "rejected")) {
        await createNotification({
            userId: venue.owner.toString(),
            type: status === "approved" ? "venue_approved" : "venue_rejected",
            title: status === "approved" ? "Venue Approved" : "Venue Rejected",
            message: status === "approved"
                ? `${venue.venueName} has been approved and is now visible to users`
                : `${venue.venueName} was rejected${reason ? `: ${reason}` : ""}`,
            data: {
                venueId: venue._id.toString(),
                status,
                reason,
            },
        })
    }

    return { message: `Venue ${status} successfully` }
}

export const AdminToggleStatus = async (venueId: string) => {
    const venue = await Venue.findById(venueId)
    if (!venue) throw new Error('Venue not found')

    venue.isActive = !venue.isActive
    await venue.save()

    return {
        message: venue.isActive ? 'Venue activated successfully' : 'Venue deactivated successfully'
    }
}

export const adminGetAllBookings = async (data: AdminGetBookingsQuery) => {
    const { bookingStatus, paymentStatus, startDate, endDate, page, limit } = data

    const filter: Record<string, any> = {}

    if (bookingStatus) filter.bookingStatus = bookingStatus
    if (paymentStatus) filter.paymentStatus = paymentStatus
    if (startDate && endDate) {
        filter.bookingDate = { $gte: startDate, $lte: endDate }
    }
    const Page = Number(page) || 1
    const Limit = Number(limit) || 10
    const Skip = (Page - 1) * Limit

    const [totalCount, bookings] = await Promise.all([
        Booking.countDocuments(filter),
        Booking.find(filter).populate('userId', 'userName email profileImage').populate('venueId', 'venueName location.address.city')
            .select('-razorpayOrderId -razorpayPaymentId -razorpaySignature')
            .sort({ createdAt: -1 }).skip(Skip).limit(Limit)
    ])

    return {
        bookings,
        totalCount,
        pagination: {
            currentPage: Page,
            totalPages: Math.ceil(totalCount / Limit),
            hasNextPage: Page < Math.ceil(totalCount / Limit),
            hasPreviousPage: Page > 1
        }
    }
}


export const adminGetOwnerApplications = async (data: AdminGetOwnerApplicationsQuery) => {
    const { ownerStatus, search, page, limit } = data

    const Page = Number(page) || 1
    const Limit = Number(limit) || 10
    const Skip = (Page - 1) * Limit

    const userFilter: Record<string, any> = {}
    if (ownerStatus) userFilter.ownerStatus = ownerStatus
    else userFilter.ownerStatus = { $ne: "NONE" } 

    if (search) {
        userFilter.$or = [
            { userName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ]
    }

    const users = await User.find(userFilter).select('_id')
    const userIds = users.map(u => u._id)

    const profileFilter: Record<string, any> = { user: { $in: userIds } }

    if (search) {
        profileFilter.$or = [
            { businessName: { $regex: search, $options: 'i' } }
        ]
    }

    const [totalCount, applications] = await Promise.all([
        OwnerProfile.countDocuments({ user: { $in: userIds } }),
        OwnerProfile.find(profileFilter)
            .populate('user', 'userName email profileImage ownerStatus role isActive')
            .sort({ createdAt: -1 })
            .skip(Skip)
            .limit(Limit)
    ])

    return {
        applications,
        totalCount,
        pagination: {
            currentPage: Page,
            totalPages: Math.ceil(totalCount / Limit),
            hasNextPage: Page < Math.ceil(totalCount / Limit),
            hasPreviousPage: Page > 1
        }
    }
}

export const adminGetOwnerApplicationDetail = async (userId: string) => {
    const ownerProfile = await OwnerProfile.findOne({ user: userId })
        .populate('user', 'userName email profileImage ownerStatus role createdAt')

    if (!ownerProfile) throw new Error('Application not found')

    return { application: ownerProfile }
}

export const adminUpdateOwnerApplicationStatus = async (userId: string, data: AdminOwnerApplicationAction) => {
    const { action, rejectionReason } = data

    const user = await User.findById(userId)
    if (!user) throw new Error('User not found')

    const ownerProfile = await OwnerProfile.findOne({ user: userId })
    if (!ownerProfile) throw new Error('Owner application not found')

    if (action === 'APPROVED') {
        user.ownerStatus = 'APPROVED'
        user.role = 'venue_owner'
        ownerProfile.rejectionReason = null
    } else {
        user.ownerStatus = 'REJECTED'
        ownerProfile.rejectionReason = rejectionReason!
    }

    await Promise.all([user.save(), ownerProfile.save()])

    await createNotification({
        userId: user._id.toString(),
        type: action === "APPROVED" ? "owner_application_approved" : "owner_application_rejected",
        title: action === "APPROVED" ? "Owner Application Approved" : "Owner Application Rejected",
        message: action === "APPROVED"
            ? "Your owner application has been approved. You can now manage venues."
            : `Your owner application was rejected${rejectionReason ? `: ${rejectionReason}` : ""}`,
        data: {
            applicationId: ownerProfile._id.toString(),
            status: action,
            rejectionReason,
        },
    })

    return {
        message: action === 'APPROVED' ? 'Owner application approved successfully' : 'Owner application rejected successfully'
    }
}
