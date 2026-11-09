"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Layers,
  Building2,
  FileCheck,
  CalendarCheck,
  LogOut,
  X,
} from "lucide-react";
import { useCurrentUser, useLogoutMutation } from "@/features/auth/hooks/useAuth";

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  isHovered?: boolean;
  onHoverChange?: (hovered: boolean) => void;
}

export const ADMIN_NAV_ITEMS = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Layers,
  },
  {
    title: "Venues",
    href: "/admin/venues",
    icon: Building2,
  },
  {
    title: "Applications",
    href: "/admin/applications",
    icon: FileCheck,
  },
  {
    title: "Bookings",
    href: "/admin/bookings",
    icon: CalendarCheck,
  },
];

export function AdminSidebar({
  mobileOpen = false,
  onCloseMobile,
  isHovered: controlledHovered,
  onHoverChange,
}: AdminSidebarProps) {
  const [internalHovered, setInternalHovered] = useState(false);
  const isHovered =
    controlledHovered !== undefined ? controlledHovered : internalHovered;

  const handleMouseEnter = () => {
    setInternalHovered(true);
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    setInternalHovered(false);
    onHoverChange?.(false);
  };
  const pathname = usePathname();
  const router = useRouter();
  const { data: authData } = useCurrentUser();
  const logoutMutation = useLogoutMutation();

  const user = authData?.user;
  const adminName = user?.fullName || "Admin";
  const adminEmail = user?.email || "admin@bookmyvenue.com";

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // Ignored: route push handles user exit regardless of network status
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

  const renderContent = (expanded: boolean) => (
    <div className="flex h-full flex-col bg-black text-[#F5F2EB] select-none">
      {/* Brand Header */}
      <div
        className={`flex h-14 items-center border-b border-[#1a1a1a] transition-all duration-300 ${
          expanded ? "px-4 justify-between" : "px-0 justify-center"
        }`}
      >
        <Link
          href="/admin"
          onClick={onCloseMobile}
          className={`flex items-center transition-opacity hover:opacity-90 ${
            expanded ? "gap-3" : "justify-center w-full"
          }`}
          title="Venuo Admin"
        >
          {/* Brand Monogram Icon - always centered in collapsed rail */}
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#D6B77A]/35 bg-[#141414] font-serif text-sm font-bold text-[#D6B77A] shadow-xs">
            V
          </span>

          {/* Full Brand Name */}
          <span
            className={`font-serif text-[22px] font-bold tracking-tight text-[#F5F2EB] leading-none whitespace-nowrap transition-all duration-300 ${
              expanded
                ? "opacity-100 max-w-[140px] translate-x-0"
                : "opacity-0 max-w-0 -translate-x-2 overflow-hidden pointer-events-none"
            }`}
          >
            Venuo
          </span>
        </Link>

        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="ml-auto rounded-md p-1.5 text-[#888888] hover:bg-[#141414] hover:text-[#F5F2EB] lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <div
        className={`flex-1 overflow-y-auto py-4 space-y-1.5 scrollbar-none transition-all duration-300 ${
          expanded ? "px-2" : "px-0 flex flex-col items-center"
        }`}
      >
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isLinkActive(item.href, item.exact);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              prefetch={false}
              title={!expanded ? item.title : undefined}
              className={`group flex items-center text-xs font-medium transition-all duration-150 rounded-lg ${
                expanded
                  ? `gap-3 px-3 py-2.5 w-full ${
                      active
                        ? "bg-gradient-to-r from-[#D6B77A]/15 via-[#D6B77A]/5 to-transparent text-[#F5F2EB] border-l-2 border-[#D6B77A]"
                        : "text-[#888888] hover:bg-[#0d0d0d] hover:text-[#F5F2EB] border-l-2 border-transparent"
                    }`
                  : `justify-center h-10 w-10 ${
                      active
                        ? "bg-[#D6B77A]/15 text-[#D6B77A] border border-[#D6B77A]/40"
                        : "text-[#888888] hover:bg-[#0d0d0d] hover:text-[#F5F2EB] border border-transparent"
                    }`
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-colors ${
                  active ? "text-[#D6B77A]" : "text-[#888888] group-hover:text-[#F5F2EB]"
                }`}
              />
              <span
                className={`truncate transition-all duration-200 whitespace-nowrap ${
                  expanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
                }`}
              >
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Profile & Logout Footer */}
      <div
        className={`border-t border-[#1a1a1a] bg-black transition-all duration-300 ${
          expanded ? "p-3.5" : "py-3 px-0 flex justify-center"
        }`}
      >
        <div
          className={`flex items-center overflow-hidden ${
            expanded ? "justify-between gap-2 w-full" : "justify-center w-full"
          }`}
        >
          {expanded && (
            <div className="min-w-0 flex-1 px-1 transition-all duration-200">
              <p className="truncate text-xs font-medium text-[#F5F2EB]">
                {adminName}
              </p>
              <p className="truncate text-[10px] text-[#888888]">{adminEmail}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#242424] bg-[#0d0d0d] text-[#888888] hover:border-[#D16B6B]/40 hover:text-[#D16B6B] transition-colors disabled:opacity-50"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar: Collapsed by default (68px), expands on hover (240px) */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-40 border-r border-[#1a1a1a] transition-all duration-300 ease-in-out ${
          isHovered
            ? "w-60 shadow-2xl shadow-black/90"
            : "w-[68px]"
        }`}
      >
        {renderContent(isHovered)}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative flex w-64 max-w-[85vw] flex-1 flex-col border-r border-[#1a1a1a]">
            {renderContent(true)}
          </div>
        </div>
      )}
    </>
  );
}
