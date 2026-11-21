export type CategoryStatus = "active" | "inactive";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  status: CategoryStatus;
  venueCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoriesApiResponse {
  success?: boolean;
  categories: Category[];
  totalCount?: number;
}

