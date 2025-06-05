import { profileApi } from "./profileApi";
import { FollowUser } from "~/types/user";

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
  }),
});

export const { useFollowUserMutation, useUnFollowUserMutation } = followApi;
