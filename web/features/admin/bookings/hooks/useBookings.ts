import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminBookingsService } from "../services/bookings.service";
import { BookingsQueryParams } from "../types/booking.types";
import { ApiError } from "@/lib/api";

export const ADMIN_BOOKINGS_KEYS = {
  all: ["admin", "bookings"] as const,
  stats: () => [...ADMIN_BOOKINGS_KEYS.all, "stats"] as const,
  list: (params?: BookingsQueryParams) =>
    [...ADMIN_BOOKINGS_KEYS.all, "list", params] as const,
  detail: (id: string) => [...ADMIN_BOOKINGS_KEYS.all, "detail", id] as const,
};

// Hook for fetching aggregated booking metrics
export function useBookingStats() {
  return useQuery({
    queryKey: ADMIN_BOOKINGS_KEYS.stats(),
    queryFn: () => adminBookingsService.getStats(),
    staleTime: 30 * 1000,
  });
}

// Hook for fetching paginated bookings list
export function useBookingsList(params?: BookingsQueryParams) {
  return useQuery({
    queryKey: ADMIN_BOOKINGS_KEYS.list(params),
    queryFn: () => adminBookingsService.getBookings(params),
    staleTime: 30 * 1000,
  });
}

// Hook for fetching single booking details
export function useBookingDetail(id: string | null) {
  return useQuery({
    queryKey: ADMIN_BOOKINGS_KEYS.detail(id || ""),
    queryFn: () => adminBookingsService.getBookingDetail(id || ""),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

// Hook for cancelling booking administratively
export function useAdminCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string },
    ApiError,
    { id: string; reason: string }
  >({
    mutationFn: ({ id, reason }) =>
      adminBookingsService.cancelBooking(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_BOOKINGS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

