import { Metadata } from "next";
import { CategoriesManagementView } from "@/features/admin/categories";

export const metadata: Metadata = {
  title: "Categories Taxonomy — Venuo Admin",
  description: "Manage event occasion categories, banners, and taxonomy.",
};

export default function AdminCategoriesPage() {
  return <CategoriesManagementView />;
}
