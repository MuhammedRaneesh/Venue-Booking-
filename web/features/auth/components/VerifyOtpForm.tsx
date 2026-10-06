"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useVerifyOtpMutation, useResendOtpMutation } from "../hooks/useRegister";
import { otpSchema } from "../schemas/otp.schema";

interface VerifyOtpFormProps {
  email: string;
  onBack: () => void;
  onSuccess?: () => void;
}

export function VerifyOtpForm({ email, onBack, onSuccess }: VerifyOtpFormProps) {
  const router = useRouter();
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const verifyOtpMutation = useVerifyOtpMutation();
  const resendOtpMutation = useResendOtpMutation();

  // Cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleDigitChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;

    const updated = [...otpDigits];
    if (val.length > 1) {
      // Pasting full OTP
      const pasted = val.slice(0, 6).split("");
      pasted.forEach((d, i) => {
        if (i < 6) updated[i] = d;
      });
      setOtpDigits(updated);
      const nextIdx = Math.min(pasted.length, 5);
      inputRefs.current[nextIdx]?.focus();
      return;
    }

    updated[index] = val;
    setOtpDigits(updated);
    setError(null);

    // Auto advance
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpNumber = otpDigits.join("");

    const validation = otpSchema.safeParse({
      email: email.trim().toLowerCase(),
      otpNumber,
    });

    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Invalid OTP code");
      return;
    }

    verifyOtpMutation.mutate(
      {
        email: email.trim().toLowerCase(),
        otpNumber,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          if (onSuccess) {
            onSuccess();
          } else {
            setTimeout(() => {
              router.push("/login");
            }, 1800);
          }
        },
        onError: (err) => {
          setError(err.message || "Invalid or expired OTP code.");
        },
      }
    );
  };

  const handleResend = () => {
    if (resendCooldown > 0 || resendOtpMutation.isPending) return;

    setError(null);
    setResendMessage(null);

    resendOtpMutation.mutate(
      { email: email.trim().toLowerCase() },
      {
        onSuccess: (data) => {
          setResendCooldown(60);
          setResendMessage(data.result?.message || "New verification code sent!");
        },
        onError: (err) => {
          setError(err.message || "Failed to resend code. Please try again.");
        },
      }
    );
  };

  if (isSuccess) {
    return (
      <div className="w-full text-center py-4">
        <div className="w-13 h-13 bg-[#FFF5F5] text-[#FA5A55] rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h2 className="font-serif text-2xl font-medium text-[#171717] mb-1.5">
          Account Verified!
        </h2>
        <p className="text-xs sm:text-[13px] text-[#737373] max-w-xs mx-auto mb-4">
          Your account has been created successfully. Redirecting you to sign in...
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center h-10 px-5 bg-[#FA5A55] hover:bg-[#E63E39] text-white text-xs font-medium rounded-lg transition-colors"
        >
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs text-[#737373] hover:text-[#171717] transition-colors mb-3.5 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to form</span>
      </button>

      {/* Brand Header */}
      <div>
        <Link href="/" className="inline-block">
          <span className="font-serif text-[28px] sm:text-[30px] font-bold tracking-tight text-[#171717]">
            Venuo<span className="text-[#FA5A55]">.</span>
          </span>
        </Link>
        <p className="text-xs text-[#737373] tracking-normal mt-0.5 font-normal">
          Find. Book. Celebrate.
        </p>
      </div>

      {/* Title */}
      <div className="mt-4 mb-4">
        <h1 className="font-serif text-[22px] sm:text-[25px] font-medium tracking-tight text-[#171717]">
          Verify your email
        </h1>
        <p className="mt-1 text-xs sm:text-[13px] text-[#737373] leading-relaxed">
          We sent a 6-digit code to <span className="font-medium text-[#171717]">{email}</span>.
          Enter it below to complete registration.
        </p>
      </div>

      {/* Feedback alerts */}
      {error && (
        <div className="flex items-start gap-2 p-2.5 mb-3 text-xs bg-red-50 border border-red-200 text-red-600 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {resendMessage && (
        <div className="flex items-start gap-2 p-2.5 mb-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{resendMessage}</span>
        </div>
      )}

      {/* OTP Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between gap-2 sm:gap-2.5">
          {otpDigits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-11 h-12 sm:w-12 sm:h-12 text-center text-lg font-semibold bg-white text-[#171717] border border-[#E5E5E5] hover:border-[#D4D4D4] rounded-lg focus:border-[#FA5A55] focus:ring-4 focus:ring-[#FA5A55]/12 outline-none transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              autoFocus={idx === 0}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={verifyOtpMutation.isPending}
          className="w-full h-11 flex items-center justify-center gap-2 bg-[#FA5A55] hover:bg-[#E63E39] active:scale-[0.99] text-white text-sm font-medium rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-150 disabled:opacity-60 cursor-pointer"
        >
          {verifyOtpMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying code...</span>
            </>
          ) : (
            <>
              <span>Complete registration</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Resend footer */}
      <div className="mt-3.5 text-center text-xs text-[#737373]">
        Didn&apos;t receive code?{" "}
        {resendCooldown > 0 ? (
          <span className="text-[#A3A3A3] font-medium">Resend in {resendCooldown}s</span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resendOtpMutation.isPending}
            className="text-[#FA5A55] hover:text-[#E63E39] font-medium hover:underline cursor-pointer"
          >
            {resendOtpMutation.isPending ? "Sending..." : "Resend code"}
          </button>
        )}
      </div>
    </div>
  );
}

export default VerifyOtpForm;
