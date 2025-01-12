import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "~/utils/secureStore";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1`,
    prepareHeaders: (headers) => {
      const token = getToken("accessToken"); // Get the token
      if (!token) throw new Error("Token not found"); // Handle missing token

      headers.set("Authorization", `Bearer ${token}`); // Add the token to headers
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUserProfile: builder.mutation({
      query: (data) => ({
        url: "/getProfile",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const { useGetUserProfileMutation } = profileApi;
