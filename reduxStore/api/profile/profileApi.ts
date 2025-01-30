// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { FollowUser, TargetUser, BlockUser } from "~/types/user";
// import { getToken } from "~/utils/secureStore";

// export const profileApi = createApi({
//   reducerPath: "profileApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: process.env.EXPO_PUBLIC_BASE_URL,
//     prepareHeaders: async (headers) => {
//       const token = await getToken("accessToken");
//       if (token) {
//         headers.set("Authorization", `Bearer ${token}`);
//       }
//       headers.set("Content-Type", "application/json");
//       return headers;
//     },
//   }),
//   endpoints: (builder) => ({
//     // get user profile
//     getUserProfile: builder.mutation<any, TargetUser>({
//       query: (body) => ({
//         url: "/api/v1/getProfile",
//         method: "POST",
//         body,
//       }),
//       transformResponse: (response: { data: any }) => response.data,
//     }),
//     // follow user
//     followUser: builder.mutation<any, FollowUser>({
//       query: (body) => ({
//         url: "/api/v1/follow",
//         method: "POST",
//         body,
//       }),
//       transformResponse: (response: { data: any }) => response.data,
//     }),
//     // unfollow user
//     unFollowUser: builder.mutation<any, FollowUser>({
//       query: (body) => ({
//         url: "/api/v1/unfollow",
//         method: "DELETE",
//         body,
//       }),
//       transformResponse: (response: { data: any }) => response.data,
//     }),
//     // find followers
//     findFollowers: builder.mutation<any, Partial<TargetUser>>({
//       query: (body) => ({
//         url: "/api/v1/findFollowers",
//         method: "POST",
//         body,
//       }),
//       transformResponse: (response: { data: any }) => response.data,
//     }),
//     // find followings
//     findFollowings: builder.mutation<any, Partial<TargetUser>>({
//       query: (body) => ({
//         url: "/api/v1/findFollowings",
//         method: "POST",
//         body,
//       }),
//       transformResponse: (response: { data: any }) => response.data,
//     }),
//     // block user
//     blockUser: builder.mutation<any, BlockUser>({
//       query: (body) => ({
//         url: "/api/v1/block",
//         method: "POST",
//         body,
//       }),
//       transformResponse: (response: { data: any }) => response.data,
//     }),
//     // unblock user
//     unblockUser: builder.mutation<any, BlockUser>({
//       query: (body) => ({
//         url: "/api/v1/unblock",
//         method: "DELETE",
//         body,
//       }),
//       transformResponse: (response: { data: any }) => response.data,
//     }),
//     // find blocked users
//   }),
// });

// export const {
//   useFindFollowersMutation,
//   useFindFollowingsMutation,
//   useFollowUserMutation,
//   useGetUserProfileMutation,
//   useUnFollowUserMutation,
//   useBlockUserMutation,
//   useUnblockUserMutation,
// } = profileApi;

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
  tagTypes: ["UserProfile", "Followers", "Followings", "BlockedUserList"],
  endpoints: () => ({}),
});
