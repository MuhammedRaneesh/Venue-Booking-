export type CategoryStatus = "active" | "inactive";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  status: CategoryStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CategoryQueryParams {
  search?: string;
  status?: CategoryStatus;
  page?: number;
  limit?: number;
}

export interface CategoryPagination {
  currentPage: number;
  Limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CategoryListResponse {
  success: boolean;
  categories: Category[];
  totalCount: number;
  pagination: CategoryPagination;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  status: CategoryStatus;
  image?: File | null;
}

