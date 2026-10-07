import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyForgotOtpClient } from "./VerifyForgotOtpClient";

export const metadata: Metadata = {
  title: "Verify Reset Code | Venuo",
  description: "Enter your 6-digit verification code to reset your Venuo account password.",
  openGraph: {
    title: "Verify Reset Code | Venuo",
    description: "Enter your 6-digit verification code to reset your Venuo account password.",
  },
};

function VerifyForgotOtpFallback() {
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
        <h1 className="font-serif text-[24px] sm:text-[26px] font-medium tracking-tight text-[#171717]">
          Verify reset code
        </h1>
        <p className="mt-1 text-xs sm:text-[13px] text-[#737373] leading-relaxed">
          Preparing verification code...
        </p>
      </div>
      <div className="flex items-center justify-between gap-2 sm:gap-2.5 my-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="w-11 h-12 sm:w-12 sm:h-12 rounded-lg bg-[#F5F5F5] border border-[#E5E5E5] animate-pulse"
          />
        ))}
      </div>
      <div className="w-full h-11 bg-[#FA5A55]/70 rounded-lg animate-pulse" />
    </div>
  );
}

export default function VerifyForgotOtpPage() {
  return (
    <Suspense fallback={<VerifyForgotOtpFallback />}>
      <VerifyForgotOtpClient />
    </Suspense>
  );
}
