"use client";

import { useState } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { AdminVenue } from "../types/venue.types";

interface VenueRejectModalProps {
  venue: AdminVenue | null;
  onClose: () => void;
  onConfirmReject: (venue: AdminVenue, reason: string) => Promise<void>;
  isActionPending?: boolean;
}

const COMMON_REJECTION_REASONS = [
  "Incomplete or blurry property photos",
  "Incorrect or unverifiable physical address",
  "Pricing or capacity details inconsistent with property type",
  "Missing required fire safety or commercial operation licenses",
  "Duplicate venue listing already present in catalog",
  "Violation of platform quality or safety guidelines",
];

export function VenueRejectModal({
  venue,
  onClose,
  onConfirmReject,
  isActionPending,
}: VenueRejectModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!venue) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = (customReason || selectedPreset).trim();

    if (!finalReason) {
      setValidationError("Please specify a rejection reason for the host.");
      return;
    }

    setValidationError(null);
    await onConfirmReject(venue, finalReason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#222222] bg-[#0c0c0c] text-[#F5F2EB] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1a1a1a] px-6 py-4 bg-[#0e0e0e]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D16B6B]/20 bg-[#161010] text-[#D16B6B]">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#F5F2EB]">
                Reject Venue Listing
              </h2>
              <p className="text-xs text-[#777777]">
                Provide an official explanation for the venue host
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#888888] hover:bg-[#1a1a1a] hover:text-[#F5F2EB] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="rounded-xl border border-[#1f1f1f] bg-[#121212] p-3 text-xs">
            <p className="text-[#888888]">
              Target property:{" "}
              <strong className="text-[#F5F2EB]">{venue.venueName}</strong>
            </p>
            <p className="text-[#777777] mt-0.5">
              Host: {venue.owner?.fullName || "Host"} ({venue.owner?.email})
            </p>
          </div>

          {/* Quick presets */}
          <div>
            <label className="block text-xs font-medium text-[#CCCCCC] mb-1.5">
              Common Grounds for Rejection
            </label>
            <div className="space-y-1.5">
              {COMMON_REJECTION_REASONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setSelectedPreset(preset);
                    setCustomReason(preset);
                    setValidationError(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs border transition-colors ${
                    selectedPreset === preset
                      ? "border-[#D16B6B]/50 bg-[#D16B6B]/10 text-[#F5F2EB]"
                      : "border-[#1f1f1f] bg-[#111111] text-[#999999] hover:border-[#2f2f2f] hover:text-[#CCCCCC]"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Reason textarea */}
          <div>
            <label
              htmlFor="rejection-reason"
              className="block text-xs font-medium text-[#CCCCCC] mb-1.5"
            >
              Rejection Memo / Instructions for Host{" "}
              <span className="text-[#D16B6B]">*</span>
            </label>
            <textarea
              id="rejection-reason"
              rows={3}
              value={customReason}
              onChange={(e) => {
                setCustomReason(e.target.value);
                setValidationError(null);
              }}
              placeholder="Detail specifically what needs to be fixed before re-submission..."
              className="w-full rounded-lg border border-[#1f1f1f] bg-black p-3 text-xs text-[#F5F2EB] placeholder-[#666666] outline-none transition-colors focus:border-[#D16B6B]/50 focus:ring-1 focus:ring-[#D16B6B]/30"
            />
          </div>

          {validationError && (
            <p className="text-xs text-[#D16B6B] font-medium">
              {validationError}
            </p>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#1a1a1a]">
            <button
              type="button"
              onClick={onClose}
              disabled={isActionPending}
              className="rounded-lg border border-[#262626] bg-[#141414] px-4 py-2 text-xs font-medium text-[#CCCCCC] hover:bg-[#1a1a1a] hover:text-[#F5F2EB] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isActionPending}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D16B6B]/50 bg-[#D16B6B] px-4 py-2 text-xs font-medium text-white hover:bg-[#b85858] disabled:opacity-50 transition-colors shadow-lg shadow-[#D16B6B]/20"
            >
              {isActionPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Rejecting...</span>
                </>
              ) : (
                <span>Confirm Rejection</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

