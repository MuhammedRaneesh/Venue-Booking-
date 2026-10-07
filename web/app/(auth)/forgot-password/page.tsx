import type { Metadata } from "next";
import { Suspense } from "react";
import { ForgotPasswordClient } from "./ForgotPasswordClient";

export const metadata: Metadata = {
  title: "Reset your password | Venuo",
  description:
    "Enter your email to receive password reset instructions for your Venuo account.",
  openGraph: {
    title: "Reset your password | Venuo",
    description:
      "Enter your email to receive password reset instructions for your Venuo account.",
  },
};

function ForgotPasswordFallback() {
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
      <div className="mt-4 mb-4">
        <h1 className="font-serif text-[24px] sm:text-[26px] font-medium tracking-tight text-[#171717] leading-tight">
          Reset your password
        </h1>
        <p className="mt-1 text-xs sm:text-[13px] text-[#737373] leading-relaxed">
          Loading...
        </p>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<ForgotPasswordFallback />}>
      <ForgotPasswordClient />
    </Suspense>
  );
}
