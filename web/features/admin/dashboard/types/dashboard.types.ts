export type DashboardPeriod = "all" | "this_year" | "this_month";

export interface MonthlyStat {
  _id: {
    year: number;
    month: number;
  };
  totalRevenue: number;
  platformFees: number;
  bookingsCount: number;
}

export interface DashboardRecentBooking {
  _id: string;
  eventType: string;
  totalAmount: number;
  platformFee: number;
  bookingStatus: string;
  paymentStatus: string;
  bookingDate: string;
  createdAt: string;
  userId?: {
    _id?: string;
    fullName?: string;
    email?: string;
    profileImage?: string;
    phoneNumber?: string;
  };
  venueId?: {
    _id?: string;
    venueName?: string;
    category?: string;
    photos?: string[];
    location?: {
      address?: {
        city?: string;
        place?: string;
        district?: string;
      };
    };
  };
}

export interface DashboardSummary {
  users: {
    total: number;
    owners: number;
    pendingOwnerApplications: number;
  };
  venues: {
    approved: number;
    pending: number;
    totalVenue: number;
  };
  bookings: {
    active: number;
    completed: number;
    cancelled: number;
    totalBooking: number;
  };
  revenue: {
    totalRevenue: number;
    totalPlatformFees: number;
  };
  monthlyStats?: MonthlyStat[];
  recentBookings: DashboardRecentBooking[];
}

export interface DashboardSummaryResponse {
  success: boolean;
  data: DashboardSummary;
}

