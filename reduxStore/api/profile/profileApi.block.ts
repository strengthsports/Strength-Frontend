import { profileApi } from "./profileApi";
import { BlockUser, UnblockUser } from "~/types/user";

export const blockApi = profileApi.injectEndpoints({
  endpoints: (builder) => ({
    blockUser: builder.mutation<any, BlockUser>({
      query: (body) => ({
        url: "/api/v1/block",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: any }) => response.data,
      invalidatesTags: (result, error, { blockingId }) => [
        { type: "UserProfile", id: blockingId },
      ],
    }),
    unblockUser: builder.mutation<any, UnblockUser>({
      query: (body) => ({
        url: "/api/v1/unblock",
        method: "DELETE",
        body,
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
  }),
});

export const { useBlockUserMutation, useUnblockUserMutation } = blockApi;
