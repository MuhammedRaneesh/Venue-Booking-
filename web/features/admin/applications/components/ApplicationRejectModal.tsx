"use client";

import { useState } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { OwnerApplication } from "../types/application.types";

interface ApplicationRejectModalProps {
  application: OwnerApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReject: (application: OwnerApplication, reason: string) => Promise<void>;
  isLoading: boolean;
}

const COMMON_REASONS = [
  "Incomplete or unverified physical business address",
  "Invalid or mismatching GSTIN credentials",
  "Unreachable on provided phone number during verification check",
  "Business or space listing does not comply with Venuo hosting standards",
];

export function ApplicationRejectModal({
  application,
  isOpen,
  onClose,
  onConfirmReject,
  isLoading,
}: ApplicationRejectModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !application) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide a reason for rejecting this application.");
      return;
    }

    try {
      setError(null);
      await onConfirmReject(application, reason.trim());
      setReason("");
      onClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while rejecting.";
      setError(message);
    }
  };

  const handleSelectPreset = (preset: string) => {
    setReason(preset);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (!isLoading) onClose();
        }}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#381f1f] bg-[#0c0c0c] text-[#F5F2EB] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1a1a1a] px-6 py-4 bg-[#140b0b]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D16B6B]/30 bg-[#251212] text-[#D16B6B]">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#F5F2EB]">
                Reject Host Application
              </h3>
              <p className="text-xs text-[#888888]">
                {application.businessName} • {application.user?.fullName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-1.5 text-[#666666] hover:bg-[#1a1a1a] hover:text-[#F5F2EB] disabled:opacity-50 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-[#A3A3A3] leading-relaxed">
            Please provide an explanation for rejecting this host application. The applicant will be notified with these details so they can make required corrections.
          </p>

          {/* Quick Reason Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-[#777777]">
              Quick Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_REASONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  disabled={isLoading}
                  className="rounded-md border border-[#262626] bg-[#141414] px-2.5 py-1 text-[11px] text-[#A3A3A3] hover:border-[#D6B77A]/40 hover:text-[#F5F2EB] transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Reason Textarea */}
          <div className="space-y-1.5">
            <label
              htmlFor="rejectionReason"
              className="text-xs font-medium text-[#F5F2EB]"
            >
              Rejection Notice <span className="text-[#D16B6B]">*</span>
            </label>
            <textarea
              id="rejectionReason"
              rows={4}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Explain the specific reason for rejecting this application..."
              disabled={isLoading}
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#141414] p-3 text-xs text-[#F5F2EB] placeholder:text-[#555555] focus:border-[#D16B6B] focus:outline-none focus:ring-1 focus:ring-[#D16B6B]/40 transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-[#D16B6B] bg-[#1f0f0f] border border-[#3b1818] p-2.5 rounded-lg">
              {error}
            </p>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 border-t border-[#1a1a1a] pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg border border-[#262626] bg-[#141414] px-4 py-2 text-xs font-medium text-[#A3A3A3] hover:bg-[#1a1a1a] hover:text-[#F5F2EB] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading || !reason.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#D16B6B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#b85a5a] transition-colors disabled:opacity-50 shadow-xs"
            >
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Confirm Rejection</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

