import { Metadata } from "next";
import { ApplicationsManagementView } from "@/features/admin/applications";

export const metadata: Metadata = {
  title: "Host Applications — Venuo Admin",
  description: "Review and verify venue owner onboarding applications and KYC credentials.",
};

export default function AdminApplicationsPage() {
  return <ApplicationsManagementView />;
}
