"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { USER_QUERY_KEY } from "@/features/auth/hooks/useAuth";

export default function GoogleAuthSuccessPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    router.replace("/");
  }, [router, queryClient]);

  return (
    <div className="flex flex-col justify-center items-center text-center space-y-3 py-8">
      <Loader2 className="w-8 h-8 animate-spin text-[#FA5A55] mx-auto" />
      <p className="text-sm text-[#737373] font-medium">
        Completing sign in with Google...
      </p>
    </div>
  );
}
