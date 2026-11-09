export type OwnerApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface OwnerApplicationUser {
  _id: string;
  fullName: string;
  email: string;
  profileImage?: string;
  ownerStatus: "PENDING" | "APPROVED" | "REJECTED" | "NONE";
  role: "user" | "venue_owner" | "admin";
  isActive: boolean;
  createdAt?: string;
}

export interface OwnerApplication {
  _id: string;
  user: OwnerApplicationUser;
  businessName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstNumber?: string;
  profileImage?: string;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OwnerApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface OwnerApplicationsQueryParams {
  ownerStatus?: OwnerApplicationStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface OwnerApplicationsPagination {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface OwnerApplicationsListResponse {
  success: boolean;
  applications: OwnerApplication[];
  totalCount: number;
  pagination: OwnerApplicationsPagination;
}

export interface OwnerApplicationDetailResponse {
  success: boolean;
  application: OwnerApplication;
}

export interface OwnerApplicationActionPayload {
  action: "APPROVED" | "REJECTED";
  rejectionReason?: string;
}

export interface OwnerApplicationActionResponse {
  success: boolean;
  message: string;
}

