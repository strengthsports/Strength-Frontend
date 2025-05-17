import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "~/utils/secureStore";

export const cricketApi = createApi({
  reducerPath: "cricketApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/sportsDataApi/cricket`,
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
    getCricketLiveMatches: builder.query({
      query: () => `/live`,
      transformResponse: (response: any) => {
        const liveMatches = Array.isArray(response.data.liveMatches)
          ? response.data.liveMatches
          : [];

        // console.log("Live Cricket Matches :", liveMatches);
        return { liveMatches };
      },
    }),
    getCricketNextMatches: builder.query({
      query: () => `/next`,
      transformResponse: (response: any) => {
        const nextMatches = Array.isArray(response.data.nextMatches)
          ? response.data.nextMatches
          : [];

        // console.log("Next Cricket Matches :", nextMatches);
        return { nextMatches };
      },
    }),
    getCricketNextMatchesBySeries: builder.query({
      query: () => `/next/series`,
      transformResponse: (response: any) => {
        const seriesMatches = Array.isArray(response.data.seriesMatches)
          ? response.data.seriesMatches
          : [];

        // console.log("Series Cricket Matches :", seriesMatches);
        return {
          seriesMatches,
        };
      },
    }),
    getCricketRecentMatches: builder.query({
      query: () => `/recent`,
      transformResponse: (response: any) => {
        const recentMatches = Array.isArray(response.data.recentMatches)
          ? response.data.recentMatches
          : [];

        // console.log("Recent Cricket Matches :", recentMatches);
        return { recentMatches };
      },
    }),
  }),
});

export const {
  useGetCricketLiveMatchesQuery,
  useGetCricketNextMatchesQuery,
  useGetCricketNextMatchesBySeriesQuery,
  useGetCricketRecentMatchesQuery,
} = cricketApi;
