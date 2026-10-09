"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User as UserIcon,
  Building2,
  MapPin,
  FileText,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Check,
} from "lucide-react";
import { User } from "@/features/auth/types/auth.types";
import {
  ownerOnboardingSchema,
  OwnerOnboardingInput,
} from "../schemas/ownerOnboarding.schema";
import { useOwnerOnboardingMutation } from "../hooks/useOwnerOnboarding";
import { RejectionNoticeBanner } from "./ApplicationStatusCards";

interface OwnerOnboardingFormProps {
  user: User;
  rejected?: boolean;
}

export function OwnerOnboardingForm({ user, rejected }: OwnerOnboardingFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [serverError, setServerError] = useState<string | null>(null);
  const onboardingMutation = useOwnerOnboardingMutation();

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OwnerOnboardingInput>({
    resolver: zodResolver(ownerOnboardingSchema),
    mode: "onChange",
    defaultValues: {
      fullName: user.fullName || "",
      phoneNumber: user.phoneNumber || "",
      businessName: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      gstNumber: "",
    },
  });

  const nextStep = async () => {
    setServerError(null);
    if (step === 1) {
      const isValid = await trigger(["fullName", "phoneNumber"]);
      if (isValid) setStep(2);
    } else if (step === 2) {
      const isValid = await trigger(["businessName", "gstNumber"]);
      if (isValid) setStep(3);
    }
  };

  const prevStep = () => {
    setServerError(null);
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  };

  const onSubmit = async (data: OwnerOnboardingInput) => {
    setServerError(null);
    try {
      await onboardingMutation.mutateAsync({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        businessName: data.businessName,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        gstNumber: data.gstNumber ? data.gstNumber.trim() : undefined,
      });
    } catch (err: any) {
      setServerError(
        err?.message || "Something went wrong submitting your application. Please try again."
      );
    }
  };

  const isPending = onboardingMutation.isPending || isSubmitting;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 lg:p-9 shadow-xs flex flex-col justify-between max-h-full">
      {rejected && (
        <div className="mb-4">
          <RejectionNoticeBanner
            onReset={() => {
              reset({
                fullName: user.fullName || "",
                phoneNumber: user.phoneNumber || "",
                businessName: "",
                address: "",
                city: "",
                state: "",
                pincode: "",
                gstNumber: "",
              });
              setStep(1);
            }}
          />
        </div>
      )}

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Step {step} of 3
          </span>
          <span className="text-xs font-medium text-coral-600">
            {step === 1 && "Host Representative"}
            {step === 2 && "Business & Tax"}
            {step === 3 && "Venue Location"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                if (s < step) setStep(s as 1 | 2 | 3);
              }}
              disabled={s > step}
              className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                s === step
                  ? "bg-coral-500"
                  : s < step
                  ? "bg-foreground"
                  : "bg-muted"
              }`}
              aria-label={`Go to step ${s}`}
            />
          ))}
        </div>

        <div className="pt-1">
          <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {step === 1 && "Who is the primary host contact?"}
            {step === 2 && "Tell us about your business entity"}
            {step === 3 && "Where is your registered venue located?"}
          </h2>
          <p className="text-muted-foreground text-xs sm:text-[13px]">
            {step === 1 && "We will use this information to reach you regarding booking requests."}
            {step === 2 && "Your registered business or company profile for tax invoice records."}
            {step === 3 && "Physical street address and postal code of your premises."}
          </p>
        </div>
      </div>

      {serverError && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
          <p className="flex-1">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-semibold text-foreground mb-1.5"
              >
                Full Legal Name <span className="text-coral-500">*</span>
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="fullName"
                  type="text"
                  placeholder="Enter your legal full name"
                  {...register("fullName")}
                  className={`w-full pl-10 pr-4 py-2.5 bg-background border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all placeholder:text-muted-foreground/60 ${
                    errors.fullName ? "border-red-400 bg-red-50/20" : "border-border"
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-xs font-semibold text-foreground mb-1.5"
              >
                Contact Phone <span className="text-coral-500">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs font-semibold text-muted-foreground select-none">
                  +91
                </span>
                <input
                  id="phoneNumber"
                  type="tel"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  {...register("phoneNumber")}
                  className={`w-full pl-12 pr-4 py-2.5 bg-background border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all placeholder:text-muted-foreground/60 ${
                    errors.phoneNumber ? "border-red-400 bg-red-50/20" : "border-border"
                  }`}
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="businessName"
                className="block text-xs font-semibold text-foreground mb-1.5"
              >
                Registered Venue / Business Name <span className="text-coral-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="businessName"
                  type="text"
                  placeholder="Enter business or venue entity name"
                  {...register("businessName")}
                  className={`w-full pl-10 pr-4 py-2.5 bg-background border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all placeholder:text-muted-foreground/60 ${
                    errors.businessName ? "border-red-400 bg-red-50/20" : "border-border"
                  }`}
                />
              </div>
              {errors.businessName && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.businessName.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="gstNumber"
                  className="block text-xs font-semibold text-foreground"
                >
                  GST Number (GSTIN)
                </label>
                <span className="text-[11px] text-muted-foreground">Optional</span>
              </div>
              <div className="relative">
                <FileText className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="gstNumber"
                  type="text"
                  placeholder="GSTIN (optional)"
                  {...register("gstNumber")}
                  className={`w-full pl-10 pr-4 py-2.5 bg-background border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all placeholder:text-muted-foreground/60 uppercase ${
                    errors.gstNumber ? "border-red-400 bg-red-50/20" : "border-border"
                  }`}
                />
              </div>
              {errors.gstNumber && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.gstNumber.message}
                </p>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="address"
                className="block text-xs font-semibold text-foreground mb-1.5"
              >
                Street Address / Premises <span className="text-coral-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3 pointer-events-none" />
                <textarea
                  id="address"
                  rows={2}
                  placeholder="Street address or building name"
                  {...register("address")}
                  className={`w-full pl-10 pr-4 py-2 bg-background border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all placeholder:text-muted-foreground/60 resize-none ${
                    errors.address ? "border-red-400 bg-red-50/20" : "border-border"
                  }`}
                />
              </div>
              {errors.address && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="city"
                  className="block text-xs font-semibold text-foreground mb-1.5"
                >
                  City <span className="text-coral-500">*</span>
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder="City"
                  {...register("city")}
                  className={`w-full px-3.5 py-2 bg-background border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all placeholder:text-muted-foreground/60 ${
                    errors.city ? "border-red-400 bg-red-50/20" : "border-border"
                  }`}
                />
                {errors.city && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-xs font-semibold text-foreground mb-1.5"
                >
                  State <span className="text-coral-500">*</span>
                </label>
                <input
                  id="state"
                  type="text"
                  placeholder="State"
                  {...register("state")}
                  className={`w-full px-3.5 py-2 bg-background border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all placeholder:text-muted-foreground/60 ${
                    errors.state ? "border-red-400 bg-red-50/20" : "border-border"
                  }`}
                />
                {errors.state && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.state.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="pincode"
                  className="block text-xs font-semibold text-foreground mb-1.5"
                >
                  Pincode <span className="text-coral-500">*</span>
                </label>
                <input
                  id="pincode"
                  type="text"
                  maxLength={6}
                  placeholder="6-digit PIN code"
                  {...register("pincode")}
                  className={`w-full px-3.5 py-2 bg-background border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all placeholder:text-muted-foreground/60 ${
                    errors.pincode ? "border-red-400 bg-red-50/20" : "border-border"
                  }`}
                />
                {errors.pincode && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.pincode.message}</p>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-muted/60 border border-border/70 p-3 text-[11.5px] text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <p>You confirm that you represent or own the spaces submitted.</p>
            </div>
          </div>
        )}

        <div className="pt-2 flex items-center justify-between gap-3 border-t border-border">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="h-10 px-4 rounded-full border border-border hover:bg-muted text-foreground text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="h-10 px-6 rounded-full bg-foreground hover:bg-neutral-800 text-background text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isPending}
              className="h-10 px-6 rounded-full bg-foreground hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed text-background text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>{rejected ? "Re-submit Application" : "Submit Application"}</span>
                  <Check className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
