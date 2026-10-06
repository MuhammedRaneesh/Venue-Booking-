import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart"
import { Download } from "lucide-react"
import { DASHBOARD_COLORS, formatCurrency } from "./dashboardData"

interface RevenueAreaChartProps {
    data: Array<{
        label: string
        date: string
        revenue: number
    }>
    loading?: boolean
    period?: "year" | "month"
    onPeriodChange?: (period: "year" | "month") => void
}

const chartConfig = {
    revenue: {
        label: "Revenue",
        color: DASHBOARD_COLORS.primary,
    },
} satisfies ChartConfig

function RevenueTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) {
        return null
    }

    return (
        <div className="rounded-[6px] border border-[#22443A] bg-[#22443A] px-3 py-2 text-xs text-white shadow-none">
            <p className="font-medium">{label}</p>
            <p className="mt-1 font-semibold tabular-nums">{formatCurrency(Number(payload[0]?.value || 0))}</p>
        </div>
    )
}

function RevenueAreaChart({ data, loading, period = "year", onPeriodChange }: RevenueAreaChartProps) {
    return (
        <Card className="rounded-2xl border border-[#E5DFD2] bg-white py-0 shadow-sm flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between border-b border-[#E5DFD2] px-6 py-5 space-y-0">
                <div>
                    <CardTitle className="text-xl font-bold text-[#1E1E1C]">Revenue Analytics</CardTitle>
                    <p className="mt-1 text-sm text-[#4A6357]">Monthly revenue trend across all properties</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex bg-[#FAF7F0] border border-[#E5DFD2] rounded-lg p-1">
                        <button 
                            onClick={() => onPeriodChange?.("year")}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${period === 'year' ? 'bg-white shadow-sm text-[#22443A]' : 'text-[#4A6357] hover:text-[#1E1E1C]'}`}
                        >
                            This Year
                        </button>
                        <button 
                            onClick={() => onPeriodChange?.("month")}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${period === 'month' ? 'bg-white shadow-sm text-[#22443A]' : 'text-[#4A6357] hover:text-[#1E1E1C]'}`}
                        >
                            This Month
                        </button>
                    </div>
                    <button className="flex items-center gap-2 rounded-lg bg-[#22443A] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                        <Download className="h-4 w-4" /> Export
                    </button>
                </div>
            </CardHeader>
            <CardContent className="p-5">
                {loading ? (
                    <div className="flex h-[300px] items-center justify-center rounded-[8px] border border-[#E5DFD2] text-sm text-[#4A6357]">
                        Loading revenue data
                    </div>
                ) : data.length === 0 ? (
                    <div className="flex h-[300px] items-center justify-center rounded-[8px] border border-[#E5DFD2] text-sm text-[#4A6357]">
                        No revenue data yet
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="h-[300px] w-full aspect-auto">
                        <AreaChart data={data} margin={{ left: 8, right: 12, top: 12, bottom: 0 }}>
                            <defs>
                                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22443A" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#22443A" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} stroke="#E5DFD2" strokeDasharray="4 4" />
                            <XAxis
                                dataKey="label"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                tick={{ fill: "#4A6357", fontSize: 12, fontFamily: "Inter, system-ui, sans-serif" }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                width={68}
                                tickFormatter={(value) => formatCurrency(Number(value))}
                                tick={{ fill: "#4A6357", fontSize: 12, fontFamily: "Inter, system-ui, sans-serif" }}
                            />
                            <ChartTooltip cursor={{ stroke: "#E5DFD2", strokeDasharray: "4 4" }} content={<RevenueTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#22443A"
                                strokeWidth={2}
                                fill="url(#revenueFill)"
                                dot={false}
                                activeDot={{ r: 6, fill: "#C9A24B", stroke: "#C9A24B" }}
                            />
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}

export default RevenueAreaChart
