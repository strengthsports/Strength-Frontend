import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
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
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    getNotifications: builder.query<
      {
        notifications: any[];
        unreadCount: number;
      },
      void
    >({
      query: () => ({
        url: "/api/v1/notification",
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["Notifications"],
    }),
    markNotificationsAsRead: builder.mutation<
      {
        updatedCount: number;
      },
      {
        notificationIds: string[];
      }
    >({
      query: (body) => ({
        url: "/api/v1/notification/mark-as-read",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkNotificationsAsReadMutation } =
  notificationApi;
