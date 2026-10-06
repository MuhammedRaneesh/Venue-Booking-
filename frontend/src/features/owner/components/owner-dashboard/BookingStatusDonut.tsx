import { Label, Pie, PieChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart"
import {BookingStatusKey,formatNumber,statusColors,statusLabels} from "./dashboardData"

interface BookingStatusDonutProps {
    counts: Record<BookingStatusKey, number>
}

const chartConfig = {
    confirmed: { label: "Confirmed", color: statusColors.confirmed },
    pending: { label: "Pending", color: statusColors.pending },
    cancelled: { label: "Cancelled", color: statusColors.cancelled },
    completed: { label: "Completed", color: statusColors.completed },
} satisfies ChartConfig

function StatusTooltip({ active, payload }: any) {
    if (!active || !payload?.length) {
        return null
    }

    const item = payload[0]
    return (
        <div className="rounded-[6px] border border-[#0F172A] bg-[#0F172A] px-3 py-2 text-xs text-white shadow-none">
            <p className="font-medium">{item.name}</p>
            <p className="mt-1 font-semibold tabular-nums">{formatNumber(Number(item.value || 0))}</p>
        </div>
    )
}

function BookingStatusDonut({ counts }: BookingStatusDonutProps) {
    const chartData = (Object.keys(statusLabels) as BookingStatusKey[]).map((status) => ({
        status,
        name: statusLabels[status],
        value: counts[status],
        fill: statusColors[status],
    }))
    const total = chartData.reduce((sum, item) => sum + item.value, 0)

    return (
        <Card className="rounded-2xl border border-[#E2E8F0] bg-white py-0 shadow-sm">
            <CardHeader className="border-b border-[#E2E8F0] px-5 py-4">
                <CardTitle className="text-lg font-bold text-[#0F172A]">Booking Status</CardTitle>
                <p className="text-sm text-[#64748B]">Current booking distribution</p>
            </CardHeader>
            <CardContent className="p-5">
                <ChartContainer config={chartConfig} className="mx-auto h-[260px] w-full max-w-[320px] aspect-square">
                    <PieChart>
                        <ChartTooltip content={<StatusTooltip />} />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={72}
                            outerRadius={105}
                            stroke="none"
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                                        return null
                                    }

                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                fill="#0F172A"
                                                fontFamily="Inter, system-ui, sans-serif"
                                                fontSize="24"
                                                fontWeight="600"
                                                className="tabular-nums"
                                            >
                                                {formatNumber(total)}
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 22}
                                                fill="#64748B"
                                                fontFamily="Inter, system-ui, sans-serif"
                                                fontSize="12"
                                            >
                                                bookings
                                            </tspan>
                                        </text>
                                    )
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>

                <div className="mt-4 grid grid-cols-2 gap-3">
                    {chartData.map((item) => (
                        <div key={item.status} className="flex items-center justify-between gap-2 text-sm">
                            <span className="inline-flex items-center gap-2 text-[#64748B]">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                                {item.name}
                            </span>
                            <span className="font-semibold text-[#0F172A] tabular-nums">{formatNumber(item.value)}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default BookingStatusDonut
