import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useGetOwnerProfileQuery, useGetOwnerDashboardQuery } from "@/api/ownerApi";
import {
  UserCircle2,
  Building2,
  Phone,
  MapPin,
  Hash,
  Mail,
  CalendarDays,
  Loader2,
  AlertCircle,
  BadgeCheck,
  Pencil,
  Star,
  TrendingUp,
  DollarSign,
  Building,
  ChevronRight,
} from "lucide-react";

function OwnerProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const { data, isLoading, isError, refetch } = useGetOwnerProfileQuery({});
  const { data: dashData } = useGetOwnerDashboardQuery({});

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[500px]">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-[#F5EFE4] flex items-center justify-center">
            <Loader2 className="w-7 h-7 animate-spin text-[#C29F47]" />
          </div>
        </div>
        <p className="text-xs font-semibold text-[#5F5665] mt-4 tracking-wide">
          Loading your profile...
        </p>
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] border border-dashed border-rose-200 rounded-3xl bg-rose-50/30 p-8">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7 text-rose-400" />
        </div>
        <p className="text-sm font-bold text-rose-600 mb-1">Profile unavailable</p>
        <p className="text-xs text-rose-400 font-medium mb-4">Could not load your business profile.</p>
        <button
          onClick={() => refetch()}
          className="px-5 py-2.5 bg-white border border-rose-200 text-xs font-bold text-rose-700 rounded-xl hover:bg-rose-50 transition-all shadow-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  const profile = data.data;
  const memberSince = profile?.user?.createdAt
    ? new Date(profile.user.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const displayName = profile?.user?.userName || user?.userName || "Venue Owner";
  const displayEmail = profile?.user?.email || user?.email || "—";
  const displayAvatar = profile?.user?.profileImage || user?.profileImage;

  const stats = [
    {
      label: "Total Venues",
      value: dashData?.totalVenues ?? "—",
      icon: Building,
      color: "from-indigo-500 to-indigo-600",
      bg: "bg-indigo-50 border-indigo-100",
      iconColor: "text-indigo-500",
    },
    {
      label: "Total Bookings",
      value: dashData?.totalBookings ?? "—",
      icon: CalendarDays,
      color: "from-amber-500 to-orange-500",
      bg: "bg-amber-50 border-amber-100",
      iconColor: "text-amber-500",
    },
    {
      label: "Net Earnings",
      value: dashData?.totalEarnings != null
        ? `₹${Number(dashData.totalEarnings).toLocaleString("en-IN")}`
        : "—",
      icon: DollarSign,
      color: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50 border-emerald-100",
      iconColor: "text-emerald-500",
    },
    {
      label: "Active Venues",
      value: dashData?.activeVenues ?? "—",
      icon: TrendingUp,
      color: "from-[#C29F47] to-[#a8852d]",
      bg: "bg-[#F5EFE4] border-[#EADFCB]",
      iconColor: "text-[#C29F47]",
    },
  ];

  const contactDetails = [
    {
      icon: Mail,
      label: "Email Address",
      value: displayEmail,
      iconBg: "bg-indigo-50 border-indigo-100",
      iconColor: "text-indigo-500",
    },
    {
      icon: Phone,
      label: "Phone Number",
      value: profile?.phone || "—",
      iconBg: "bg-emerald-50 border-emerald-100",
      iconColor: "text-emerald-500",
    },
    {
      icon: CalendarDays,
      label: "Member Since",
      value: memberSince,
      iconBg: "bg-[#F5EFE4] border-[#EADFCB]",
      iconColor: "text-[#C29F47]",
    },
    {
      icon: Hash,
      label: "GST Number",
      value: profile?.gstNumber || "Not provided",
      iconBg: "bg-[#F5EFE4] border-[#EADFCB]",
      iconColor: "text-[#C29F47]",
    },
  ];

  const addressDetails = [
    { label: "Address", value: profile?.address || "—" },
    { label: "City", value: profile?.city || "—" },
    { label: "State", value: profile?.state || "—" },
    { label: "Pincode", value: profile?.pincode || "—" },
  ];


  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-7 animate-in fade-in duration-300">

  
      <div className="relative rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0b2e] via-[#2B1343] to-[#0d1a3a]" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C29F47]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl -translate-x-1/2 pointer-events-none" />

        <div className="relative p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-7">

            <div className="relative shrink-0">
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt={displayName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-white/10 shadow-2xl"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-[#C29F47]/30 to-[#C29F47]/10 border border-[#C29F47]/20 flex items-center justify-center shadow-2xl">
                  {displayName !== "Venue Owner" ? (
                    <span className="text-3xl font-black text-[#C29F47]">{initials}</span>
                  ) : (
                    <UserCircle2 className="w-12 h-12 text-[#C29F47]" />
                  )}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-400 border-2 border-[#1a0b2e] flex items-center justify-center shadow-lg">
                <BadgeCheck className="w-4.5 h-4.5 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/20 uppercase tracking-wider">
                  ✓ Verified Owner
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#C29F47]/20 text-[#C29F47] border border-[#C29F47]/20 uppercase tracking-wider">
                  <Star className="w-2.5 h-2.5 inline mr-0.5" />
                  Partner
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                {displayName}
              </h1>

              <div className="flex items-center gap-2 mt-2">
                <Building2 className="w-4 h-4 text-[#C29F47] shrink-0" />
                <p className="text-sm font-bold text-[#C29F47]">
                  {profile?.businessName || "—"}
                </p>
              </div>

              <p className="text-xs text-white/40 font-medium mt-1.5">
                {displayEmail}
              </p>

              <div className="flex items-center gap-1.5 mt-3">
                <MapPin className="w-3.5 h-3.5 text-white/40 shrink-0" />
                <p className="text-xs text-white/40 font-medium">
                  {[profile?.city, profile?.state].filter(Boolean).join(", ") || "Location not set"}
                </p>
              </div>
            </div>

            <button
              title="Edit coming soon"
              className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 hover:border-white/20 transition-all duration-200 cursor-not-allowed backdrop-blur-sm"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10">
            {stats.map(({ label, value, icon: Icon, iconColor }) => (
              <div key={label} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${iconColor.replace("text-", "bg-").replace("500", "500/20").replace("[#C29F47]", "[#C29F47]/20")} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <div>
                  <p className="text-lg font-black text-white leading-tight">{value}</p>
                  <p className="text-[10px] text-white/50 font-medium leading-tight">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-5">

          <div className="bg-white border border-[#F3EFE9] rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-[#F3EFE9]/60 bg-[#FCFBF9]/60 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#2B1343]">Contact Information</h3>
                <p className="text-[11px] text-[#5F5665] font-medium mt-0.5">Your registered contact and account details.</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-[#F5EFE4] border border-[#EADFCB] flex items-center justify-center">
                <Phone className="w-4 h-4 text-[#C29F47]" />
              </div>
            </div>
            <div className="divide-y divide-[#F3EFE9]/50">
              {contactDetails.map(({ icon: Icon, label, value, iconBg, iconColor }) => (
                <div key={label} className="flex items-center gap-4 px-6 py-4 hover:bg-[#FCFBF9]/60 transition-colors group">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${iconBg}`}>
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5665]/60">{label}</p>
                    <p className="text-sm font-bold text-[#2B1343] mt-0.5 break-all">{value}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#5F5665]/30 shrink-0 group-hover:text-[#C29F47] transition-colors" />
                </div>
              ))}
            </div>
          </div>

          <div className="relative bg-gradient-to-r from-[#2B1343]/5 to-[#C29F47]/5 border border-[#EADFCB]/60 rounded-3xl p-5 flex items-center gap-4 overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-[#C29F47]/5 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="w-10 h-10 rounded-2xl bg-[#C29F47]/15 border border-[#C29F47]/20 flex items-center justify-center shrink-0">
              <Pencil className="w-4.5 h-4.5 text-[#C29F47]" />
            </div>
            <div className="flex-1 relative">
              <p className="text-xs font-bold text-[#2B1343]">Profile editing coming soon</p>
              <p className="text-[11px] text-[#5F5665] font-medium mt-0.5 leading-relaxed">
                You'll be able to update your business info, upload a logo, and manage contact details here shortly.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white border border-[#F3EFE9] rounded-3xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-[#F3EFE9]/60 bg-[#FCFBF9]/60 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#2B1343]">Business Address</h3>
                <p className="text-[11px] text-[#5F5665] font-medium mt-0.5">Registered location details.</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-rose-500" />
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="w-full h-28 rounded-2xl bg-gradient-to-br from-[#F5EFE4] to-[#EDE4D4] border border-[#EADFCB] flex flex-col items-center justify-center gap-1.5">
                <MapPin className="w-6 h-6 text-[#C29F47]" />
                <p className="text-[10px] font-bold text-[#5F5665] uppercase tracking-wider">
                  {profile?.city || "City"}, {profile?.state || "State"}
                </p>
              </div>

              {addressDetails.map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5665]/60 shrink-0 mt-0.5">{label}</p>
                  <p className="text-xs font-bold text-[#2B1343] text-right break-words max-w-[60%]">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#2B1343] to-[#1a0b2e] rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#C29F47]/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-[#C29F47]/20 flex items-center justify-center">
                  <BadgeCheck className="w-4 h-4 text-[#C29F47]" />
                </div>
                <p className="text-xs font-bold text-[#C29F47] uppercase tracking-wider">Verified Partner</p>
              </div>
              <p className="text-[11px] text-white/60 font-medium leading-relaxed">
                Your account has been approved and verified by the BookMyVenue team. You can list venues and receive bookings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerProfilePage;
