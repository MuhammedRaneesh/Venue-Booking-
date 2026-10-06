import { Mutex } from "async-mutex";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "@/features/auth/slices/authSlice";

const mutex = new Mutex();

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  credentials: "include",
});

const baseQueryWithRefresh: typeof rawBaseQuery = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await rawBaseQuery(
          { url: "/auth/refresh-token", method: "POST" },
          api,
          extraOptions
        );
        if (refreshResult.data) {
          result = await rawBaseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRefresh,
  tagTypes: [
    "Availability",
    "MyBookings",
    "Venue",
    "Wishlist",
    "Dashboard" ,
    "Users",
    "OwnerApplications",
    "Bookings",
    "Notifications",
    "Categories"
  ],
  endpoints: () => ({}),
});
