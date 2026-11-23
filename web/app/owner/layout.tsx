import type { Metadata } from "next";
import { OwnerLayout } from "@/features/owner/components/OwnerLayout";

export const metadata: Metadata = {
  title: "Host Dashboard — Venuo",
  description: "Manage your venues, bookings, availability, and earnings on Venuo.",
};

export default function OwnerRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OwnerLayout>{children}</OwnerLayout>;
}
