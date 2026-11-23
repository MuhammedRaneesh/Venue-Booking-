import { LucideIcon } from "lucide-react";

export interface OwnerNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: number | string;
  hasIndicator?: boolean;
  isDividerAfter?: boolean;
}

export interface OwnerDashboardSummary {
  totalVenues: number;
  activeVenues: number;
  inactiveVenues: number;
  totalBookings: number;
  pendingBookings: number;
  totalEarnings: number;
  recentBookings?: Array<{
    _id: string;
    bookingNumber?: string;
    totalAmount: number;
    bookingStatus: string;
    eventDate?: string;
    createdAt: string;
    user?: {
      fullName?: string;
      email?: string;
    } | null;
    venue?: {
      venueName: string;
    } | null;
  }>;
}

export interface OwnerVenue {
  _id: string;
  venueName: string;
  category?: {
    name: string;
  };
  city?: string;
  status?: "pending" | "approved" | "rejected" | "suspended";
  isActive?: boolean;
  capacity?: number;
  pricePerDay?: number;
  images?: string[];
}
