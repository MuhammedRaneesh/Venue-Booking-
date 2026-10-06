import type {
    OwnerBookingItem,
    OwnerDashboardChartPoint,
    OwnerDashboardRecentBooking,
    OwnerDashboardSummaryResponse,
} from "@/features/owner/types/owner.type"

export const DASHBOARD_COLORS = {
    primary: "#0F766E",
    secondary: "#64748B",
    accent: "#0D9488",
    background: "#F8FAFC",
    text: "#0F172A",
    border: "#E2E8F0",
    hover: "#F1F5F9",
    confirmed: "#10B981",
    pending: "#F59E0B",
    cancelled: "#F43F5E",
    completed: "#3B82F6",
} as const

export type BookingStatusKey = "confirmed" | "pending" | "cancelled" | "completed"

export const statusLabels: Record<BookingStatusKey, string> = {
    confirmed: "Confirmed",
    pending: "Pending",
    cancelled: "Cancelled",
    completed: "Completed",
}

export const statusColors: Record<BookingStatusKey, string> = {
    confirmed: DASHBOARD_COLORS.confirmed,
    pending: DASHBOARD_COLORS.pending,
    cancelled: DASHBOARD_COLORS.cancelled,
    completed: DASHBOARD_COLORS.completed,
}

const asNumber = (value: unknown) => {
    const number = Number(value)
    return Number.isFinite(number) ? number : 0
}

const getNested = (source: any, paths: string[]) => {
    for (const path of paths) {
        const value = path.split(".").reduce((current, key) => current?.[key], source)
        if (value !== undefined && value !== null) {
            return value
        }
    }
    return undefined
}

export const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value)

export const formatNumber = (value: number) => value.toLocaleString("en-IN")

export const formatChartLabel = (date: string) => {
    const [year, month, day] = date.split("-").map(Number)
    const parsedDate = month
        ? new Date(year, month - 1, day || 1)
        : new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
        return date
    }

    return day
        ? parsedDate.toLocaleDateString("en-IN", { month: "short", day: "numeric" })
        : parsedDate.toLocaleDateString("en-IN", { month: "short" })
}

export const normalizeDashboard = (summary?: OwnerDashboardSummaryResponse) => {
    const data = summary?.data || {}
    const source = { ...data, ...summary }

    const totalRevenue = asNumber(getNested(source, [
        "stats.totalRevenue",
        "revenue.totalRevenue",
        "totalRevenue",
        "totalEarnings",
    ]))
    const totalBookings = asNumber(getNested(source, [
        "stats.totalBookings",
        "bookings.totalBookings",
        "totalBookings",
    ]))
    const pendingBookings = asNumber(getNested(source, [
        "stats.pendingBookings",
        "bookings.pendingBookings",
        "pendingBookings",
    ]))
    const activeVenues = asNumber(getNested(source, [
        "stats.activeVenues",
        "venues.activeVenues",
        "activeVenues",
    ]))

    const recentBookings = (getNested(source, ["recentBookings", "bookings.recent", "recent"]) || []) as OwnerDashboardRecentBooking[]

    return {
        totalRevenue,
        totalBookings,
        pendingBookings,
        activeVenues,
        recentBookings,
        deltas: {
            totalRevenue: asNumber(getNested(source, ["deltas.totalRevenue", "revenue.delta", "totalRevenueDelta"])),
            totalBookings: asNumber(getNested(source, ["deltas.totalBookings", "bookings.delta", "totalBookingsDelta"])),
            pendingBookings: asNumber(getNested(source, ["deltas.pendingBookings", "pendingBookingsDelta"])),
            activeVenues: asNumber(getNested(source, ["deltas.activeVenues", "activeVenuesDelta"])),
        },
        statusCounts: normalizeStatusCounts(getNested(source, [
            "bookingStatusCounts",
            "statusCounts",
            "bookings.statusCounts",
        ]), recentBookings),
    }
}

export const normalizeRevenueChart = (points?: OwnerDashboardChartPoint[], period: "year" | "month" = "year") => {
    if (period === "year") {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const dataMap = new Map(
            (points || []).map(p => {
                const parts = p.date.split("-");
                const mIdx = parts.length >= 2 ? Number(parts[1]) - 1 : 0;
                return [months[mIdx], asNumber(p.revenue ?? p.earnings ?? p.totalAmount)];
            })
        );
        return months.map(m => ({
            label: m,
            date: m,
            revenue: dataMap.get(m) || 0
        }));
    }
    
    return (points || []).map((point) => ({
        label: formatChartLabel(point.date),
        date: point.date,
        revenue: asNumber(point.revenue ?? point.earnings ?? point.totalAmount),
    }))
}

export const normalizeBookingRow = (booking: OwnerDashboardRecentBooking | OwnerBookingItem) => {
    const user = "userId" in booking ? booking.userId : booking.user
    const venue = "venueId" in booking ? booking.venueId : booking.venue

    return {
        id: booking._id,
        guest: user?.userName || "Guest",
        email: user?.email || "",
        venue: venue?.venueName || "Venue",
        date: booking.bookingDate,
        amount: asNumber(("totalAmount" in booking ? booking.totalAmount : undefined) ?? ("amountPaid" in booking ? booking.amountPaid : undefined)),
        status: normalizeStatus(booking.bookingStatus),
    }
}

export const normalizeStatus = (status?: string): BookingStatusKey => {
    switch ((status || "").toLowerCase()) {
        case "approved":
        case "confirmed":
            return "confirmed"
        case "pending":
            return "pending"
        case "cancelled":
        case "rejected":
        case "expired":
            return "cancelled"
        case "completed":
            return "completed"
        default:
            return "pending"
    }
}

export function normalizeStatusCounts(input: unknown, fallbackBookings: OwnerDashboardRecentBooking[] = []) {
    const counts: Record<BookingStatusKey, number> = {
        confirmed: 0,
        pending: 0,
        cancelled: 0,
        completed: 0,
    }

    if (Array.isArray(input)) {
        input.forEach((item: any) => {
            const status = normalizeStatus(item.status || item.bookingStatus || item._id)
            counts[status] += asNumber(item.count || item.total || item.value)
        })
    } else if (input && typeof input === "object") {
        Object.entries(input as Record<string, unknown>).forEach(([status, value]) => {
            counts[normalizeStatus(status)] += asNumber(value)
        })
    } else {
        fallbackBookings.forEach((booking) => {
            counts[normalizeStatus(booking.bookingStatus)] += 1
        })
    }

    return counts
}
