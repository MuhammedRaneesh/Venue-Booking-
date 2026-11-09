import { apiClient } from "@/lib/api";
import {
  AdminBooking,
  BookingDetailResponse,
  BookingsListResponse,
  BookingsQueryParams,
  BookingStats,
} from "../types/booking.types";

export const adminBookingsService = {
  // Get aggregated booking metrics & revenue counts
  getStats: async (): Promise<BookingStats> => {
    const response = await apiClient.get<{
      success: boolean;
      stats: BookingStats;
    }>("/admin/bookings/stats");
    return response.data.stats;
  },

  // Get paginated list of bookings with status and date filters
  getBookings: async (
    params?: BookingsQueryParams
  ): Promise<BookingsListResponse> => {
    const response = await apiClient.get<BookingsListResponse>(
      "/admin/bookings",
      {
        params,
      }
    );
    return response.data;
  },

  // Get single booking detailed dossier
  getBookingDetail: async (id: string): Promise<AdminBooking> => {
    const response = await apiClient.get<BookingDetailResponse>(
      `/admin/bookings/${id}`
    );
    return response.data.booking;
  },

  // Administrative cancellation of a booking
  cancelBooking: async (
    id: string,
    reason: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
    }>(`/admin/bookings/${id}/cancel`, { reason });
    return response.data;
  },
};

