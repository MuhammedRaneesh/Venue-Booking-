"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import gsap from "gsap";
import { useResetPasswordMutation } from "../hooks/useLogin";
import { resetPasswordSchema, ResetPasswordSchemaInput } from "../schemas/reset-password.schema";

interface ResetPasswordFormProps {
  email: string;
}

export function ResetPasswordForm({ email }: ResetPasswordFormProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const resetPasswordMutation = useResetPasswordMutation();

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

  useEffect(() => {
    if (isSuccess && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { scale: 0.92, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(1.5)" }
      );
    }
  }, [isSuccess]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordSchemaInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("newPassword") || "";
  const hasMinLength = passwordValue.length >= 8;
  const hasNumberOrSymbol = /[\d\W]/.test(passwordValue);

  const onSubmit = (data: ResetPasswordSchemaInput) => {
    setApiError(null);

    resetPasswordMutation.mutate(
      {
        email: email.trim().toLowerCase(),
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        },
        onError: (err) => {
          setApiError(err.message || "Failed to reset password. Please try again.");
        },
      }
    );
  };

  if (isSuccess) {
    return (
      <div ref={successRef} className="w-full text-center py-4">
        <div className="w-13 h-13 bg-[#FFF5F5] text-[#FA5A55] rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h2 className="font-serif text-2xl font-medium text-[#171717] mb-1.5">
          Password Updated!
        </h2>
        <p className="text-xs sm:text-[13px] text-[#737373] max-w-xs mx-auto mb-5 leading-relaxed">
          Your new password has been set successfully. Redirecting you to sign in...
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center h-11 px-6 bg-[#FA5A55] hover:bg-[#E63E39] text-white text-sm font-medium rounded-lg transition-colors"
        >
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full">
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

      <div className="mt-5 mb-4">
        <h1 className="font-serif text-[26px] sm:text-[28px] font-medium tracking-tight text-[#171717] leading-tight">
          Create new password
        </h1>
        <p className="mt-1 text-xs sm:text-[13px] text-[#737373] leading-relaxed">
          Set a secure new password for <span className="font-medium text-[#171717]">{email || "your account"}</span>.
        </p>
      </div>

      {apiError && (
        <div className="flex items-start gap-2 p-2.5 mb-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <span>{apiError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3.5">
        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-[#171717] mb-1.5"
          >
            New password
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-[#A3A3A3]">
              <Lock className="w-[18px] h-[18px]" />
            </span>
            <input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              {...register("newPassword")}
              placeholder="Enter new password"
              className={`w-full h-11 pl-10.5 pr-10 text-sm bg-white text-[#171717] border rounded-lg placeholder:text-[#A3A3A3] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
                errors.newPassword
                  ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  : "border-[#E5E5E5] hover:border-[#D4D4D4] focus:border-[#FA5A55] focus:ring-4 focus:ring-[#FA5A55]/12 focus:outline-none"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center text-[#A3A3A3] hover:text-[#525252] transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-[18px] h-[18px]" />
              ) : (
                <Eye className="w-[18px] h-[18px]" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-xs text-[#DC2626]">{errors.newPassword.message}</p>
          )}

          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#737373]">
            <span className={hasMinLength ? "text-emerald-600 font-medium" : "text-[#737373]"}>
              {hasMinLength ? "✓" : "•"} 8+ characters
            </span>
            <span className={hasNumberOrSymbol ? "text-emerald-600 font-medium" : "text-[#737373]"}>
              {hasNumberOrSymbol ? "✓" : "•"} number or symbol
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-[#171717] mb-1.5"
          >
            Confirm new password
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-[#A3A3A3]">
              <Lock className="w-[18px] h-[18px]" />
            </span>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              placeholder="Confirm new password"
              className={`w-full h-11 pl-10.5 pr-10 text-sm bg-white text-[#171717] border rounded-lg placeholder:text-[#A3A3A3] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
                errors.confirmPassword
                  ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  : "border-[#E5E5E5] hover:border-[#D4D4D4] focus:border-[#FA5A55] focus:ring-4 focus:ring-[#FA5A55]/12 focus:outline-none"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center text-[#A3A3A3] hover:text-[#525252] transition-colors cursor-pointer"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-[18px] h-[18px]" />
              ) : (
                <Eye className="w-[18px] h-[18px]" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-[#DC2626]">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={resetPasswordMutation.isPending}
          className="w-full h-11 mt-2 flex items-center justify-center gap-2 bg-[#FA5A55] hover:bg-[#E63E39] active:scale-[0.99] text-white text-sm font-medium rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-150 disabled:opacity-60 cursor-pointer"
        >
          {resetPasswordMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Updating password...</span>
            </>
          ) : (
            <>
              <span>Reset password</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-[#737373]">
        Remember your password?{" "}
        <Link
          href="/login"
          className="text-[#FA5A55] hover:text-[#E63E39] font-medium hover:underline transition-colors ml-1"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default ResetPasswordForm;
