import { Metadata } from "next";
import { UsersManagementView } from "@/features/admin/users";

export const metadata: Metadata = {
  title: "Users Management — Venuo Admin",
  description: "Monitor and moderate platform members and hosts.",
};

export default function AdminUsersPage() {
  return <UsersManagementView />;
}
