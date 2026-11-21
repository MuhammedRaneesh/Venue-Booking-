"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { Category, CategoriesApiResponse } from "@/types/category";

export const CATEGORIES_QUERY_KEY = ["categories", "active"] as const;

export async function fetchCategories(): Promise<Category[]> {
  const response = await apiClient.get<CategoriesApiResponse | Category[]>("/categories");
  const data = response.data;
  const list = Array.isArray(data) ? data : data.categories ?? [];
  return list.filter((cat) => cat.status === "active");
}

export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });
}

export type { Category } from "@/types/category";

