// In your component or a custom hook file
import { useDispatch } from "react-redux";
import { updatePostLikeStatus } from "~/reduxStore/slices/post/postSlice";
import { AppDispatch } from "~/reduxStore";
import { useCallback } from "react";

const useLikeAction = () => {
  const dispatch = useDispatch<AppDispatch>();

  /**
   * Toggles the like status and updates like count.
   * @param postId - The unique identifier of the post.
   * @param currentLikeStatus - The current liked status.
   * @param currentLikeCount - The current number of likes.
   */
  const handleLikeAction = useCallback(
    (postId: string, currentLikeStatus: boolean, currentLikeCount: number) => {
      // Toggle the like status.
      const newLikeStatus = !currentLikeStatus;
      // Adjust like count accordingly.
      const newLikeCount = newLikeStatus
        ? currentLikeCount + 1
        : currentLikeCount - 1;
      // Dispatch the update action.
      dispatch(
        updatePostLikeStatus({
          postId,
          isLiked: newLikeStatus,
          likesCount: newLikeCount,
        })
      );
      console.log(
        "Post",
        postId,
        newLikeStatus ? "liked" : "unliked",
        "with count",
        newLikeCount
      );
    },
    [dispatch]
  );

  return { handleLikeAction };
};

export default useLikeAction;
