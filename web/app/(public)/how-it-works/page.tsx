import React from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      step: "01",
      icon: Search,
      title: "Discover & Compare",
      description:
        "Filter premier wedding halls, auditoriums, and banquet lawns by city, guest capacity, and amenities. View authentic photos, verified reviews, and all-inclusive transparent daily pricing.",
    },
    {
      step: "02",
      icon: Clock,
      title: "Request Your Date",
      description:
        "Select your event date and slot. Venue owners receive your request immediately and usually respond within 2 hours with availability confirmation.",
    },
    {
      step: "03",
      icon: ShieldCheck,
      title: "Secure Advance & Celebrate",
      description:
        "Lock in your booking with a secure advance deposit. Your funds are protected under Venuo's host verification policy until your event is successfully confirmed.",
    },
  ];

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-100 text-coral-700 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simple, Transparent &amp; Secure</span>
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-foreground tracking-tight">
          How Venuo works
        </h1>
        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
          We take the stress out of booking wedding venues and celebration spaces across Kerala with verified hosts and protected payments.
        </p>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="bg-card border border-border rounded-3xl p-8 shadow-2xs hover:shadow-md transition-shadow relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-coral-50 border border-coral-100 flex items-center justify-center text-coral-600">
                    <Icon className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <span className="font-serif text-3xl font-bold text-muted-foreground/40">
                    {item.step}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-border/60 flex items-center gap-2 text-xs font-medium text-coral-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified guarantee</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* For Venue Owners Callout */}
      <div className="bg-foreground text-background rounded-3xl p-8 sm:p-12 mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <span className="text-xs uppercase font-semibold text-coral-400 tracking-wider">
            For Venue Owners
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-2 mb-3">
            Own a wedding hall or banquet auditorium in Kerala?
          </h2>
          <p className="text-sm text-neutral-300 leading-relaxed">
            List your space on Venuo to reach thousands of families planning weddings, receptions, and gatherings. Manage bookings with zero listing fees.
          </p>
        </div>

        <Link
          href="/onboarding/application"
          className="h-12 px-7 rounded-full bg-coral-500 hover:bg-coral-600 active:bg-coral-700 text-white font-medium text-sm flex items-center gap-2 shrink-0 shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>List your venue today</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-6">
        <Link
          href="/venues"
          className="inline-flex items-center gap-2 text-sm font-semibold text-coral-600 hover:text-coral-700 transition-colors"
        >
          <span>Explore venues across Kerala</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

