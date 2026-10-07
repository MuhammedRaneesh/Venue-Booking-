"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import gsap from "gsap";
import { useForgotPasswordMutation } from "../hooks/useLogin";
import { forgotPasswordSchema, ForgotPasswordSchemaInput } from "../schemas/forgot-password.schema";

interface ForgotPasswordFormProps {
  initialEmail?: string;
  onBack?: () => void;
}

export function ForgotPasswordForm({ initialEmail = "", onBack }: ForgotPasswordFormProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);

  const forgotPasswordMutation = useForgotPasswordMutation();

  useEffect(() => {
    router.prefetch("/login");
    router.prefetch("/verify-forgot-otp");
  }, [router]);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, x: 20, scale: 0.98 },
        { opacity: 1, x: 0, scale: 1, duration: 0.28, ease: "power2.out" }
      );
    }
    return () => {
      if (containerRef.current) {
        gsap.killTweensOf(containerRef.current);
      }
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchemaInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      email: initialEmail,
    },
  });

  const onSubmit = (data: ForgotPasswordSchemaInput) => {
    if (isNavigating) return;
    setApiError(null);

    forgotPasswordMutation.mutate(
      { email: data.email },
      {
        onSuccess: () => {
          setIsNavigating(true);
          const targetUrl = `/verify-forgot-otp?email=${encodeURIComponent(data.email)}`;

          if (containerRef.current) {
            gsap.to(containerRef.current, {
              x: -20,
              opacity: 0,
              scale: 0.98,
              duration: 0.22,
              ease: "power2.inOut",
            });
          }

          router.push(targetUrl);
        },
        onError: (err) => {
          setApiError(err.message || "Failed to send reset code. Please try again.");
        },
      }
    );
  };

  const handleBack = () => {
    if (isNavigatingBack) return;
    setIsNavigatingBack(true);

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        x: 20,
        opacity: 0,
        scale: 0.98,
        duration: 0.22,
        ease: "power2.inOut",
      });
    }

    if (onBack) {
      onBack();
    } else {
      router.push("/login");
    }
  };

  return (
    <div ref={containerRef} className="w-full">
      <button
        type="button"
        onClick={handleBack}
        disabled={isNavigatingBack}
        className="group inline-flex items-center gap-1.5 text-xs text-[#737373] hover:text-[#171717] transition-colors mb-3.5 cursor-pointer disabled:opacity-50"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-150 group-hover:-translate-x-0.5" />
        <span>Back to sign in</span>
      </button>

      <div>
        <Link href="/" className="inline-block">
          <span className="font-serif text-[34px] sm:text-[38px] font-bold tracking-tight text-[#171717]">
            Venuo<span className="text-[#FA5A55]">.</span>
          </span>
        </Link>
        <p className="text-xs text-[#737373] tracking-normal mt-0.5 font-normal">
          Find. Book. Celebrate.
        </p>
      </div>

      <div className="mt-4 mb-4">
        <h1 className="font-serif text-[24px] sm:text-[26px] font-medium tracking-tight text-[#171717] leading-tight">
          Reset your password
        </h1>
        <p className="mt-1 text-xs sm:text-[13px] text-[#737373] leading-relaxed">
          Enter your email address and we&apos;ll send you a code to reset your password.
        </p>
      </div>

      {apiError && (
        <div className="flex items-start gap-2 p-2.5 mb-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <span>{apiError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label
            htmlFor="forgot-email"
            className="block text-sm font-medium text-[#171717] mb-1.5"
          >
            Email address
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-[#A3A3A3]">
              <Mail className="w-[18px] h-[18px]" />
            </span>
            <input
              id="forgot-email"
              type="email"
              {...register("email")}
              placeholder="you@example.com"
              className={`w-full h-11 pl-10.5 pr-4 text-sm bg-white text-[#171717] border rounded-lg placeholder:text-[#A3A3A3] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
                errors.email
                  ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  : "border-[#E5E5E5] hover:border-[#D4D4D4] focus:border-[#FA5A55] focus:ring-4 focus:ring-[#FA5A55]/12 focus:outline-none"
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-[#DC2626]">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={forgotPasswordMutation.isPending || isNavigating}
          className="w-full h-11 flex items-center justify-center gap-2 bg-[#FA5A55] hover:bg-[#E63E39] active:scale-[0.99] text-white text-sm font-medium rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-150 disabled:opacity-60 cursor-pointer"
        >
          {forgotPasswordMutation.isPending || isNavigating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isNavigating ? "Redirecting..." : "Sending code..."}</span>
            </>
          ) : (
            <>
              <span>Send reset code</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default ForgotPasswordForm;
