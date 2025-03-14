import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "~/utils/secureStore";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { Notification } from "~/types/others";

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
    getNotifications: builder.query({
      query: () => ({
        url: "/api/v1/notification",
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const userId = useSelector((state: any) => state.profile.user._id);
        console.log("\n\n\nUser ID fetched : ", userId);

        // Create a Socket.IO connection
        const socket = io(process.env.EXPO_PUBLIC_SOCKET_URL, {
          transports: ["websocket"],
        });
        console.log("\n\nSocket connection created");
        socket.emit("\n\njoin", userId);
        console.log("\nJoined room");
        try {
          // Wait until the initial cache data is loaded
          await cacheDataLoaded;

          // Listen for new notification events from the socket
          socket.on("newNotification", (notification) => {
            // Update the cache: prepend the new notification to the list
            updateCachedData((draft) => {
              // Optionally, check for duplicates here if needed:
              const exists = draft.find(
                (n: Notification) =>
                  n._id === notification._id ||
                  n.notificationId === notification.notificationId
              );
              if (!exists) {
                draft.unshift(notification);
              }
            });
            console.log("New notification got");
          });
        } catch (error) {
          console.error("Socket subscription error:", error);
        }
        // Cleanup: disconnect the socket when the cache subscription is removed
        await cacheEntryRemoved;
        socket.disconnect();
      },
    }),
  }),
});

export const { useGetNotificationsQuery } = notificationApi;
