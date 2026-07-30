import { useGetOwnerDashboardQuery } from "@/api/ownerApi";
import {
  Building2,
  CalendarCheck,
  Clock,
  ArrowUpRight,
  TrendingUp,
  User,
  MapPin,
  Loader2,
  Wallet,
  Activity
} from "lucide-react";

const GOLD = "#D4AF37";

function OwnerDashboard() {
  const { data, isLoading, isError, refetch } = useGetOwnerDashboardQuery({});

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: GOLD }} />
        <p className="text-sm font-medium text-gray-500 mt-4 tracking-wide">
          Loading your metrics...
        </p>
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] border border-dashed border-red-200 rounded-2xl bg-red-50/50 p-6">
        <p className="text-sm font-bold text-red-600">Failed to sync dashboard updates.</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-5 py-2.5 bg-white border border-red-200 text-sm font-semibold text-red-600 rounded-xl hover:bg-red-50 transition-all shadow-sm"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const metrics = [
    {
      title: "Net Earnings",
      value: `₹${data.totalEarnings?.toLocaleString("en-IN", { minimumFractionDigits: 2 }) || "0.00"}`,
      description: "Payout share after 8% fee",
      icon: Wallet,
      color: "#10B981", // emerald
      bg: "rgba(16, 185, 129, 0.1)"
    },
    {
      title: "Total Bookings",
      value: data.totalBookings || 0,
      description: `${data.pendingBookings || 0} awaiting approval`,
      icon: CalendarCheck,
      color: GOLD,
      bg: "rgba(212, 175, 55, 0.1)"
    },
    {
      title: "Total Venues",
      value: data.totalVenues || 0,
      description: `${data.activeVenues || 0} active operations`,
      icon: Building2,
      color: "#6366F1", // indigo
      bg: "rgba(99, 102, 241, 0.1)"
    },
  ];

  const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
    pending:   { bg: "rgba(251,191,36,0.12)", text: "#B45309", dot: "#F59E0B" },
    confirmed: { bg: "rgba(34,197,94,0.12)",  text: "#15803D", dot: "#22C55E" },
    approved:  { bg: "rgba(34,197,94,0.12)",  text: "#15803D", dot: "#22C55E" },
    completed: { bg: "rgba(34,197,94,0.12)",  text: "#15803D", dot: "#22C55E" },
    rejected:  { bg: "rgba(239,68,68,0.12)",  text: "#B91C1C", dot: "#EF4444" },
    cancelled: { bg: "rgba(107,114,128,0.12)",text: "#374151", dot: "#9CA3AF" },
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Overview</h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor your earnings, recent bookings, and venue health.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden group hover:border-gray-200 transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: metric.bg, color: metric.color }}
              >
                <metric.icon size={20} />
              </div>
            </div>
            <div>
              <h3 className="text-[28px] font-bold text-gray-900 tracking-tight leading-none mb-2">
                {metric.value}
              </h3>
              <div className="flex items-center justify-between">
                 <span className="text-sm font-semibold text-gray-600">
                   {metric.title}
                 </span>
                 <span className="text-[10px] font-bold tracking-wide uppercase text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md">
                   {metric.description}
                 </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(212,175,55,0.1)" }}>
                <Activity size={16} style={{ color: GOLD }} />
              </div>
              <h3 className="text-[15px] font-bold text-gray-800">Recent Booking Logs</h3>
            </div>
            <button className="text-xs font-bold hover:underline cursor-pointer flex items-center gap-1 transition-colors" style={{ color: GOLD }}>
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {(!data.recentBookings || data.recentBookings.length === 0) ? (
              <div className="p-10 flex flex-col items-center justify-center text-center">
                <CalendarCheck size={32} className="text-gray-300 mb-3" />
                <p className="text-sm font-semibold text-gray-600">No recent bookings</p>
                <p className="text-xs text-gray-400 mt-1">Your latest venue bookings will appear here.</p>
              </div>
            ) : (
              data.recentBookings.map((booking: any) => {
                const status = statusConfig[booking.bookingStatus?.toLowerCase()] || statusConfig.pending;
                return (
                  <div key={booking._id} className="p-5 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors duration-150">
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 text-gray-500">
                        <User size={18} />
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <p className="text-sm font-bold text-gray-900 truncate leading-none">
                          {booking.user?.userName || "Anonymous Guest"}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-gray-500 font-medium">
                          <span className="truncate max-w-[120px] sm:max-w-none">{booking.user?.email}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                          <span className="flex items-center gap-1 text-gray-700 font-semibold truncate">
                            <MapPin size={10} style={{ color: GOLD }} className="shrink-0" /> 
                            {booking.venue?.venueName || "Deleted Venue"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2.5 shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-black text-gray-900 leading-none">
                          ₹{booking.amountPaid?.toLocaleString("en-IN") || 0}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-1">
                          <Clock size={10} />
                          {new Date(booking.bookingDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                        </span>
                        
                        <span
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider whitespace-nowrap"
                            style={{ background: status.bg, color: status.text }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: status.dot }} />
                            {booking.bookingStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-1">
             <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 border border-gray-100 text-gray-600">
                <Building2 size={15} />
             </div>
             <h3 className="text-[15px] font-bold text-gray-800">Property Health</h3>
          </div>
          <p className="text-xs text-gray-500 font-medium mb-6 mt-1 ml-10">Current operational distribution.</p>

          <div className="space-y-5 flex-1 flex flex-col justify-center">
            <div className="space-y-2">
              <div className="flex justify-between items-end text-sm">
                <span className="font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active
                </span>
                <span className="font-bold text-gray-900">{data.activeVenues || 0}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-700 ease-out"
                  style={{ width: `${data.totalVenues ? ((data.activeVenues || 0) / data.totalVenues) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-end text-sm">
                <span className="font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Suspended
                </span>
                <span className="font-bold text-gray-900">{data.inactiveVenues || 0}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all duration-700 ease-out"
                  style={{ width: `${data.totalVenues ? ((data.inactiveVenues || 0) / data.totalVenues) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between bg-gray-50 p-3.5 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center">
                  <TrendingUp size={12} className="text-emerald-600" />
                </div>
                <span className="text-xs font-semibold text-gray-600">Efficiency Score</span>
              </div>
              <span className="text-sm font-black text-emerald-600">
                {data.totalVenues ? Math.round(((data.activeVenues || 0) / data.totalVenues) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OwnerDashboard;
