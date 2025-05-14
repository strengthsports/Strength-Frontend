// postsSlice.ts
import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
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
  },
});

export const { upsertPosts, updatePost, addPost, removePost, resetFeed } =
  postsSlice.actions;
export default postsSlice.reducer;

// --- Selectors
export const { selectById: selectPostById, selectAll: selectAllPosts } =
  postsAdapter.getSelectors<RootState>((state) => state.posts);
