"use client";

import React from "react";
import Link from "next/link";
import { Clock, CheckCircle2, ArrowRight, Mail, AlertTriangle, RefreshCw } from "lucide-react";

export function ApplicationPendingCard({ userEmail }: { userEmail?: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 lg:p-9 shadow-xs space-y-5 lg:space-y-6">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-semibold border border-amber-500/20">
          <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: "3s" }} />
          Application Under Review
        </span>
        <span className="text-xs text-muted-foreground font-medium">Estimated: 24–48 hrs</span>
      </div>

      <div className="space-y-2">
        <h2 className="font-serif text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
          We’re verifying your host application
        </h2>
        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
          Thank you for applying to host on Venuo. Our curation team is currently reviewing your business credentials and contact information to ensure our guests receive a safe, world-class experience.
        </p>
      </div>

      <div className="rounded-2xl bg-muted/60 border border-border/70 p-4 sm:p-5 space-y-3">
        <h3 className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          Application Progress
        </h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs sm:text-[13px] font-semibold text-foreground">Application Submitted</p>
              <p className="text-[11px] text-muted-foreground">Your business and contact details were received securely.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs sm:text-[13px] font-semibold text-foreground">Compliance & Identity Review</p>
              <p className="text-[11px] text-muted-foreground">Our team confirms authenticity and venue representation.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 opacity-60">
            <div className="w-5 h-5 rounded-full bg-border text-muted-foreground flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
              3
            </div>
            <div>
              <p className="text-xs sm:text-[13px] font-semibold text-foreground">Host Dashboard Activation</p>
              <p className="text-[11px] text-muted-foreground">You’ll be able to publish venues and accept direct bookings.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Mail className="w-4 h-4 text-muted-foreground/80 shrink-0" />
          <span>Updates sent to <strong className="text-foreground font-medium">{userEmail || "your email"}</strong></span>
        </div>

        <Link
          href="/venues"
          className="h-9 px-4 rounded-full bg-muted hover:bg-neutral-200 text-foreground text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
        >
          <span>Explore venues</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export function ApplicationApprovedCard() {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 lg:p-9 shadow-xs space-y-5 lg:space-y-6">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-semibold border border-emerald-500/20">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        Host Account Approved
      </div>

      <div className="space-y-2">
        <h2 className="font-serif text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
          Congratulations! You are an active host
        </h2>
        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
          Your venue host credentials have been verified by Venuo administrators. Your account now has full host privileges to publish listings, manage reservations, and track revenue.
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-coral-50 border border-coral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-foreground">Ready to list your first space?</h3>
          <p className="text-[11.5px] text-muted-foreground mt-0.5">
            Head to the owner dashboard to add photos, set pricing, and configure amenities.
          </p>
        </div>
        <Link
          href="/owner"
          className="h-9 px-5 rounded-full bg-coral-500 hover:bg-coral-600 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 shrink-0 shadow-xs transition-colors"
        >
          <span>Open Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export function RejectionNoticeBanner({ onReset }: { onReset?: () => void }) {
  return (
    <div className="rounded-2xl bg-amber-50 border border-amber-200/80 p-3.5 sm:p-4 space-y-2">
      <div className="flex items-center gap-2 text-amber-800">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <h3 className="text-xs font-semibold">Your previous application needs revisions</h3>
      </div>
      <p className="text-[11.5px] text-amber-700 leading-relaxed">
        Our verification team was unable to approve your prior application with the information submitted. Please review your details, update any necessary fields, and re-submit.
      </p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="text-[11px] font-semibold text-amber-900 underline hover:no-underline inline-flex items-center gap-1 cursor-pointer pt-0.5"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset form to defaults</span>
        </button>
      )}
    </div>
  );
}
