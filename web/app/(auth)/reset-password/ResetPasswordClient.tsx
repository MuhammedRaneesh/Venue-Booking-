"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return <ResetPasswordForm email={email} />;
}

export default ResetPasswordClient;
