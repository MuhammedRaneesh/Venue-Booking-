"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import gsap from "gsap";
import { GoogleButton } from "./GoogleButton";
import { useLoginMutation } from "../hooks/useLogin";
import { loginSchema, LoginSchemaInput } from "../schemas/login.schema";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const loginMutation = useLoginMutation();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "google_failed") {
      setApiError("Google sign-in was cancelled or failed. Please try again.");
    }
  }, [searchParams]);

  useEffect(() => {
    router.prefetch("/register");
    router.prefetch("/forgot-password");
  }, [router]);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, x: -16, scale: 0.99 },
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
    watch,
    formState: { errors },
  } = useForm<LoginSchemaInput>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const enteredEmail = watch("email");

  const onSubmit = (data: LoginSchemaInput) => {
    if (isNavigating) return;
    setApiError(null);

    loginMutation.mutate(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          setIsNavigating(true);

          if (containerRef.current) {
            gsap.to(containerRef.current, {
              opacity: 0,
              scale: 0.98,
              y: -10,
              duration: 0.22,
              ease: "power2.inOut",
            });
          }

          router.push("/");
        },
        onError: (err) => {
          setApiError(err.message || "Invalid email or password. Please try again.");
        },
      }
    );
  };

  const handleNavigateToRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isNavigating) return;
    setIsNavigating(true);

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        x: -20,
        opacity: 0,
        scale: 0.98,
        duration: 0.22,
        ease: "power2.inOut",
      });
    }

    router.push("/register");
  };

  const handleNavigateToForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isNavigating) return;
    setIsNavigating(true);

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        x: -20,
        opacity: 0,
        scale: 0.98,
        duration: 0.22,
        ease: "power2.inOut",
      });
    }

    const emailQuery = enteredEmail ? `?email=${encodeURIComponent(enteredEmail)}` : "";
    router.push(`/forgot-password${emailQuery}`);
  };

  const isEmailUnverified =
    apiError?.toLowerCase().includes("verify your email") ||
    apiError?.toLowerCase().includes("not verified");

  return (
    <div ref={containerRef} className="w-full">
      <div>
        <Link href="/" className="inline-block">
          <span className="font-serif text-[34px] sm:text-[38px] font-bold tracking-tight text-[#171717]">
            Venuo<span className="text-[#FA5A55]">.</span>
          </span>
        </Link>
        <p className="text-xs text-[#737373] font-normal tracking-normal mt-0.5">
          Find. Book. Celebrate.
        </p>
      </div>

      <div className="mt-5 mb-4">
        <h1 className="font-serif text-[26px] sm:text-[28px] font-medium tracking-tight text-[#171717] leading-tight">
          Welcome back
        </h1>
        <p className="mt-1 text-xs sm:text-[13px] text-[#737373] leading-relaxed">
          Sign in to your account to manage your bookings and venues.
        </p>
      </div>

      {apiError && (
        <div className="flex items-start gap-2 p-2.5 mb-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1">
            <span>{apiError}</span>
            {isEmailUnverified && (
              <span className="block mt-1 font-medium">
                <Link
                  href={`/verify-otp?email=${encodeURIComponent(enteredEmail || "")}`}
                  className="text-red-700 underline hover:text-[#171717] transition-colors"
                >
                  Verify your email now &rarr;
                </Link>
              </span>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#171717] mb-1.5"
          >
            Email address
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-[#A3A3A3]">
              <Mail className="w-[18px] h-[18px]" />
            </span>
            <input
              id="email"
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

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#171717] mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-[#A3A3A3]">
              <Lock className="w-[18px] h-[18px]" />
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Enter your password"
              className={`w-full h-11 pl-10.5 pr-10 text-sm bg-white text-[#171717] border rounded-lg placeholder:text-[#A3A3A3] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
                errors.password
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
          {errors.password && (
            <p className="mt-1 text-xs text-[#DC2626]">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-0.5 pb-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="w-4 h-4 rounded border-[#D4D4D4] text-[#FA5A55] accent-[#FA5A55] focus:ring-[#FA5A55] cursor-pointer"
            />
            <span className="text-xs text-[#737373]">Remember me</span>
          </label>

          <button
            type="button"
            onClick={handleNavigateToForgotPassword}
            className="text-xs text-[#FA5A55] hover:text-[#E63E39] font-medium hover:underline transition-colors cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending || isNavigating}
          className="w-full h-11 mt-1 flex items-center justify-center gap-2 bg-[#FA5A55] hover:bg-[#E63E39] active:scale-[0.99] text-white text-sm font-medium rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-150 disabled:opacity-60 cursor-pointer"
        >
          {loginMutation.isPending || isNavigating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isNavigating ? "Redirecting..." : "Signing in..."}</span>
            </>
          ) : (
            <>
              <span>Sign in</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="relative my-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E5E5E5]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-[#A3A3A3] text-xs">or</span>
        </div>
      </div>

      <GoogleButton label="Continue with Google" />

      <p className="mt-3 text-center text-xs text-[#737373]">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={handleNavigateToRegister}
          className="text-[#FA5A55] hover:text-[#E63E39] font-medium hover:underline transition-colors ml-1 cursor-pointer"
        >
          Sign up
        </button>
      </p>
    </div>
  );
}

export default LoginForm;
