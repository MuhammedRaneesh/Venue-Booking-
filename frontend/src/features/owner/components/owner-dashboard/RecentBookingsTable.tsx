import { ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import type { OwnerBookingItem, OwnerDashboardRecentBooking, Pagination } from "@/features/owner/types/owner.type"
import {BookingStatusKey,formatCurrency,normalizeBookingRow,statusColors,statusLabels,} from "./dashboardData"

interface RecentBookingsTableProps {
    bookings: Array<OwnerDashboardRecentBooking | OwnerBookingItem>
    pagination?: Pagination
    page: number
    onPageChange: (page: number) => void
}

function StatusBadge({ status }: { status: BookingStatusKey }) {
    const color = statusColors[status]

    return (
        <Badge
            variant="outline"
            className="rounded-full border-none px-2.5 py-1 text-xs font-semibold capitalize shadow-none"
            style={{ color, backgroundColor: `${color}15` }}
        >
            {statusLabels[status]}
        </Badge>
    )
}

function RecentBookingsTable({ bookings, pagination, page, onPageChange }: RecentBookingsTableProps) {
    const rows = bookings.map(normalizeBookingRow)
    const totalPages = pagination?.totalPages || 1
    const canPrevious = pagination?.hasPreviousPage || page > 1
    const canNext = pagination?.hasNextPage || page < totalPages

    return (
        <section className="rounded-2xl border border-[#E5DFD2] bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#E5DFD2] px-5 py-4">
                <div>
                    <h2 className="text-lg font-bold text-[#1E1E1C]">Recent Bookings</h2>
                    <p className="text-sm text-[#4A6357]">Latest reservations across your venues</p>
                </div>
            </div>

            <div className="max-h-[460px] overflow-auto">
                <Table className="min-w-[760px]">
                    <TableHeader>
                        <TableRow className="border-[#E5DFD2] hover:bg-transparent">
                            <TableHead className="sticky top-0 bg-white text-[13px] font-semibold uppercase tracking-wide text-[#4A6357]">
                                Guest
                            </TableHead>
                            <TableHead className="sticky top-0 bg-white text-[13px] font-semibold uppercase tracking-wide text-[#4A6357]">
                                Venue
                            </TableHead>
                            <TableHead className="sticky top-0 bg-white text-[13px] font-semibold uppercase tracking-wide text-[#4A6357]">
                                Date
                            </TableHead>
                            <TableHead className="sticky top-0 bg-white text-[13px] font-semibold uppercase tracking-wide text-[#4A6357]">
                                Amount
                            </TableHead>
                            <TableHead className="sticky top-0 bg-white text-[13px] font-semibold uppercase tracking-wide text-[#4A6357]">
                                Status
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow className="border-[#E5DFD2]">
                                <TableCell colSpan={5} className="h-28 text-center text-sm text-[#4A6357]">
                                    No recent bookings found
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row) => (
                                <TableRow key={row.id} className="border-[#E5DFD2] hover:bg-[#F3EFE6]">
                                    <TableCell>
                                        <div>
                                            <p className="font-semibold text-[#1E1E1C]">{row.guest}</p>
                                            <p className="text-xs text-[#4A6357]">{row.email}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-[#1E1E1C]">{row.venue}</TableCell>
                                    <TableCell className="text-[#4A6357] tabular-nums">
                                        {row.date
                                            ? new Date(row.date).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })
                                            : "-"}
                                    </TableCell>
                                    <TableCell className="font-semibold text-[#1E1E1C] tabular-nums">
                                        {formatCurrency(row.amount)}
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={row.status} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-[#E5DFD2] px-5 py-4">
                <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    disabled={!canPrevious}
                    onClick={() => onPageChange(page - 1)}
                    className="rounded-[6px] border-[#E5DFD2] bg-[#FAF7F0] text-[#4A6357] hover:bg-[#F3EFE6] hover:text-[#1E1E1C]"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="rounded-[6px] bg-[#22443A] px-3 py-1.5 text-sm font-semibold text-white tabular-nums">
                    {page}
                </span>
                <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    disabled={!canNext}
                    onClick={() => onPageChange(page + 1)}
                    className="rounded-[6px] border-[#E5DFD2] bg-[#FAF7F0] text-[#4A6357] hover:bg-[#F3EFE6] hover:text-[#1E1E1C]"
                    aria-label="Next page"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </section>
    )
}

export default RecentBookingsTable
