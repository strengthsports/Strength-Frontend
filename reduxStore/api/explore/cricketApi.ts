import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = process.env.EXPO_PUBLIC_CRICKET_API_BASE_URL;
const API_KEY = process.env.EXPO_PUBLIC_CRICKET_API;

export const cricketApi = createApi({
  reducerPath: "cricketApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    getCricketMatches: builder.query({
      query: () => `/v1/cricScore?apikey=${API_KEY}`,
      transformResponse: (response: any) => {
        const matches = response.data || [];

        // Extract live matches
        const liveMatches = matches.filter(
          (match: any) => match.ms === "live" && match.status !== "Match not started"
        );

        // Extract the next match (earliest fixture)
        const nextMatch = matches
          .filter((match: any) => match.ms === "fixture")
          .sort((a: any, b: any) => new Date(a.dateTimeGMT) - new Date(b.dateTimeGMT))[0] || null;

        return { liveMatches, nextMatch };
      },
    }),
  }),
});

export const { useGetCricketMatchesQuery } = cricketApi;