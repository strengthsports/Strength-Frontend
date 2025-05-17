import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "~/utils/secureStore";

export const basketballApi = createApi({
  reducerPath: "basketballApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/sportsDataApi/basketball`,
    prepareHeaders: async (headers) => {
      const token = await getToken("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getBasketballLiveMatches: builder.query({
      query: () => `/live`,
      transformResponse: (response: any) => {
        const liveMatches = Array.isArray(response.data.liveMatches)
          ? response.data.liveMatches
          : [];

        // console.log("Live Basketball Matches :", liveMatches);
        return { liveMatches };
      },
    }),
    getBasketballNextMatches: builder.query({
      query: () => `/next`,
      transformResponse: (response: any) => {
        const nextMatches = Array.isArray(response.data.nextMatches)
          ? response.data.nextMatches
          : [];

        // console.log("Next Basketball Matches :", nextMatches);
        return { nextMatches };
      },
    }),
    getBasketballRecentMatches: builder.query({
      query: () => `/recent`,
      transformResponse: (response: any) => {
        const recentMatches = Array.isArray(response.data.recentMatches)
          ? response.data.recentMatches
          : [];

        // console.log("Recent Basketball Matches :", recentMatches);
        return { recentMatches };
      },
    }),
  }),
});

export const {
  useGetBasketballLiveMatchesQuery,
  useGetBasketballNextMatchesQuery,
  useGetBasketballRecentMatchesQuery,
} = basketballApi;
