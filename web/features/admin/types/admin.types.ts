import { ComponentType } from "react";

export interface AdminNavItem {
  title: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  exact?: boolean;
  badge?: string | number;
  description?: string;
}

export interface AdminUserSummary {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
}

