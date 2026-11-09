import { apiClient } from "@/lib/api";
import {
  Category,
  CategoryListResponse,
  CategoryQueryParams,
} from "../types/category.types";

export const adminCategoriesService = {
  // Get paginated list of categories for admin
  getCategories: async (
    params?: CategoryQueryParams
  ): Promise<CategoryListResponse> => {
    const response = await apiClient.get<CategoryListResponse>(
      "/categories/admin-categori",
      {
        params,
      }
    );
    return response.data;
  },

  // Create new category with image upload
  createCategory: async (
    formData: FormData
  ): Promise<{ success: boolean; message: string; category: Category }> => {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      category: Category;
    }>("/categories", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update existing category with optional new image
  updateCategory: async (
    id: string,
    formData: FormData
  ): Promise<{ success: boolean; message: string; category: Category }> => {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
      category: Category;
    }>(`/categories/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Toggle active/inactive status
  toggleCategoryStatus: async (
    id: string
  ): Promise<{ success: boolean; message: string; category: Category }> => {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
      category: Category;
    }>(`/categories/${id}/toggle-status`);
    return response.data;
  },

  // Delete category with linked-venue safety check
  deleteCategory: async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{
      success: boolean;
      message: string;
    }>(`/categories/${id}`);
    return response.data;
  },
};

