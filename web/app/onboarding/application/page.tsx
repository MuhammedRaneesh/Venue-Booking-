"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { OwnerOnboardingForm } from "@/features/owner/components/OwnerOnboardingForm";
import {
  ApplicationPendingCard,
  ApplicationApprovedCard,
} from "@/features/owner/components/ApplicationStatusCards";
import { Loader2 } from "lucide-react";

export default function OwnerApplicationPage() {
  const router = useRouter();
  const { data, isLoading: isAuthLoading } = useCurrentUser();
  const user = data?.user;

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/login?redirect=/onboarding/application");
    }
  }, [isAuthLoading, user, router]);

  if (isAuthLoading) {
    return (
      <div className="w-full h-full max-w-[620px] mx-auto px-4 sm:px-6 flex items-center justify-center animate-pulse">
        <div className="w-full h-[460px] rounded-3xl bg-muted/60" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin text-coral-500" />
        <p className="text-xs sm:text-sm font-medium">Redirecting to sign in...</p>
      </div>
    );
  }

  const ownerStatus = user.ownerStatus || "NONE";

  return (
    <div className="w-full h-full max-w-[620px] mx-auto px-4 sm:px-6 flex items-center justify-center overflow-hidden">
      <div className="w-full">
        {ownerStatus === "PENDING" && (
          <ApplicationPendingCard userEmail={user.email} />
        )}

        {ownerStatus === "APPROVED" && <ApplicationApprovedCard />}

        {ownerStatus === "REJECTED" && (
          <OwnerOnboardingForm user={user} rejected={true} />
        )}

        {ownerStatus === "NONE" && <OwnerOnboardingForm user={user} />}
      </div>
    </div>
  );
}
