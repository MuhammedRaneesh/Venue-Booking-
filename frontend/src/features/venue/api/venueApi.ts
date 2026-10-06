import { api } from "@/api/baseApi";
import { GetVenue, VenueQueryParams } from "@/features/owner/types/owner.type";

export const VenueApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getVenue: builder.query<GetVenue, VenueQueryParams>({
      query: (params) => {
        const cleanParams = Object.fromEntries(
          Object.entries(params).filter(([, value]) => value !== undefined)
        );
        return {
          url: "/venues",
          params: cleanParams,
        };
      },
    }),
    getVenueDetails : builder.query({
      query : (venueId)=>`/venues/${venueId}`
    })
  }),
});

export const { useGetVenueQuery  , useGetVenueDetailsQuery} = VenueApi;
