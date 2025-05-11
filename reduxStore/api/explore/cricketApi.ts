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
      headers.set("x-rapidapi-host", "cricbuzz-cricket.p.rapidapi.com");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCricketLiveMatches: builder.query({
      query: () => `/matches/v1/live`,
      transformResponse: (response: any) => {
        const typeMatches = Array.isArray(response.typeMatches)
          ? response.typeMatches
          : [];

        const allMatches: any[] = [];

        // Extract live matches
        typeMatches.forEach((typeMatch: any) => {
          const seriesMatches = typeMatch?.seriesMatches || [];

          seriesMatches.forEach((seriesMatch: any) => {
            const matches = seriesMatch?.seriesAdWrapper?.matches;
            if (Array.isArray(matches)) {
              allMatches.push(...matches); // flatten and extract matches
            }
          });
        });

        // Extra checking for live match
        const liveMatches = allMatches.filter((match: any) =>
          ["In Progress", "Stumps"].includes(match?.matchInfo?.state)
        );

        return { liveMatches };
      },
    }),
    getCricketNextMatches: builder.query({
      query: () => `/matches/v1/upcoming`,
      transformResponse: (response: any) => {
        const typeMatches = Array.isArray(response.typeMatches)
          ? response.typeMatches
          : [];

        const allMatches: any[] = [];

        // Extract next matches
        typeMatches.forEach((typeMatch: any) => {
          const seriesMatches = typeMatch?.seriesMatches || [];

          seriesMatches.forEach((seriesMatch: any) => {
            const seriesAdWrapper = seriesMatch?.seriesAdWrapper;
            const matches = seriesAdWrapper?.matches;

            // Extra checking for next match
            if (Array.isArray(matches)) {
              const previewMatches = matches.filter(
                (match: any) => match?.matchInfo?.state === "Preview"
              );

              if (previewMatches.length > 0) {
                allMatches.push({
                  ...seriesAdWrapper,
                  matches: previewMatches,
                });
              }
            }
          });
        });

        return { nextMatches: allMatches };
      },
    }),
    getCricketRecentMatches: builder.query({
      query: () => `matches/v1/recent`,
      transformResponse: (response: any) => {
        const typeMatches = Array.isArray(response.typeMatches)
          ? response.typeMatches
          : [];

        // Extract recent matches
        const allMatches: any[] = [];

        // Extract live matches
        typeMatches.forEach((typeMatch: any) => {
          const seriesMatches = typeMatch?.seriesMatches || [];

          seriesMatches.forEach((seriesMatch: any) => {
            const matches = seriesMatch?.seriesAdWrapper?.matches;
            if (Array.isArray(matches)) {
              allMatches.push(...matches); // flatten and extract matches
            }
          });
        });

        // Extra checking for recent match
        const recentMatches = allMatches.filter(
          (match: any) =>
            match?.matchInfo?.state === "Complete" &&
            match?.matchInfo?.stateTitle !== "Abandon"
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
