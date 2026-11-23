import mongoose from "mongoose"
import { Booking } from "../booking/booking.schema.js"
import { Venue } from "../venue/venue.schema.js"
import { AppError } from "../../utils/AppError.js"

const TZ = "Asia/Kolkata"
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000
const INACTIVE: readonly ("pending" | "approved" | "rejected" | "cancelled" | "completed" | "expired")[] = [
    "cancelled",
    "rejected",
    "expired",
]

// owner's share: ownerPayout, falling back to total - fee for old bookings
const NET_AMOUNT = {
    $cond: [
        { $gt: ["$ownerPayout", 0] },
        "$ownerPayout",
        { $subtract: ["$totalAmount", { $ifNull: ["$platformFee", 0] }] },
    ],
}

type Range = { start: Date; end: Date }

const istMonthRange = (offset = 0): Range => {
    const ist = new Date(Date.now() + IST_OFFSET_MS)
    const y = ist.getUTCFullYear()
    const m = ist.getUTCMonth() + offset
    return {
        start: new Date(Date.UTC(y, m, 1) - IST_OFFSET_MS),
        end: new Date(Date.UTC(y, m + 1, 1) - IST_OFFSET_MS),
    }
}

const istStartOfToday = () => {
    const ist = new Date(Date.now() + IST_OFFSET_MS)
    return new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate()) - IST_OFFSET_MS)
}

const monthKey = (start: Date) =>
    new Date(start.getTime() + IST_OFFSET_MS).toISOString().slice(0, 7)

const changePct = (current: number, previous: number) =>
    previous === 0 ? null : Number((((current - previous) / previous) * 100).toFixed(1))

// builds the base filter and checks the venue belongs to this owner
const buildScope = async (ownerId: string, venueId?: string) => {
    const scope: Record<string, any> = { ownerId: new mongoose.Types.ObjectId(ownerId) }
    if (venueId) {
        const owned = await Venue.exists({ _id: venueId, owner: ownerId })
        if (!owned) throw new AppError("Venue not found", 404)
        scope.venueId = new mongoose.Types.ObjectId(venueId)
    }
    return scope
}

const sumRevenue = async (scope: Record<string, any>, { start, end }: Range) => {
    const [r] = await Booking.aggregate([
        { $match: { ...scope, paymentStatus: "fully_paid", bookingStatus: { $nin: INACTIVE } } },
        { $addFields: { revenueDate: { $ifNull: ["$paidAt", "$createdAt"] }, net: NET_AMOUNT } },
        { $match: { revenueDate: { $gte: start, $lt: end } } },
        { $group: { _id: null, total: { $sum: "$net" } } },
    ])
    return r?.total ?? 0
}

const countBookings = (scope: Record<string, any>, { start, end }: Range) =>
    Booking.countDocuments({
        ...scope,
        bookingStatus: { $nin: INACTIVE },
        bookingDate: { $gte: start, $lt: end },
    })

// booked (venue, day) pairs divided by available venue-days.
// Simplification: an hourly booking marks the whole day as occupied.
const calcOccupancy = async (scope: Record<string, any>, { start, end }: Range) => {
    const [booked, venueCount] = await Promise.all([
        Booking.aggregate([
            {
                $match: {
                    ...scope,
                    bookingStatus: { $in: ["approved", "completed"] },
                    bookingDate: { $gte: start, $lt: end },
                },
            },
            { $group: { _id: { venueId: "$venueId", day: "$bookingDate" } } },
            { $count: "days" },
        ]),
        scope.venueId
            ? Promise.resolve(1)
            : Venue.countDocuments({ owner: scope.ownerId, status: "approved", isActive: true }),
    ])
    const daysInMonth = Math.round((end.getTime() - start.getTime()) / DAY_MS)
    const available = venueCount * daysInMonth
    if (available === 0) return 0
    return Number((((booked[0]?.days ?? 0) / available) * 100).toFixed(1))
}

export const getOwnerDashboardSummary = async (ownerId: string, venueId?: string) => {
    const scope = await buildScope(ownerId, venueId)
    const cur = istMonthRange(0)
    const prev = istMonthRange(-1)

    const [revCur, revPrev, bkCur, bkPrev, occCur, occPrev, pendingCount, pendingDocs, upcomingDocs] =
        await Promise.all([
            sumRevenue(scope, cur),
            sumRevenue(scope, prev),
            countBookings(scope, cur),
            countBookings(scope, prev),
            calcOccupancy(scope, cur),
            calcOccupancy(scope, prev),
            Booking.countDocuments({ ...scope, bookingStatus: "pending" }),
            Booking.find({ ...scope, bookingStatus: "pending" })
                .sort({ createdAt: 1 }).limit(5)
                .populate("userId", "fullName userName email phoneNumber")
                .populate("venueId", "venueName")
                .lean(),
            Booking.find({ ...scope, bookingStatus: "approved", bookingDate: { $gte: istStartOfToday() } })
                .sort({ bookingDate: 1 }).limit(5)
                .populate("userId", "fullName userName email phoneNumber")
                .populate("venueId", "venueName")
                .lean(),
        ])

    const mapBooking = (b: any) => ({
        bookingId: b._id,
        guestName: b.userId?.fullName ?? b.userId?.userName ?? null,
        guestEmail: b.userId?.email ?? null,
        guestPhone: b.userId?.phoneNumber ?? null,
        venueName: b.venueId?.venueName ?? null,
        eventType: b.eventType,
        bookingType: b.bookingType,
        bookingDate: b.bookingDate,
        startDateTime: b.startDateTime ?? null,
        endDateTime: b.endDateTime ?? null,
        guestCount: b.guestCount,
        amount: b.totalAmount,
        paymentStatus: b.paymentStatus,
        createdAt: b.createdAt,
    })

    return {
        kpis: {
            revenue: { value: revCur, previous: revPrev, changePct: changePct(revCur, revPrev) },
            bookings: { value: bkCur, previous: bkPrev, changePct: changePct(bkCur, bkPrev) },
            occupancy: { value: occCur, previous: occPrev, changePct: changePct(occCur, occPrev) },
            pending: { value: pendingCount },
        },
        pendingRequests: pendingDocs.map(mapBooking),
        upcoming: upcomingDocs.map(mapBooking),
    }
}

export const getOwnerRevenueSeries = async (ownerId: string, range: "6m" | "12m", venueId?: string) => {
    const scope = await buildScope(ownerId, venueId)
    const months = range === "6m" ? 6 : 12
    const from = istMonthRange(-(months - 1)).start

    const rows = await Booking.aggregate([
        { $match: { ...scope, paymentStatus: "fully_paid", bookingStatus: { $nin: INACTIVE } } },
        { $addFields: { revenueDate: { $ifNull: ["$paidAt", "$createdAt"] }, net: NET_AMOUNT } },
        { $match: { revenueDate: { $gte: from } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$revenueDate", timezone: TZ } },
                revenue: { $sum: "$net" },
                bookings: { $sum: 1 },
            },
        },
    ])
    const byMonth = new Map(rows.map((r) => [r._id as string, r]))

    // fill empty months so the chart has no gaps
    return Array.from({ length: months }, (_, i) => {
        const key = monthKey(istMonthRange(-(months - 1 - i)).start)
        const row = byMonth.get(key)
        return { month: key, revenue: row?.revenue ?? 0, bookings: row?.bookings ?? 0 }
    })
}

export const getOwnerBreakdown = async (
    ownerId: string,
    range: "30d" | "6m" | "12m" | "all",
    venueId?: string
) => {
    const scope = await buildScope(ownerId, venueId)
    const match: Record<string, any> = { ...scope }

    if (range === "30d") match.createdAt = { $gte: new Date(Date.now() - 30 * DAY_MS) }
    else if (range === "6m") match.createdAt = { $gte: istMonthRange(-5).start }
    else if (range === "12m") match.createdAt = { $gte: istMonthRange(-11).start }

    const live = { $match: { bookingStatus: { $nin: INACTIVE } } }

    const [r] = await Booking.aggregate([
        { $match: match },
        {
            $facet: {
                status: [{ $group: { _id: "$bookingStatus", count: { $sum: 1 } } }],
                weekday: [
                    live,
                    { $group: { _id: { $dayOfWeek: { date: "$bookingDate", timezone: TZ } }, count: { $sum: 1 } } },
                ],
                eventType: [
                    live,
                    { $group: { _id: "$eventType", count: { $sum: 1 } } },
                    { $sort: { count: -1 } },
                ],
                bookingType: [live, { $group: { _id: "$bookingType", count: { $sum: 1 } } }],
            },
        },
    ])

    const dayNames = ["", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const weekdayCounts = new Map<number, number>(r.weekday.map((w: any) => [w._id, w.count]))

    return {
        status: r.status.map((s: any) => ({ status: s._id, count: s.count })),
        weekday: [2, 3, 4, 5, 6, 7, 1].map((d) => ({ day: dayNames[d], count: weekdayCounts.get(d) ?? 0 })),
        eventType: r.eventType.map((e: any) => ({ eventType: e._id, count: e.count })),
        bookingType: r.bookingType.map((b: any) => ({ bookingType: b._id, count: b.count })),
    }
}
