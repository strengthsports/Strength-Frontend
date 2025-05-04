import { profileApi } from "./profileApi";
import { Member, TargetUser, User } from "~/types/user";

export const profileEndpoints = profileApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<any, TargetUser>({
      query: (body) => ({
        url: "/getProfile",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: any }) => response.data,
      providesTags: (result, error, arg) =>
        result ? [{ type: "UserProfile", id: arg.targetUserId }] : [],
    }),
    getPageMembers: builder.query<any, { pageId: string }>({
      query: ({ pageId }) => ({
        url: "/page-members",
        params: { pageId },
      }),
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const { useLazyGetUserProfileQuery, useGetPageMembersQuery } =
  profileEndpoints;
