"use client";

import {
  X,
  Building2,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { OwnerApplication } from "../types/application.types";

interface ApplicationDetailModalProps {
  application: OwnerApplication | null;
  onClose: () => void;
  onApprove: (application: OwnerApplication) => void;
  onReject: (application: OwnerApplication) => void;
  isActionPending?: boolean;
}

export function ApplicationDetailModal({
  application,
  onClose,
  onApprove,
  onReject,
  isActionPending,
}: ApplicationDetailModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!application) return null;

  const hostUser = application.user;
  const status = hostUser?.ownerStatus || "PENDING";
  const isPending = status === "PENDING";
  const isApproved = status === "APPROVED";
  const isRejected = status === "REJECTED";

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
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
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[#222222] bg-[#0c0c0c] text-[#F5F2EB] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1a1a1a] px-6 py-4 bg-[#0e0e0e]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D6B77A]/20 bg-[#161616] text-[#D6B77A]">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#F5F2EB]">
                Host Dossier
              </h2>
              <p className="text-xs text-[#777777]">
                KYC and business registration verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Badge */}
            {isApproved && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#65A982]/30 bg-[#65A982]/10 px-2.5 py-0.5 text-xs font-medium text-[#65A982]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Approved Host
              </span>
            )}
            {isRejected && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#D16B6B]/30 bg-[#D16B6B]/10 px-2.5 py-0.5 text-xs font-medium text-[#D16B6B]">
                <XCircle className="h-3.5 w-3.5" />
                Rejected
              </span>
            )}
            {isPending && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#D9A441]/30 bg-[#D9A441]/10 px-2.5 py-0.5 text-xs font-medium text-[#D9A441]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#D9A441]" />
                Pending Review
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#666666] hover:bg-[#1a1a1a] hover:text-[#F5F2EB] transition-colors ml-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6 scrollbar-thin">
          {/* 1. Host Profile Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-[#1a1a1a] bg-[#121212] p-4">
            <div className="flex items-center gap-3.5">
              {hostUser?.profileImage || application.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={hostUser?.profileImage || application.profileImage}
                  alt={hostUser?.fullName || application.businessName}
                  className="h-14 w-14 rounded-full border border-[#262626] object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#D6B77A]/25 bg-[#171717] text-base font-bold text-[#D6B77A]">
                  {application.businessName?.slice(0, 2).toUpperCase() || "VN"}
                </div>
              )}

              <div>
                <h3 className="font-semibold text-base text-[#F5F2EB]">
                  {application.businessName}
                </h3>
                <p className="text-xs text-[#A3A3A3]">
                  Applicant: <span className="text-[#F5F2EB] font-medium">{hostUser?.fullName}</span>
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-[#777777]">
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-3 w-3 text-[#555555]" />
                    {hostUser?.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end gap-1.5 text-[11px] text-[#777777] self-stretch sm:self-auto justify-between border-t sm:border-t-0 border-[#1a1a1a] pt-2 sm:pt-0">
              <span className="text-[#555555]">User ID:</span>
              <div className="flex items-center gap-1 font-mono text-[#A3A3A3]">
                <span>{hostUser?._id?.slice(0, 10)}...</span>
                <button
                  type="button"
                  onClick={() => handleCopy(hostUser?._id || "", "userId")}
                  className="text-[#666666] hover:text-[#F5F2EB]"
                  title="Copy User ID"
                >
                  {copiedKey === "userId" ? (
                    <Check className="h-3 w-3 text-[#65A982]" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 2. Business Entity & Tax Identity */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#777777]">
              Commercial Entity & Tax Info
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Business Trade Name */}
              <div className="rounded-xl border border-[#1a1a1a] bg-[#121212] p-3.5 space-y-1">
                <span className="text-[11px] text-[#666666]">Registered Trade Name</span>
                <p className="text-sm font-medium text-[#F5F2EB]">
                  {application.businessName}
                </p>
              </div>

              {/* GST Number */}
              <div className="rounded-xl border border-[#1a1a1a] bg-[#121212] p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#666666]">GSTIN / Registration No.</span>
                  {application.gstNumber && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        application.gstNumber.length === 15
                          ? "bg-[#65A982]/10 text-[#65A982] border-[#65A982]/25"
                          : "bg-[#D9A441]/10 text-[#D9A441] border-[#D9A441]/25"
                      }`}
                    >
                      {application.gstNumber.length === 15
                        ? "15-character format"
                        : `${application.gstNumber.length}/15 chars`}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-medium text-[#D6B77A] tracking-wider uppercase">
                    {application.gstNumber || "Not Provided"}
                  </span>
                  {application.gstNumber && (
                    <button
                      type="button"
                      onClick={() => handleCopy(application.gstNumber!, "gst")}
                      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-[#888888] hover:bg-[#1a1a1a] hover:text-[#F5F2EB]"
                    >
                      {copiedKey === "gst" ? (
                        <Check className="h-3 w-3 text-[#65A982]" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>Copy</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Location and Address */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#777777]">
              Premises Location & Operating Address
            </h4>

            <div className="rounded-xl border border-[#1a1a1a] bg-[#121212] p-4 space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#D6B77A] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs text-[#F5F2EB] leading-relaxed">
                    {application.address}
                  </p>
                  <p className="text-xs text-[#888888]">
                    {application.city}, {application.state} —{" "}
                    <span className="font-mono font-medium text-[#A3A3A3]">
                      PIN: {application.pincode}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 border-t border-[#1a1a1a] pt-3 text-xs text-[#A3A3A3]">
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#666666]" />
                  <a
                    href={`tel:${application.phone}`}
                    className="hover:text-[#D6B77A] font-mono transition-colors"
                  >
                    {application.phone}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(application.phone, "phone")}
                    className="text-[#666666] hover:text-[#F5F2EB] ml-1"
                    title="Copy Phone"
                  >
                    {copiedKey === "phone" ? (
                      <Check className="h-3 w-3 text-[#65A982]" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-[#666666]" />
                  <a
                    href={`mailto:${hostUser?.email}`}
                    className="hover:text-[#D6B77A] transition-colors"
                  >
                    {hostUser?.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Verification History / Rejection Notice */}
          {application.rejectionReason && (
            <div className="rounded-xl border border-[#D16B6B]/30 bg-[#140b0b] p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#D16B6B]">
                <AlertCircle className="h-4 w-4" />
                <span>Previous Rejection Reason</span>
              </div>
              <p className="text-xs text-[#E5B5B5] leading-relaxed pl-6">
                &ldquo;{application.rejectionReason}&rdquo;
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className="flex flex-wrap items-center justify-between text-[11px] text-[#666666] border-t border-[#161616] pt-3">
            <span>
              Submitted on:{" "}
              <span className="text-[#888888] tabular-nums">
                {application.createdAt
                  ? new Date(application.createdAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "—"}
              </span>
            </span>
            <span>
              Account Role:{" "}
              <span className="text-[#A3A3A3] font-medium capitalize">
                {hostUser?.role?.replace("_", " ")}
              </span>
            </span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between border-t border-[#1a1a1a] bg-[#0e0e0e] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#262626] bg-[#141414] px-4 py-2 text-xs font-medium text-[#A3A3A3] hover:text-[#F5F2EB] hover:bg-[#1a1a1a] transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2.5">
            {/* If pending or rejected: can approve */}
            {(isPending || isRejected) && (
              <button
                type="button"
                onClick={() => onApprove(application)}
                disabled={isActionPending}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#D6B77A] px-4 py-2 text-xs font-semibold text-[#111111] hover:bg-[#e0c58e] transition-colors disabled:opacity-50 shadow-xs"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  {isRejected ? "Re-evaluate & Approve" : "Approve as Host"}
                </span>
              </button>
            )}

            {/* If pending: can reject */}
            {isPending && (
              <button
                type="button"
                onClick={() => onReject(application)}
                disabled={isActionPending}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#D16B6B]/40 bg-[#1a0f0f] px-4 py-2 text-xs font-medium text-[#D16B6B] hover:bg-[#D16B6B]/20 transition-colors disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                <span>Reject Application</span>
              </button>
            )}

            {isApproved && (
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#65A982]">
                <ShieldCheck className="h-4 w-4" />
                <span>Host account is fully active</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
