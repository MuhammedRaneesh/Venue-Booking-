import { User } from "../auth/user.schema.js";
import { Booking } from "../booking/booking.schema.js";
import { Venue } from "../venue/venue.schema.js";
import { OwnerProfile } from "../owner/owner.schema.js";
import mongoose from "mongoose";
import { AdminUserSchema, AdminGetAllVenue, AdminVenueStatus, AdminGetBookingsQuery, AdminGetOwnerApplicationsQuery, AdminOwnerApplicationAction, DashboardQuery } from "./admin.validation.js";
import { createNotification } from "../Notification/Notification.service.js";
import { AppError } from "../../utils/AppError.js";

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

    const monthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const [recentBookings, monthlyStats] = await Promise.all([
        Booking.find(dateFilter)
            .populate("userId", "fullName email profileImage phoneNumber")
            .populate("venueId", "venueName category photos location.address")
            .sort({ createdAt: -1 })
            .limit(5),
        Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: monthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    totalRevenue: {
                        $sum: {
                            $cond: [{ $eq: ["$paymentStatus", "fully_paid"] }, "$totalAmount", 0]
                        }
                    },
                    platformFees: {
                        $sum: {
                            $cond: [{ $eq: ["$paymentStatus", "fully_paid"] }, "$platformFee", 0]
                        }
                    },
                    bookingsCount: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ])
    ]);

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
        monthlyStats,
        recentBookings
    }

};


export const getAllusers = async (data: AdminUserSchema) => {
    
    const { search, limit, page, role, isActive } = data;

    const filter: Record<string, any> = {
        role: { $ne: "admin" }
    };

    if (role) filter.role = role;

    if (typeof isActive === "boolean") {
        if (isActive) {
            filter.isActive = { $ne: false };
        } else {
            filter.isActive = false;
        }
    }

    if (search) {
        filter.$or = [
            { fullName: { $regex: search, $options: "i", }, },
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

export const getUserStats = async () => {
    const stats = await User.aggregate([
        {
            $match: {
                role: { $ne: "admin" }
            }
        },
        {
            $facet: {
                total: [{ $count: "count" }],
                active: [
                    { $match: { isActive: { $ne: false } } },
                    { $count: "count" }
                ],
                blocked: [
                    { $match: { isActive: false } },
                    { $count: "count" }
                ],
                users: [
                    { $match: { role: "user" } },
                    { $count: "count" }
                ],
                venueOwners: [
                    { $match: { role: "venue_owner" } },
                    { $count: "count" }
                ]
            }
        }
    ]);

    const s = stats[0];

    return {
        total: s?.total[0]?.count ?? 0,
        active: s?.active[0]?.count ?? 0,
        blocked: s?.blocked[0]?.count ?? 0,
        users: s?.users[0]?.count ?? 0,
        venueOwners: s?.venueOwners[0]?.count ?? 0,
    };
};

export const toggleUserStatus = async (userId: string) => {
    const user = await User.findById(userId);

    if (!user) throw new AppError("User not found", 404);
    if (user.role === "admin") throw new AppError("Cannot toggle status of admin user", 403);

    const newStatus = user.isActive === false ? true : false;
    await User.updateOne({ _id: userId }, { $set: { isActive: newStatus } });

    return {
        message: newStatus ? 'User reactivated successfully' : 'User suspended successfully',
        isActive: newStatus
    };
};

export const adminGetUserDetails = async (userId: string) => {
    const user = await User.findById(userId).select("-password -refreshToken");
    return { user }
}

export const getVenueStats = async () => {
    const stats = await Venue.aggregate([
        {
            $facet: {
                total: [{ $count: "count" }],
                approved: [
                    { $match: { status: "approved" } },
                    { $count: "count" }
                ],
                pending: [
                    { $match: { status: "pending" } },
                    { $count: "count" }
                ],
                rejected: [
                    { $match: { status: "rejected" } },
                    { $count: "count" }
                ],
                suspended: [
                    { $match: { status: "suspended" } },
                    { $count: "count" }
                ],
                active: [
                    { $match: { isActive: { $ne: false } } },
                    { $count: "count" }
                ],
                inactive: [
                    { $match: { isActive: false } },
                    { $count: "count" }
                ]
            }
        }
    ]);

    const s = stats[0];

    return {
        total: s?.total?.[0]?.count ?? 0,
        approved: s?.approved?.[0]?.count ?? 0,
        pending: s?.pending?.[0]?.count ?? 0,
        rejected: s?.rejected?.[0]?.count ?? 0,
        suspended: s?.suspended?.[0]?.count ?? 0,
        active: s?.active?.[0]?.count ?? 0,
        inactive: s?.inactive?.[0]?.count ?? 0,
    };
};

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
        Venue.find(filter)
            .populate('owner', 'fullName email profileImage phoneNumber')
            .select('venueName description category location.address pricing capacity photos status isActive rejectionReason createdAt')
            .sort({ createdAt: -1 })
            .skip(Skip)
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
    const venue = await Venue.findById(venueId).populate("owner", "fullName email profileImage phoneNumber")
    if (!venue) throw new AppError("venue not found", 404)
    return { venue }
}

export const adminUpdateVenueStatus = async (venueId: string, data: AdminVenueStatus) => {
    const { status, reason } = data

    const venue = await Venue.findById(venueId)
    if (!venue) throw new AppError("Venue not found", 404)
    const previousStatus = venue.status

    if (status === 'rejected' && !reason) {
        throw new AppError("Rejection reason is required", 400)
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
    if (!venue) throw new AppError('Venue not found', 404)

    venue.isActive = !venue.isActive
    await venue.save()

    return {
        message: venue.isActive ? 'Venue activated successfully' : 'Venue deactivated successfully',
        isActive: venue.isActive
    }
}

export const getBookingStats = async () => {
    const stats = await Booking.aggregate([
        {
            $facet: {
                total: [{ $count: "count" }],
                pending: [
                    { $match: { bookingStatus: "pending" } },
                    { $count: "count" }
                ],
                approved: [
                    { $match: { bookingStatus: "approved" } },
                    { $count: "count" }
                ],
                completed: [
                    { $match: { bookingStatus: "completed" } },
                    { $count: "count" }
                ],
                cancelled: [
                    { $match: { bookingStatus: { $in: ["cancelled", "rejected", "expired"] } } },
                    { $count: "count" }
                ],
                fullyPaid: [
                    { $match: { paymentStatus: "fully_paid" } },
                    { $count: "count" }
                ],
                unpaid: [
                    { $match: { paymentStatus: "unpaid" } },
                    { $count: "count" }
                ],
                totalRevenue: [
                    { $match: { paymentStatus: "fully_paid" } },
                    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
                ],
                totalPlatformFees: [
                    { $match: { paymentStatus: "fully_paid" } },
                    { $group: { _id: null, total: { $sum: "$platformFee" } } }
                ]
            }
        }
    ]);

    const s = stats[0];
    return {
        total: s?.total?.[0]?.count ?? 0,
        pending: s?.pending?.[0]?.count ?? 0,
        approved: s?.approved?.[0]?.count ?? 0,
        completed: s?.completed?.[0]?.count ?? 0,
        cancelled: s?.cancelled?.[0]?.count ?? 0,
        fullyPaid: s?.fullyPaid?.[0]?.count ?? 0,
        unpaid: s?.unpaid?.[0]?.count ?? 0,
        totalRevenue: s?.totalRevenue?.[0]?.total ?? 0,
        totalPlatformFees: s?.totalPlatformFees?.[0]?.total ?? 0,
    };
};

export const adminGetBookingDetail = async (bookingId: string) => {
    const booking = await Booking.findById(bookingId)
        .populate('userId', 'fullName email profileImage phoneNumber')
        .populate('venueId', 'venueName category photos location.address pricing')
        .populate('ownerId', 'fullName email phoneNumber');
    if (!booking) throw new AppError("Booking not found", 404);
    return { booking };
};

export const adminCancelBooking = async (bookingId: string, reason: string) => {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new AppError("Booking not found", 404);

    booking.bookingStatus = "cancelled";
    booking.cancellationReason = reason || "Cancelled by administrator";
    booking.cancelledAt = new Date();
    await booking.save();

    await createNotification({
        userId: booking.userId.toString(),
        type: "booking_cancelled",
        title: "Booking Cancelled by Administrator",
        message: `Your booking has been cancelled: ${reason || "Administrative decision"}`,
        data: { bookingId, cancellationReason: reason }
    });

    await createNotification({
        userId: booking.ownerId.toString(),
        type: "booking_cancelled",
        title: "Booking Cancelled by Administrator",
        message: `A booking for your venue was cancelled: ${reason || "Administrative decision"}`,
        data: { bookingId, cancellationReason: reason }
    });

    return { message: "Booking cancelled successfully" };
};

export const adminGetAllBookings = async (data: AdminGetBookingsQuery) => {
    const { search, bookingStatus, paymentStatus, startDate, endDate, page, limit } = data

    const filter: Record<string, any> = {}

    if (bookingStatus) filter.bookingStatus = bookingStatus
    if (paymentStatus) filter.paymentStatus = paymentStatus
    if (startDate && endDate) {
        filter.bookingDate = { $gte: startDate, $lte: endDate }
    }

    if (search && search.trim()) {
        const clean = search.trim();
        const [matchingUsers, matchingVenues] = await Promise.all([
            User.find({
                $or: [
                    { fullName: { $regex: clean, $options: 'i' } },
                    { email: { $regex: clean, $options: 'i' } }
                ]
            }).select('_id'),
            Venue.find({
                venueName: { $regex: clean, $options: 'i' }
            }).select('_id')
        ]);

        const userIds = matchingUsers.map(u => u._id);
        const venueIds = matchingVenues.map(v => v._id);

        filter.$or = [
            { eventType: { $regex: clean, $options: 'i' } },
            { userId: { $in: userIds } },
            { venueId: { $in: venueIds } }
        ];
    }

    const Page = Number(page) || 1
    const Limit = Number(limit) || 10
    const Skip = (Page - 1) * Limit

    const [totalCount, bookings] = await Promise.all([
        Booking.countDocuments(filter),
        Booking.find(filter)
            .populate('userId', 'fullName email profileImage phoneNumber')
            .populate('venueId', 'venueName category photos location.address pricing')
            .populate('ownerId', 'fullName email phoneNumber')
            .select('-razorpayOrderId -razorpayPaymentId -razorpaySignature')
            .sort({ createdAt: -1 })
            .skip(Skip)
            .limit(Limit)
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


export const getOwnerApplicationStats = async () => {
    const stats = await User.aggregate([
        {
            $match: {
                ownerStatus: { $in: ["PENDING", "APPROVED", "REJECTED"] }
            }
        },
        {
            $facet: {
                total: [{ $count: "count" }],
                pending: [
                    { $match: { ownerStatus: "PENDING" } },
                    { $count: "count" }
                ],
                approved: [
                    { $match: { ownerStatus: "APPROVED" } },
                    { $count: "count" }
                ],
                rejected: [
                    { $match: { ownerStatus: "REJECTED" } },
                    { $count: "count" }
                ]
            }
        }
    ]);

    const s = stats[0];

    return {
        total: s?.total[0]?.count ?? 0,
        pending: s?.pending[0]?.count ?? 0,
        approved: s?.approved[0]?.count ?? 0,
        rejected: s?.rejected[0]?.count ?? 0,
    };
};

export const adminGetOwnerApplications = async (data: AdminGetOwnerApplicationsQuery) => {
    const { ownerStatus, search, page, limit } = data;

    const Page = Number(page) || 1;
    const Limit = Number(limit) || 10;
    const Skip = (Page - 1) * Limit;

    const userFilter: Record<string, any> = {};
    if (ownerStatus) userFilter.ownerStatus = ownerStatus;
    else userFilter.ownerStatus = { $ne: "NONE" };

    let userIds: any[] = [];
    if (search && search.trim()) {
        const s = search.trim();

        // 1. Users matching fullName or email
        const matchingUsers = await User.find({
            ...userFilter,
            $or: [
                { fullName: { $regex: s, $options: 'i' } },
                { email: { $regex: s, $options: 'i' } }
            ]
        }).select('_id');
        const userIdsFromUsers = matchingUsers.map(u => u._id);

        // 2. All users with matching status
        const allStatusUsers = await User.find(userFilter).select('_id');
        const allStatusUserIds = allStatusUsers.map(u => u._id);

        // 3. Owner profiles matching businessName, phone, or city
        const matchingProfiles = await OwnerProfile.find({
            user: { $in: allStatusUserIds },
            $or: [
                { businessName: { $regex: s, $options: 'i' } },
                { phone: { $regex: s, $options: 'i' } },
                { city: { $regex: s, $options: 'i' } }
            ]
        }).select('user');
        const userIdsFromProfiles = matchingProfiles.map(p => p.user);

        const combined = new Set([
            ...userIdsFromUsers.map(id => id.toString()),
            ...userIdsFromProfiles.map(id => id.toString())
        ]);
        userIds = Array.from(combined);
    } else {
        const users = await User.find(userFilter).select('_id');
        userIds = users.map(u => u._id);
    }

    const queryFilter = { user: { $in: userIds } };

    const [totalCount, applications] = await Promise.all([
        OwnerProfile.countDocuments(queryFilter),
        OwnerProfile.find(queryFilter)
            .populate('user', 'fullName email profileImage ownerStatus role isActive createdAt')
            .sort({ createdAt: -1 })
            .skip(Skip)
            .limit(Limit)
    ]);

    return {
        applications,
        totalCount,
        pagination: {
            currentPage: Page,
            totalPages: Math.ceil(totalCount / Limit),
            hasNextPage: Page < Math.ceil(totalCount / Limit),
            hasPreviousPage: Page > 1
        }
    };
};

export const adminGetOwnerApplicationDetail = async (id: string) => {
    let ownerProfile = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
        ownerProfile = await OwnerProfile.findOne({ user: id })
            .populate('user', 'fullName email profileImage ownerStatus role createdAt');

        if (!ownerProfile) {
            ownerProfile = await OwnerProfile.findById(id)
                .populate('user', 'fullName email profileImage ownerStatus role createdAt');
        }
    }

    if (!ownerProfile) throw new AppError('Application not found', 404);

    return { application: ownerProfile };
};

export const adminUpdateOwnerApplicationStatus = async (id: string, data: AdminOwnerApplicationAction) => {
    const { action, rejectionReason } = data;

    let user: any = null;
    let ownerProfile: any = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
        // Try finding OwnerProfile by either user reference or direct _id
        ownerProfile = await OwnerProfile.findOne({
            $or: [{ user: id }, { _id: id }]
        });

        if (ownerProfile) {
            user = await User.findById(ownerProfile.user);
        }

        if (!user) {
            user = await User.findById(id);
            if (user && !ownerProfile) {
                ownerProfile = await OwnerProfile.findOne({ user: user._id });
            }
        }
    }

    if (!user) throw new AppError('User not found', 404);
    if (!ownerProfile) throw new AppError('Owner application not found', 404);

    const userUpdate: Record<string, any> = {
        ownerStatus: action === 'APPROVED' ? 'APPROVED' : 'REJECTED',
    };

    if (action === 'APPROVED') {
        userUpdate.role = 'venue_owner';
    }

    // Safeguard legacy users: backfill fullName if missing
    if (!user.fullName) {
        userUpdate.fullName = (user as any).userName || user.email?.split('@')[0] || 'User';
    }

    // Atomic database updates bypass full-schema revalidation failures
    await Promise.all([
        User.findByIdAndUpdate(user._id, { $set: userUpdate }, { new: true }),
        OwnerProfile.findByIdAndUpdate(
            ownerProfile._id,
            {
                $set: {
                    rejectionReason: action === 'APPROVED' ? null : (rejectionReason || 'Application rejected by administrator')
                }
            },
            { new: true }
        ),
    ]);

    // Dispatch real-time notification safely without blocking status update
    try {
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
        });
    } catch (notifErr) {
        console.error("[Owner Application] Non-fatal notification error:", notifErr);
    }

    return {
        message: action === 'APPROVED' ? 'Owner application approved successfully' : 'Owner application rejected successfully'
    };
};
