// postsSlice.ts
import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "~/reduxStore";
import { Post } from "~/types/post";

// 1️⃣ Entity adapter for posts
const postsAdapter = createEntityAdapter<Post, string>({
  selectId: (post) => post._id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

export const postsSlice = createSlice({
  name: "posts",
  initialState: postsAdapter.getInitialState(),
  reducers: {
    // general upsert
    upsertPosts: postsAdapter.upsertMany,
    updatePost: postsAdapter.updateOne,
    addPost: postsAdapter.addOne,
    removePost: postsAdapter.removeOne,
    resetFeed: postsAdapter.removeAll,
    updateAllFeedPostsFollowStatus: (
      state,
      action: PayloadAction<{
        userId: string;
        isFollowing: boolean;
      }>
    ) => {
      const { userId, isFollowing } = action.payload;

      // Find all posts by this user
      const updates = Object.values(state.entities)
        .filter((post) => post?.postedBy._id === userId)
        .map((post) => ({
          id: post._id,
          changes: { isFollowing },
        }));

      // Update all matching posts
      if (updates.length > 0) {
        postsAdapter.updateMany(state, updates);
      }
    },
    updateAllFeedPostsReportStatus: (
      state,
      action: PayloadAction<{
        postId: string;
        isReported: boolean;
      }>
    ) => {
      const { postId, isReported } = action.payload;

      // Find all posts by this postId
      const updates = Object.values(state.entities)
        .filter((post) => post?._id === postId)
        .map((post) => ({
          id: post._id,
          changes: { isReported },
        }));

      // Update all matching posts
      if (updates.length > 0) {
        postsAdapter.updateMany(state, updates);
      }
    },
  },
});

export const {
  upsertPosts,
  updatePost,
  addPost,
  removePost,
  resetFeed,
  updateAllFeedPostsFollowStatus,
  updateAllFeedPostsReportStatus,
} = postsSlice.actions;
export default postsSlice.reducer;

// --- Selectors
export const { selectById: selectPostById, selectAll: selectAllPosts } =
  postsAdapter.getSelectors<RootState>((state) => state.posts);
