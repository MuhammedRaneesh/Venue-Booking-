"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Bell,
  Eye,
  Plus,
  ChevronDown,
  LogOut,
  Settings,
  Store,
  Sparkles,
} from "lucide-react";
import { useCurrentUser, useLogoutMutation } from "@/features/auth/hooks/useAuth";
import { useUnreadCount } from "@/features/notifications/hooks/useUnreadCount";
import { useOwnerDashboardSummary } from "../Dashbored/hooks/useOwnerDashboard";

interface OwnerNavbarProps {
  onOpenMobileSidebar: () => void;
}

// Keep in sync with the sidebar header (both must be h-16 so their borders meet)
const CONTROL = "h-10";

type PageMeta = { title: string; subtitle?: string };

// Ordered: more specific paths first. "/owner" is matched exactly (see getPageMeta)
const PAGE_META: { path: string; meta: PageMeta }[] = [
  { path: "/owner/bookings", meta: { title: "Bookings", subtitle: "Review and manage booking requests" } },
  { path: "/owner/calendar", meta: { title: "Calendar", subtitle: "See booked, pending and free dates" } },
  { path: "/owner/earnings", meta: { title: "Earnings", subtitle: "Revenue, platform fees and payouts" } },
  { path: "/owner/venues", meta: { title: "My Venue", subtitle: "Manage your listing and photos" } },
  { path: "/owner/notifications", meta: { title: "Notifications", subtitle: "Stay on top of requests and payments" } },
  { path: "/owner/settings", meta: { title: "Profile & Settings", subtitle: "Your account and business details" } },
  { path: "/owner/profile", meta: { title: "Profile & Settings", subtitle: "Your account and business details" } },
];

function getPageMeta(pathname: string): PageMeta {
  if (pathname === "/owner") return { title: "Overview" };
  const match = PAGE_META.find(
    ({ path }) => pathname === path || pathname.startsWith(`${path}/`)
  );
  return match?.meta ?? { title: "Overview" };
}

export function OwnerNavbar({ onOpenMobileSidebar }: OwnerNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: authData } = useCurrentUser();
  const logoutMutation = useLogoutMutation();
  const { data: summary } = useOwnerDashboardSummary();

  const user = authData?.user;
  const { data: unreadCount = 0 } = useUnreadCount(Boolean(user));

  const displayName = user?.fullName || user?.userName || (user?.email ? user.email.split("@")[0] : "Host");
  const email = user?.email || "";
  const initials =
    (user?.fullName || displayName)
      .trim()
      .split(/\s+/)
      .map((w: string) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "H";

  // Dynamic count of pending bookings from summary
  const pendingCount = summary?.pendingBookings ?? 0;

  const pageMeta = getPageMeta(pathname);
  const subtitle =
    pathname === "/owner"
      ? pendingCount > 0
        ? `${pendingCount} booking ${pendingCount === 1 ? "request needs" : "requests need"} your response`
        : "Here's how your venue is doing"
      : pageMeta.subtitle;

  // Close the dropdown on route change
  useEffect(() => {
    setProfileDropdownOpen(false);
  }, [pathname]);

  // Close the dropdown on outside click or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setProfileDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // ignored
    } finally {
      router.push("/login");
    }
  };

  const menuItem =
    "flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#F6EFEA] hover:text-[#1E1B18] transition-colors";

  return (
    <header className="sticky top-0 z-20 h-16 w-full border-b border-[#EFECE8] bg-white px-4 sm:px-6 lg:px-8 select-none">
      <div className="flex h-full items-center justify-between gap-4">
        {/* Left: mobile menu + title block */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className={`${CONTROL} w-10 -ml-2 inline-flex items-center justify-center rounded-xl text-[#6B625D] hover:text-[#1E1B18] hover:bg-[#F6EFEA] transition-colors lg:hidden`}
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0 leading-tight">
            <h1 className="text-[17px] font-bold text-[#1E1B18] truncate tracking-tight">
              {pageMeta.title}
            </h1>
            {subtitle && (
              <p className="hidden sm:block text-[12.5px] text-[#7A7169] truncate mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
 

          {/* Add venue */}
          <Link
            href="/onboarding/application"
            className={`${CONTROL} inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 rounded-full bg-coral-500 hover:bg-coral-600 active:bg-coral-600 text-white text-[13px] font-semibold shadow-xs transition-all duration-150 active:scale-[0.98]`}
            aria-label="Add venue"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add venue</span>
          </Link>

          {/* Notifications */}
          <Link
            href="/owner/notifications"
            className={`relative ${CONTROL} w-10 rounded-full inline-flex items-center justify-center text-[#48403B] hover:text-[#1E1B18] hover:bg-[#F6EFEA] transition-colors`}
            aria-label={
              unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"
            }
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-coral-500 text-white text-[10px] font-bold leading-[17px] text-center ring-2 ring-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

          <div className="h-6 w-px bg-[#EFECE8] hidden sm:block" />

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              className={`${CONTROL} flex items-center gap-2 pl-1 pr-2.5 rounded-full border border-[#E8E2DC] hover:border-coral-300 hover:bg-[#FAF7F4] transition-colors cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-coral-500/30`}
              aria-expanded={profileDropdownOpen}
              aria-haspopup="menu"
              aria-label="Host account menu"
            >
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={displayName}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#30130C] text-[#FFF5F2] font-semibold text-[12px] flex items-center justify-center shrink-0">
                  {initials}
                </div>
              )}

              <span className="hidden md:inline-block text-[13px] font-medium text-[#1E1B18] max-w-[110px] truncate">
                {displayName.split(" ")[0]}
              </span>

              <ChevronDown
                className={`w-4 h-4 text-[#7A7169] transition-transform duration-200 ${
                  profileDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileDropdownOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2.5 w-64 rounded-2xl bg-white border border-[#EFECE8] shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
              >
                {/* User summary */}
                <div className="px-3.5 py-3 rounded-xl bg-[#FAF7F4] border border-[#EFECE8]/80 mb-1.5">
                  <p className="text-[14px] font-semibold text-[#1E1B18] truncate">
                    {displayName}
                  </p>
                  {email && (
                    <p className="text-[12px] text-[#7A7169] truncate mt-0.5">{email}</p>
                  )}
                </div>

                <div className="space-y-0.5 text-[13.5px] font-medium text-[#48403B]">
                  <Link href="/owner/venues" role="menuitem" className={menuItem}>
                    <Store className="w-4 h-4 text-[#7A7169]" />
                    <span>My Venue</span>
                  </Link>
                  <Link href="/owner/settings" role="menuitem" className={menuItem}>
                    <Settings className="w-4 h-4 text-[#7A7169]" />
                    <span>Profile & Settings</span>
                  </Link>
                  <Link href="/venues" role="menuitem" className={menuItem}>
                    <Eye className="w-4 h-4 text-[#7A7169]" />
                    <span>Switch to Guest View</span>
                  </Link>
                </div>

                <div className="my-1.5 border-t border-[#EFECE8]" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13.5px] font-medium text-coral-700 hover:bg-coral-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
