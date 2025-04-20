import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = process.env.EXPO_PUBLIC_FOOTBALL_API_BASE_URL;
const API_KEY = process.env.EXPO_PUBLIC_FOOTBALL_API;

if (!API_KEY || !API_BASE_URL) {
  throw new Error("Missing API Key or BASE URL in environment variables");
}

export const footballApi = createApi({
  reducerPath: "footballApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("x-apisports-key", API_KEY);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getFootballLiveMatches: builder.query({
      query: () => `/fixtures?live=all`,
      transformResponse: (response: any) => {
        const matches = response.response || [];
        // Extract live matches
        const liveMatches = matches.filter((match: any) =>
          ["1H", "HT", "2H", "ET", "BT", "P", "INT"].includes(
            match.fixture.status.short
          )
        );
        return { liveMatches };
      },
    }),
    getFootballNextMatches: builder.query({
      query: () => `/fixtures?next=5`,
      transformResponse: (response: any) => {
        const matches = response.response || [];
        // Extract next matches
        const nextMatches = matches.filter((match: any) =>
          ["TBD", "NS"].includes(match.fixture.status.short)
        );
        return { nextMatches };
      },
    }),
    getFootballRecentMatches: builder.query({
      query: () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const previousDate = yesterday.toISOString().split("T")[0];
        return `/fixtures?date=${previousDate}`;
      },
      transformResponse: (response: any) => {
        const matches = response.response || [];
        // Extract recent matches
        const recentMatches = matches.filter((match: any) =>
          ["FT", "AET", "PEN"].includes(match.fixture.status.short)
        );

        return { recentMatches };
      },
    }),
  }),
});

export const {
  useGetFootballLiveMatchesQuery,
  useGetFootballNextMatchesQuery,
  useGetFootballRecentMatchesQuery,
} = footballApi;
