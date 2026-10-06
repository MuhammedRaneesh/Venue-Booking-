import { api } from "@/api/baseApi";

export const wishlistApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: () => "/wishlist",
      providesTags: ["Wishlist"],
    }),
    addWishlist: builder.mutation({
      query: (venueId) => ({
        url: "/wishlist/add",
        method: "POST",
        body: { venueId },
      }),
      invalidatesTags: ["Wishlist"],
    }),
    removeWishlist: builder.mutation({
      query: (venueId) => ({
        url: `/wishlist/remove/${venueId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddWishlistMutation,
  useRemoveWishlistMutation,
} = wishlistApi;
