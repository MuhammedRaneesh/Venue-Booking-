import type { Metadata } from "next";
import { AdminLayout } from "@/features/admin/components/AdminLayout";

export const metadata: Metadata = {
  title: "Admin Console — Venuo",
  description: "Venuo Administration and Operations Console",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}

