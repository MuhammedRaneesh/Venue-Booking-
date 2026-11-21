import React from "react";
import Link from "next/link";
import { ArrowUpRight, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-card border-t border-border mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 select-none">
              <div className="w-7 h-7 flex items-center justify-center">
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full text-coral-500"
                >
                  <path
                    d="M5 7L16 26L27 7"
                    stroke="currentColor"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 7L16 18L22 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-40"
                  />
                </svg>
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
                Venuo
              </span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Discover and book premier venues for weddings, grand receptions, banquets, and celebrations across Kerala with verified hosts and transparent booking.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 fill-coral-500 text-coral-500 inline" />
              <span>for celebrations in God&apos;s Own Country</span>
            </div>
          </div>

          {/* Col 2: Venues */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Venues
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/venues" className="hover:text-coral-600 transition-colors">
                  Wedding Halls
                </Link>
              </li>
              <li>
                <Link href="/venues" className="hover:text-coral-600 transition-colors">
                  Banquet Auditoriums
                </Link>
              </li>
              <li>
                <Link href="/venues" className="hover:text-coral-600 transition-colors">
                  Resort Lawns
                </Link>
              </li>
              <li>
                <Link href="/venues" className="hover:text-coral-600 transition-colors">
                  Convention Centers
                </Link>
              </li>
              <li>
                <Link href="/venues" className="hover:text-coral-600 transition-colors">
                  Heritage Manors
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Cities */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Districts
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/venues?city=Kochi" className="hover:text-coral-600 transition-colors">
                  Kochi (Ernakulam)
                </Link>
              </li>
              <li>
                <Link href="/venues?city=Kozhikode" className="hover:text-coral-600 transition-colors">
                  Kozhikode
                </Link>
              </li>
              <li>
                <Link href="/venues?city=Thiruvananthapuram" className="hover:text-coral-600 transition-colors">
                  Thiruvananthapuram
                </Link>
              </li>
              <li>
                <Link href="/venues?city=Thrissur" className="hover:text-coral-600 transition-colors">
                  Thrissur
                </Link>
              </li>
              <li>
                <Link href="/venues?city=Alappuzha" className="hover:text-coral-600 transition-colors">
                  Alappuzha
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Links */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Platform
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/how-it-works" className="hover:text-coral-600 transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/onboarding/application" className="hover:text-coral-600 transition-colors inline-flex items-center gap-1">
                  <span>List your venue</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-coral-600 transition-colors">
                  Saved venues
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-coral-600 transition-colors">
                  Host sign in
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Venuo Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

