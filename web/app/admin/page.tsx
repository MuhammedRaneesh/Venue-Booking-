import { Metadata } from "next";
import { DashboardView } from "@/features/admin/dashboard";

export const metadata: Metadata = {
  title: "Dashboard — Venuo Admin",
  description: "Executive platform analytics and operational overview",
};

export default function AdminDashboardPage() {
  return <DashboardView />;
}
