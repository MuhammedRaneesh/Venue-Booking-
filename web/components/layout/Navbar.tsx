"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  ArrowUpRight,
  User as UserIcon,
  LogOut,
  Sparkles,
  LayoutDashboard,
  Calendar,
  Heart,
} from "lucide-react";
import { useCurrentUser, useLogoutMutation } from "@/features/auth/hooks/useAuth";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, isLoading: isAuthLoading } = useCurrentUser();
  const user = data?.user;
  const logoutMutation = useLogoutMutation();

  const isOwner = user?.role === "venue_owner";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
        router.push("/");
      },
    });
  };

  const navLinks = [
    { label: "Explore venues", href: "/venues" },
    { label: "How it works", href: "/how-it-works" },
    { label: "List your venue", href: isOwner ? "/owner" : "/list-space" },
  ];

  const listSpaceHref = isOwner
    ? "/owner"
    : user
    ? "/onboarding/application"
    : "/list-space";

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-xs"
          : "bg-background border-b border-transparent shadow-none"
      }`}
    >
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center min-w-[150px] sm:min-w-[180px] shrink-0">
            <Link
              href="/"
              className="font-serif text-[26px] sm:text-[28px] font-bold tracking-tight text-foreground hover:opacity-90 transition-opacity select-none"
              aria-label="Venuo Home"
            >
              Venuo
            </Link>
          </div>

          <nav className="hidden md:flex flex-1 items-center justify-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[15px] font-medium tracking-tight px-3.5 py-1.5 rounded-full transition-all duration-150 ${
                    isActive
                      ? "text-coral-500 font-semibold bg-coral-50"
                      : "text-foreground hover:text-coral-500 hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center justify-end min-w-[150px] sm:min-w-[180px] shrink-0 gap-3.5">
            {isAuthLoading ? (
              <div className="flex items-center gap-3 animate-pulse" aria-hidden="true">
                <div className="h-10 w-28 rounded-full bg-muted" />
                <div className="w-10 h-10 rounded-full bg-muted" />
              </div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={listSpaceHref}
                  className="h-10 px-5 rounded-full bg-foreground hover:bg-neutral-800 text-background text-[14px] font-medium flex items-center gap-1.5 shadow-xs hover:shadow-sm transition-all duration-150 group active:scale-[0.98]"
                >
                  <span>List your space</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-background/90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </Link>

                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="w-10 h-10 rounded-full border border-border hover:border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-coral-500/30 transition-all flex items-center justify-center cursor-pointer shadow-xs overflow-hidden active:scale-95"
                    aria-expanded={dropdownOpen}
                    aria-label="User account menu"
                  >
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.fullName || "User profile"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-foreground text-background text-[13px] font-semibold flex items-center justify-center tracking-wider">
                        {(user.fullName || user.email || "U")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                    )}
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-60 bg-background rounded-2xl border border-border shadow-lg p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="px-3.5 py-3 rounded-xl bg-muted/60 border border-border/60 mb-1">
                        <p className="text-[13.5px] font-semibold text-foreground truncate">
                          {user.fullName || "User"}
                        </p>
                        <p className="text-[12px] text-muted-foreground truncate mt-0.5">
                          {user.email}
                        </p>
                        {isOwner && (
                          <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-coral-50 text-coral-500">
                            <Sparkles className="w-3 h-3" /> Venue Owner
                          </span>
                        )}
                      </div>

                      <div className="space-y-0.5 py-0.5">
                        <Link
                          href="/profile"
                          className="flex items-center gap-2.5 px-3 py-2 text-[13.5px] text-foreground/80 hover:text-foreground hover:bg-muted rounded-xl transition-colors font-medium"
                        >
                          <UserIcon className="w-4 h-4 text-muted-foreground" />
                          Profile
                        </Link>
                        {isOwner ? (
                          <Link
                            href="/owner"
                            className="flex items-center gap-2.5 px-3 py-2 text-[13.5px] text-foreground/80 hover:text-foreground hover:bg-muted rounded-xl transition-colors font-medium"
                          >
                            <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                            Owner Dashboard
                          </Link>
                        ) : (
                          <Link
                            href="/booking"
                            className="flex items-center gap-2.5 px-3 py-2 text-[13.5px] text-foreground/80 hover:text-foreground hover:bg-muted rounded-xl transition-colors font-medium"
                          >
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            My Bookings
                          </Link>
                        )}
                        <Link
                          href="/wishlist"
                          className="flex items-center gap-2.5 px-3 py-2 text-[13.5px] text-foreground/80 hover:text-foreground hover:bg-muted rounded-xl transition-colors font-medium"
                        >
                          <Heart className="w-4 h-4 text-muted-foreground" />
                          Wishlist
                        </Link>
                      </div>

                      <div className="border-t border-border mt-1 pt-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 px-3 py-2 text-[13.5px] text-coral-600 hover:bg-coral-50 rounded-xl transition-colors font-medium cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-coral-600" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-[15px] font-medium text-foreground hover:text-coral-500 px-3.5 py-1.5 rounded-full hover:bg-muted transition-colors"
                >
                  Sign in
                </Link>

                <Link
                  href={listSpaceHref}
                  className="h-10 px-5 rounded-full bg-foreground hover:bg-neutral-800 text-background text-[14px] font-medium flex items-center gap-1.5 shadow-xs hover:shadow-sm transition-all duration-150 group active:scale-[0.98]"
                >
                  <span>List your space</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-background/90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-xl text-foreground hover:bg-muted border border-border transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 pt-4 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2.5 rounded-xl text-[15px] font-medium transition-colors ${
                    isActive
                      ? "text-coral-500 bg-coral-50"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border pt-4">
            {isAuthLoading ? (
              <div className="space-y-3 animate-pulse" aria-hidden="true">
                <div className="h-14 w-full rounded-xl bg-muted/60" />
                <div className="h-10 w-full rounded-full bg-muted/60" />
              </div>
            ) : user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-2.5 bg-muted/60 rounded-xl border border-border/60">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.fullName || "User profile"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-foreground text-background text-[13px] font-semibold flex items-center justify-center">
                      {(user.fullName || user.email || "U")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {user.fullName || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-muted rounded-lg font-medium"
                  >
                    <UserIcon className="w-4 h-4 text-muted-foreground" />
                    Profile
                  </Link>
                  {isOwner ? (
                    <Link
                      href="/owner"
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-muted rounded-lg font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                      Owner Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/booking"
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-muted rounded-lg font-medium"
                    >
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      My Bookings
                    </Link>
                  )}
                  <Link
                    href="/wishlist"
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-muted rounded-lg font-medium"
                  >
                    <Heart className="w-4 h-4 text-muted-foreground" />
                    Wishlist
                  </Link>
                </div>

                <Link
                  href={listSpaceHref}
                  className="flex items-center justify-center gap-1.5 w-full h-10 rounded-full bg-foreground text-background text-[14px] font-medium shadow-xs"
                >
                  <span>List your space</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-2 text-sm text-coral-600 hover:bg-coral-50 rounded-xl transition-colors font-medium cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Link
                  href="/login"
                  className="flex items-center justify-center w-full h-10 text-[14px] font-medium text-foreground border border-border rounded-full hover:bg-muted"
                >
                  Sign in
                </Link>
                <Link
                  href={listSpaceHref}
                  className="flex items-center justify-center gap-1.5 w-full h-10 rounded-full bg-foreground text-background text-[14px] font-medium shadow-xs"
                >
                  <span>List your space</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
