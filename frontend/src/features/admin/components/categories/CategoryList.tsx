import {
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Edit3,
    Image as ImageIcon,
    Loader2,
    Power,
    Trash2,
} from "lucide-react"
import type { Category } from "@/features/admin/categoryApi"

type CategoryListProps = {
    categories: Category[]
    isLoading: boolean
    isError: boolean
    totalCount: number
    pagination?: {
        currentPage: number
        totalPages: number
        hasNextPage: boolean
        hasPreviousPage: boolean
    }
    actionId: string | null
    onEdit: (category: Category) => void
    onDelete: (category: Category) => void
    onToggle: (category: Category) => void
    onRetry: () => void
    onPageChange: (page: number) => void
}

export default function CategoryList({
    categories,
    isLoading,
    isError,
    totalCount,
    pagination,
    actionId,
    onEdit,
    onDelete,
    onToggle,
    onRetry,
    onPageChange,
}: CategoryListProps) {
    if (isLoading) {
        return (
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                <div className="divide-y divide-slate-100">
                    {[...Array(6)].map((_, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 px-6 py-4.5 animate-pulse"
                        >
                            <div className="h-12 w-14 rounded-xl bg-slate-100" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-40 rounded bg-slate-100" />
                                <div className="h-3 w-64 rounded bg-slate-100/70" />
                            </div>
                            <div className="h-6 w-20 rounded-full bg-slate-100" />
                            <div className="h-8 w-28 rounded-lg bg-slate-100" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-100 bg-rose-50/30 px-6 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                    <AlertCircle className="h-6 w-6" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-800">
                    Unable to load categories
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                    An error occurred while fetching the venue categories.
                </p>
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                    Retry connection
                </button>
            </div>
        )
    }

    if (categories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white px-6 py-16 text-center shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 ring-1 ring-slate-200/60">
                    <ImageIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-800">
                    No categories found
                </h3>
                <p className="mt-1 max-w-sm text-xs text-slate-500">
                    There are no categories matching your current filters. Create a category or clear search terms.
                </p>
            </div>
        )
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/60 text-xs font-semibold text-slate-600">
                            <th className="px-6 py-3.5">Category</th>
                            <th className="px-6 py-3.5">Slug</th>
                            <th className="px-6 py-3.5">Description</th>
                            <th className="px-6 py-3.5">Status</th>
                            <th className="px-6 py-3.5">Created</th>
                            <th className="px-6 py-3.5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                        {categories.map((category) => {
                            const isActive = category.status === "active"
                            const isActionLoading = actionId === category._id

                            return (
                                <tr
                                    key={category._id}
                                    className="transition-colors hover:bg-slate-50/50"
                                >
                                    {/* Category Name & Thumbnail */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3.5">
                                            <div className="relative h-12 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200/70 bg-slate-100 shadow-sm">
                                                {category.image ? (
                                                    <img
                                                        src={category.image}
                                                        alt={category.name}
                                                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                                                        <ImageIcon className="h-5 w-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">
                                                    {category.name}
                                                </p>
                                                <p className="mt-0.5 font-mono text-[11px] text-slate-400">
                                                    ID: {category._id.slice(-6)}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Slug */}
                                    <td className="px-6 py-4">
                                        <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">
                                            {category.slug}
                                        </span>
                                    </td>

                                    {/* Description */}
                                    <td className="max-w-[280px] px-6 py-4">
                                        <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">
                                            {category.description || "—"}
                                        </p>
                                    </td>

                                    {/* Status Badge */}
                                    <td className="px-6 py-4">
                                        {isActive ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                                Inactive
                                            </span>
                                        )}
                                    </td>

                                    {/* Date */}
                                    <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                                        {new Date(category.createdAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </td>

                                    {/* Action Buttons */}
                                    <td className="whitespace-nowrap px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            {/* Edit */}
                                            <button
                                                type="button"
                                                onClick={() => onEdit(category)}
                                                disabled={isActionLoading}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800 disabled:opacity-50"
                                                title="Edit category"
                                            >
                                                <Edit3 className="h-3.5 w-3.5" />
                                            </button>

                                            {/* Toggle Status */}
                                            <button
                                                type="button"
                                                onClick={() => onToggle(category)}
                                                disabled={isActionLoading}
                                                className={`inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition disabled:opacity-50 ${
                                                    isActive
                                                        ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                                        : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                                }`}
                                                title={isActive ? "Deactivate category" : "Activate category"}
                                            >
                                                {isActionLoading ? (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                ) : (
                                                    <Power className="h-3 w-3" />
                                                )}
                                                <span>{isActive ? "Deactivate" : "Activate"}</span>
                                            </button>

                                            {/* Delete */}
                                            <button
                                                type="button"
                                                onClick={() => onDelete(category)}
                                                disabled={isActionLoading}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                                                title="Delete category"
                                            >
                                                {isActionLoading ? (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-500" />
                                                ) : (
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-3.5 text-xs text-slate-500">
                    <div>
                        Showing page{" "}
                        <span className="font-semibold text-slate-800">
                            {pagination.currentPage}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-slate-800">
                            {pagination.totalPages}
                        </span>{" "}
                        ({totalCount} categories)
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => onPageChange(pagination.currentPage - 1)}
                            disabled={!pagination.hasPreviousPage}
                            className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft className="h-3.5 w-3.5" />
                            Previous
                        </button>
                        <button
                            type="button"
                            onClick={() => onPageChange(pagination.currentPage + 1)}
                            disabled={!pagination.hasNextPage}
                            className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                            <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
