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
  Bell,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { useCurrentUser, useLogoutMutation } from "@/features/auth/hooks/useAuth";
import { useUnreadCount } from "@/features/notifications/hooks/useUnreadCount";
import { useNotificationSocket } from "@/features/notifications/hooks/useNotificationSocket";

type Cta =
  | { kind: "link"; label: string; href: string }
  | { kind: "pending"; label: string };

function formatBadge(count: number) {
  return count > 9 ? "9+" : String(count);
}

function CtaButton({ cta, fullWidth = false }: { cta: Cta; fullWidth?: boolean }) {
  const width = fullWidth ? "w-full justify-center" : "";

  if (cta.kind === "pending") {
    return (
      <span
        className={`h-10 px-5 rounded-full bg-coral-50 text-coral-700 border border-coral-200 text-[14px] font-medium inline-flex items-center gap-1.5 cursor-default select-none ${width}`}
        aria-disabled="true"
      >
        <Clock className="w-3.5 h-3.5" />
        {cta.label}
      </span>
    );
  }

  return (
    <Link
      href={cta.href}
      className={`h-10 px-5 rounded-full bg-coral-600 hover:bg-coral-700 active:bg-coral-800 text-white text-[14px] font-medium inline-flex items-center gap-1.5 shadow-xs hover:shadow-sm transition-all duration-150 group active:scale-[0.98] ${width}`}
    >
      <span>{cta.label}</span>
      <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="relative w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:bg-muted hover:text-coral-700 transition-colors"
    >
      {children}
    </Link>
  );
}

function NotificationIcon({ count }: { count: number }) {
  return (
    <IconLink
      href="/notifications"
      label={count > 0 ? `Notifications, ${count} unread` : "Notifications"}
    >
      <Bell className="w-[19px] h-[19px]" />
      {count > 0 && (
        <span className="absolute top-1 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-coral-600 text-white text-[10px] font-bold leading-[18px] text-center ring-2 ring-background">
          {formatBadge(count)}
        </span>
      )}
    </IconLink>
  );
}

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
  const isAdmin = user?.role === "admin";
  const displayName: string = user?.userName || user?.email || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  const { data: unreadCount = 0 } = useUnreadCount(Boolean(user));
  useNotificationSocket(user?._id);

  const cta: Cta = !user
    ? { kind: "link", label: "List your space", href: "/list-space" }
    : isAdmin
    ? { kind: "link", label: "Admin panel", href: "/admin" }
    : isOwner
    ? { kind: "link", label: "Dashboard", href: "/owner" }
    : user.ownerStatus === "PENDING"
    ? { kind: "pending", label: "Application pending" }
    : { kind: "link", label: "List your space", href: "/onboarding/application" };

  const navLinks = [
    { label: "Explore venues", href: "/venues" },
    { label: "How it works", href: "/how-it-works" },
    { label: "For owners", href: isOwner ? "/owner" : "/list-space" },
  ];

  const isLinkActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
        router.push("/");
      },
    });
  };

  const menuItemClass =
    "flex items-center gap-2.5 px-3 py-2 text-[13.5px] text-foreground/80 hover:text-foreground hover:bg-muted rounded-xl transition-colors font-medium";

  const avatar = (size: string, text: string) =>
    user?.profileImage ? (
      <img
        src={user.profileImage}
        alt={displayName}
        referrerPolicy="no-referrer"
        className={`${size} rounded-full object-cover`}
      />
    ) : (
      <div
        className={`${size} rounded-full bg-foreground text-background ${text} font-semibold flex items-center justify-center tracking-wider`}
      >
        {initials}
      </div>
    );

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
              className="font-serif text-[26px] sm:text-[28px] font-bold tracking-tight text-foreground hover:opacity-90 transition-opacity select-none inline-flex items-baseline"
              aria-label="Venuo Home"
            >
              Venuo
              <span className="ml-0.5 w-1.5 h-1.5 rounded-full bg-coral-500 inline-block" />
            </Link>
          </div>

          <nav className="hidden md:flex flex-1 items-center justify-center gap-4 lg:gap-6">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-[15px] font-medium tracking-tight px-3.5 py-1.5 rounded-full transition-all duration-150 ${
                    active
                      ? "text-coral-700 font-semibold bg-coral-50"
                      : "text-foreground hover:text-coral-700 hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center justify-end min-w-[150px] sm:min-w-[180px] shrink-0 gap-2">
            {isAuthLoading ? (
              <div className="flex items-center gap-3 animate-pulse" aria-hidden="true">
                <div className="h-10 w-28 rounded-full bg-muted" />
                <div className="w-10 h-10 rounded-full bg-muted" />
              </div>
            ) : user ? (
              <>
                <IconLink href="/wishlist" label="Wishlist">
                  <Heart className="w-[19px] h-[19px]" />
                </IconLink>
                <NotificationIcon count={unreadCount} />

                <div className="ml-1">
                  <CtaButton cta={cta} />
                </div>

                <div className="relative ml-1" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="w-10 h-10 rounded-full border border-border hover:border-coral-300 focus:outline-hidden focus:ring-2 focus:ring-coral-500/40 transition-all flex items-center justify-center cursor-pointer shadow-xs overflow-hidden active:scale-95"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="menu"
                    aria-label="User account menu"
                  >
                    {avatar("w-full h-full", "text-[13px]")}
                  </button>

                  {dropdownOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 mt-2.5 w-60 bg-background rounded-2xl border border-border shadow-lg p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                    >
                      <div className="px-3.5 py-3 rounded-xl bg-muted/60 border border-border/60 mb-1">
                        <p className="text-[13.5px] font-semibold text-foreground truncate">
                          {displayName}
                        </p>
                        <p className="text-[12px] text-muted-foreground truncate mt-0.5">
                          {user.email}
                        </p>
                        {isOwner && (
                          <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-coral-50 text-coral-700">
                            <Sparkles className="w-3 h-3" /> Venue Owner
                          </span>
                        )}
                        {isAdmin && (
                          <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-coral-50 text-coral-700">
                            <ShieldCheck className="w-3 h-3" /> Admin
                          </span>
                        )}
                      </div>

                      <div className="space-y-0.5 py-0.5">
                        <Link href="/profile" role="menuitem" className={menuItemClass}>
                          <UserIcon className="w-4 h-4 text-muted-foreground" />
                          Profile
                        </Link>
                        {isAdmin ? (
                          <Link href="/admin" role="menuitem" className={menuItemClass}>
                            <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                            Admin Panel
                          </Link>
                        ) : isOwner ? (
                          <Link href="/owner" role="menuitem" className={menuItemClass}>
                            <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                            Owner Dashboard
                          </Link>
                        ) : (
                          <Link href="/booking" role="menuitem" className={menuItemClass}>
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            My Bookings
                          </Link>
                        )}
                        <Link href="/wishlist" role="menuitem" className={menuItemClass}>
                          <Heart className="w-4 h-4 text-muted-foreground" />
                          Wishlist
                        </Link>
                        <Link
                          href="/notifications"
                          role="menuitem"
                          className={`${menuItemClass} justify-between`}
                        >
                          <span className="flex items-center gap-2.5">
                            <Bell className="w-4 h-4 text-muted-foreground" />
                            Notifications
                          </span>
                          {unreadCount > 0 && (
                            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-coral-600 text-white text-[11px] font-bold leading-5 text-center">
                              {formatBadge(unreadCount)}
                            </span>
                          )}
                        </Link>
                      </div>

                      <div className="border-t border-border mt-1 pt-1">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 px-3 py-2 text-[13.5px] text-coral-700 hover:bg-coral-50 rounded-xl transition-colors font-medium cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-[15px] font-medium text-foreground hover:text-coral-700 px-3.5 py-1.5 rounded-full hover:bg-muted transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="h-10 px-5 rounded-full border border-coral-500 text-coral-700 hover:bg-coral-50 text-[14px] font-medium inline-flex items-center transition-colors"
                >
                  Sign up
                </Link>
                <CtaButton cta={cta} />
              </>
            )}
          </div>

          <div className="flex items-center gap-1 md:hidden">
            {user && (
              <>
                <IconLink href="/wishlist" label="Wishlist">
                  <Heart className="w-[19px] h-[19px]" />
                </IconLink>
                <NotificationIcon count={unreadCount} />
              </>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="ml-1 p-2 rounded-xl text-foreground hover:bg-muted border border-border transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 pt-4 pb-6 space-y-4 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`px-3 py-2.5 rounded-xl text-[15px] font-medium transition-colors ${
                    active ? "text-coral-700 bg-coral-50" : "text-foreground hover:bg-muted"
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
                  {avatar("w-10 h-10", "text-[13px]")}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <Link href="/profile" className={menuItemClass}>
                    <UserIcon className="w-4 h-4 text-muted-foreground" />
                    Profile
                  </Link>
                  {isAdmin ? (
                    <Link href="/admin" className={menuItemClass}>
                      <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                      Admin Panel
                    </Link>
                  ) : isOwner ? (
                    <Link href="/owner" className={menuItemClass}>
                      <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                      Owner Dashboard
                    </Link>
                  ) : (
                    <Link href="/booking" className={menuItemClass}>
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      My Bookings
                    </Link>
                  )}
                  <Link href="/wishlist" className={menuItemClass}>
                    <Heart className="w-4 h-4 text-muted-foreground" />
                    Wishlist
                  </Link>
                  <Link href="/notifications" className={`${menuItemClass} justify-between`}>
                    <span className="flex items-center gap-2.5">
                      <Bell className="w-4 h-4 text-muted-foreground" />
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-coral-600 text-white text-[11px] font-bold leading-5 text-center">
                        {formatBadge(unreadCount)}
                      </span>
                    )}
                  </Link>
                </div>

                <CtaButton cta={cta} fullWidth />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-2 text-sm text-coral-700 hover:bg-coral-50 rounded-xl transition-colors font-medium cursor-pointer"
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
                  href="/register"
                  className="flex items-center justify-center w-full h-10 text-[14px] font-medium text-coral-700 border border-coral-500 rounded-full hover:bg-coral-50"
                >
                  Sign up
                </Link>
                <CtaButton cta={cta} fullWidth />
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
