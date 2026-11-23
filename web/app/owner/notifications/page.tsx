"use client";

import React from "react";
import { Bell, Inbox } from "lucide-react";

export default function OwnerNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1B18]">
          Notifications
        </h1>
        <p className="text-[14px] text-[#7A7169] mt-1">
          Real-time alerts for booking inquiries, cancellations, and payouts
        </p>
      </div>

      <div className="rounded-3xl border border-[#EFECE8] bg-white p-12 text-center shadow-xs space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#FAF7F4] border border-[#EFECE8] text-[#9A9188] flex items-center justify-center mx-auto">
          <Bell className="w-5 h-5" />
        </div>
        <p className="text-[15px] font-semibold text-[#1E1B18]">
          No new notifications
        </p>
        <p className="text-[13px] text-[#7A7169] max-w-sm mx-auto">
          You are all caught up. New booking requests and platform updates will appear here.
        </p>
      </div>
    </div>
  );
}
