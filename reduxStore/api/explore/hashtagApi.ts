import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "~/utils/secureStore";

export const hashtagApi = createApi({
  reducerPath: "hashtagApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/hashtag`,
    prepareHeaders: async (headers) => {
      const token = await getToken("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  //   tagTypes: ["HashtagResults"],
  endpoints: (builder) => ({
    getTrendingHashtag: builder.query({
      query: () => "/trending-hashtags",
      transformResponse: (response: { data: any }) => response.data,
      //   invalidatesTags: ["HashtagResults"],
    }),
  }),
});

export const { useGetTrendingHashtagQuery } = hashtagApi;
