import { api } from "@/api/baseApi";

export type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
};

export type CategoryQueryParams = {
  search?: string;
  status?: "active" | "inactive";
  page?: number;
  limit?: number;
};

export type CategoryListResponse = {
  success: boolean;
  categories: Category[];
  totalCount: number;
  pagination: {
    currentPage: number;
    Limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export type CategoryResponse = {
  success: boolean;
  message: string;
  category: Category;
};

export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryListResponse, CategoryQueryParams | void>({
      query: (params) => {
        const cleanParams = params
          ? Object.fromEntries(
              Object.entries(params).filter(([, value]) => value !== undefined && value !== "")
            )
          : undefined;

        return {
          url: "/categories/admin-categori",
          params: cleanParams,
        };
      },
      providesTags: ["Categories"],
    }),
    createCategory: builder.mutation<CategoryResponse, FormData>({
      query: (formData) => ({
        url: "/categories",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Categories"],
    }),
    updateCategory: builder.mutation<CategoryResponse, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),
    deleteCategory: builder.mutation<CategoryResponse, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
    toggleCategoryStatus: builder.mutation<CategoryResponse, string>({
      query: (id) => ({
        url: `/categories/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useToggleCategoryStatusMutation,
} = categoryApi;

