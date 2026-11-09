"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Upload,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Category, CategoryStatus } from "../types/category.types";
import { useCreateCategory, useUpdateCategory } from "../hooks/useCategories";

interface CategoryFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: Category | null;
}

const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

interface CategoryDrawerFormProps {
  categoryToEdit?: Category | null;
  onClose: () => void;
}

function CategoryDrawerForm({
  categoryToEdit,
  onClose,
}: CategoryDrawerFormProps) {
  const isEditing = Boolean(categoryToEdit);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialized directly with props (remounted by key when category changes)
  const [name, setName] = useState(categoryToEdit?.name || "");
  const [slug, setSlug] = useState(categoryToEdit?.slug || "");
  const [isSlugCustom, setIsSlugCustom] = useState(Boolean(categoryToEdit?.slug));
  const [description, setDescription] = useState(
    categoryToEdit?.description || ""
  );
  const [status, setStatus] = useState<CategoryStatus>(
    categoryToEdit?.status || "active"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    categoryToEdit?.image || null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  // Auto slug generation from name if not custom
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isSlugCustom) {
      setSlug(slugify(val));
    }
  };

  const handleSlugRegenerate = () => {
    setSlug(slugify(name));
    setIsSlugCustom(false);
  };

  // Image file select handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please select a valid image file (JPEG, PNG, WebP)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Image file size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage("Category name must be at least 2 characters");
      return;
    }

    if (!isEditing && !selectedFile) {
      setErrorMessage("Please upload a cover image for this category");
      return;
    }

    const formData = new FormData();
    formData.append("name", trimmedName);
    if (slug.trim()) {
      formData.append("slug", slugify(slug));
    }
    formData.append("description", description.trim());
    formData.append("status", status);

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      if (isEditing && categoryToEdit) {
        await updateMutation.mutateAsync({
          id: categoryToEdit._id,
          formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onClose();
    } catch (err: unknown) {
      const errObj = err as { message?: string; errors?: Array<{ message: string }> };
      const msg =
        errObj?.errors?.[0]?.message ||
        errObj?.message ||
        "Failed to save category. Please try again.";
      setErrorMessage(msg);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col justify-between overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Error Message */}
        {errorMessage && (
          <div className="flex items-start gap-2.5 rounded-lg border border-[#3b1d1d] bg-[#1a0c0c] p-3 text-xs text-[#D16B6B]">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* 1. Cover Image Dropzone */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#F5F2EB] flex items-center justify-between">
            <span>Cover Image</span>
            <span className="text-[11px] font-normal text-[#777777]">
              {isEditing ? "Optional replacement" : "Required · JPG, PNG, WebP"}
            </span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {previewUrl ? (
            <div className="group relative overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#141414] aspect-video w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Category Preview"
                className="h-full w-full object-cover transition-transform group-hover:scale-102 duration-300"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg bg-[#222222] border border-[#3a3a3a] px-3 py-1.5 text-xs font-medium text-[#F5F2EB] hover:border-[#D6B77A] transition-colors"
                >
                  Change Photo
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#262626] bg-[#0f0f0f] py-8 px-4 cursor-pointer hover:border-[#D6B77A]/50 hover:bg-[#141414] transition-all"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#171717] border border-[#2a2a2a] text-[#D6B77A] group-hover:scale-105 transition-transform">
                <Upload className="h-5 w-5" />
              </div>
              <p className="mt-3 text-xs font-medium text-[#F5F2EB]">
                Click to browse or drop category photo
              </p>
              <p className="mt-1 text-[11px] text-[#666666]">
                High-resolution landscape banner (up to 5MB)
              </p>
            </div>
          )}
        </div>

        {/* 2. Category Name */}
        <div className="space-y-1.5">
          <label htmlFor="cat-name" className="text-xs font-semibold text-[#F5F2EB]">
            Category Name <span className="text-[#D6B77A]">*</span>
          </label>
          <input
            id="cat-name"
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Heritage Palaces & Havelis"
            required
            maxLength={80}
            className="h-10 w-full rounded-lg border border-[#222222] bg-[#111111] px-3.5 text-xs text-[#F5F2EB] placeholder-[#666666] outline-none transition-colors focus:border-[#D6B77A]/50 focus:ring-1 focus:ring-[#D6B77A]/30"
          />
        </div>

        {/* 3. URL Slug */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="cat-slug" className="text-xs font-semibold text-[#F5F2EB]">
              Taxonomy Slug
            </label>
            <button
              type="button"
              onClick={handleSlugRegenerate}
              className="flex items-center gap-1 text-[11px] text-[#D6B77A] hover:underline"
              title="Regenerate slug from current name"
            >
              <RefreshCw className="h-2.5 w-2.5" />
              <span>Sync from name</span>
            </button>
          </div>
          <div className="flex items-center rounded-lg border border-[#222222] bg-[#111111] px-3 text-xs text-[#666666]">
            <span className="font-mono text-[11px] select-none text-[#555555]">/category/</span>
            <input
              id="cat-slug"
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setIsSlugCustom(true);
              }}
              placeholder="heritage-palaces"
              className="h-9 w-full bg-transparent pl-1 font-mono text-xs text-[#D6B77A] outline-none placeholder-[#555555]"
            />
          </div>
        </div>

        {/* 4. Description */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="cat-desc" className="text-xs font-semibold text-[#F5F2EB]">
              Description
            </label>
            <span className="text-[10px] text-[#666666] tabular-nums">
              {description.length}/1000
            </span>
          </div>
          <textarea
            id="cat-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            placeholder="Briefly describe this venue occasion type and characteristics..."
            className="w-full rounded-lg border border-[#222222] bg-[#111111] p-3 text-xs text-[#F5F2EB] placeholder-[#666666] outline-none transition-colors focus:border-[#D6B77A]/50 focus:ring-1 focus:ring-[#D6B77A]/30 resize-none"
          />
        </div>

        {/* 5. Status Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#F5F2EB]">
            Publication Status
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <div
              onClick={() => setStatus("active")}
              className={`flex items-center gap-2.5 rounded-lg border p-3 cursor-pointer transition-all ${
                status === "active"
                  ? "border-[#65A982]/40 bg-[#65A982]/10 text-[#F5F2EB]"
                  : "border-[#222222] bg-[#111111] text-[#777777] hover:border-[#333333]"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-[#65A982]" />
              <div>
                <p className="text-xs font-semibold">Active</p>
                <p className="text-[10px] opacity-75">Live in guest catalog</p>
              </div>
            </div>

            <div
              onClick={() => setStatus("inactive")}
              className={`flex items-center gap-2.5 rounded-lg border p-3 cursor-pointer transition-all ${
                status === "inactive"
                  ? "border-[#D6B77A]/40 bg-[#D6B77A]/10 text-[#F5F2EB]"
                  : "border-[#222222] bg-[#111111] text-[#777777] hover:border-[#333333]"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-[#888888]" />
              <div>
                <p className="text-xs font-semibold">Inactive</p>
                <p className="text-[10px] opacity-75">Draft / Hidden</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Footer Actions */}
      <div className="sticky bottom-0 border-t border-[#1a1a1a] bg-[#0c0c0c] p-5 flex items-center justify-end gap-2.5 select-none">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="rounded-lg border border-[#262626] bg-[#141414] px-4 py-2 text-xs font-medium text-[#A3A3A3] hover:border-[#383838] hover:text-[#F5F2EB] transition-colors disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-lg bg-[#D6B77A] px-5 py-2 text-xs font-semibold text-[#111111] hover:bg-[#e0c58e] transition-colors disabled:opacity-50 shadow-xs"
        >
          {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          <span>
            {isPending
              ? "Saving..."
              : isEditing
              ? "Update Category"
              : "Create Category"}
          </span>
        </button>
      </div>
    </form>
  );
}

export function CategoryFormDrawer({
  isOpen,
  onClose,
  categoryToEdit,
}: CategoryFormDrawerProps) {
  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/75 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md sm:max-w-lg flex-col bg-[#0c0c0c] border-l border-[#222222] text-[#F5F2EB] shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex h-16 items-center justify-between border-b border-[#1a1a1a] px-6 select-none">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold tracking-tight text-[#F5F2EB]">
              {categoryToEdit ? "Edit Category" : "New Category"}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#777777] hover:bg-[#161616] hover:text-[#F5F2EB] transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Form - Remounts automatically when target category changes */}
        <CategoryDrawerForm
          key={categoryToEdit?._id || "new-category"}
          categoryToEdit={categoryToEdit}
          onClose={onClose}
        />
      </div>
    </>
  );
}
