"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Ticket,
  Calendar,
  Banknote,
  Store,
  Bell,
  Settings,
  X,
  LogOut,
} from "lucide-react";
import { useCurrentUser, useLogoutMutation } from "@/features/auth/hooks/useAuth";
import { useOwnerDashboardSummary } from "../Dashbored/hooks/useOwnerDashboard";
import { useUnreadCount } from "@/features/notifications/hooks/useUnreadCount";
import { OwnerNavItem } from "../Dashbored/types/dashboard.types";

interface OwnerSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const OWNER_NAV_ITEMS: OwnerNavItem[] = [
  {
    title: "Overview",
    href: "/owner",
    icon: LayoutGrid,
    exact: true,
  },
  {
    title: "Bookings",
    href: "/owner/bookings",
    icon: Ticket,
  },
  {
    title: "Calendar",
    href: "/owner/calendar",
    icon: Calendar,
  },
  {
    title: "Earnings",
    href: "/owner/earnings",
    icon: Banknote,
  },
  {
    title: "My Venue",
    href: "/owner/venues",
    icon: Store,
    isDividerAfter: true,
  },
  {
    title: "Notifications",
    href: "/owner/notifications",
    icon: Bell,
  },
  {
    title: "Profile & Settings",
    href: "/owner/settings",
    icon: Settings,
  },
];

export function OwnerSidebar({ mobileOpen = false, onCloseMobile }: OwnerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { data: authData } = useCurrentUser();
  const logoutMutation = useLogoutMutation();
  const { data: summary } = useOwnerDashboardSummary();
  const { data: unreadNotifications = 0 } = useUnreadCount(Boolean(authData?.user));

  const user = authData?.user;
  const displayName = user?.fullName || user?.userName || (user?.email ? user.email.split("@")[0] : "Host");
  const initials =
    (user?.fullName || displayName)
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "H";

  // Dynamic real count from backend summary (zero if none)
  const pendingCount = summary?.pendingBookings ?? 0;
  const hasUnread = unreadNotifications > 0;

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // Ignored
    } finally {
      router.push("/login");
    }
  };

  const isLinkActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Brand & Host Mode Badge Header - strictly aligned h-16 with navbar */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-[#EFECE8] bg-white shrink-0">
        <Link
          href="/owner"
          className="group inline-flex items-center gap-2 transition-opacity hover:opacity-95"
          onClick={onCloseMobile}
        >
          <span className="font-serif text-[22px] font-bold tracking-tight text-[#1E1B18] inline-flex items-baseline leading-none">
            Venuo
            <span className="ml-0.5 w-1.5 h-1.5 rounded-full bg-coral-500 inline-block" />
          </span>
        </Link>

        {/* Mobile close button */}
        {mobileOpen && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1.5 rounded-xl text-[#7A7169] hover:text-[#1E1B18] hover:bg-[#F6EFEA] transition-colors lg:hidden"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto" aria-label="Owner dashboard">
        {OWNER_NAV_ITEMS.map((item) => {
          const active = isLinkActive(item.href, item.exact);
          const IconComponent = item.icon;

          // Real dynamic badge only if pendingBookings > 0
          const badgeValue =
            item.title === "Bookings" && pendingCount > 0
              ? pendingCount
              : null;

          // Real indicator only if unread notifications exist
          const showIndicator =
            item.title === "Notifications" && hasUnread;

          return (
            <React.Fragment key={item.title}>
              <Link
                href={item.href}
                onClick={onCloseMobile}
                aria-current={active ? "page" : undefined}
                className={`group flex items-center justify-between px-3.5 py-3 rounded-2xl text-[15px] transition-all duration-150 ${
                  active
                    ? "bg-[#FFEFEA] text-[#30130C] font-semibold shadow-xs"
                    : "text-[#48403B] hover:text-[#1E1B18] hover:bg-[#F9F5F0] font-medium"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <IconComponent
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      active
                        ? "text-[#30130C]"
                        : "text-[#48403B] group-hover:text-[#1F1916]"
                    }`}
                    strokeWidth={active ? 2.1 : 1.85}
                  />
                  <span className="truncate">{item.title}</span>
                </div>

                {/* Right side Badge or Status Dot */}
                <div className="flex items-center shrink-0 ml-2">
                  {badgeValue !== null && (
                    <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#F3ECE2] text-[#54483B] text-[12px] font-bold inline-flex items-center justify-center">
                      {badgeValue}
                    </span>
                  )}

                  {showIndicator && (
                    <span
                      className="w-2 h-2 rounded-full bg-[#E85942] shrink-0"
                      aria-label="New notifications indicator"
                    />
                  )}
                </div>
              </Link>

              {/* Subtle divider after 'My Venue' */}
              {item.isDividerAfter && (
                <div className="pt-2 pb-2 px-1">
                  <div className="border-t border-[#F0EAE4]" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Host Space Quick Status / Bottom Card */}
      <div className="p-4 border-t border-[#EFECE8] bg-[#FDFBF9] shrink-0">
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-[#EFECE8] shadow-xs">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={displayName}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-coral-200"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#30130C] text-[#FFF5F2] font-semibold text-xs flex items-center justify-center shrink-0">
              {initials}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-[13.5px] font-semibold text-[#1E1B18] truncate leading-tight">
              {displayName}
            </p>
            <p className="text-[11.5px] text-[#7A7169] truncate leading-tight mt-0.5">
              Host Console
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Log out"
            aria-label="Log out of host console"
            className="p-1.5 rounded-xl text-[#8E847C] hover:text-coral-700 hover:bg-coral-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed / Sticky on Desktop) */}
      <aside className="hidden lg:block w-[268px] shrink-0 border-r border-[#EFECE8] bg-white h-screen sticky top-0 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer (Responsive slide-out on Mobile/Tablet) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-[280px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out animate-in slide-in-from-left">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
