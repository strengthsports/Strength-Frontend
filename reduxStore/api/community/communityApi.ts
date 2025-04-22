import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SuggestTeam } from "~/types/team";
import { SuggestionUser } from "~/types/user";
import { getToken } from "~/utils/secureStore";

export const communityApi = createApi({
  reducerPath: "communityApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/community`,
    prepareHeaders: async (headers) => {
      const token = await getToken("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: [
    "UsersBySports",
    "PopularUsers",
    "UsersByActivity",
    "UsersByCity",
    "Pages",
    "PopularTeams",
    "Teams",
  ],
  endpoints: (builder) => ({
    suggestUsers: builder.query<
      { users: SuggestionUser[]; hasMore: boolean; nextOffset: string | null },
      {
        city?: string;
        sports?: boolean;
        popularUser?: boolean;
        limit: number;
        start: number;
        lastTimeStamp?: string | null;
      }
    >({
      query: ({ city, sports, start, limit = 10, lastTimeStamp }) => ({
        url: "/users",
        params: { city, sports, start, limit, lastTimeStamp },
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
    // Get users based on activity
    getUsersBasedOnActivity: builder.query<
      SuggestionUser[],
      { limit?: number; lastTimeStamp?: string | null }
    >({
      query: ({ limit = 10, lastTimeStamp }) => ({
        url: "/similar-users",
        params: {
          limit,
          lastTimeStamp,
        },
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
    // Endpoint for suggesting teams (to support) with filters
    getTeamsToSupport: builder.query<
      { teams: SuggestTeam[]; hasMore: boolean; nextOffset: string | null },
      {
        search?: string;
        sport?: string;
        gender?: string;
        city?: string;
        limit: number;
        start: number;
        lastTimeStamp?: string | null;
      }
    >({
      query: ({
        search,
        sport,
        gender,
        city,
        limit = 10,
        start,
        lastTimeStamp,
      }) => ({
        url: "/teams",
        params: { search, sport, gender, city, limit, start, lastTimeStamp },
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
    // Endpoint for suggesting pages to follow
    getPagesToFollow: builder.query<
      { pages: SuggestionUser[]; hasMore: boolean; nextOffset: string | null },
      {
        city?: string;
        limit: number;
        start: number;
        lastTimeStamp?: string | null;
      }
    >({
      query: ({ city, limit, start, lastTimeStamp }) => ({
        url: "/pages",
        params: { city, limit, start, lastTimeStamp },
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
  }),
});

export const {
  useSuggestUsersQuery,
  useGetTeamsToSupportQuery,
  useGetPagesToFollowQuery,
  useGetUsersBasedOnActivityQuery,
} = communityApi;
