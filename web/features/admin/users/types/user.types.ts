export interface UserStats {
  total: number;
  active: number;
  blocked: number;
  users: number;
  venueOwners: number;
}

export interface AdminUser {
  _id: string;
  fullName: string;
  email: string;
  role: "user" | "venue_owner";
  phoneNumber?: string;
  profileImage?: string;
  isActive: boolean;
  isVerified: boolean;
  ownerStatus?: "NONE" | "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt?: string;
}

export interface UsersQueryParams {
  search?: string;
  role?: "user" | "venue_owner";
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface UsersListResponse {
  success: boolean;
  user: AdminUser[];
  totalcount: number;
  pagination: {
    currentPage: number;
    Limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

