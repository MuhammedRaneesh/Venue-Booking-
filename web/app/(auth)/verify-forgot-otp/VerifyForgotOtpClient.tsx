"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { VerifyForgotOtpForm } from "@/features/auth/components/VerifyForgotOtpForm";

export function VerifyForgotOtpClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  return (
    <VerifyForgotOtpForm
      email={email}
      onBack={() => router.push(`/forgot-password?email=${encodeURIComponent(email)}`)}
    />
  );
}

export default VerifyForgotOtpClient;
