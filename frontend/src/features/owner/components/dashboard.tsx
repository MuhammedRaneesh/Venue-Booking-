import { useMemo, useState } from "react"
import { Store, CalendarCheck, FileBarChart, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  useGetBookingUpdateQuery,
  useGetOwnerDashboardChartQuery,
  useGetOwnerDashboardSummaryQuery,
} from "@/features/owner/ownerApi"
import { Button } from "@/components/ui/button"
import BookingStatusDonut from "./owner-dashboard/BookingStatusDonut"
import RecentBookingsTable from "./owner-dashboard/RecentBookingsTable"
import RevenueAreaChart from "./owner-dashboard/RevenueAreaChart"
import StatCards from "./owner-dashboard/StatCards"
import {
  normalizeDashboard,
  normalizeRevenueChart,
  normalizeStatusCounts,
} from "./owner-dashboard/dashboardData"
import type { OwnerBookingItem, Pagination } from "@/features/owner/types/owner.type"

function OwnerDashboard() {
  const [page, setPage] = useState(1)
  const [chartPeriod, setChartPeriod] = useState<"year" | "month">("year")
  const limit = 8
  const navigate = useNavigate()
  const {
    data: summaryData,
    isLoading: summaryLoading,
    isError: summaryError,
    refetch: refetchSummary,
  } = useGetOwnerDashboardSummaryQuery({})

  const {
    data: chartData,
    isLoading: chartLoading,
    isFetching: chartFetching,
  } = useGetOwnerDashboardChartQuery({ period: chartPeriod })

  const {
    data: bookingData,
    isLoading: bookingsLoading,
  } = useGetBookingUpdateQuery({ page, limit })

  const dashboard = useMemo(() => normalizeDashboard(summaryData), [summaryData])
  const revenueData = useMemo(() => normalizeRevenueChart(chartData?.data, chartPeriod), [chartData, chartPeriod])
  const bookingRows = (bookingData?.booking || dashboard.recentBookings || []) as OwnerBookingItem[]
  const pagination = bookingData?.pagination as Pagination | undefined
  const statusCounts = useMemo(
    () => normalizeStatusCounts(dashboard.statusCounts, bookingRows as any),
    [dashboard.statusCounts, bookingRows]
  )

  if (summaryLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-[8px] border border-[#E5DFD2] text-sm text-[#4A6357]">
        Loading dashboard
      </div>
    )
  }

  if (summaryError || !summaryData?.success) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[8px] border border-[#E5DFD2] text-center">
        <p className="text-sm font-semibold text-[#1E1E1C]">Failed to load dashboard data.</p>
        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-[6px] border-[#E5DFD2] bg-[#FAF7F0] text-[#4A6357] hover:bg-[#F3EFE6] hover:text-[#1E1E1C]"
          onClick={() => refetchSummary()}
        >
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[EB_Garamond,serif] text-3xl font-medium text-[#1E1E1C]">Venue Owner Dashboard</h2>
        <p className="mt-1 text-sm text-[#4A6357]">
          Track your revenue, bookings, and recent venue activity.
        </p>
      </div>

      <StatCards stats={dashboard} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(320px,2fr)]">
        <RevenueAreaChart 
          data={revenueData} 
          loading={chartLoading || chartFetching} 
          period={chartPeriod}
          onPeriodChange={setChartPeriod}
        />
        <BookingStatusDonut counts={statusCounts} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <RecentBookingsTable
                bookings={bookingRows}
                pagination={pagination}
                page={page}
                onPageChange={setPage}
            />
            {bookingsLoading && (
                <p className="mt-2 text-right text-xs text-[#4A6357]">Refreshing recent bookings...</p>
            )}
        </div>
        <div className="space-y-6">
            <div className="rounded-2xl border border-[#E5DFD2] bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-[#1E1E1C]">Quick Actions</h3>
                <div className="space-y-4">
                    <button onClick={() => navigate("/owner/venues/new")} className="group flex w-full items-center gap-4 rounded-xl border border-[#E5DFD2] bg-[#FAF7F0] p-4 text-left transition-all hover:bg-white hover:border-[#C9A24B]">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#E5DFD2] bg-white text-[#22443A] transition-colors group-hover:bg-[#C9A24B] group-hover:text-white group-hover:border-[#C9A24B]">
                            <Store className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-[#1E1E1C]">Add New Venue</p>
                            <p className="text-[11px] text-[#4A6357]">Expand your portfolio</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-[#4A6357] transition-colors group-hover:text-[#C9A24B]" />
                    </button>
                    <button onClick={() => navigate("/owner")} className="group flex w-full items-center gap-4 rounded-xl border border-[#E5DFD2] bg-[#FAF7F0] p-4 text-left transition-all hover:bg-white hover:border-[#C9A24B]">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#E5DFD2] bg-white text-[#22443A] transition-colors group-hover:bg-[#C9A24B] group-hover:text-white group-hover:border-[#C9A24B]">
                            <CalendarCheck className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-[#1E1E1C]">Manage Bookings</p>
                            <p className="text-[11px] text-[#4A6357]">Update status or dates</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-[#4A6357] transition-colors group-hover:text-[#C9A24B]" />
                    </button>
                    <button onClick={() => {}} className="group flex w-full items-center gap-4 rounded-xl border border-[#E5DFD2] bg-[#FAF7F0] p-4 text-left transition-all hover:bg-white hover:border-[#C9A24B]">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#E5DFD2] bg-white text-[#22443A] transition-colors group-hover:bg-[#C9A24B] group-hover:text-white group-hover:border-[#C9A24B]">
                            <FileBarChart className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-[#1E1E1C]">View Reports</p>
                            <p className="text-[11px] text-[#4A6357]">Download tax & sales data</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-[#4A6357] transition-colors group-hover:text-[#C9A24B]" />
                    </button>
                </div>
            </div>
            

        </div>
      </div>
    </div>
  )
}

export default OwnerDashboard
