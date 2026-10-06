import { useState } from "react"
import { useAdminDashboardQuery } from "@/features/admin/adminApi"
import { Users, Building2, CalendarCheck, IndianRupee, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

const GOLD = "#D4AF37"

type Period = "this_month" | "this_year" | "all"

const formatCurrency = (amount: number) =>
    `\u20b9${amount.toLocaleString("en-IN")}`

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })

const statusStyles: Record<string, string> = {
    pending:   "bg-yellow-100 text-yellow-700",
    approved:  "bg-green-100 text-green-700",
    rejected:  "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-600",
    completed: "bg-blue-100 text-blue-700",
    expired:   "bg-orange-100 text-orange-700",
}

export default function DashboardOverview() {
    const [period, setPeriod] = useState<Period>("all")
    const navigate = useNavigate()
    const { data, isLoading, isError, refetch } = useAdminDashboardQuery({ period })

    if (isLoading) return (
        <div className="space-y-4 animate-pulse">
            <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-white rounded-xl border border-gray-200" />)}
            </div>
            <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-white rounded-xl border border-gray-200" />)}
            </div>
            <div className="h-64 bg-white rounded-xl border border-gray-200" />
        </div>
    )

    if (isError) return (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
            <p className="text-gray-500 text-sm">Failed to load dashboard data</p>
            <button
                onClick={refetch}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
                Retry
            </button>
        </div>
    )

    const { users, venues, bookings, revenue, recentBookings } = data.data

    return (
        <div className="space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-gray-800 font-bold text-xl">Dashboard Overview</h1>
                    <p className="text-gray-400 text-sm mt-0.5">Welcome back, here&apos;s what&apos;s happening</p>
                </div>
                <select
                    value={period}
                    onChange={e => setPeriod(e.target.value as Period)}
                    className="text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none"
                >
                    <option value="all">All time</option>
                    <option value="this_month">This month</option>
                    <option value="this_year">This year</option>
                </select>
            </div>

            {/* Main stat cards */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { icon: <Users size={18} />,         label: "Total Users",    value: users.total,               sub: `${users.owners} venue owners` },
                    { icon: <Building2 size={18} />,     label: "Total Venues",   value: venues.totalVenue,          sub: `${venues.pending} pending approval`,         subColor: "text-yellow-600" },
                    { icon: <CalendarCheck size={18} />, label: "Total Bookings", value: bookings.totalBooking,      sub: `${bookings.active} active`,                  subColor: "text-blue-600" },
                    { icon: <IndianRupee size={18} />,   label: "Total Revenue",  value: formatCurrency(revenue.totalRevenue), sub: `${formatCurrency(revenue.totalPlatformFees)} platform fees`, subColor: "text-green-600" },
                ].map(({ icon, label, value, sub, subColor = "text-gray-400" }) => (
                    <div key={label} className="bg-white rounded-xl border border-gray-200 p-5" style={{ borderLeft: `3px solid ${GOLD}` }}>
                        <div className="flex items-center gap-2 text-gray-400 mb-3">
                            <span style={{ color: GOLD }}>{icon}</span>
                            <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{value}</p>
                        {sub && <p className={`text-xs mt-1 ${subColor}`}>{sub}</p>}
                    </div>
                ))}
            </div>

            {/* Mini action cards */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { icon: <Clock size={15} className="text-yellow-500" />,       label: "Pending Applications", value: users.pendingOwnerApplications, path: "/admin/applications", highlight: users.pendingOwnerApplications > 0 },
                    { icon: <AlertCircle size={15} className="text-orange-500" />, label: "Pending Venues",       value: venues.pending,                  path: "/admin/venues",        highlight: venues.pending > 0 },
                    { icon: <CheckCircle size={15} className="text-green-500" />,  label: "Completed Bookings",   value: bookings.completed,              path: null,                   highlight: false },
                    { icon: <XCircle size={15} className="text-red-400" />,        label: "Cancelled Bookings",   value: bookings.cancelled,              path: null,                   highlight: false },
                ].map(({ icon, label, value, path, highlight }) => (
                    <div
                        key={label}
                        onClick={() => path && navigate(path)}
                        className={`bg-white rounded-xl border p-4 flex items-center gap-3 ${path ? "cursor-pointer hover:shadow-sm transition-shadow" : ""} ${highlight ? "border-yellow-200" : "border-gray-200"}`}
                    >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${highlight ? "bg-yellow-50" : "bg-gray-50"}`}>
                            {icon}
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">{label}</p>
                            <p className={`text-lg font-bold ${highlight ? "text-yellow-600" : "text-gray-800"}`}>{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent bookings table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800 text-[15px]">Recent Bookings</h2>
                    <button
                        onClick={() => navigate("/admin/bookings")}
                        className="text-sm font-medium transition-colors"
                        style={{ color: GOLD }}
                    >
                        View all →
                    </button>
                </div>

                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            {["User", "Venue", "Date", "Amount", "Status"].map(col => (
                                <th key={col} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {!recentBookings?.length ? (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-gray-400 text-sm">
                                    No recent bookings
                                </td>
                            </tr>
                        ) : (
                            recentBookings.map((booking: any) => (
                                <tr key={booking._id} className="hover:bg-gray-50/60 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <p className="font-medium text-gray-800">{booking.userId?.userName ?? "—"}</p>
                                        <p className="text-gray-400 text-xs">{booking.userId?.email ?? ""}</p>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-600">{booking.venueId?.venueName ?? "—"}</td>
                                    <td className="px-5 py-3.5 text-gray-500">{formatDate(booking.createdAt)}</td>
                                    <td className="px-5 py-3.5 font-semibold text-gray-800">{formatCurrency(booking.totalAmount)}</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[booking.bookingStatus] ?? "bg-gray-100 text-gray-600"}`}>
                                            {booking.bookingStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    )
}
