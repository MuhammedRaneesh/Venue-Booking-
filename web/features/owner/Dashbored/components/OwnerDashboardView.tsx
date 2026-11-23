"use client";

import React from "react";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { useOwnerDashboardSummary, useOwnerVenues } from "../hooks/useOwnerDashboard";
import { OwnerWelcomeBanner } from "./OwnerWelcomeBanner";
import { OwnerStatCards } from "./OwnerStatCards";
import { OwnerRecentBookings } from "./OwnerRecentBookings";

export function OwnerDashboardView() {
  const { data: authData } = useCurrentUser();
  const { data: summary } = useOwnerDashboardSummary();
  const { data: venuesData } = useOwnerVenues();

  const user = authData?.user;
  const hostName = user?.fullName || user?.userName || (user?.email ? user.email.split("@")[0] : "Host");

  const totalVenues = summary?.totalVenues ?? venuesData?.totalCount ?? 0;
  const totalBookings = summary?.totalBookings ?? 0;
  const pendingBookings = summary?.pendingBookings ?? 0;
  const totalEarnings = summary?.totalEarnings ?? 0;
  const recentBookings = summary?.recentBookings ?? [];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <OwnerWelcomeBanner hostName={hostName} />
      <OwnerStatCards
        totalEarnings={totalEarnings}
        pendingBookings={pendingBookings}
        totalBookings={totalBookings}
        totalVenues={totalVenues}
      />
      <OwnerRecentBookings recentBookings={recentBookings} />
    </div>
  );
}
