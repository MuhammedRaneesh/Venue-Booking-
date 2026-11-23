"use client";

import React, { useState } from "react";
import { OwnerSidebar } from "./OwnerSidebar";
import { OwnerNavbar } from "./OwnerNavbar";

interface OwnerLayoutProps {
  children: React.ReactNode;
}

export function OwnerLayout({ children }: OwnerLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2B2523] flex relative antialiased selection:bg-coral-100 selection:text-coral-800">
      {/* Desktop & Mobile Responsive Sidebar */}
      <OwnerSidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 relative z-10">
        <OwnerNavbar onOpenMobileSidebar={() => setMobileOpen(true)} />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
