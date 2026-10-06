import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
    AlertCircle,
    Check,
    ImagePlus,
    Loader2,
    Sparkles,
    Trash2,
    UploadCloud,
    X,
} from "lucide-react"
import { toast } from "sonner"
import { useCreateCategoryMutation } from "@/features/admin/categoryApi"

const createCategorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Category name must be at least 2 characters")
        .max(80, "Category name cannot exceed 80 characters"),
    slug: z
        .string()
        .trim()
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug must contain lowercase letters, numbers, and hyphens only (e.g. banquet-hall)"
        )
        .optional()
        .or(z.literal("")),
    description: z
        .string()
        .trim()
        .max(1000, "Description cannot exceed 1000 characters")
        .optional(),
    status: z.enum(["active", "inactive"]),
    image: z
        .custom<File | null>((val) => val instanceof File, {
            message: "A cover photo is required for this category",
        })
        .refine(
            (file) => !file || file.size <= 5 * 1024 * 1024,
            "Image size must be less than 5MB"
        )
        .refine(
            (file) =>
                !file ||
                ["image/jpeg", "image/png", "image/webp"].includes(file.type),
            "Only JPG, PNG, and WEBP formats are accepted"
        ),
})

type CreateCategoryFormValues = z.infer<typeof createCategorySchema>

type CreateCategoryModalProps = {
    open: boolean
    onClose: () => void
}

const slugify = (text: string) =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function CreateCategoryModal({
    open,
    onClose,
}: CreateCategoryModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [createCategory, { isLoading }] = useCreateCategoryMutation()

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        clearErrors,
        formState: { errors },
    } = useForm<CreateCategoryFormValues>({
        resolver: zodResolver(createCategorySchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            status: "active",
            image: null,
        },
    })

    const selectedFile = watch("image")
    const currentStatus = watch("status")
    const currentName = watch("name")

    // Handle local image preview lifecycle
    useEffect(() => {
        if (!selectedFile || !(selectedFile instanceof File)) {
            setPreviewUrl(null)
            return
        }
        const objectUrl = URL.createObjectURL(selectedFile)
        setPreviewUrl(objectUrl)
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    // Reset form state on modal open/close
    useEffect(() => {
        if (!open) {
            reset()
            setPreviewUrl(null)
            setIsDragging(false)
        }
    }, [open, reset])

    if (!open) return null

    const handleFileSelection = (file?: File) => {
        if (!file) return
        setValue("image", file, { shouldValidate: true })
        clearErrors("image")
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
        const droppedFile = e.dataTransfer.files?.[0]
        if (droppedFile) {
            handleFileSelection(droppedFile)
        }
    }

    const handleRemoveImage = () => {
        setValue("image", null, { shouldValidate: true })
        setPreviewUrl(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleAutoGenerateSlug = () => {
        if (!currentName) return
        setValue("slug", slugify(currentName), { shouldValidate: true })
    }

    const onSubmit = async (values: CreateCategoryFormValues) => {
        try {
            const formData = new FormData()
            formData.append("name", values.name.trim())

            const cleanSlug = values.slug?.trim() || slugify(values.name)
            if (cleanSlug) {
                formData.append("slug", cleanSlug)
            }

            if (values.description?.trim()) {
                formData.append("description", values.description.trim())
            }

            formData.append("status", values.status)

            if (values.image instanceof File) {
                formData.append("image", values.image)
            }

            const response = await createCategory(formData).unwrap()
            toast.success(response.message || "Category created successfully")
            onClose()
        } catch (err: unknown) {
            const errorObj = err as { data?: { message?: string } }
            toast.error(errorObj?.data?.message || "Failed to create category")
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
                onClick={!isLoading ? onClose : undefined}
            />

            {/* Modal Dialog */}
            <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
                    <div>
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-600/20">
                            Curation
                        </span>
                        <h2 className="mt-1.5 text-lg font-semibold text-slate-900">
                            Create venue category
                        </h2>
                        <p className="text-xs text-slate-500">
                            Add a classification for venues such as Banquet Halls, Villas, or Resorts.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                        aria-label="Close dialog"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form
                    id="create-category-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex-1 space-y-5 overflow-y-auto px-6 py-5 text-sm"
                >
                    {/* Cover Image Upload Area */}
                    <div>
                        <div className="flex items-center justify-between pb-1.5">
                            <label className="text-xs font-semibold text-slate-800">
                                Cover photograph <span className="text-rose-500">*</span>
                            </label>
                            <span className="text-[11px] text-slate-400">
                                JPG, PNG, WEBP (Max 5MB)
                            </span>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleFileSelection(file)
                            }}
                        />

                        {previewUrl && selectedFile ? (
                            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-900/5">
                                <div className="aspect-[16/7] w-full overflow-hidden">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-200/80 bg-white/95 px-4 py-2.5 backdrop-blur-sm">
                                    <div className="min-w-0 pr-3">
                                        <p className="truncate text-xs font-medium text-slate-800">
                                            {selectedFile.name}
                                        </p>
                                        <p className="text-[11px] text-slate-500">
                                            {formatFileSize(selectedFile.size)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                                        >
                                            Change
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="rounded-lg border border-rose-200 bg-rose-50 p-1 text-rose-600 transition hover:bg-rose-100"
                                            title="Remove photo"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault()
                                    setIsDragging(true)
                                }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-all ${
                                    isDragging
                                        ? "border-amber-500 bg-amber-50/50"
                                        : errors.image
                                          ? "border-rose-300 bg-rose-50/30"
                                          : "border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-50"
                                }`}
                            >
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5">
                                    {isDragging ? (
                                        <UploadCloud className="h-5 w-5 text-amber-600 animate-bounce" />
                                    ) : (
                                        <ImagePlus className="h-5 w-5 text-slate-400" />
                                    )}
                                </div>
                                <p className="mt-3 text-xs font-semibold text-slate-700">
                                    Drag and drop your category banner here, or{" "}
                                    <span className="text-amber-700 underline underline-offset-2">
                                        browse files
                                    </span>
                                </p>
                                <p className="mt-1 text-[11px] text-slate-400">
                                    High-resolution landscapes work best for showcase cards
                                </p>
                            </div>
                        )}

                        {errors.image && (
                            <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600">
                                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                                <span>{errors.image.message as string}</span>
                            </p>
                        )}
                    </div>

                    {/* Name & Slug Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Name Input */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-800">
                                Category name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                {...register("name")}
                                type="text"
                                placeholder="e.g. Royal Banquet Hall"
                                className={`mt-1.5 w-full rounded-lg border px-3 py-2 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition outline-none ${
                                    errors.name
                                        ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                                        : "border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                }`}
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-rose-600">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Slug Input */}
                        <div>
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-semibold text-slate-800">
                                    URL slug
                                </label>
                                {currentName && (
                                    <button
                                        type="button"
                                        onClick={handleAutoGenerateSlug}
                                        className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 hover:text-amber-800"
                                    >
                                        <Sparkles className="h-3 w-3" />
                                        Generate
                                    </button>
                                )}
                            </div>
                            <input
                                {...register("slug")}
                                type="text"
                                placeholder="e.g. royal-banquet-hall"
                                className={`mt-1.5 w-full rounded-lg border px-3 py-2 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition outline-none font-mono text-xs ${
                                    errors.slug
                                        ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                                        : "border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                }`}
                            />
                            {errors.slug && (
                                <p className="mt-1 text-xs text-rose-600">
                                    {errors.slug.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Description Textarea */}
                    <div>
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold text-slate-800">
                                Description
                            </label>
                            <span className="text-[11px] text-slate-400">
                                Optional summary for catalog search
                            </span>
                        </div>
                        <textarea
                            {...register("description")}
                            rows={3}
                            placeholder="Grand spaces suitable for receptions, weddings, and formal banquets with seating for 300+ guests..."
                            className={`mt-1.5 w-full rounded-lg border px-3 py-2 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition outline-none ${
                                errors.description
                                    ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                                    : "border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                            }`}
                        />
                        {errors.description && (
                            <p className="mt-1 text-xs text-rose-600">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Status Segmented Control */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-800">
                            Listing status
                        </label>
                        <div className="mt-1.5 grid grid-cols-2 gap-2.5">
                            <button
                                type="button"
                                onClick={() => setValue("status", "active")}
                                className={`flex items-center justify-between rounded-lg border p-3 text-left transition ${
                                    currentStatus === "active"
                                        ? "border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600"
                                        : "border-slate-200 bg-white hover:bg-slate-50"
                                }`}
                            >
                                <div>
                                    <div className="flex items-center gap-1.5 font-medium text-slate-900">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                        Active
                                    </div>
                                    <p className="mt-0.5 text-[11px] text-slate-500">
                                        Visible in filters and venue listings
                                    </p>
                                </div>
                                {currentStatus === "active" && (
                                    <Check className="h-4 w-4 text-emerald-600" />
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => setValue("status", "inactive")}
                                className={`flex items-center justify-between rounded-lg border p-3 text-left transition ${
                                    currentStatus === "inactive"
                                        ? "border-slate-600 bg-slate-100 ring-1 ring-slate-600"
                                        : "border-slate-200 bg-white hover:bg-slate-50"
                                }`}
                            >
                                <div>
                                    <div className="flex items-center gap-1.5 font-medium text-slate-900">
                                        <span className="h-2 w-2 rounded-full bg-slate-400" />
                                        Inactive
                                    </div>
                                    <p className="mt-0.5 text-[11px] text-slate-500">
                                        Hidden from customer discovery
                                    </p>
                                </div>
                                {currentStatus === "inactive" && (
                                    <Check className="h-4 w-4 text-slate-700" />
                                )}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Footer Controls */}
                <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="create-category-form"
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-700 focus:ring-2 focus:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                        style={{ backgroundColor: "#C9A84C" }}
                    >
                        {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        {isLoading ? "Uploading & creating..." : "Create Category"}
                    </button>
                </div>
            </div>
        </div>
    )
}
