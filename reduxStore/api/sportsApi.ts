import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SportsList } from "~/types/sports";
import { getToken } from "~/utils/secureStore";

export const sportsApi = createApi({
  reducerPath: "sportsApi",
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
  endpoints: (builder) => ({
    // fetch sports
    getSports: builder.query<Array<SportsList>, null>({
      query: () => ({
        url: "/api/v1/fetch-allSports",
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
  }),
});

export const { useGetSportsQuery } = sportsApi;
