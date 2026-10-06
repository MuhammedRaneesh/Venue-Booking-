import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Create your account | Venuo",
  description:
    "Join Venuo to discover and book extraordinary venues for weddings, meetings, dinners, and events.",
  openGraph: {
    title: "Create your account | Venuo",
    description:
      "Join Venuo to discover and book extraordinary venues for weddings, meetings, dinners, and events.",
  },
};

export default function RegisterPage() {
  return <RegisterForm />;
}
