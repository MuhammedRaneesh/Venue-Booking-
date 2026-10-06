import { ArrowDownRight, ArrowUpRight, CalendarCheck, Clock, IndianRupee, Store } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { DASHBOARD_COLORS, formatCurrency, formatNumber } from "./dashboardData"

interface StatCardsProps {
    stats: {
        totalRevenue: number
        totalBookings: number
        pendingBookings: number
        activeVenues: number
        deltas: {
            totalRevenue: number
            totalBookings: number
            pendingBookings: number
            activeVenues: number
        }
    }
}

function DeltaPill({ value }: { value: number }) {
    const positive = value >= 0
    const color = positive ? DASHBOARD_COLORS.confirmed : DASHBOARD_COLORS.cancelled
    const Icon = positive ? ArrowUpRight : ArrowDownRight

    return (
        <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums"
            style={{ color, backgroundColor: `${color}15` }}
        >
            <Icon className="h-3 w-3" />
            {Math.abs(value)}%
        </span>
    )
}

function StatCards({ stats }: StatCardsProps) {
    const items = [
        {
            label: "Total Revenue",
            value: formatCurrency(stats.totalRevenue),
            delta: stats.deltas.totalRevenue,
            icon: IndianRupee,
            accent: true,
        },
        {
            label: "Total Bookings",
            value: formatNumber(stats.totalBookings),
            delta: stats.deltas.totalBookings,
            icon: CalendarCheck,
            accent: false,
        },
        {
            label: "Pending Bookings",
            value: formatNumber(stats.pendingBookings),
            delta: stats.deltas.pendingBookings,
            icon: Clock,
            accent: false,
        },
        {
            label: "Active Venues",
            value: formatNumber(stats.activeVenues),
            delta: stats.deltas.activeVenues,
            icon: Store,
            accent: false,
        },
    ]

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => (
                <Card
                    key={item.label}
                    className={`rounded-2xl border border-[#E5DFD2] bg-white py-0 shadow-sm transition-all hover:shadow-md ${
                        item.accent ? "border-l-4 border-l-[#C9A24B]" : ""
                    }`}
                >
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-[#4A6357]">
                                    {item.label}
                                </p>
                                <p className="mt-2 truncate text-3xl font-bold tracking-tight text-[#1E1E1C] tabular-nums">
                                    {item.value}
                                </p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3EFE6]">
                                <item.icon className="h-5 w-5 shrink-0 text-[#22443A]" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <DeltaPill value={item.delta} />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default StatCards
