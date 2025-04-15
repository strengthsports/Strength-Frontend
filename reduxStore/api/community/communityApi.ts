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
    /**
     * Unified Suggest Users Endpoint
     *
     * Accepts query parameters to filter suggestions as follows:
     * - If `city` is provided, returns users from that city (using a case-insensitive match).
     * - If `sports` is provided (or uses current user's selected sports on backend), returns users whose selected sports match.
     * - If `popularUser` is true, returns users sorted by popularity (high followerCount, etc.).
     *
     * Excludes the current user and users already followed.
     *
     * Uses cursor-based pagination via the `lastTimeStamp` parameter.
     */
    suggestUsers: builder.query<
      { users: SuggestionUser[]; hasMore: boolean; nextCursor: string | null },
      {
        city?: string;
        sports?: boolean;
        popularUser?: boolean;
        limit?: number;
        lastTimeStamp?: string | null;
      }
    >({
      query: ({ city, sports, popularUser, limit = 10, lastTimeStamp }) => ({
        url: "/suggest-users",
        params: { city, sports, popularUser, limit, lastTimeStamp },
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
      { teams: SuggestTeam[]; hasMore: boolean; nextCursor: string | null },
      {
        search?: string;
        sport?: string;
        gender?: string;
        city?: string;
        limit?: number;
        lastTimeStamp?: string | null;
      }
    >({
      query: ({ search, sport, gender, city, limit = 10, lastTimeStamp }) => ({
        url: "/teams",
        params: { search, sport, gender, city, limit, lastTimeStamp },
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
    // Endpoint for suggesting pages to follow
    getPagesToFollow: builder.query<
      { pages: SuggestionUser[]; hasMore: boolean; nextCursor: string | null },
      { city?: string; limit?: number; lastTimeStamp?: string | null }
    >({
      query: ({ city, limit = 10, lastTimeStamp }) => ({
        url: "/pages",
        params: { city, limit, lastTimeStamp },
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
