import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TargetUser } from "~/types/user";
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
  endpoints: (builder) => ({
    findFollowers: builder.mutation<any, Partial<TargetUser>>({
      query: (body) => ({
        url: "/api/v1/findFollowers",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
    findFollowings: builder.mutation<any, Partial<TargetUser>>({
      query: (body) => ({
        url: "/api/v1/findFollowings",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
  }),
});

export const { useFindFollowersMutation, useFindFollowingsMutation } =
  profileApi;
