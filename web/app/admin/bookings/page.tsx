import { Metadata } from "next";
import { BookingsManagementView } from "@/features/admin/bookings";

export const metadata: Metadata = {
  title: "Bookings Management — Venuo Admin",
  description: "Monitor and manage reservations and settlements on Venuo",
};

export default function AdminBookingsPage() {
  return <BookingsManagementView />;
}
