import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminCategoriesService } from "../services/categories.service";
import {
  Category,
  CategoryQueryParams,
  CategoryListResponse,
} from "../types/category.types";
import { ApiError } from "@/lib/api";

export const ADMIN_CATEGORIES_KEYS = {
  all: ["admin", "categories"] as const,
  list: (params?: CategoryQueryParams) =>
    [...ADMIN_CATEGORIES_KEYS.all, "list", params] as const,
};

// Fetch categories list with filters and pagination
export function useCategoriesList(params?: CategoryQueryParams) {
  return useQuery<CategoryListResponse, ApiError>({
    queryKey: ADMIN_CATEGORIES_KEYS.list(params),
    queryFn: () => adminCategoriesService.getCategories(params),
    staleTime: 30 * 1000,
  });
}

// Create category mutation
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string; category: Category },
    ApiError,
    FormData
  >({
    mutationFn: (formData: FormData) =>
      adminCategoriesService.createCategory(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEYS.all });
    },
  });
}

// Update category mutation
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string; category: Category },
    ApiError,
    { id: string; formData: FormData }
  >({
    mutationFn: ({ id, formData }) =>
      adminCategoriesService.updateCategory(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEYS.all });
    },
  });
}

// Toggle category active/inactive status mutation
export function useToggleCategoryStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string; category: Category },
    ApiError,
    string
  >({
    mutationFn: (id: string) =>
      adminCategoriesService.toggleCategoryStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEYS.all });
    },
  });
}

// Delete category mutation
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string },
    ApiError,
    string
  >({
    mutationFn: (id: string) => adminCategoriesService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEYS.all });
    },
  });
}

