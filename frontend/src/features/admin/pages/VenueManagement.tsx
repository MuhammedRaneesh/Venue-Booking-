// pages/admin/VenueManagement.tsx
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import {
    useGetAdminVenuesQuery,
    useGetAdminVenueDetailQuery,
    useUpdateAdminVenueStatusMutation,
    useToggleAdminVenueActiveMutation
} from "@/features/admin/adminApi"
import {
    Search, X, ChevronLeft, ChevronRight,
    CheckCircle, XCircle, Eye, MapPin, Users,
    Clock, Building2, Tag, IndianRupee, Home
} from "lucide-react"
import type { VenueListItem, VenueDetail } from "@/features/admin/types/adminType"

const GOLD = "#D4AF37"

const KERALA_DISTRICTS = [
    "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha",
    "Kottayam", "Idukki", "Ernakulam", "Thrissur", "Palakkad",
    "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
]

const CATEGORIES = [
    "Wedding Hall", "Convention Center", "Conference Hall", "Banquet Hall",
    "Party Hall", "Outdoor Venue", "Resort", "Auditorium"
]

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    pending:   { bg: "rgba(251,191,36,0.12)", text: "#B45309", dot: "#F59E0B", label: "Pending"   },
    approved:  { bg: "rgba(34,197,94,0.12)",  text: "#15803D", dot: "#22C55E", label: "Approved"  },
    rejected:  { bg: "rgba(239,68,68,0.12)",  text: "#B91C1C", dot: "#EF4444", label: "Rejected"  },
    suspended: { bg: "rgba(107,114,128,0.12)",text: "#374151", dot: "#9CA3AF", label: "Suspended" },
}

/* ── Status Badge ─────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
    const cfg = statusConfig[status] ?? { bg: "#F3F4F6", text: "#6B7280", dot: "#9CA3AF", label: status }
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
            style={{ background: cfg.bg, color: cfg.text }}
        >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
            {cfg.label}
        </span>
    )
}

/* ── Venue Detail Modal ───────────────────────────────────────── */
function VenueDetailModal({ venueId, onClose }: { venueId: string; onClose: () => void }) {
    const { data, isLoading } = useGetAdminVenueDetailQuery(venueId)
    const [updateStatus, { isLoading: isUpdating }] = useUpdateAdminVenueStatusMutation()
    const [toggleActive, { isLoading: isToggling }] = useToggleAdminVenueActiveMutation()
    const [showRejectInput, setShowRejectInput] = useState(false)
    const [reason, setReason] = useState("")
    const [error, setError] = useState("")
    const [activePhoto, setActivePhoto] = useState(0)

    const venue: VenueDetail | undefined = data?.venue

    const handleApprove = async () => {
        try {
            await updateStatus({ id: venueId, status: "approved" }).unwrap()
            onClose()
        } catch (err: any) {
            setError(err?.data?.message ?? "Something went wrong")
        }
    }

    const handleReject = async () => {
        if (!reason.trim()) { setError("Rejection reason is required"); return }
        try {
            await updateStatus({ id: venueId, status: "rejected", reason }).unwrap()
            onClose()
        } catch (err: any) {
            setError(err?.data?.message ?? "Something went wrong")
        }
    }

    const handleToggleActive = async () => {
        try {
            await toggleActive(venueId).unwrap()
        } catch (err: any) {
            setError(err?.data?.message ?? "Something went wrong")
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
            onClick={e => { if (e.target === e.currentTarget) onClose() }}
        >
            <style>{`
                @keyframes modalSlideIn {
                    from { opacity: 0; transform: translateY(18px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)   scale(1);    }
                }
                .venue-modal { animation: modalSlideIn 0.22s ease-out both; }
            `}</style>

            <div className="venue-modal bg-white rounded-2xl w-[700px] max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div
                    className="flex items-center justify-between px-6 py-4 sticky top-0 bg-white z-10"
                    style={{ borderBottom: "1px solid #F3F4F6" }}
                >
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(212,175,55,0.1)" }}>
                            <Building2 size={14} style={{ color: GOLD }} />
                        </div>
                        <h2 className="font-semibold text-gray-800 text-[15px]">Venue Details</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                    >
                        <X size={16} />
                    </button>
                </div>

                {isLoading ? (
                    <div className="p-6 space-y-4 animate-pulse">
                        <div className="h-52 bg-gray-100 rounded-2xl" />
                        <div className="h-4 bg-gray-100 rounded-lg w-1/2" />
                        <div className="h-3 bg-gray-100 rounded-lg w-1/3" />
                        <div className="grid grid-cols-3 gap-3">
                            {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl" />)}
                        </div>
                    </div>
                ) : venue ? (
                    <div className="p-6 space-y-5">
                        {/* Photos */}
                        {venue.photos?.length > 0 && (
                            <div className="space-y-2.5">
                                <img
                                    src={venue.photos[activePhoto]}
                                    className="w-full h-56 object-cover rounded-2xl"
                                    alt="venue"
                                />
                                {venue.photos.length > 1 && (
                                    <div className="flex gap-2 overflow-x-auto pb-1">
                                        {venue.photos.map((photo, i) => (
                                            <img
                                                key={i}
                                                src={photo}
                                                onClick={() => setActivePhoto(i)}
                                                className="w-16 h-16 object-cover rounded-xl cursor-pointer flex-shrink-0 transition-all"
                                                style={{
                                                    outline: activePhoto === i ? `2px solid ${GOLD}` : "none",
                                                    outlineOffset: "2px",
                                                    opacity: activePhoto === i ? 1 : 0.55,
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Name + badges */}
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg leading-tight">{venue.venueName}</h3>
                                <div className="flex items-center gap-1.5 mt-1.5 text-gray-400 text-sm">
                                    <MapPin size={12} className="flex-shrink-0" />
                                    <span>{venue.location?.address?.place}, {venue.location?.address?.city}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                                <StatusBadge status={venue.status} />
                                <span
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                                    style={
                                        venue.isActive
                                            ? { background: "rgba(34,197,94,0.1)", color: "#15803D" }
                                            : { background: "rgba(239,68,68,0.1)", color: "#B91C1C" }
                                    }
                                >
                                    <span
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ background: venue.isActive ? "#22C55E" : "#EF4444" }}
                                    />
                                    {venue.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>

                        {/* Quick stats */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="rounded-xl p-3.5 text-center" style={{ background: "#F9FAFB", border: "1px solid #F3F4F6" }}>
                                <div className="flex items-center justify-center gap-1 mb-1.5">
                                    <Tag size={11} className="text-gray-400" />
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Category</p>
                                </div>
                                <p className="text-sm font-bold text-gray-700">{venue.category}</p>
                            </div>
                            <div className="rounded-xl p-3.5 text-center" style={{ background: "#F9FAFB", border: "1px solid #F3F4F6" }}>
                                <div className="flex items-center justify-center gap-1 mb-1.5">
                                    <Users size={11} className="text-gray-400" />
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Capacity</p>
                                </div>
                                <p className="text-sm font-bold text-gray-700">{venue.capacity} guests</p>
                            </div>
                            <div className="rounded-xl p-3.5 text-center" style={{ background: "#F9FAFB", border: "1px solid #F3F4F6" }}>
                                <div className="flex items-center justify-center gap-1 mb-1.5">
                                    <Clock size={11} className="text-gray-400" />
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Hours</p>
                                </div>
                                <p className="text-sm font-bold text-gray-700">{venue.availability?.openTime} – {venue.availability?.closeTime}</p>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="rounded-xl p-4" style={{ background: "#F9FAFB", border: "1px solid #F3F4F6" }}>
                            <div className="flex items-center gap-1.5 mb-3">
                                <IndianRupee size={11} className="text-gray-400" />
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pricing</p>
                            </div>
                            <div className="flex gap-8">
                                <div>
                                    <p className="text-xs text-gray-400 mb-0.5">Per hour</p>
                                    <p className="font-bold text-gray-800 text-base">₹{venue.pricing?.pricePerHour?.toLocaleString("en-IN")}</p>
                                </div>
                                <div className="w-px bg-gray-200" />
                                <div>
                                    <p className="text-xs text-gray-400 mb-0.5">Per day</p>
                                    <p className="font-bold text-gray-800 text-base">₹{venue.pricing?.pricePerDay?.toLocaleString("en-IN")}</p>
                                </div>
                            </div>
                        </div>

                        {/* Owner */}
                        <div className="rounded-xl p-4" style={{ background: "#F9FAFB", border: "1px solid #F3F4F6" }}>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Owner</p>
                            <div className="flex items-center gap-3">
                                {venue.owner?.profileImage ? (
                                    <img src={venue.owner.profileImage} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                                ) : (
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                                        style={{ background: `linear-gradient(135deg, ${GOLD}, #B8962E)` }}
                                    >
                                        {venue.owner?.userName?.[0]?.toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">{venue.owner?.userName}</p>
                                    <p className="text-gray-400 text-xs mt-0.5">{venue.owner?.email}</p>
                                    {venue.owner?.phoneNumber && (
                                        <p className="text-gray-400 text-xs mt-0.5">{venue.owner.phoneNumber}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Description</p>
                            <p className="text-sm text-gray-600 leading-relaxed">{venue.description}</p>
                        </div>

                        {/* Amenities */}
                        {venue.amenities?.length > 0 && (
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Amenities</p>
                                <div className="flex flex-wrap gap-2">
                                    {venue.amenities.map((a) => (
                                        <span
                                            key={a}
                                            className="px-2.5 py-1 text-xs font-medium rounded-lg"
                                            style={{ background: "rgba(212,175,55,0.08)", color: "#92722A" }}
                                        >
                                            {a}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Rejection reason */}
                        {venue.rejectionReason && (
                            <div className="rounded-xl p-4" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
                                <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1.5">Rejection Reason</p>
                                <p className="text-sm text-red-600">{venue.rejectionReason}</p>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: "rgba(239,68,68,0.08)" }}>
                                <XCircle size={14} className="text-red-400 flex-shrink-0" />
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Reject input */}
                        {showRejectInput && (
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                                    Rejection reason <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    value={reason}
                                    onChange={e => { setReason(e.target.value); setError("") }}
                                    placeholder="Explain why this venue is being rejected..."
                                    rows={3}
                                    className="w-full text-sm px-3.5 py-2.5 rounded-xl resize-none focus:outline-none transition-all"
                                    style={{ border: "1px solid #E5E7EB" }}
                                    onFocus={e => { e.currentTarget.style.borderColor = "#EF4444"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(239,68,68,0.1)" }}
                                    onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.boxShadow = "none" }}
                                />
                            </div>
                        )}
                        <div className="space-y-3 pt-1">
                            {venue.status === "pending" && (
                                <div className="flex gap-3">
                                    {!showRejectInput ? (
                                        <>
                                            <button
                                                onClick={handleApprove}
                                                disabled={isUpdating}
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 transition-colors"
                                            >
                                                <CheckCircle size={15} />
                                                {isUpdating ? "Approving…" : "Approve"}
                                            </button>
                                            <button
                                                onClick={() => setShowRejectInput(true)}
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                                                style={{ border: "1px solid rgba(239,68,68,0.3)" }}
                                            >
                                                <XCircle size={15} />
                                                Reject
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => { setShowRejectInput(false); setReason(""); setError("") }}
                                                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                                                style={{ border: "1px solid #E5E7EB" }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleReject}
                                                disabled={isUpdating}
                                                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
                                            >
                                                {isUpdating ? "Rejecting…" : "Confirm Reject"}
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Toggle active — approved only */}
                            {venue.status === "approved" && (
                                <button
                                    onClick={handleToggleActive}
                                    disabled={isToggling}
                                    className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60"
                                    style={
                                        venue.isActive
                                            ? { background: "rgba(239,68,68,0.08)", color: "#B91C1C", border: "1px solid rgba(239,68,68,0.2)" }
                                            : { background: "rgba(34,197,94,0.08)", color: "#15803D", border: "1px solid rgba(34,197,94,0.2)" }
                                    }
                                >
                                    {isToggling ? "Updating…" : venue.isActive ? "Deactivate Venue" : "Activate Venue"}
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                            <Building2 size={20} className="text-gray-300" />
                        </div>
                        <p className="text-gray-400 text-sm">Venue not found</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function VenueManagement() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "")
    const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null)

    const page     = Number(searchParams.get("page") ?? 1)
    const status   = searchParams.get("status")   ?? ""
    const district = searchParams.get("district") ?? ""
    const category = searchParams.get("category") ?? ""
    const search   = searchParams.get("search")   ?? ""

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams)
            if (searchInput) params.set("search", searchInput)
            else params.delete("search")
            params.set("page", "1")
            setSearchParams(params)
        }, 450)
        return () => clearTimeout(timer)
    }, [searchInput])

    const { data, isLoading, isError, refetch } = useGetAdminVenuesQuery({
        page,
        status:   status   || undefined,
        district: district || undefined,
        category: category || undefined,
        search:   search   || undefined,
    })

    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value) params.set(key, value)
        else params.delete(key)
        if (key !== "page") params.set("page", "1")
        setSearchParams(params)
    }

    const hasFilters = !!(status || district || category || search)

    const venues: VenueListItem[] = data?.venue ?? []
    const pagination = data?.pagination
    const totalCount = data?.totalCount ?? 0

    const inputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.currentTarget.style.borderColor = GOLD
        e.currentTarget.style.boxShadow   = `0 0 0 3px rgba(212,175,55,0.12)`
        e.currentTarget.style.background  = "#FFFFFF"
    }
    const inputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.currentTarget.style.borderColor = "#EEEEEE"
        e.currentTarget.style.boxShadow   = "none"
        e.currentTarget.style.background  = "#F9FAFB"
    }

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-gray-900 font-bold text-xl tracking-tight">Venue Management</h1>
                    <p className="text-gray-400 text-sm mt-0.5">
                        {isLoading ? "Loading…" : `${totalCount} total venue${totalCount !== 1 ? "s" : ""}`}
                    </p>
                </div>

                {/* Quick status pills */}
                <div className="hidden md:flex items-center gap-2">
                    {(["pending", "approved", "rejected", "suspended"] as const).map(s => {
                        const cfg    = statusConfig[s]
                        const active = status === s
                        return (
                            <button
                                key={s}
                                onClick={() => updateParam("status", active ? "" : s)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
                                style={
                                    active
                                        ? { background: cfg.bg, color: cfg.text, borderColor: cfg.dot + "44" }
                                        : { background: "#F9FAFB", color: "#6B7280", borderColor: "#E5E7EB" }
                                }
                            >
                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: active ? cfg.dot : "#D1D5DB" }} />
                                {cfg.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Filters Bar */}
            <div
                className="bg-white rounded-2xl p-3.5 flex items-center gap-3 flex-wrap"
                style={{ border: "1px solid #F3F4F6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            >
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search venue name or location…"
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl bg-gray-50 text-gray-700 focus:outline-none transition-all"
                        style={{ border: "1px solid #EEEEEE" }}
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                    />
                    {searchInput && (
                        <button
                            onClick={() => setSearchInput("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X size={13} />
                        </button>
                    )}
                </div>

                {/* Status */}
                <div className="relative">
                    <select
                        value={status}
                        onChange={e => updateParam("status", e.target.value)}
                        className="text-sm pl-3 pr-8 py-2.5 rounded-xl bg-gray-50 text-gray-700 appearance-none cursor-pointer focus:outline-none transition-all"
                        style={{ border: "1px solid #EEEEEE" }}
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                    >
                        <option value="">All status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="suspended">Suspended</option>
                    </select>
                    <ChevronLeft size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 -rotate-90 text-gray-400 pointer-events-none" />
                </div>

                {/* District */}
                <div className="relative">
                    <select
                        value={district}
                        onChange={e => updateParam("district", e.target.value)}
                        className="text-sm pl-3 pr-8 py-2.5 rounded-xl bg-gray-50 text-gray-700 appearance-none cursor-pointer focus:outline-none transition-all"
                        style={{ border: "1px solid #EEEEEE" }}
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                    >
                        <option value="">All districts</option>
                        {KERALA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronLeft size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 -rotate-90 text-gray-400 pointer-events-none" />
                </div>

                {/* Category */}
                <div className="relative">
                    <select
                        value={category}
                        onChange={e => updateParam("category", e.target.value)}
                        className="text-sm pl-3 pr-8 py-2.5 rounded-xl bg-gray-50 text-gray-700 appearance-none cursor-pointer focus:outline-none transition-all"
                        style={{ border: "1px solid #EEEEEE" }}
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                    >
                        <option value="">All categories</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronLeft size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 -rotate-90 text-gray-400 pointer-events-none" />
                </div>

                {/* Clear */}
                {hasFilters && (
                    <button
                        onClick={() => { setSearchInput(""); setSearchParams({}) }}
                        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors px-2 py-1"
                    >
                        <X size={13} /> Clear
                    </button>
                )}
            </div>

            {/* Table Card */}
            <div
                className="bg-white rounded-2xl overflow-hidden"
                style={{ border: "1px solid #F3F4F6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            >
                {isLoading ? (
                    <div className="divide-y divide-gray-50">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                                <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3.5 bg-gray-100 rounded-lg w-1/3" />
                                    <div className="h-3 bg-gray-100 rounded-lg w-1/4" />
                                </div>
                                <div className="h-5 w-20 bg-gray-100 rounded-full" />
                                <div className="h-8 w-16 bg-gray-100 rounded-xl" />
                            </div>
                        ))}
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                            <XCircle size={22} className="text-red-400" />
                        </div>
                        <div className="text-center">
                            <p className="text-gray-700 font-medium text-sm">Failed to load venues</p>
                            <p className="text-gray-400 text-xs mt-0.5">Something went wrong on our end</p>
                        </div>
                        <button
                            onClick={refetch}
                            className="px-5 py-2 text-sm rounded-xl font-semibold text-white"
                            style={{ background: GOLD }}
                        >
                            Try again
                        </button>
                    </div>
                ) : venues.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                            <Home size={22} className="text-gray-300" />
                        </div>
                        <div className="text-center">
                            <p className="text-gray-700 font-medium text-sm">No venues found</p>
                            <p className="text-gray-400 text-xs mt-0.5">
                                {hasFilters ? "Try adjusting your filters" : "No venues registered yet"}
                            </p>
                        </div>
                        {hasFilters && (
                            <button
                                onClick={() => { setSearchInput(""); setSearchParams({}) }}
                                className="text-xs text-gray-400 hover:text-gray-700 underline transition-colors"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ background: "#FAFAFA", borderBottom: "1px solid #F3F4F6" }}>
                                        {["Venue", "Owner", "Location", "Category", "Submitted", "Status", "Actions"].map(h => (
                                            <th key={h} className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {venues.map((venue) => (
                                        <tr
                                            key={venue._id}
                                            className="transition-colors"
                                            style={{ borderBottom: "1px solid #F9FAFB" }}
                                            onMouseEnter={e => (e.currentTarget.style.background = "#FAFAFA")}
                                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                        >
                                            {/* Venue */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {/* Thumbnail */}
                                                    {(venue as any).photos?.[0] ? (
                                                        <img
                                                            src={(venue as any).photos[0]}
                                                            className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                                                            alt={venue.venueName}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                                            style={{ background: "rgba(212,175,55,0.1)" }}
                                                        >
                                                            <Building2 size={16} style={{ color: GOLD }} />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-gray-800 text-[13px]">{venue.venueName}</p>
                                                        <p className="text-xs text-gray-400 mt-0.5">{venue.location?.address?.district}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Owner */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2.5">
                                                    {venue.owner?.profileImage ? (
                                                        <img src={venue.owner.profileImage} className="w-8 h-8 rounded-xl object-cover flex-shrink-0" />
                                                    ) : (
                                                        <div
                                                            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                                            style={{ background: `linear-gradient(135deg, ${GOLD}, #B8962E)` }}
                                                        >
                                                            {venue.owner?.userName?.[0]?.toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-gray-700 font-semibold text-[13px]">{venue.owner?.userName}</p>
                                                        <p className="text-gray-400 text-xs mt-0.5">{venue.owner?.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Location */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-start gap-1.5">
                                                    <MapPin size={11} className="text-gray-300 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-gray-600 text-[13px] font-medium">{venue.location?.address?.city}</p>
                                                        <p className="text-gray-400 text-xs mt-0.5">{venue.location?.address?.state}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap"
                                                    style={{ background: "rgba(124,58,237,0.08)", color: "#6D28D9" }}
                                                >
                                                    <Tag size={9} />
                                                    {venue.category}
                                                </span>
                                            </td>

                                            {/* Submitted */}
                                            <td className="px-6 py-4">
                                                <span className="text-gray-500 text-xs whitespace-nowrap">
                                                    {new Date(venue.createdAt).toLocaleDateString("en-IN", {
                                                        day: "numeric", month: "short", year: "numeric",
                                                    })}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <StatusBadge status={venue.status} />
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => setSelectedVenueId(venue._id)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all"
                                                    style={{ borderColor: "#E5E7EB", color: "#6B7280" }}
                                                    onMouseEnter={e => {
                                                        e.currentTarget.style.borderColor = GOLD
                                                        e.currentTarget.style.color = GOLD
                                                    }}
                                                    onMouseLeave={e => {
                                                        e.currentTarget.style.borderColor = "#E5E7EB"
                                                        e.currentTarget.style.color = "#6B7280"
                                                    }}
                                                >
                                                    <Eye size={12} />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination && (
                            <div
                                className="flex items-center justify-between px-6 py-4"
                                style={{ borderTop: "1px solid #F3F4F6" }}
                            >
                                <p className="text-xs text-gray-400">
                                    Page <span className="font-medium text-gray-600">{pagination.currentPage}</span> of{" "}
                                    <span className="font-medium text-gray-600">{pagination.totalPages}</span>
                                    {" "}— {totalCount} venue{totalCount !== 1 ? "s" : ""}
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => updateParam("page", String(page - 1))}
                                        disabled={!pagination.hasPreviousPage}
                                        className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-gray-200 hover:border-yellow-400"
                                    >
                                        <ChevronLeft size={14} />
                                    </button>
                                    <span
                                        className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white"
                                        style={{ background: GOLD }}
                                    >
                                        {pagination.currentPage}
                                    </span>
                                    <button
                                        onClick={() => updateParam("page", String(page + 1))}
                                        disabled={!pagination.hasNextPage}
                                        className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-gray-200 hover:border-yellow-400"
                                    >
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Venue Detail Modal */}
            {selectedVenueId && (
                <VenueDetailModal
                    venueId={selectedVenueId}
                    onClose={() => setSelectedVenueId(null)}
                />
            )}
        </div>
    )
}
