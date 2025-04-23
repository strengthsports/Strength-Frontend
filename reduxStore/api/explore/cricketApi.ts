import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = process.env.EXPO_PUBLIC_CRICKET_API_BASE_URL;
const API_KEY = process.env.EXPO_PUBLIC_CRICKET_API;

if (!API_KEY || !API_BASE_URL) {
  throw new Error("Missing API Key or BASE URL in environment variables");
}

export const cricketApi = createApi({
  reducerPath: "cricketApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("x-rapidapi-key", API_KEY);
      headers.set("x-rapidapi-host", "cricket-live-line1.p.rapidapi.com");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCricketLiveMatches: builder.query({
      query: () => `/liveMatches`,
      transformResponse: (response: any) => {
        const matches = response.data || [];

        // Extract live matches
        // Extra checking for live match
        const liveMatches = matches.filter(
          (match: any) => match.match_status === "Live"
        );

        return { liveMatches };
      },
    }),
    getCricketNextMatches: builder.query({
      query: () => `/upcomingMatches`,
      transformResponse: (response: any) => {
        const matches = response.data || [];

        // Extract next matches
        // Extra checking for next match
        const nextMatches = matches.filter(
          (match: any) => match.match_status === "Upcoming"
        );

        return { nextMatches };
      },
    }),
    getCricketRecentMatches: builder.query({
      query: () => `/recentMatches`,
      transformResponse: (response: any) => {
        const matches = response.data || [];

        // Extract recent matches
        // Extra checking for recent match
        const recentMatches = matches.filter(
          (match: any) => match.match_status === "Finished"
        );

        return { recentMatches };
      },
    }),
  }),
});

export const {
  useGetCricketLiveMatchesQuery,
  useGetCricketNextMatchesQuery,
  useGetCricketRecentMatchesQuery,
} = cricketApi;
