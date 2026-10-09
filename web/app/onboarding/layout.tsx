import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen h-dvh flex flex-col bg-background overflow-hidden text-foreground">
      <header className="h-14 sm:h-16 shrink-0 border-b border-border/80 bg-background/95 backdrop-blur-md z-30">
        <div className="h-full w-full max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-2xl font-bold tracking-tight text-foreground hover:opacity-90 transition-opacity"
            aria-label="Venuo Home"
          >
            Venuo
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit to Home</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-hidden flex flex-col">
        {children}
      </main>
    </div>
  );
}
