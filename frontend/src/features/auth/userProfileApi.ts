import { api } from "@/api/baseApi";
import { UpdateUserProfileResponse , GetUserProfileResponse } from "./types/auth.types";

export const userProfileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<GetUserProfileResponse, void>({
      query: () => "/user/profile",
      providesTags: ["Profile"] as any,
    }),
    updateUserProfile: builder.mutation<UpdateUserProfileResponse, FormData>({
      query: (data) => ({
        url: "/user/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Profile"] as any,
    }),
  }),
});

export const { useGetUserProfileQuery, useUpdateUserProfileMutation } = userProfileApi;
