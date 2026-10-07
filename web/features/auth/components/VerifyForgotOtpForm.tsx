"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import { useVerifyForgotOtpMutation, useForgotPasswordMutation } from "../hooks/useLogin";
import { verifyForgotOtpSchema } from "../schemas/verify-forgot-otp.schema";

interface VerifyForgotOtpFormProps {
  email: string;
  onBack?: () => void;
}

export function VerifyForgotOtpForm({ email, onBack }: VerifyForgotOtpFormProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(180);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const verifyOtpMutation = useVerifyForgotOtpMutation();
  const resendOtpMutation = useForgotPasswordMutation();

  useEffect(() => {
    router.prefetch("/forgot-password");
    router.prefetch("/reset-password");
  }, [router]);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { x: 20, opacity: 0, scale: 0.98 },
        { x: 0, opacity: 1, scale: 1, duration: 0.28, ease: "power2.out" }
      );
    }

    const inputs = inputRefs.current.filter(Boolean);
    if (inputs.length > 0) {
      gsap.fromTo(
        inputs,
        { y: 10, opacity: 0, scale: 0.92 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.3,
          stagger: 0.035,
          ease: "back.out(1.5)",
          delay: 0.06,
        }
      );
    }

    return () => {
      if (containerRef.current) {
        gsap.killTweensOf(containerRef.current);
      }
    };
  }, []);

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
    if (isNavigating) return;
    setError(null);

    const otpNumber = otpDigits.join("");
    const validation = verifyForgotOtpSchema.safeParse({ otpNumber });

    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Please enter all 6 digits");
      return;
    }

    verifyOtpMutation.mutate(
      {
        email: email.trim().toLowerCase(),
        otp: otpNumber,
      },
      {
        onSuccess: () => {
          setIsNavigating(true);
          const targetUrl = `/reset-password?email=${encodeURIComponent(email)}`;

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
        onSuccess: () => {
          setResendCooldown(180);
          setResendMessage("A new verification code has been dispatched to your email.");
        },
        onError: (err) => {
          setError(err.message || "Failed to resend code. Please try again.");
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
      router.push(`/forgot-password?email=${encodeURIComponent(email)}`);
    }
  };

  const formatCooldown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
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
        <span>Back to forgot password</span>
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
          Verify reset code
        </h1>
        <p className="mt-1 text-xs sm:text-[13px] text-[#737373] leading-relaxed">
          We sent a 6-digit code to <span className="font-medium text-[#171717]">{email || "your email"}</span>.
          Enter it below to reset your password.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-2.5 mb-3 text-xs bg-red-50 border border-red-200 text-red-600 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {resendMessage && (
        <div className="flex items-start gap-2 p-2.5 mb-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
          <span>{resendMessage}</span>
        </div>
      )}

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
          disabled={verifyOtpMutation.isPending || isNavigating}
          className="w-full h-11 flex items-center justify-center gap-2 bg-[#FA5A55] hover:bg-[#E63E39] active:scale-[0.99] text-white text-sm font-medium rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-150 disabled:opacity-60 cursor-pointer"
        >
          {verifyOtpMutation.isPending || isNavigating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isNavigating ? "Redirecting..." : "Verifying code..."}</span>
            </>
          ) : (
            <>
              <span>Verify code</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-3.5 text-center text-xs text-[#737373]">
        Didn&apos;t receive code?{" "}
        {resendCooldown > 0 ? (
          <span className="text-[#A3A3A3] font-medium">Resend in {formatCooldown(resendCooldown)}</span>
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

export default VerifyForgotOtpForm;
