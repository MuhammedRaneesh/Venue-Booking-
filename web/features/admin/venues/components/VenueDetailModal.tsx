"use client";

import { useState } from "react";
import {
  X,
  Building2,
  MapPin,
  Users,
  IndianRupee,
  Clock,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ImageIcon,
  Sparkles,
  Power,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { AdminVenue, VenueStatus } from "../types/venue.types";

interface VenueDetailModalProps {
  venue: AdminVenue | null;
  onClose: () => void;
  onApprove: (venue: AdminVenue) => void;
  onReject: (venue: AdminVenue) => void;
  onToggleActive: (venue: AdminVenue) => void;
  isActionPending?: boolean;
}

export function VenueDetailModal({
  venue,
  onClose,
  onApprove,
  onReject,
  onToggleActive,
  isActionPending,
}: VenueDetailModalProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  if (!venue) return null;

  const photos = venue.photos || [];
  const activePhoto = photos[selectedPhotoIndex] || photos[0];
  const address = venue.location?.address;
  const owner = venue.owner;
  const status = venue.status;
  const isApproved = status === "approved";
  const isPending = status === "pending";
  const isRejected = status === "rejected";

  const getStatusBadge = (s: VenueStatus | string) => {
    switch (s) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-[#65A982]/30 bg-[#65A982]/10 px-2.5 py-0.5 text-xs font-medium text-[#65A982]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-[#D16B6B]/30 bg-[#D16B6B]/10 px-2.5 py-0.5 text-xs font-medium text-[#D16B6B]">
            <XCircle className="h-3.5 w-3.5" />
            Rejected
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-2.5 py-0.5 text-xs font-medium text-[#A78BFA]">
            <AlertTriangle className="h-3.5 w-3.5" />
            Suspended
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-[#D9A441]/35 bg-[#D9A441]/10 px-2.5 py-0.5 text-xs font-medium text-[#D9A441]">
            <Clock className="h-3.5 w-3.5 animate-pulse" />
            Pending Approval
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-[#222222] bg-[#0c0c0c] text-[#F5F2EB] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1a1a1a] px-6 py-4 bg-[#0e0e0e] shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D6B77A]/20 bg-[#161616] text-[#D6B77A]">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold text-[#F5F2EB]">
                  {venue.venueName}
                </h2>
                <span className="rounded bg-[#1a1a1a] px-2 py-0.5 text-[10px] font-medium text-[#D6B77A]">
                  {venue.category}
                </span>
              </div>
              <p className="text-xs text-[#777777]">
                Full moderation dossier and property profile
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {getStatusBadge(status)}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-[#888888] hover:bg-[#1a1a1a] hover:text-[#F5F2EB] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
          {/* Rejection Memo if rejected */}
          {isRejected && venue.rejectionReason && (
            <div className="rounded-xl border border-[#D16B6B]/30 bg-[#D16B6B]/10 p-3.5 text-[#F5F2EB]">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-[#D16B6B] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-xs text-[#D16B6B]">
                    Rejection Notice Recorded
                  </h4>
                  <p className="mt-1 text-xs text-[#CCCCCC] leading-relaxed">
                    &ldquo;{venue.rejectionReason}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Photo Gallery Hero */}
          {photos.length > 0 ? (
            <div className="space-y-2">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#1f1f1f] bg-[#141414]">
                <img
                  src={activePhoto}
                  alt={`${venue.venueName} preview`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-1 text-[10px] font-medium text-[#E5E5E5] backdrop-blur-xs">
                  {selectedPhotoIndex + 1} / {photos.length} photos
                </div>
              </div>

              {photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {photos.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border transition-all ${
                        selectedPhotoIndex === idx
                          ? "border-[#D6B77A] ring-1 ring-[#D6B77A]"
                          : "border-[#1f1f1f] opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-36 items-center justify-center rounded-xl border border-dashed border-[#262626] bg-[#121212] text-[#666666]">
              <div className="flex flex-col items-center gap-1.5">
                <ImageIcon className="h-6 w-6" />
                <span>No property photos uploaded</span>
              </div>
            </div>
          )}

          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-[#1a1a1a] bg-[#121212] p-3">
              <span className="text-[11px] text-[#737373]">Maximum Capacity</span>
              <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[#F5F2EB]">
                <Users className="h-4 w-4 text-[#D6B77A]" />
                <span>{venue.capacity?.toLocaleString() || "—"} guests</span>
              </div>
            </div>

            <div className="rounded-xl border border-[#1a1a1a] bg-[#121212] p-3">
              <span className="text-[11px] text-[#737373]">Day Rate</span>
              <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-[#65A982] font-serif">
                <IndianRupee className="h-3.5 w-3.5" />
                <span>
                  {venue.pricing?.pricePerDay
                    ? `${venue.pricing.pricePerDay.toLocaleString()}`
                    : "Not set"}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-[#1a1a1a] bg-[#121212] p-3">
              <span className="text-[11px] text-[#737373]">Hourly Rate</span>
              <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-[#65A982] font-serif">
                <IndianRupee className="h-3.5 w-3.5" />
                <span>
                  {venue.pricing?.pricePerHour
                    ? `${venue.pricing.pricePerHour.toLocaleString()}`
                    : "Not set"}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-[#1a1a1a] bg-[#121212] p-3">
              <span className="text-[11px] text-[#737373]">Daily Schedule</span>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#F5F2EB]">
                <Clock className="h-3.5 w-3.5 text-[#D6B77A]" />
                <span>
                  {venue.availability?.openTime && venue.availability?.closeTime
                    ? `${venue.availability.openTime} – ${venue.availability.closeTime}`
                    : "Flexible"}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {venue.description && (
            <div className="rounded-xl border border-[#1a1a1a] bg-[#121212] p-4">
              <h3 className="text-xs font-semibold text-[#D6B77A] uppercase tracking-wider mb-2">
                Property Overview & Details
              </h3>
              <p className="text-xs text-[#CCCCCC] leading-relaxed whitespace-pre-line">
                {venue.description}
              </p>
            </div>
          )}

          {/* Location & Address */}
          <div className="rounded-xl border border-[#1a1a1a] bg-[#121212] p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-[#D6B77A] uppercase tracking-wider">
                Physical Location
              </h3>
              {venue.location?.coordinates && (
                <span className="text-[11px] text-[#777777]">
                  Coordinates: {venue.location.coordinates[1]?.toFixed(4)},{" "}
                  {venue.location.coordinates[0]?.toFixed(4)}
                </span>
              )}
            </div>
            <div className="flex items-start gap-2 text-xs text-[#E5E5E5]">
              <MapPin className="h-4 w-4 text-[#D6B77A] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#F5F2EB]">{address?.place}</p>
                <p className="text-[#888888] mt-0.5">
                  {address?.city}, {address?.district}, {address?.state} —{" "}
                  {address?.pincode}
                </p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          {venue.amenities && venue.amenities.length > 0 && (
            <div className="rounded-xl border border-[#1a1a1a] bg-[#121212] p-4">
              <h3 className="text-xs font-semibold text-[#D6B77A] uppercase tracking-wider mb-2.5">
                Features & Amenities ({venue.amenities.length})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {venue.amenities.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#262626] bg-black px-2.5 py-1 text-[11px] text-[#D4D4D4]"
                  >
                    <Sparkles className="h-3 w-3 text-[#D6B77A]" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Host Profile */}
          <div className="rounded-xl border border-[#1a1a1a] bg-[#121212] p-4">
            <h3 className="text-xs font-semibold text-[#D6B77A] uppercase tracking-wider mb-3">
              Venue Host / Partner
            </h3>
            <div className="flex items-center gap-3">
              {owner?.profileImage ? (
                <img
                  src={owner.profileImage}
                  alt={owner.fullName || "Owner"}
                  className="h-10 w-10 rounded-full object-cover border border-[#2a2a2a]"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1c1c1c] text-xs font-bold text-[#D6B77A]">
                  {(owner?.fullName || owner?.email || "H")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#F5F2EB]">
                  {owner?.fullName || "Venue Host"}
                </p>
                <div className="mt-1 flex flex-wrap gap-3 text-xs text-[#888888]">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-[#666666]" />
                    {owner?.email || "No email"}
                  </span>
                  {owner?.phoneNumber && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-[#666666]" />
                      {owner.phoneNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#1a1a1a] bg-[#0e0e0e] px-6 py-4 shrink-0">
          {/* Active status button */}
          <button
            type="button"
            disabled={isActionPending}
            onClick={() => onToggleActive(venue)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              venue.isActive
                ? "bg-[#65A982]/10 border-[#65A982]/30 text-[#65A982] hover:bg-[#65A982]/20"
                : "bg-[#1f1f1f] border-[#333333] text-[#737373] hover:text-[#A3A3A3]"
            }`}
          >
            <Power className="h-3.5 w-3.5" />
            <span>Listing is {venue.isActive ? "Active" : "Deactivated"}</span>
          </button>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {!isApproved && (
              <button
                type="button"
                disabled={isActionPending}
                onClick={() => onApprove(venue)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#65A982]/40 bg-[#65A982] px-4 py-2 text-xs font-medium text-white hover:bg-[#528a6a] disabled:opacity-50 transition-colors shadow-lg shadow-[#65A982]/20 cursor-pointer"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Approve Listing</span>
              </button>
            )}

            {!isRejected && (
              <button
                type="button"
                disabled={isActionPending}
                onClick={() => onReject(venue)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#D16B6B]/40 bg-[#D16B6B]/15 px-4 py-2 text-xs font-medium text-[#D16B6B] hover:bg-[#D16B6B]/25 disabled:opacity-50 transition-colors cursor-pointer"
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>Reject Listing</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#262626] bg-[#141414] px-4 py-2 text-xs font-medium text-[#CCCCCC] hover:bg-[#1a1a1a] hover:text-[#F5F2EB] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

