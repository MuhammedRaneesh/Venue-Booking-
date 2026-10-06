// pages/admin/OwnerApplications.tsx
import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import {
    useAdminGetVenueOwnerApplicationQuery,
    useAdminOwnerApplicationDetailQuery,
    useAdminOwnerApplicationUpdateMutation
} from "@/features/admin/adminApi"
import {
    Search, X, ChevronLeft, ChevronRight,
    CheckCircle, XCircle, Building2, MapPin,
    FileText, User, Calendar
} from "lucide-react"

const GOLD = "#D4AF37"

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    PENDING:  { bg: "rgba(251,191,36,0.12)",  text: "#B45309", dot: "#F59E0B", label: "Pending"  },
    APPROVED: { bg: "rgba(34,197,94,0.12)",   text: "#15803D", dot: "#22C55E", label: "Approved" },
    REJECTED: { bg: "rgba(239,68,68,0.12)",   text: "#B91C1C", dot: "#EF4444", label: "Rejected" },
}

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: string }) {
    const cfg = statusConfig[status] ?? { bg: "#F3F4F6", text: "#6B7280", dot: "#9CA3AF", label: status }
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: cfg.bg, color: cfg.text }}
        >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
            {cfg.label}
        </span>
    )
}

/* ─── Detail Modal ─── */
function ApplicationDetailModal({ userId, onClose }: { userId: string; onClose: () => void }) {
    const { data, isLoading } = useAdminOwnerApplicationDetailQuery(userId)
    const [updateStatus, { isLoading: isUpdating }] = useAdminOwnerApplicationUpdateMutation()
    const [rejectionReason, setRejectionReason] = useState("")
    const [showRejectInput, setShowRejectInput] = useState(false)
    const [error, setError] = useState("")

    const application = data?.application
    const user = application?.user

    const handleApprove = async () => {
        try {
            await updateStatus({ id: userId, action: "APPROVED" }).unwrap()
            onClose()
        } catch (err: any) {
            setError(err?.data?.message ?? "Something went wrong")
        }
    }

    const handleReject = async () => {
        if (!rejectionReason.trim()) { setError("Rejection reason is required"); return }
        try {
            await updateStatus({ id: userId, action: "REJECTED", rejectionReason }).unwrap()
            onClose()
        } catch (err: any) {
            setError(err?.data?.message ?? "Something went wrong")
        }
    }

    const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose()
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
            onClick={handleBackdrop}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-[540px] max-h-[90vh] overflow-y-auto shadow-2xl"
                style={{ animation: "modalIn 0.2s ease" }}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(212,175,55,0.12)" }}>
                            <FileText size={15} style={{ color: GOLD }} />
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900 text-[14px] leading-tight">Application Details</h2>
                            <p className="text-[11px] text-gray-400">Review owner application</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
                    >
                        <X size={16} />
                    </button>
                </div>

                {isLoading ? (
                    <div className="p-6 space-y-4 animate-pulse">
                        <div className="flex flex-col items-center gap-3">
                            <div className="h-16 w-16 rounded-2xl bg-gray-100" />
                            <div className="h-4 bg-gray-100 rounded w-32" />
                            <div className="h-3 bg-gray-100 rounded w-24" />
                        </div>
                        <div className="space-y-3 mt-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-10 bg-gray-100 rounded-xl" />
                            ))}
                        </div>
                    </div>
                ) : application ? (
                    <div className="p-6">
                        {/* User Profile */}
                        <div className="flex flex-col items-center mb-6">
                            {user?.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    alt={user.userName}
                                    className="w-16 h-16 rounded-2xl object-cover ring-4 ring-yellow-50"
                                />
                            ) : (
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl ring-4 ring-yellow-50"
                                    style={{ background: `linear-gradient(135deg, ${GOLD}, #B8962E)` }}
                                >
                                    {user?.userName?.[0]?.toUpperCase()}
                                </div>
                            )}
                            <p className="font-semibold text-gray-900 mt-3 text-[15px]">{user?.userName}</p>
                            <p className="text-gray-400 text-xs mt-0.5">{user?.email}</p>
                            <div className="mt-2.5">
                                <StatusBadge status={user?.ownerStatus} />
                            </div>
                        </div>

                        {/* Business Details */}
                        <div className="rounded-xl p-4 mb-4" style={{ background: "#FAFAFA", border: "1px solid #F3F4F6" }}>
                            <div className="flex items-center gap-2 mb-3">
                                <Building2 size={14} className="text-gray-400" />
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Business details</p>
                            </div>
                            <div className="space-y-0">
                                {[
                                    { label: "Business name", value: application.businessName },
                                    { label: "Phone",         value: application.phone },
                                    { label: "Address",       value: application.address },
                                    { label: "City",          value: application.city },
                                    { label: "State",         value: application.state },
                                    { label: "Pincode",       value: application.pincode },
                                    { label: "GST number",    value: application.gstNumber || "—" },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
                                        <span className="text-xs text-gray-400">{label}</span>
                                        <span className="text-sm font-medium text-gray-700 text-right max-w-[60%]">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Rejection reason (if any) */}
                        {application.rejectionReason && (
                            <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
                                <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1.5">Rejection reason</p>
                                <p className="text-sm text-red-600">{application.rejectionReason}</p>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 mb-4" style={{ background: "rgba(239,68,68,0.07)" }}>
                                <XCircle size={14} className="text-red-500 flex-shrink-0" />
                                <p className="text-sm text-red-500">{error}</p>
                            </div>
                        )}

                        {/* Reject reason input */}
                        {showRejectInput && (
                            <div className="mb-4">
                                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                                    Rejection reason <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={e => { setRejectionReason(e.target.value); setError("") }}
                                    placeholder="Explain why this application is being rejected..."
                                    rows={3}
                                    className="w-full text-sm px-3 py-2.5 rounded-xl resize-none focus:outline-none transition-all"
                                    style={{ border: "1px solid #FCA5A5", background: "rgba(254,242,242,0.5)" }}
                                />
                            </div>
                        )}

                        {/* Actions — only if PENDING */}
                        {user?.ownerStatus === "PENDING" && (
                            <div className="flex gap-3 mt-2">
                                {!showRejectInput ? (
                                    <>
                                        <button
                                            onClick={handleApprove}
                                            disabled={isUpdating}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
                                            style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}
                                        >
                                            <CheckCircle size={15} /> Approve
                                        </button>
                                        <button
                                            onClick={() => setShowRejectInput(true)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                                            style={{ background: "rgba(239,68,68,0.07)", color: "#DC2626", border: "1px solid rgba(239,68,68,0.2)" }}
                                        >
                                            <XCircle size={15} /> Reject
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => { setShowRejectInput(false); setRejectionReason(""); setError("") }}
                                            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 transition-all"
                                            style={{ border: "1px solid #E5E7EB", background: "#FAFAFA" }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleReject}
                                            disabled={isUpdating}
                                            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
                                            style={{ background: "linear-gradient(135deg, #DC2626, #B91C1C)" }}
                                        >
                                            {isUpdating ? "Rejecting…" : "Confirm reject"}
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                            <FileText size={20} className="text-gray-300" />
                        </div>
                        <p className="text-gray-400 text-sm">Application not found</p>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: translateY(12px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    )
}

/* ─── Main Page ─── */
export default function OwnerApplications() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "")
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

    const page       = Number(searchParams.get("page") ?? 1)
    const ownerStatus = searchParams.get("ownerStatus") ?? ""
    const search     = searchParams.get("search") ?? ""

    const { data, isLoading, isError, refetch } = useAdminGetVenueOwnerApplicationQuery({
        page,
        ownerStatus: ownerStatus || undefined,
        search: search || undefined,
    })

    const updateParam = useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams)
            if (value) params.set(key, value)
            else params.delete(key)
            if (key !== "page") params.set("page", "1")
            setSearchParams(params)
        },
        [searchParams, setSearchParams]
    )

    /* Debounced search — fires 450 ms after user stops typing */
    useEffect(() => {
        const timer = setTimeout(() => updateParam("search", searchInput), 450)
        return () => clearTimeout(timer)
    }, [searchInput]) // eslint-disable-line react-hooks/exhaustive-deps

    const applications = data?.applications ?? []
    const pagination   = data?.pagination
    const totalCount   = data?.totalCount ?? 0
    const hasFilters   = !!(ownerStatus || search)

    return (
        <div className="space-y-5">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-gray-900 font-bold text-xl tracking-tight">Owner Applications</h1>
                    <p className="text-gray-400 text-sm mt-0.5">
                        {isLoading ? "Loading…" : `${totalCount} total application${totalCount !== 1 ? "s" : ""}`}
                    </p>
                </div>

                {/* Quick-filter status pills */}
                <div className="hidden sm:flex items-center gap-2">
                    {(["PENDING", "APPROVED", "REJECTED"] as const).map(s => {
                        const cfg = statusConfig[s]
                        const active = ownerStatus === s
                        return (
                            <button
                                key={s}
                                onClick={() => updateParam("ownerStatus", active ? "" : s)}
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
                {/* Search — debounced, no submit button */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                        id="application-search"
                        type="text"
                        placeholder="Search name, email or business…"
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        className="w-full pl-9 pr-9 py-2.5 text-sm bg-gray-50 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none transition-all"
                        style={{ border: "1px solid #EEEEEE" }}
                        onFocus={e => {
                            e.currentTarget.style.borderColor = GOLD
                            e.currentTarget.style.boxShadow  = `0 0 0 3px rgba(212,175,55,0.12)`
                            e.currentTarget.style.background  = "#FFFFFF"
                        }}
                        onBlur={e => {
                            e.currentTarget.style.borderColor = "#EEEEEE"
                            e.currentTarget.style.boxShadow  = "none"
                            e.currentTarget.style.background  = "#F9FAFB"
                        }}
                    />
                    {searchInput && (
                        <button
                            onClick={() => setSearchInput("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={13} />
                        </button>
                    )}
                </div>

                {/* Status select */}
                <div className="relative">
                    <select
                        value={ownerStatus}
                        onChange={e => updateParam("ownerStatus", e.target.value)}
                        className="text-sm pl-3 pr-8 py-2.5 rounded-xl bg-gray-50 text-gray-700 appearance-none cursor-pointer focus:outline-none transition-all"
                        style={{ border: "1px solid #EEEEEE" }}
                        onFocus={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(212,175,55,0.12)` }}
                        onBlur={e =>  { e.currentTarget.style.borderColor = "#EEEEEE"; e.currentTarget.style.boxShadow = "none" }}
                    >
                        <option value="">All status</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
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
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3.5 bg-gray-100 rounded-lg w-1/4" />
                                    <div className="h-3 bg-gray-100 rounded-lg w-1/3" />
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
                            <p className="text-gray-700 font-medium text-sm">Failed to load applications</p>
                            <p className="text-gray-400 text-xs mt-0.5">Something went wrong on our end</p>
                        </div>
                        <button
                            onClick={refetch}
                            className="px-5 py-2 text-sm rounded-xl font-medium text-white transition-all"
                            style={{ background: GOLD }}
                        >
                            Try again
                        </button>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                            <User size={22} className="text-gray-300" />
                        </div>
                        <div className="text-center">
                            <p className="text-gray-700 font-medium text-sm">No applications found</p>
                            <p className="text-gray-400 text-xs mt-0.5">
                                {hasFilters ? "Try adjusting your search or filters" : "No owner applications yet"}
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
                                        {["Applicant", "Business", "Location", "Applied", "Status", "Action"].map(h => (
                                            <th key={h} className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map((app: any) => {
                                        const user = app.user
                                        return (
                                            <tr
                                                key={app._id}
                                                className="transition-colors"
                                                style={{ borderBottom: "1px solid #F9FAFB" }}
                                                onMouseEnter={e => (e.currentTarget.style.background = "#FAFAFA")}
                                                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                            >
                                                {/* Applicant */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {user?.profileImage ? (
                                                            <img src={user.profileImage} alt={user.userName} className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
                                                        ) : (
                                                            <div
                                                                className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                                                                style={{ background: `linear-gradient(135deg, ${GOLD}, #B8962E)` }}
                                                            >
                                                                {user?.userName?.[0]?.toUpperCase()}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-semibold text-gray-800 text-[13px]">{user?.userName}</p>
                                                            <p className="text-gray-400 text-xs mt-0.5">{user?.email}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Business */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-start gap-2">
                                                        <Building2 size={13} className="text-gray-300 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <p className="font-semibold text-gray-700 text-[13px]">{app.businessName}</p>
                                                            {app.gstNumber && <p className="text-xs text-gray-400 mt-0.5">GST: {app.gstNumber}</p>}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Location */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-start gap-1.5">
                                                        <MapPin size={12} className="text-gray-300 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-gray-600 text-[13px] font-medium">{app.city}</p>
                                                            <p className="text-gray-400 text-xs">{app.state}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Applied date */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={12} className="text-gray-300 flex-shrink-0" />
                                                        <span className="text-gray-500 text-xs">
                                                            {new Date(app.createdAt).toLocaleDateString("en-IN", {
                                                                day: "numeric", month: "short", year: "numeric",
                                                            })}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Status */}
                                                <td className="px-6 py-4">
                                                    <StatusBadge status={user?.ownerStatus} />
                                                </td>

                                                {/* Action */}
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => setSelectedUserId(user?._id)}
                                                        className="px-3.5 py-1.5 text-xs rounded-xl font-semibold transition-all border"
                                                        style={{ borderColor: "#E5E7EB", color: "#374151", background: "#F9FAFB" }}
                                                        onMouseEnter={e => {
                                                            e.currentTarget.style.borderColor = GOLD
                                                            e.currentTarget.style.color = GOLD
                                                            e.currentTarget.style.background = "rgba(212,175,55,0.06)"
                                                        }}
                                                        onMouseLeave={e => {
                                                            e.currentTarget.style.borderColor = "#E5E7EB"
                                                            e.currentTarget.style.color = "#374151"
                                                            e.currentTarget.style.background = "#F9FAFB"
                                                        }}
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination && (
                            <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: "1px solid #F3F4F6" }}>
                                <p className="text-xs text-gray-400">
                                    Page <span className="font-medium text-gray-600">{pagination.currentPage}</span> of{" "}
                                    <span className="font-medium text-gray-600">{pagination.totalPages}</span>
                                    {" "}— {totalCount} application{totalCount !== 1 ? "s" : ""}
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

            {/* Detail modal */}
            {selectedUserId && (
                <ApplicationDetailModal
                    userId={selectedUserId}
                    onClose={() => setSelectedUserId(null)}
                />
            )}
        </div>
    )
}
