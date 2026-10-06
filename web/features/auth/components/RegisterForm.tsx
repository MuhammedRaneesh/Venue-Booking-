"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { GoogleButton } from "./GoogleButton";
import { VerifyOtpForm } from "./VerifyOtpForm";
import { useRegisterMutation } from "../hooks/useRegister";
import { registerSchema, RegisterSchemaInput } from "../schemas/register.schema";

export function RegisterForm() {
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaInput>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: RegisterSchemaInput) => {
    setApiError(null);

    registerMutation.mutate(
      {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: "user",
      },
      {
        onSuccess: () => {
          setSubmittedEmail(data.email);
          setIsOtpStep(true);
        },
        onError: (err) => {
          setApiError(err.message || "Registration failed. Please try again.");
        },
      }
    );
  };

  // If in OTP Step, smoothly render the dedicated VerifyOtpForm
  if (isOtpStep) {
    return (
      <VerifyOtpForm
        email={submittedEmail}
        onBack={() => {
          setIsOtpStep(false);
          setApiError(null);
        }}
      />
    );
  }

  return (
    <div className="w-full">
      {/* Brand Header */}
      <div>
        <Link href="/" className="inline-block">
          <span className="font-serif text-[28px] sm:text-[30px] font-bold tracking-tight text-[#171717]">
            Venuo<span className="text-[#FA5A55]">.</span>
          </span>
        </Link>
        <p className="text-xs text-[#737373] font-normal tracking-normal mt-0.5">
          Find. Book. Celebrate.
        </p>
      </div>

      {/* Main Title & Subtitle */}
      <div className="mt-5 mb-4">
        <h1 className="font-serif text-[26px] sm:text-[28px] font-medium tracking-tight text-[#171717] leading-tight">
          Create your account
        </h1>
        <p className="mt-1 text-xs sm:text-[13px] text-[#737373] leading-relaxed">
          Join Venuo to discover and book amazing venues for your special moments.
        </p>
      </div>

      {/* Backend Error Banner */}
      {apiError && (
        <div className="flex items-start gap-2 p-2.5 mb-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Registration Form with React Hook Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-[#171717] mb-1.5"
          >
            Full name
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-[#A3A3A3]">
              <User className="w-[18px] h-[18px]" />
            </span>
            <input
              id="fullName"
              type="text"
              {...register("fullName")}
              placeholder="Enter your full name"
              className={`w-full h-11 pl-10.5 pr-4 text-sm bg-white text-[#171717] border rounded-lg placeholder:text-[#A3A3A3] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
                errors.fullName
                  ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  : "border-[#E5E5E5] hover:border-[#D4D4D4] focus:border-[#FA5A55] focus:ring-4 focus:ring-[#FA5A55]/12 focus:outline-none"
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-xs text-[#DC2626]">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email Address */}
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

        {/* Password */}
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
              placeholder="Create a password"
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
          {errors.password ? (
            <p className="mt-1 text-xs text-[#DC2626]">{errors.password.message}</p>
          ) : (
            <p className="mt-1 text-xs text-[#737373]">
              Use at least 8 characters with a mix of letters, numbers and symbols.
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full h-11 mt-1 flex items-center justify-center gap-2 bg-[#FA5A55] hover:bg-[#E63E39] active:scale-[0.99] text-white text-sm font-medium rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-150 disabled:opacity-60 cursor-pointer"
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Or Divider */}
      <div className="relative my-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E5E5E5]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-[#A3A3A3] text-xs">or</span>
        </div>
      </div>

      {/* Google OAuth Button */}
      <GoogleButton label="Continue with Google" />

      {/* Sign In Footer */}
      <p className="mt-3 text-center text-xs text-[#737373]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#FA5A55] hover:text-[#E63E39] font-medium hover:underline transition-colors ml-1"
        >
          Sign in
        </Link>
      </p>

      {/* Terms of Service & Privacy Policy Notice */}
      <p className="mt-3 text-center text-[11px] text-[#A3A3A3] leading-relaxed">
        By creating an account, you agree to Venuo&apos;s{" "}
        <Link href="/terms" className="text-[#FA5A55] hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-[#FA5A55] hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}

export default RegisterForm;
