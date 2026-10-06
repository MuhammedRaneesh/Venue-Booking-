import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Plus, Search, Sparkles, X } from "lucide-react"
import { toast } from "sonner"
import CategoryList from "@/features/admin/components/categories/CategoryList"
import CreateCategoryModal from "@/features/admin/components/categories/CreateCategoryModal"
import EditCategoryModal from "@/features/admin/components/categories/EditCategoryModal"
import {
    useDeleteCategoryMutation,
    useGetCategoriesQuery,
    useToggleCategoryStatusMutation,
    type Category,
} from "@/features/admin/categoryApi"

const PAGE_SIZE = 10

const getErrorMessage = (error: unknown) => {
    if (typeof error === "object" && error !== null && "data" in error) {
        const data = (error as { data?: { message?: string } }).data
        return data?.message || "An unexpected error occurred"
    }
    return "An unexpected error occurred"
}

export default function AdminCategoriesPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [actionId, setActionId] = useState<string | null>(null)

    const page = Number(searchParams.get("page") ?? 1)
    const search = searchParams.get("search") ?? ""
    const statusParam = searchParams.get("status")
    const status = (statusParam === "active" || statusParam === "inactive") ? statusParam : undefined

    const { data, isLoading, isError, refetch } = useGetCategoriesQuery({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        status,
    })

    const [deleteCategory] = useDeleteCategoryMutation()
    const [toggleCategoryStatus] = useToggleCategoryStatusMutation()

    const categories = data?.categories ?? []
    const pagination = data?.pagination
    const totalCount = data?.totalCount ?? 0
    const hasFilters = Boolean(search || status)

    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        if (key !== "page") {
            params.set("page", "1")
        }
        setSearchParams(params)
    }

    const handleDelete = async (category: Category) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete category "${category.name}"? This action cannot be undone if no venues are linked.`
        )
        if (!confirmed) return

        setActionId(category._id)
        try {
            const response = await deleteCategory(category._id).unwrap()
            toast.success(response.message || "Category deleted successfully")
        } catch (error) {
            toast.error(getErrorMessage(error))
        } finally {
            setActionId(null)
        }
    }

    const handleToggle = async (category: Category) => {
        setActionId(category._id)
        try {
            const response = await toggleCategoryStatus(category._id).unwrap()
            toast.success(response.message || "Category status updated")
        } catch (error) {
            toast.error(getErrorMessage(error))
        } finally {
            setActionId(null)
        }
    }

    const handleClearFilters = () => {
        setSearchInput("")
        setSearchParams({})
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-600/20">
                            <Sparkles className="h-3 w-3 text-amber-700" />
                            Inventory
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs font-medium text-slate-500">
                            {totalCount} total classifications
                        </span>
                    </div>
                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                        Venue Categories
                    </h1>
                    <p className="mt-0.5 text-xs text-slate-500">
                        Curate venue classifications, cover banners, and consumer discovery filters.
                    </p>
                </div>

                <div>
                    <button
                        type="button"
                        onClick={() => setIsCreateOpen(true)}
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-95 focus:ring-2 focus:ring-amber-500/20"
                        style={{ backgroundColor: "#C9A84C" }}
                    >
                        <Plus className="h-4 w-4" />
                        Add Category
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            updateParam("search", searchInput)
                        }}
                        className="relative flex-1"
                    >
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search by category name, slug, or keywords..."
                            className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                        />
                    </form>

                    <div className="flex items-center gap-2">
                        <select
                            value={status ?? ""}
                            onChange={(e) => updateParam("status", e.target.value)}
                            className="rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active Only</option>
                            <option value="inactive">Inactive Only</option>
                        </select>

                        {hasFilters && (
                            <button
                                type="button"
                                onClick={handleClearFilters}
                                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
                            >
                                <X className="h-3.5 w-3.5" />
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Category Table */}
            <CategoryList
                categories={categories}
                isLoading={isLoading}
                isError={isError}
                totalCount={totalCount}
                pagination={pagination}
                actionId={actionId}
                onEdit={(category) => setEditingCategory(category)}
                onDelete={handleDelete}
                onToggle={handleToggle}
                onRetry={refetch}
                onPageChange={(nextPage) => updateParam("page", String(nextPage))}
            />

            {/* Separate Create Modal */}
            <CreateCategoryModal
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />

            {/* Separate Edit Modal */}
            <EditCategoryModal
                open={Boolean(editingCategory)}
                category={editingCategory}
                onClose={() => setEditingCategory(null)}
            />
        </div>
    )
}
