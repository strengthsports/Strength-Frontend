import { profileApi } from "./profileApi";
import { BlockUser } from "~/types/user";

export const blockApi = profileApi.injectEndpoints({
  endpoints: (builder) => ({
    blockUser: builder.mutation<any, BlockUser>({
      query: (body) => ({
        url: "/api/v1/block",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
    unblockUser: builder.mutation<any, BlockUser>({
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
