import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SportsList } from "~/types/sports";
import { getToken } from "~/utils/secureStore";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
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
    // fetch notifications
    getNotifications: builder.query<any, null>({
      query: () => ({
        url: "/api/v1/get-notifications",
      }),
      transformResponse: (response: { data: any }) =>
        response.data?.notifications,
    }),
  }),
});

export const { useGetNotificationsQuery } = notificationApi;
