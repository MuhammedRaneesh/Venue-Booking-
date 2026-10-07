"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export function ForgotPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  return (
    <ForgotPasswordForm
      initialEmail={email}
      onBack={() => router.push("/login")}
    />
  );
}

export default ForgotPasswordClient;
