export type BookingStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "completed"
  | "expired";

export type PaymentStatus = "unpaid" | "fully_paid" | "refunded";

export interface BookingUser {
  _id: string;
  fullName: string;
  email: string;
  profileImage?: string;
  phoneNumber?: string;
}

export interface BookingVenue {
  _id: string;
  venueName: string;
  category?: string;
  photos?: string[];
  location?: {
    address?: {
      place?: string;
      city?: string;
      district?: string;
      state?: string;
      pincode?: string;
    };
  };
}

export interface BookingOwner {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
}

export interface AdminBooking {
  _id: string;
  userId: BookingUser;
  venueId: BookingVenue;
  ownerId?: BookingOwner;
  bookingDate: string;
  startDateTime?: string;
  endDateTime?: string;
  eventType: string;
  guestCount: number;
  specialRequest?: string;
  totalAmount: number;
  platformFee: number;
  ownerPayout: number;
  bookingStatus: BookingStatus;
  bookingType?: "hourly" | "full-day";
  paymentType?: string;
  amountPaid?: number;
  paymentStatus: PaymentStatus;
  cancelledAt?: string | null;
  cancellationReason?: string;
  paidAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface BookingStats {
  total: number;
  pending: number;
  approved: number;
  completed: number;
  cancelled: number;
  fullyPaid: number;
  unpaid: number;
  totalRevenue: number;
  totalPlatformFees: number;
}

export interface BookingsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  bookingStatus?: BookingStatus;
  paymentStatus?: PaymentStatus;
  startDate?: string;
  endDate?: string;
}

export interface BookingsListResponse {
  bookings: AdminBooking[];
  totalCount: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface BookingDetailResponse {
  booking: AdminBooking;
}

