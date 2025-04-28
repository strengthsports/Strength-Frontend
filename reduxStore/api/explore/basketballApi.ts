import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = process.env.EXPO_PUBLIC_BASKETBALL_API_BASE_URL;
const API_KEY = process.env.EXPO_PUBLIC_BASKETBALL_API;

if (!API_KEY || !API_BASE_URL) {
  throw new Error("Missing API Key or BASE URL in environment variables");
}

export const basketballApi = createApi({
  reducerPath: "basketballApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("x-apisports-key", API_KEY);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getBasketballLiveMatches: builder.query({
      query: () => {
        const today = new Date().toISOString().split("T")[0];
        return `/games?date=${today}`;
      },
      transformResponse: (response: any) => {
        const matches = response.response || [];

        // Extract live matches
        const liveMatches = matches.filter((match: any) =>
          ["Q1", "Q2", "Q3", "Q4", "OT", "BT", "HT"].includes(
            match.status.short
          )
        );
        return { liveMatches };
      },
    }),
    getBasketballNextMatches: builder.query({
      query: () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextDate = tomorrow.toISOString().split("T")[0];
        return `/games?date=${nextDate}`;
      },
      transformResponse: (response: any) => {
        const matches = response.response || [];

        // Extract next matches
        const nextMatchesAll = matches.filter(
          (match: any) => match.status.short === "NS"
        );

        const nextMatches = nextMatchesAll.filter(
          (match: any) => match.league.name === "Liga A"
        );

        // ✅ Group matches by league name
        const groupedByLeague: { league: string; matches: any[] }[] = [];

        nextMatches.forEach((match: any) => {
          const leagueIndex = groupedByLeague.findIndex(
            (item) => item.league === match.league.name
          );
          if (leagueIndex > -1) {
            groupedByLeague[leagueIndex].matches.push(match);
          } else {
            groupedByLeague.push({
              league: match.league.name,
              matches: [match],
            });
          }
        });

        return { nextMatches: groupedByLeague };
      },
    }),

    getBasketballRecentMatches: builder.query({
      query: () => {
        const today = new Date().toISOString().split("T")[0];
        return `/games?date=${today}`;
      },
      transformResponse: (response: any) => {
        const matches = response.response || [];

        // Extract live matches
        const recentMatches = matches.filter((match: any) =>
          ["FT", "AOT"].includes(match.status.short)
        );
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
