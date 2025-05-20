import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "~/utils/secureStore";

// Define the notification types
export interface Notification {
  _id: string;
  sender: any;
  receiver: any;
  target: any;
  type: string;
  comment?: string;
  isNotificationRead: boolean;
  isNotificationVisited: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  data: {
    notifications: Notification[];
    unreadCount: number;
    pagination: {
      total: number;
      page: number;
      pages: number;
      limit: number;
    };
  };
  message: string;
  success: boolean;
}

interface GetNotificationsResponse {
  data: {
    notifications: Notification[];
    unreadCount: number;
    pagination: {
      total: number;
      page: number;
      pages: number;
      limit: number;
    };
  };
}

interface NotificationParams {
  page?: number;
  limit?: number;
  sortBy?: "latest" | "unread";
}

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/notification`,
    prepareHeaders: async (headers) => {
      const token = await getToken("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    getNotifications: builder.query<
      GetNotificationsResponse,
      NotificationParams
    >({
      query: (params = {}) => {
        const { page = 1, limit = 10, sortBy = "latest" } = params;
        return {
          url: "",
          params: { page, limit, sortBy },
          method: "GET",
        };
      },
      transformResponse: (response: ApiResponse) => ({
        data: {
          notifications: response.data.notifications,
          unreadCount: response.data.unreadCount,
          pagination: response.data.pagination,
        },
      }),
      providesTags: ["Notifications"],
    }),

    getUnreadNotifications: builder.query<any, any>({
      query: () => {
        return {
          url: "/unread",
          method: "GET",
        };
      },
      providesTags: ["Notifications"],
    }),

    markNotificationsAsRead: builder.mutation<void, null>({
      query: () => ({
        url: "/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),

    markNotificationAsVisited: builder.mutation<
      void,
      { notificationId: string }
    >({
      query: (data) => ({
        url: `/${data.notificationId}/visited`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),

    deleteNotification: builder.mutation({
      query: (data) => ({
        url: `/${data.notificationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadNotificationsQuery,
  useMarkNotificationsAsReadMutation,
  useMarkNotificationAsVisitedMutation,
  useDeleteNotificationMutation,
} = notificationApi;
