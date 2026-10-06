// pages/admin/BookingManagement.tsx
import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronLeft, ChevronRight, X, CalendarIcon } from "lucide-react"
import { useAdminGetBookingQuery } from "@/features/admin/adminApi"

const GOLD = "#D4AF37"

const bookingStatusStyles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-blue-100 text-blue-700",
    rejected: "bg-red-100 text-red-600",
    cancelled: "bg-gray-100 text-gray-500",
    completed: "bg-green-100 text-green-700",
    expired: "bg-orange-100 text-orange-600",
}

const paymentStatusStyles: Record<string, string> = {
    unpaid: "bg-yellow-100 text-yellow-700",
    fully_paid: "bg-green-100 text-green-700",
    refunded: "bg-blue-100 text-blue-700",
}



export default function BookingManagement() {
    const [searchParams, setSearchParams] = useSearchParams()

    const page = Number(searchParams.get("page") ?? 1)
    const bookingStatus = searchParams.get("bookingStatus") ?? ""
    const paymentStatus = searchParams.get("paymentStatus") ?? ""
    const startDate = searchParams.get("startDate") ?? ""
    const endDate = searchParams.get("endDate") ?? ""

    // local calendar state
    const [startCalOpen, setStartCalOpen] = useState(false)
    const [endCalOpen, setEndCalOpen] = useState(false)

    const { data, isLoading, isError, refetch } = useAdminGetBookingQuery({
        page,
        bookingStatus: bookingStatus || undefined,
        paymentStatus: paymentStatus || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
    })

    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value) params.set(key, value)
        else params.delete(key)
        if (key !== "page") params.set("page", "1")
        setSearchParams(params)
    }

    const clearFilters = () => setSearchParams({})

    const hasFilters = bookingStatus || paymentStatus || startDate || endDate

    const bookings = data?.bookings ?? []
    const pagination = data?.pagination
    const totalCount = data?.totalCount ?? 0

    return (
        <div className="space-y-5">
            {/* Header */}
            <div>
                <h1 className="text-gray-800 font-bold text-xl">Booking management</h1>
                <p className="text-gray-400 text-sm mt-0.5">{totalCount} total bookings</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3 flex-wrap">

                    {/* Booking status */}
                    <select
                        value={bookingStatus}
                        onChange={e => updateParam("bookingStatus", e.target.value)}
                        className="text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/30 text-gray-700 bg-white"
                    >
                        <option value="">All booking status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                        <option value="expired">Expired</option>
                    </select>

                    {/* Payment status */}
                    <select
                        value={paymentStatus}
                        onChange={e => updateParam("paymentStatus", e.target.value)}
                        className="text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/30 text-gray-700 bg-white"
                    >
                        <option value="">All payment status</option>
                        <option value="unpaid">Unpaid</option>
                        <option value="fully_paid">Fully paid</option>
                        <option value="refunded">Refunded</option>
                    </select>

                    {/* Start date */}
                    <Popover open={startCalOpen} onOpenChange={setStartCalOpen}>
                        <PopoverTrigger asChild>
                            <button className="flex items-center gap-2 text-sm px-3 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                                <CalendarIcon size={14} className="text-gray-400" />
                                {startDate ? format(new Date(startDate), "dd MMM yyyy") : "Start date"}
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={startDate ? new Date(startDate) : undefined}
                                onSelect={(date) => {
                                    if (date) updateParam("startDate", format(date, "yyyy-MM-dd"))
                                    setStartCalOpen(false)
                                }}
                            />
                        </PopoverContent>
                    </Popover>

                    {/* End date */}
                    <Popover open={endCalOpen} onOpenChange={setEndCalOpen}>
                        <PopoverTrigger asChild>
                            <button className="flex items-center gap-2 text-sm px-3 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                                <CalendarIcon size={14} className="text-gray-400" />
                                {endDate ? format(new Date(endDate), "dd MMM yyyy") : "End date"}
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={endDate ? new Date(endDate) : undefined}
                                onSelect={(date) => {
                                    if (date) updateParam("endDate", format(date, "yyyy-MM-dd"))
                                    setEndCalOpen(false)
                                }}
                            />
                        </PopoverContent>
                    </Popover>

                    {/* Clear */}
                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={14} /> Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {isLoading ? (
                    <div className="divide-y divide-gray-50">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                                <div className="flex-1 space-y-1.5">
                                    <div className="h-3.5 bg-gray-100 rounded w-1/4" />
                                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                                </div>
                                <div className="h-6 w-20 bg-gray-100 rounded-full" />
                                <div className="h-6 w-20 bg-gray-100 rounded-full" />
                            </div>
                        ))}
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <p className="text-gray-400 text-sm">Failed to load bookings</p>
                        <button onClick={refetch}
                            className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                            Retry
                        </button>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <p className="text-gray-400 text-sm">No bookings found</p>
                    </div>
                ) : (
                    <>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">User</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Venue</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Event</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Date</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Amount</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Booking</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Payment</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {bookings.map((booking: any) => (
                                    <tr key={booking._id} className="hover:bg-gray-50/60 transition-colors">
                                        {/* User */}
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                {booking.userId?.profileImage ? (
                                                    <img src={booking.userId.profileImage}
                                                        className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                                                        style={{ background: GOLD }}>
                                                        {booking.userId?.userName?.[0]?.toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-800">{booking.userId?.userName ?? "—"}</p>
                                                    <p className="text-gray-400 text-xs">{booking.userId?.email ?? ""}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Venue */}
                                        <td className="px-5 py-3.5">
                                            <p className="text-gray-700 font-medium">{booking.venueId?.venueName ?? "—"}</p>
                                            <p className="text-gray-400 text-xs">{booking.venueId?.location?.address?.city ?? ""}</p>
                                        </td>

                                        {/* Event */}
                                        <td className="px-5 py-3.5 text-gray-600">{booking.eventType}</td>

                                        {/* Date */}
                                        <td className="px-5 py-3.5 text-gray-500 text-xs">
                                            {new Date(booking.bookingDate).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </td>

                                        {/* Amount */}
                                        <td className="px-5 py-3.5 font-semibold text-gray-800">
                                            ₹{booking.totalAmount}
                                        </td>

                                        {/* Booking status */}
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${bookingStatusStyles[booking.bookingStatus] ?? 'bg-gray-100 text-gray-500'}`}>
                                                {booking.bookingStatus}
                                            </span>
                                        </td>

                                        {/* Payment status */}
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${paymentStatusStyles[booking.paymentStatus] ?? 'bg-gray-100 text-gray-500'}`}>
                                                {booking.paymentStatus === 'fully_paid' ? 'Paid' : booking.paymentStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {pagination && (
                            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
                                <p className="text-xs text-gray-400">
                                    Page {pagination.currentPage} of {pagination.totalPages} — {totalCount} bookings
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateParam("page", String(page - 1))}
                                        disabled={!pagination.hasPreviousPage}
                                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft size={14} />
                                    </button>
                                    <span className="text-sm font-medium text-gray-700 min-w-[24px] text-center">
                                        {pagination.currentPage}
                                    </span>
                                    <button
                                        onClick={() => updateParam("page", String(page + 1))}
                                        disabled={!pagination.hasNextPage}
                                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
