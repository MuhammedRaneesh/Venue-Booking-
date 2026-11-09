"use client";

import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);

  return (
    <div className="min-h-screen bg-black text-[#F5F2EB] flex relative overflow-x-hidden antialiased selection:bg-[#D6B77A]/20 selection:text-[#F5F2EB]">
      {/* Isolated Admin-Only Background Gradient (Midnight Obsidian + Champagne Gold undertone) */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_90%_65%_at_50%_-15%,#1c1509_0%,#0a0804_50%,#000000_90%)]"
        aria-hidden="true"
      />

      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        isHovered={sidebarHovered}
        onHoverChange={setSidebarHovered}
      />

      {/* Main Content Area: transitions left padding synchronously so right side UI decreases size on hover */}
      <div
        className={`flex flex-1 flex-col min-w-0 relative z-10 transition-all duration-300 ease-in-out ${
          sidebarHovered ? "lg:pl-60" : "lg:pl-[68px]"
        }`}
      >
        <AdminHeader onOpenMobileSidebar={() => setMobileOpen(true)} />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
