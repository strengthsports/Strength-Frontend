import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "~/utils/secureStore";

export const profileApi = createApi({
  reducerPath: "profileApi",
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
  tagTypes: [
    "UserProfile",
    "Followers",
    "Followings",
    "BlockedUserList",
    "UserPosts",
  ],
  endpoints: () => ({}),
});
