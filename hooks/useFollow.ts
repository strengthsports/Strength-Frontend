import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import {
  useFollowUserMutation,
  useUnFollowUserMutation,
} from "~/reduxStore/api/profile/profileApi.follow";
import {
  setFollowingCount,
  pushFollowings,
  pullFollowings,
} from "~/reduxStore/slices/user/authSlice";
import { FollowUser } from "~/types/user";

export const useFollow = () => {
  const dispatch = useDispatch<AppDispatch>();
  // Get the mutation functions from RTK Query
  const [followUserMutation] = useFollowUserMutation();
  const [unFollowUserMutation] = useUnFollowUserMutation();

  // Function to follow a user
  const followUser = useCallback(
    async (followData: FollowUser) => {
      try {
        dispatch(setFollowingCount("follow"));
        dispatch(pushFollowings(followData.followingId));
        await followUserMutation(followData).unwrap();
      } catch (error) {
        dispatch(setFollowingCount("unfollow"));
        dispatch(pullFollowings(followData.followingId));
        console.error("Failed to follow user:", error);
      }
    },
    [followUserMutation]
  );

  // Function to undo a unfollow a user
  const unFollowUser = useCallback(
    async (unfollowData: FollowUser) => {
      try {
        dispatch(setFollowingCount("unfollow"));
        dispatch(pullFollowings(unfollowData.followingId));
        await unFollowUserMutation(unfollowData).unwrap();
      } catch (error) {
        dispatch(setFollowingCount("follow"));
        dispatch(pushFollowings(unfollowData.followingId));
        console.error("Failed to unfollow user:", error);
      }
    },
    [unFollowUserMutation]
  );

  return { followUser, unFollowUser };
};
