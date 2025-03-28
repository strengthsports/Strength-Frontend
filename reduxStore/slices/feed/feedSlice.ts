// feedSlice.ts
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { Post, FeedResponse } from "@/types/post";
import type { RootState, AppDispatch } from "../../index";
import { getToken } from "~/utils/secureStore";

// Create entity adapters
const postsAdapter = createEntityAdapter<Post, string>({
  selectId: (post) => post._id,
  sortComparer: (a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
});

interface FeedState {
  posts: ReturnType<typeof postsAdapter.getInitialState>;
  loading: boolean;
  error: string | null;
  lastTimestamp: string | null;
  currentPage: number;
  hasMore: boolean;
}

const initialState: FeedState = {
  posts: postsAdapter.getInitialState(),
  loading: false,
  error: null,
  lastTimestamp: null,
  currentPage: 1,
  hasMore: true,
};

// Fetch feed posts
export const fetchFeedPosts = createAsyncThunk<
  { posts: Post[]; lastTimestamp: string | null; nextPage: number },
  { limit?: number; page?: number; lastTimeStamp?: string | null },
  { state: RootState; dispatch: AppDispatch }
>("feed/fetchPosts", async (params, { rejectWithValue }) => {
  try {
    const token = await getToken("accessToken");
    if (!token) throw new Error("Token not found");
    console.log("Token : ", token);

    const limit = String(params.limit || 10);
    const page = String(params.page || 1);
    const lastTimeStamp = params.lastTimeStamp;

    console.log("Page : ", page);

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/get-feed?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      }
    );
    const data: FeedResponse = await response.json();
    // console.log(data);
    return {
      posts: data.data.posts,
      lastTimestamp: data.data.lastTimestamp,
      nextPage: data.data.nextPage,
    };
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch feed");
  }
});

// Like-Unlike
export const toggleLike = createAsyncThunk(
  "feed/toggleLike",
  async (postId: string, { getState, dispatch }) => {
    const state = getState() as RootState;
    const post = selectPostById(state, postId);

    if (!post) throw new Error("Post not found");

    // Optimistic update
    const updatedPost = {
      ...post,
      isLiked: !post.isLiked,
      likesCount: post.likesCount + (post.isLiked ? -1 : 1),
    };

    // Update Redux state immediately
    dispatch(updatePost(updatedPost));

    try {
      // Actual API call
      await fetch(`/api/posts/${postId}/like`, { method: "POST" });
      return updatedPost;
    } catch (error) {
      // Rollback on error
      dispatch(updatePost(post));
      throw error;
    }
  }
);

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    updatePost: (state, action: PayloadAction<Post>) => {
      postsAdapter.updateOne(state.posts, {
        id: action.payload._id,
        changes: action.payload,
      });
    },
    resetFeed: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedPosts.fulfilled, (state, action) => {
        const { posts, lastTimestamp, nextPage } = action.payload;
        console.log("\n\nPosts : ", posts);
        console.log("\n\nNextPage : ", nextPage);
        console.log("\n\nLastTimeStamp : ", lastTimestamp);

        postsAdapter.upsertMany(state.posts, posts);

        state.lastTimestamp = lastTimestamp;
        state.currentPage = nextPage;
        state.hasMore = !!lastTimestamp;
        state.loading = false;
      })
      .addCase(fetchFeedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updatePost, resetFeed } = feedSlice.actions;

export const { selectAll: selectAllPosts, selectById: selectPostById } =
  postsAdapter.getSelectors((state: RootState) => state.feed.posts);

export const selectFeedState = (state: RootState) => ({
  loading: state.feed.loading,
  error: state.feed.error,
  lastTimestamp: state.feed.lastTimestamp,
  currentPage: state.feed.currentPage,
  hasMore: state.feed.hasMore,
});

export default feedSlice.reducer;
