import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SuggestionUser } from "~/types/user";
import { getToken } from "~/utils/secureStore";

export const communityApi = createApi({
  reducerPath: "communityApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_BASE_URL,
    prepareHeaders: async (headers) => {
      const token = await getToken("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["UsersBySports", "PopularUsers", "UsersByActivity", "UsersByCity"],
  endpoints: (builder) => ({
    // Get users of similar sports
    getUsersOfSimilarSports: builder.query<
      SuggestionUser,
      { limit?: number; lastTimeStamp?: string | null }
    >({
      query: ({ limit = 10, lastTimeStamp }) => ({
        url: "/api/v1/get-similar-sports-users",
        params: {
          limit,
          lastTimeStamp,
        },
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
    // Get users based on activity
    getUsersBasedOnActivity: builder.query<
      SuggestionUser,
      { limit?: number; lastTimeStamp?: string | null }
    >({
      query: ({ limit = 10, lastTimeStamp }) => ({
        url: "/api/v1/get-similar-users",
        params: {
          limit,
          lastTimeStamp,
        },
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
    // Get popular users
    getPopularUsers: builder.query<
      SuggestionUser,
      { limit?: number; lastTimeStamp?: string | null }
    >({
      query: ({ limit = 10, lastTimeStamp }) => ({
        url: "/api/v1/get-popular-users",
        params: {
          limit,
          lastTimeStamp,
        },
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
    // Get users of specific city
    getUsersOfSpecificCity: builder.query<
      SuggestionUser,
      { city: string; limit?: number; lastTimeStamp?: string | null }
    >({
      query: ({ city, limit = 10, lastTimeStamp }) => ({
        url: "/api/v1/get-users-by-city",
        method: "POST",
        params: {
          limit,
          lastTimeStamp,
        },
        body: { city },
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
  }),
});

export const {
  useGetUsersOfSimilarSportsQuery,
  useGetPopularUsersQuery,
  useGetUsersBasedOnActivityQuery,
  useLazyGetUsersOfSpecificCityQuery,
} = communityApi;
