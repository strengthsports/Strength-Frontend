import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const footballApi = createApi({
  reducerPath: "footballApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_FOOTBALL_API_BASE_URL,
    prepareHeaders: (headers) => {
      const apiKey = process.env.EXPO_PUBLIC_FOOTBALL_API;
      if (apiKey) {
        headers.set("X-Auth-Token", apiKey);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getFootballMatches: builder.query({
      query: () => `/v4/matches`,
      transformResponse: (response: any) => {
        const matches = response.matches || [];

        // Extract live matches
        const liveMatches = matches.filter((match: any) => match.status === "IN_PLAY");

        // Extract the next match (earliest scheduled match)
        const nextMatch = matches
          .filter((match: any) => match.status === "TIMED")
          .sort((a: any, b: any) => new Date(a.utcDate) - new Date(b.utcDate))[0] || null;

        return { liveMatches, nextMatch };
      },
    }),
  }),
});

export const { useGetFootballMatchesQuery } = footballApi;