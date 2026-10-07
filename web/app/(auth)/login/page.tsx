import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | Venuo",
  description: "Sign in to your Venuo account to manage your venue bookings.",
  openGraph: {
    title: "Sign In | Venuo",
    description: "Sign in to your Venuo account to manage your venue bookings.",
  },
};

function LoginFallback() {
  return (
    <div className="w-full opacity-90">
      <div>
        <span className="font-serif text-[34px] sm:text-[38px] font-bold tracking-tight text-[#171717]">
          Venuo<span className="text-[#FA5A55]">.</span>
        </span>
        <p className="text-xs text-[#737373] tracking-normal mt-0.5 font-normal">
          Find. Book. Celebrate.
        </p>
      </div>
      <div className="mt-5 mb-4">
        <h1 className="font-serif text-[26px] sm:text-[28px] font-medium tracking-tight text-[#171717] leading-tight">
          Welcome back
        </h1>
        <p className="mt-1 text-xs sm:text-[13px] text-[#737373] leading-relaxed">
          Loading...
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}

