import { Metadata } from "next";
import { VenuesManagementView } from "@/features/admin/venues";

export const metadata: Metadata = {
  title: "Venues Management — Venuo Admin",
  description: "Curate and moderate venue listings on Venuo",
};

export default function AdminVenuesPage() {
  return <VenuesManagementView />;
}
