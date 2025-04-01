import { profileApi } from "./profileApi";
import { TargetUser, User } from "~/types/user";

export const profileEndpoints = profileApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<any, TargetUser>({
      query: (body) => ({
        url: "/api/v1/getProfile",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: any }) => response.data,
      // keepUnusedDataFor: 30,
      providesTags: (result, error, arg) =>
        result ? [{ type: "UserProfile", id: arg.targetUserId }] : [],
    }),
  }),
});

export const { useLazyGetUserProfileQuery } = profileEndpoints;
