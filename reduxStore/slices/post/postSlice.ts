import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "~/reduxStore";
import { Post } from "~/types/post";

const postsAdapter = createEntityAdapter<Post, string>({
  selectId: (post) => post._id,
});

const initialState = postsAdapter.getInitialState();

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: postsAdapter.setAll, // Used for initial fetch or refresh
    appendPosts: (state, action: PayloadAction<Post[]>) => {
      // Add many new posts into the state.
      // Duplicate posts (with the same _id) will be updated by the adapter.
      postsAdapter.addMany(state, action.payload);
    },
    updatePostLikeStatus: (
      state,
      action: PayloadAction<{ postId: string; isLiked: boolean }>
    ) => {
      postsAdapter.updateOne(state, {
        id: action.payload.postId,
        changes: { isLiked: action.payload.isLiked },
      });
    },
  },
});

export const { setPosts, appendPosts, updatePostLikeStatus } =
  postsSlice.actions;

export const postsSelectors = postsAdapter.getSelectors(
  (state: RootState) => state.post
);

export default postsSlice.reducer;
