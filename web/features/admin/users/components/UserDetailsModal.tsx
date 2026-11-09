"use client";

import { useState } from "react";
import {
  X,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Check,
  Copy,
  Building,
} from "lucide-react";
import { useUserDetails, useToggleUserStatus } from "../hooks/useUsers";

interface UserDetailsModalProps {
  userId: string | null;
  onClose: () => void;
}

export function UserDetailsModal({ userId, onClose }: UserDetailsModalProps) {
  const [copied, setCopied] = useState(false);
  const { data, isLoading, isError } = useUserDetails(userId || "");
  const toggleMutation = useToggleUserStatus();

  if (!userId) return null;

  const user = data?.user;

  const handleCopyId = () => {
    if (user?._id) {
      navigator.clipboard.writeText(user._id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggle = async () => {
    if (!user?._id) return;
    try {
      await toggleMutation.mutateAsync(user._id);
    } catch {
      // Ignored
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

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#222222] bg-[#0c0c0c] text-[#F5F2EB] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1a1a1a] px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-base font-bold text-[#F5F2EB]">
              Account Profile
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#666666] hover:bg-[#1a1a1a] hover:text-[#F5F2EB] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {isLoading ? (
            <div className="space-y-4 py-8">
              <div className="h-14 w-14 animate-pulse rounded-full bg-[#1a1a1a] mx-auto" />
              <div className="h-4 w-32 animate-pulse rounded bg-[#1a1a1a] mx-auto" />
              <div className="h-3 w-48 animate-pulse rounded bg-[#1a1a1a] mx-auto" />
            </div>
          ) : isError || !user ? (
            <div className="py-8 text-center text-xs text-[#D16B6B]">
              Failed to load profile details.
            </div>
          ) : (
            <>
              {/* Profile Bio */}
              <div className="flex items-center gap-4">
                {user.profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.profileImage}
                    alt={user.fullName}
                    className="h-14 w-14 rounded-full border border-[#2a2a2a] object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#D6B77A]/30 bg-[#141414] text-base font-bold text-[#D6B77A]">
                    {user.fullName?.slice(0, 2).toUpperCase() || "US"}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-serif text-lg font-bold text-[#F5F2EB]">
                      {user.fullName}
                    </h3>
                    {user.isVerified && (
                      <span title="Verified Account">
                        <ShieldCheck className="h-4 w-4 text-[#65A982] shrink-0" />
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-[#888888]">{user.email}</p>

                  <div className="mt-1.5 flex items-center gap-2">
                    <span
                      className={`inline-flex rounded border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
                        user.isActive
                          ? "bg-[#65A982]/10 text-[#65A982] border-[#65A982]/25"
                          : "bg-[#D16B6B]/10 text-[#D16B6B] border-[#D16B6B]/25"
                      }`}
                    >
                      {user.isActive ? "Active Account" : "Suspended"}
                    </span>

                    <span className="rounded border border-[#2a2a2a] bg-[#141414] px-2 py-0.5 text-[10px] font-medium text-[#A3A3A3]">
                      {user.role === "venue_owner" ? "Venue Owner" : "Customer"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* User ID */}
                <div className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-3 space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-[#666666] tracking-wider">
                    Member ID
                  </span>
                  <div className="flex items-center justify-between gap-1">
                    <span className="truncate font-mono text-[11px] text-[#A3A3A3]">
                      {user._id}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="rounded p-1 text-[#666666] hover:text-[#F5F2EB]"
                      title="Copy ID"
                    >
                      {copied ? (
                        <Check className="h-3 w-3 text-[#65A982]" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Contact Phone */}
                <div className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-3 space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-[#666666] tracking-wider flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-[#D6B77A]" /> Phone
                  </span>
                  <p className="truncate text-[11px] text-[#F5F2EB]">
                    {user.phoneNumber || "Not provided"}
                  </p>
                </div>

                {/* Email Address */}
                <div className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-3 space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-[#666666] tracking-wider flex items-center gap-1.5">
                    <Mail className="h-3 w-3 text-[#D6B77A]" /> Email
                  </span>
                  <p className="truncate text-[11px] text-[#F5F2EB]">
                    {user.email}
                  </p>
                </div>

                {/* Joined Date */}
                <div className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-3 space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-[#666666] tracking-wider flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-[#D6B77A]" /> Joined
                  </span>
                  <p className="truncate text-[11px] text-[#F5F2EB]">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                </div>

                {/* Venue Owner Status */}
                {user.ownerStatus && user.ownerStatus !== "NONE" && (
                  <div className="sm:col-span-2 rounded-xl border border-[#1a1a1a] bg-[#111111] p-3 space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-[#666666] tracking-wider flex items-center gap-1.5">
                      <Building className="h-3 w-3 text-[#D6B77A]" /> Onboarding
                      Status
                    </span>
                    <span className="inline-block rounded bg-[#1a1a1a] px-2 py-0.5 text-xs font-medium text-[#D6B77A]">
                      {user.ownerStatus}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="pt-2 border-t border-[#1a1a1a] flex items-center justify-between">
                <span className="text-xs text-[#888888]">
                  Account Status Actions:
                </span>

                <button
                  type="button"
                  onClick={handleToggle}
                  disabled={toggleMutation.isPending}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
                    user.isActive
                      ? "border border-[#D16B6B]/40 bg-[#D16B6B]/10 text-[#D16B6B] hover:bg-[#D16B6B]/20"
                      : "border border-[#65A982]/40 bg-[#65A982]/10 text-[#65A982] hover:bg-[#65A982]/20"
                  }`}
                >
                  {toggleMutation.isPending
                    ? "Updating..."
                    : user.isActive
                    ? "Suspend Account"
                    : "Reactivate Account"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
