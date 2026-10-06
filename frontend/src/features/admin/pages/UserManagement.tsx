import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import {
    useGetAdminUsersQuery,
    useToggleUserStatusMutation,
    useGetUserDetailQuery
} from "@/features/admin/adminApi"
import {
    Search, ChevronLeft, ChevronRight,
    X, CheckCircle, XCircle, Users, Shield
} from "lucide-react"

const GOLD = "#D4AF37"

const roleBadge: Record<string, { bg: string; text: string }> = {
    user: { bg: "#DBEAFE", text: "#1E40AF" },
    venue_owner: { bg: "#EDE9FE", text: "#6D28D9" },
    admin: { bg: "#FEF9C3", text: "#92400E" },
}
const roleLabel: Record<string, string> = {
    user: "User", venue_owner: "Owner", admin: "Admin"
}

export default function UserManagement() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "")
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

    const page = Number(searchParams.get("page") ?? 1)
    const role = searchParams.get("role") ?? ""
    const isActive = searchParams.get("isActive") ?? ""
    const search = searchParams.get("search") ?? ""

    const { data, isLoading, isError, refetch } = useGetAdminUsersQuery({
        page,
        role: role || undefined,
        isActive: isActive || undefined,
        search: search || undefined,
    })
    const [toggleStatus, { isLoading: isToggling }] = useToggleUserStatusMutation()

    // Detail query — only fires when a user is selected
    const { data: detailData, isLoading: detailLoading } = useGetUserDetailQuery(
        selectedUserId ?? "",
        { skip: !selectedUserId }
    )
    const detailUser = detailData?.user

    const updateParam = (key: string, value: string) => {
        const p = new URLSearchParams(searchParams)
        if (value) p.set(key, value); else p.delete(key)
        if (key !== "page") p.set("page", "1")
        setSearchParams(p)
    }

    const handleToggle = async (id: string) => {
        try { await toggleStatus(id).unwrap() } catch { /* handled by RTK */ }
    }

    const users = data?.user ?? []
    const pagination = data?.pagination
    const totalCount = data?.totalcount ?? 0

    return (
        <div className="space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#FEF9C3" }}>
                        <Users size={17} style={{ color: "#92400E" }} />
                    </div>
                    <div>
                        <h1 className="text-[18px] font-bold text-gray-800">User Management</h1>
                        <p className="text-gray-400 text-[13px]">{totalCount} total users registered</p>
                    </div>
                </div>
            </div>

            {/* Filters bar */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Search */}
                    <form
                        onSubmit={e => { e.preventDefault(); updateParam("search", searchInput) }}
                        className="flex items-center gap-2 flex-1 min-w-[200px]"
                    >
                        <div className="relative flex-1">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search name or email..."
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300/40 focus:border-yellow-400"
                            />
                        </div>
                        <button type="submit" className="px-4 py-2 text-[13px] rounded-lg text-white font-semibold" style={{ background: GOLD }}>
                            Search
                        </button>
                    </form>

                    {/* Role */}
                    <select value={role} onChange={e => updateParam("role", e.target.value)}
                        className="text-[13px] px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none">
                        <option value="">All roles</option>
                        <option value="user">User</option>
                        <option value="venue_owner">Venue Owner</option>
                    </select>

                    {/* Status */}
                    <select value={isActive} onChange={e => updateParam("isActive", e.target.value)}
                        className="text-[13px] px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none">
                        <option value="">All status</option>
                        <option value="true">Active</option>
                        <option value="false">Suspended</option>
                    </select>

                    {/* Clear */}
                    {(role || isActive || search) && (
                        <button onClick={() => { setSearchInput(""); setSearchParams({}) }}
                            className="flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={14} /> Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Table card */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {isLoading ? (
                    <div className="divide-y divide-gray-50">
                        {[...Array(7)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                                <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0" />
                                <div className="flex-1 space-y-1.5">
                                    <div className="h-3 bg-gray-100 rounded w-1/4" />
                                    <div className="h-2.5 bg-gray-100 rounded w-1/3" />
                                </div>
                                <div className="h-6 w-14 bg-gray-100 rounded-full" />
                                <div className="h-6 w-14 bg-gray-100 rounded-full" />
                                <div className="h-7 w-20 bg-gray-100 rounded-lg" />
                            </div>
                        ))}
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <p className="text-gray-400 text-sm">Failed to load users</p>
                        <button onClick={refetch} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">Retry</button>
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Users size={32} className="text-gray-200 mb-3" />
                        <p className="text-gray-400 text-sm">No users found</p>
                    </div>
                ) : (
                    <>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    {["User", "Role", "Status", "Verified", "Joined", "Actions"].map(col => (
                                        <th key={col} className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u: any) => {
                                    const badge = roleBadge[u.role] ?? { bg: "#F3F4F6", text: "#4B5563" }
                                    return (
                                        <tr key={u._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">

                                            {/* User */}
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    {u.profileImage ? (
                                                        <img src={u.profileImage} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                                                    ) : (
                                                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0"
                                                            style={{ background: GOLD }}>
                                                            {u.userName?.[0]?.toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-gray-800 text-[13px]">{u.userName}</p>
                                                        <p className="text-gray-400 text-[11px]">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Role */}
                                            <td className="px-5 py-3.5">
                                                <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold"
                                                    style={{ background: badge.bg, color: badge.text }}>
                                                    {roleLabel[u.role] ?? u.role}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-5 py-3.5">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                                                    {u.isActive ? <><CheckCircle size={10} /> Active</> : <><XCircle size={10} /> Suspended</>}
                                                </span>
                                            </td>

                                            {/* Verified */}
                                            <td className="px-5 py-3.5">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${u.isVerified ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                                                    {u.isVerified ? "Verified" : "Unverified"}
                                                </span>
                                            </td>

                                            {/* Joined */}
                                            <td className="px-5 py-3.5 text-gray-400 text-[12px]">
                                                {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => setSelectedUserId(u._id)}
                                                        className="px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium">
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggle(u._id)}
                                                        disabled={isToggling}
                                                        className={`px-3 py-1.5 text-[12px] rounded-lg font-semibold transition-colors ${u.isActive
                                                            ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                                                            : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"}`}>
                                                        {u.isActive ? "Suspend" : "Activate"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {pagination && (
                            <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
                                <p className="text-[12px] text-gray-400">
                                    Page {pagination.currentPage} of {pagination.totalPages} &nbsp;·&nbsp; {totalCount} users
                                </p>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => updateParam("page", String(page - 1))}
                                        disabled={!pagination.hasPreviousPage}
                                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                        <ChevronLeft size={14} />
                                    </button>
                                    <span className="text-[13px] font-semibold text-gray-700 min-w-[24px] text-center">
                                        {pagination.currentPage}
                                    </span>
                                    <button onClick={() => updateParam("page", String(page + 1))}
                                        disabled={!pagination.hasNextPage}
                                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ── User detail modal ── */}
            {selectedUserId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    onClick={() => setSelectedUserId(null)}>
                    <div className="bg-white rounded-2xl w-[400px] overflow-hidden shadow-2xl relative"
                        onClick={e => e.stopPropagation()}>

                        <button onClick={() => setSelectedUserId(null)}
                            className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                            <X size={15} />
                        </button>

                        {detailLoading ? (
                            <div className="p-6 pt-8 space-y-3 animate-pulse">
                                <div className="w-14 h-14 rounded-full bg-gray-100 mx-auto" />
                                <div className="h-3.5 bg-gray-100 rounded w-1/3 mx-auto" />
                                <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto" />
                            </div>
                        ) : detailUser ? (
                            <div className="px-6 pb-6 pt-8">
                                <div className="flex flex-col items-center mb-4">
                                    {detailUser.profileImage ? (
                                        <img src={detailUser.profileImage}
                                            className="w-14 h-14 rounded-full object-cover border-4 border-white" />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-[18px] font-bold border-4 border-white"
                                            style={{ background: GOLD }}>
                                            {detailUser.userName?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                    <p className="font-bold text-gray-800 text-[15px] mt-2">{detailUser.userName}</p>
                                    <p className="text-gray-400 text-[12px]">{detailUser.email}</p>

                                    {/* Role badge */}
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <Shield size={10} style={{ color: GOLD }} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                                            {roleLabel[detailUser.role] ?? detailUser.role}
                                        </span>
                                    </div>
                                </div>

                                {/* Detail rows */}
                                <div className="space-y-2">
                                    {[
                                        {
                                            label: "Status", value: detailUser.isActive ? "Active" : "Suspended",
                                            color: detailUser.isActive ? "text-green-600" : "text-red-500"
                                        },
                                        {
                                            label: "Verified", value: detailUser.isVerified ? "Yes" : "No",
                                            color: detailUser.isVerified ? "text-blue-600" : "text-gray-400"
                                        },
                                        { label: "Phone", value: detailUser.phoneNumber || "—", color: "text-gray-700" },
                                        { label: "Joined", value: new Date(detailUser.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }), color: "text-gray-700" },
                                        ...(detailUser.role === "venue_owner"
                                            ? [{ label: "Owner Status", value: detailUser.ownerStatus, color: "text-gray-700" }]
                                            : [])
                                    ].map(({ label, value, color }) => (
                                        <div key={label} className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
                                            <span className="text-[12px] text-gray-400 font-medium">{label}</span>
                                            <span className={`text-[13px] font-semibold ${color}`}>{value}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Close button */}
                                <button onClick={() => setSelectedUserId(null)}
                                    className="mt-5 w-full py-2.5 rounded-xl border border-gray-200 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors font-medium">
                                    Close
                                </button>
                            </div>
                        ) : (
                            <p className="text-center text-gray-400 py-10 text-sm">User not found</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
