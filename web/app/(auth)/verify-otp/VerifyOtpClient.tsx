"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { VerifyOtpForm } from "@/features/auth/components/VerifyOtpForm";

export function VerifyOtpClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  return (
    <VerifyOtpForm
      email={email}
      onBack={() => router.push("/register")}
    />
  );
}
