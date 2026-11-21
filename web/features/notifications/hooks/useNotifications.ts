"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { apiClient } from "@/lib/api";

export const NOTIFICATION_KEYS = {
  all: ["notifications"] as const,
  unreadCount: () => [...NOTIFICATION_KEYS.all, "unread-count"] as const,
};

export function useUnreadCount(enabled: boolean = true) {
  return useQuery<number>({
    queryKey: NOTIFICATION_KEYS.unreadCount(),
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; count: number }>(
        "/notification/unread-count"
      );
      return response.data?.count ?? 0;
    },
    enabled,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useNotificationSocket(userId?: string | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      (process.env.NEXT_PUBLIC_API_URL
        ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "")
        : "http://localhost:7000");

    const socket = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      socket.emit("join", userId);
    });

    socket.on("notification", () => {
      queryClient.setQueryData<number>(
        NOTIFICATION_KEYS.unreadCount(),
        (prev) => (typeof prev === "number" ? prev + 1 : 1)
      );
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_KEYS.unreadCount(),
      });
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_KEYS.all,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, queryClient]);
}
