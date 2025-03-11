import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "~/utils/secureStore";

export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/search`,
    prepareHeaders: async (headers) => {
      const token = await getToken("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["SearchResults"],
  endpoints: (builder) => ({
    searchUsers: builder.mutation({
      query: ({
        username,
        limit = 10,
        page = 1,
        latitude,
        longitude,
        userId,
      }) => ({
        url: "",
        method: "POST",
        body: { username, limit, page, latitude, longitude, userId },
      }),
      transformResponse: (response: { data: any }) => response.data,
      invalidatesTags: ["SearchResults"],
    }),
  }),
});

export const { useSearchUsersMutation } = searchApi;
