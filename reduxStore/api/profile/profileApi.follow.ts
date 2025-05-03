import { profileApi } from "./profileApi";
import { FollowUser, TargetUser } from "~/types/user";

export const followApi = profileApi.injectEndpoints({
  endpoints: (builder) => ({
    followUser: builder.mutation<void, FollowUser>({
      query: (body) => ({
        url: "/follow",
        method: "POST",
        body,
      }),
      async onQueryStarted({ followingId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          profileApi.util.updateQueryData(
            "getUserProfile", // Use actual endpoint name
            { id: followingId }, // Cache key matching the endpoint's argument
            (draft: any) => {
              draft.followingStatus = true;
              draft.followersCount += 1;
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo(); // Revert using undo()
          console.error("Follow mutation failed:", error);
        }
      },
      invalidatesTags: (result, error, { followingId }) => [
        { type: "UserProfile", id: followingId },
      ],
    }),
    unFollowUser: builder.mutation<void, FollowUser>({
      query: (body) => ({
        url: "/unfollow",
        method: "DELETE",
        body,
      }),
      // Similar logic for unFollowUser
      async onQueryStarted({ followingId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          profileApi.util.updateQueryData(
            "getUserProfile",
            { id: followingId },
            (draft: any) => {
              draft.followingStatus = false;
              draft.followersCount -= 1;
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { followingId }) => [
        { type: "UserProfile", id: followingId },
      ],
    }),
    findFollowers: builder.query<any, Partial<TargetUser>>({
      query: (body) => ({
        url: "/findFollowers",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: any }) => response.data,
      providesTags: [{ type: "Followers", id: "LIST" }],
    }),
    findFollowings: builder.query<any, Partial<TargetUser>>({
      query: (body) => ({
        url: "/api/v1/findFollowings",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: any }) => response.data,
      providesTags: [{ type: "Followings", id: "LIST" }],
    }),
  }),
});

export const {
  useFollowUserMutation,
  useUnFollowUserMutation,
  useLazyFindFollowersQuery,
  useLazyFindFollowingsQuery,
} = followApi;
