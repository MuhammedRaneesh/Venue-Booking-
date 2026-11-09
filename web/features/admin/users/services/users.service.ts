import { apiClient } from "@/lib/api";
import {
  AdminUser,
  UsersListResponse,
  UsersQueryParams,
  UserStats,
} from "../types/user.types";

export const adminUsersService = {
  // Get aggregated user statistics for metric cards (excluding admin)
  getUserStats: async (): Promise<UserStats> => {
    const response = await apiClient.get<{
      success: boolean;
      data: UserStats;
    }>("/admin/users/stats");
    return response.data.data;
  },

  // Get paginated users with filters
  getUsers: async (params?: UsersQueryParams): Promise<UsersListResponse> => {
    const response = await apiClient.get<UsersListResponse>(
      "/admin/users/allusers",
      {
        params,
      }
    );
    return response.data;
  },

  // Toggle user block / active status
  toggleUserStatus: async (
    userId: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
    }>(`/admin/users/${userId}/status-change`);
    return response.data;
  },

  // Get single user profile details
  getUserDetails: async (
    userId: string
  ): Promise<{ success: boolean; user: AdminUser }> => {
    const response = await apiClient.get<{
      success: boolean;
      user: AdminUser;
    }>(`/admin/users/${userId}/details`);
    return response.data;
  },
};

