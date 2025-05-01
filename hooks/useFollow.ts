import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import {
  useFollowUserMutation,
  useUnFollowUserMutation,
} from "~/reduxStore/api/profile/profileApi.follow";
import { updateAllPostsFollowStatus } from "~/reduxStore/slices/feed/feedSlice";
import { setFollowingCount } from "~/reduxStore/slices/user/profileSlice";
import { FollowUser } from "~/types/user";

export const useFollow = () => {
  const dispatch = useDispatch<AppDispatch>();
  // Get the mutation functions from RTK Query
  const [followUserMutation] = useFollowUserMutation();
  const [unFollowUserMutation] = useUnFollowUserMutation();

  // Function to follow a user
  const followUser = useCallback(
    async (followData: FollowUser, isOther?: boolean) => {
      try {
        !isOther && dispatch(setFollowingCount("follow"));
        !isOther &&
          dispatch(
            updateAllPostsFollowStatus({
              userId: followData.followingId,
              isFollowing: true,
            })
          );
        await followUserMutation(followData).unwrap();
      } catch (error) {
        !isOther && dispatch(setFollowingCount("unfollow"));
        !isOther &&
          dispatch(
            updateAllPostsFollowStatus({
              userId: followData.followingId,
              isFollowing: false,
            })
          );
        console.error("Failed to follow user:", error);
      }
    },
    [followUserMutation]
  );

  // Function to undo a unfollow a user
  const unFollowUser = useCallback(
    async (unfollowData: FollowUser, isOther?: boolean) => {
      try {
        !isOther && dispatch(setFollowingCount("unfollow"));
        !isOther &&
          dispatch(
            updateAllPostsFollowStatus({
              userId: unfollowData.followingId,
              isFollowing: false,
            })
          );
        await unFollowUserMutation(unfollowData).unwrap();
      } catch (error) {
        !isOther && dispatch(setFollowingCount("follow"));
        !isOther &&
          dispatch(
            updateAllPostsFollowStatus({
              userId: unfollowData.followingId,
              isFollowing: true,
            })
          );
        console.error("Failed to unfollow user:", error);
      }
    },
    [unFollowUserMutation]
  );

  return { followUser, unFollowUser };
};
