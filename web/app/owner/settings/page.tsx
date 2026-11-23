"use client";

import React from "react";
import { Settings, User, Building, CreditCard, Shield, Bell } from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";

export default function OwnerSettingsPage() {
  const { data: authData } = useCurrentUser();
  const user = authData?.user;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1B18]">
          Profile & Settings
        </h1>
        <p className="text-[14px] text-[#7A7169] mt-1">
          Manage host business credentials, payout accounts, and notification preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation Menu */}
        <div className="rounded-2xl bg-white border border-[#EFECE8] p-3 shadow-xs space-y-1 h-fit">
          {[
            { label: "Host Profile", icon: User, active: true },
            { label: "Business & GSTIN", icon: Building },
            { label: "Payout Bank Account", icon: CreditCard },
            { label: "Notification Channels", icon: Bell },
            { label: "Security & Login", icon: Shield },
          ].map((item) => {
            const IconComp = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors text-left ${
                  item.active
                    ? "bg-[#FFEFEA] text-[#30130C] font-semibold"
                    : "text-[#54483B] hover:bg-[#FAF7F4] hover:text-[#1E1B18]"
                }`}
              >
                <IconComp className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Profile Card Form Content */}
        <div className="lg:col-span-2 rounded-3xl bg-white border border-[#EFECE8] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#30130C] text-[#FFF5F2] font-serif text-xl font-bold flex items-center justify-center">
              {user?.fullName?.slice(0, 2).toUpperCase() || "HO"}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1E1B18]">
                {user?.fullName || "Host Account"}
              </h2>
              <p className="text-sm text-[#7A7169]">{user?.email || "host@bookmyvenue.com"}</p>
              <span className="mt-1 inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                Verified Venue Host
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#F0EAE4]">
            <div>
              <label className="block text-xs font-semibold text-[#54483B] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                defaultValue={user?.fullName || "Host Owner"}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E0D8D0] text-sm focus:outline-hidden focus:border-coral-500 bg-[#FAF8F5]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#54483B] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                defaultValue={user?.email || "host@bookmyvenue.com"}
                disabled
                className="w-full px-3.5 py-2 rounded-xl border border-[#E0D8D0] text-sm bg-neutral-100 text-[#7A7169] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#54483B] uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                defaultValue={user?.phoneNumber || "+91 98470 12345"}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E0D8D0] text-sm focus:outline-hidden focus:border-coral-500 bg-[#FAF8F5]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#54483B] uppercase tracking-wider mb-1.5">
                Host Role
              </label>
              <input
                type="text"
                defaultValue="Venue Owner & Host"
                disabled
                className="w-full px-3.5 py-2 rounded-xl border border-[#E0D8D0] text-sm bg-neutral-100 text-[#7A7169] cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              className="px-5 py-2.5 rounded-full bg-coral-600 hover:bg-coral-700 text-white text-sm font-medium shadow-xs transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
