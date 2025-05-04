import { profileApi } from "./profileApi";
import { BlockUser, UnblockUser } from "~/types/user";

export const blockApi = profileApi.injectEndpoints({
  endpoints: (builder) => ({
    blockUser: builder.mutation<any, BlockUser>({
      query: (body) => ({
        url: "/block",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: any }) => response.data,
      invalidatesTags: (result, error, { blockingId }) => [
        { type: "UserProfile", id: blockingId },
        { type: "BlockedUserList" },
      ],
    }),
    unblockUser: builder.mutation<any, UnblockUser>({
      query: (body) => ({
        url: "/unblock",
        method: "DELETE",
        body,
      }),
      transformResponse: (response: { data: any }) => response.data,
      invalidatesTags: (result, error, { blockedId }) => [
        { type: "UserProfile", id: blockedId },
        { type: "BlockedUserList" },
      ],
    }),
    getBlockedUsers: builder.query<any, void>({
      query: () => ({
        url: "/blocked-users", // Fixed return syntax
      }),
      transformResponse: (response: { data: any }) => response.data,
      keepUnusedDataFor: 100,
      providesTags: (result) =>
        result ? [{ type: "BlockedUserList" }] : [{ type: "BlockedUserList" }],
    }),
  }),
});

export const {
  useBlockUserMutation,
  useUnblockUserMutation,
  useGetBlockedUsersQuery,
} = blockApi;
