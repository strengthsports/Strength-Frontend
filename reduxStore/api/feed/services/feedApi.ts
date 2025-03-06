// reduxStore/feed/services/feedApi.ts  | It is base api
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "~/utils/secureStore";

export const feedApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1`,
    prepareHeaders: async (headers) => {
      const token = await getToken("accessToken");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["addPost", "FeedPost", "Liker", "Comment"],
  endpoints: () => ({}), // No endpoints defined here
});
