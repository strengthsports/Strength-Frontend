import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "~/utils/secureStore";

export const footballApi = createApi({
  reducerPath: "footballApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/sportsDataApi/football`,
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
    getFootballLiveMatches: builder.query({
      query: () => `/live`,
      transformResponse: (response: any) => {
        const liveMatches = Array.isArray(response.data.liveMatches)
          ? response.data.liveMatches
          : [];

        // console.log("Live Football Matches :", liveMatches);
        return { liveMatches };
      },
    }),
    getFootballNextMatches: builder.query({
      query: () => `/next`,
      transformResponse: (response: any) => {
        const nextMatches = Array.isArray(response.data.nextMatches)
          ? response.data.nextMatches
          : [];

        // console.log("Next Football Matches :", nextMatches);
        return { nextMatches };
      },
    }),
    getFootballRecentMatches: builder.query({
      query: () => `/recent`,
      transformResponse: (response: any) => {
        const recentMatches = Array.isArray(response.data.recentMatches)
          ? response.data.recentMatches
          : [];

        const recentTrendingMatches = Array.isArray(
          response.data.recentTrendingMatches
        )
          ? response.data.recentTrendingMatches
          : [];

        // console.log("Recent Football Matches :", recentMatches);
        return { recentMatches, recentTrendingMatches };
      },
    }),
  }),
});

export const {
  useGetFootballLiveMatchesQuery,
  useGetFootballNextMatchesQuery,
  useGetFootballRecentMatchesQuery,
} = footballApi;
