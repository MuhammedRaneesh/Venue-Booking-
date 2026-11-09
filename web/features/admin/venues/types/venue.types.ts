export type VenueStatus = "pending" | "approved" | "rejected" | "suspended";

export interface VenueOwner {
  _id: string;
  fullName: string;
  email: string;
  profileImage?: string;
  phoneNumber?: string;
}

export interface VenueAddress {
  place: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
}

export interface VenueLocation {
  type?: string;
  coordinates?: [number, number];
  address: VenueAddress;
}

export interface VenuePricing {
  pricePerHour: number;
  pricePerDay: number;
}

export interface VenueAvailability {
  openTime: string;
  closeTime: string;
}

export interface AdminVenue {
  _id: string;
  owner: VenueOwner;
  venueName: string;
  description?: string;
  category: string;
  capacity: number;
  pricing: VenuePricing;
  amenities?: string[];
  photos: string[];
  location: VenueLocation;
  availability?: VenueAvailability;
  status: VenueStatus;
  rejectionReason?: string | null;
  isActive: boolean;
  isFeatured?: boolean;
  averageRating?: number;
  totalReviews?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface VenueStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  suspended: number;
  active: number;
  inactive: number;
}

export interface VenuesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: VenueStatus;
  category?: string;
  district?: string;
}

export interface VenuesListResponse {
  venues: AdminVenue[];
  totalCount: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface VenueDetailResponse {
  venue: AdminVenue;
}

export interface UpdateVenueStatusPayload {
  status: VenueStatus;
  reason?: string;
}

