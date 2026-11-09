"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Category } from "../types/category.types";
import { useDeleteCategory } from "../hooks/useCategories";

interface CategoryDeleteDialogProps {
  category: Category | null;
  onClose: () => void;
}

export function CategoryDeleteDialog({
  category,
  onClose,
}: CategoryDeleteDialogProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const deleteMutation = useDeleteCategory();

  if (!category) return null;

  const handleDelete = async () => {
    setErrorMessage(null);
    try {
      await deleteMutation.mutateAsync(category._id);
      onClose();
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setErrorMessage(
        errObj?.message || "Failed to delete category. Venues may be linked."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#2e1d1d] bg-[#0e0a0a] text-[#F5F2EB] shadow-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D16B6B]/30 bg-[#D16B6B]/10 text-[#D16B6B]">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[#F5F2EB]">
              Delete Category
            </h3>
            <p className="text-xs text-[#888888]">
              Are you sure you want to delete this taxonomy?
            </p>
          </div>
        </div>

        <p className="text-xs text-[#A3A3A3] leading-relaxed">
          You are about to delete <strong className="text-[#F5F2EB]">&ldquo;{category.name}&rdquo;</strong>. 
          If any venue listings are currently assigned to this category, deletion will be blocked by the system to preserve catalog integrity.
        </p>

        {errorMessage && (
          <div className="rounded-lg border border-[#3b1d1d] bg-[#1a0c0c] p-3 text-xs text-[#D16B6B]">
            {errorMessage}
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="rounded-lg border border-[#262626] bg-[#141414] px-4 py-2 text-xs font-medium text-[#A3A3A3] hover:border-[#383838] hover:text-[#F5F2EB] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="flex items-center gap-1.5 rounded-lg border border-[#D16B6B]/40 bg-[#D16B6B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#b85353] transition-colors disabled:opacity-50 shadow-xs"
          >
            {deleteMutation.isPending && (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            )}
            <span>{deleteMutation.isPending ? "Deleting..." : "Delete"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

