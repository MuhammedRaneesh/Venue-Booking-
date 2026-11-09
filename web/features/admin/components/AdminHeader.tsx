"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

interface AdminHeaderProps {
  onOpenMobileSidebar: () => void;
}

const ROUTE_LABELS: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/users": "Users",
  "/admin/categories": "Categories",
  "/admin/venues": "Venues",
  "/admin/applications": "Applications",
  "/admin/bookings": "Bookings",
};

export function AdminHeader({ onOpenMobileSidebar }: AdminHeaderProps) {
  const pathname = usePathname();
  const currentTitle = ROUTE_LABELS[pathname] || "Admin";

  return (
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-[#1a1a1a] bg-black/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 select-none">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="rounded-md border border-[#222222] bg-[#0c0c0c] p-1.5 text-[#888888] hover:text-[#F5F2EB] lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#888888]">Admin</span>
          <span className="text-[#333333]">/</span>
          <span className="font-semibold text-[#F5F2EB]">{currentTitle}</span>
        </div>
      </div>
    </header>
  );
}
