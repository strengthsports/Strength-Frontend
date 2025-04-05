// feedSlice.ts
import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
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
      posts: data.data.posts || [],
      lastTimestamp: data.data.lastTimestamp,
      nextPage: data.data.nextPage,
    };
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch feed");
  }
});

// Fetch specific user's posts
export const fetchUserPosts = createAsyncThunk<
  { posts: Post[]; lastTimestamp: string | null; nextPage: number },
  {
    postedBy: string;
    postedByType: string;
    limit?: number;
    skip?: number;
    lastTimestamp?: string | null;
  },
  { state: RootState; dispatch: AppDispatch }
>("feed/fetchUserPosts", async (params, { rejectWithValue }) => {
  try {
    const token = await getToken("accessToken");
    if (!token) throw new Error("Authorization token not found");

    // Destructure parameters
    const {
      postedBy,
      postedByType,
      limit = 10,
      skip = 0,
      lastTimestamp = null,
    } = params;

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/post/other-user?skip=${skip}&limit=${limit}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postedBy,
          postedByType,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // console.log("Posts : ", data.data);

    return {
      posts: data.data.formattedPosts,
      lastTimestamp: data.data.lastTimestamp,
      nextPage: data.data.nextPage,
    };
  } catch (err: any) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Failed to fetch user's posts"
    );
  }
});

// Like-Unlike
export const toggleLike = createAsyncThunk(
  "feed/toggleLike",
  async (
    { targetId, targetType }: { targetId: string; targetType: string },
    { getState, dispatch, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const post = selectPostById(state, targetId);

    if (!post) throw new Error("Post not found");

    // Optimistic update
    const updatedPost = {
      ...post,
      isLiked: !post.isLiked,
      likesCount: post.likesCount + (post.isLiked ? -1 : 1),
    };

    // Update Redux state immediately
    dispatch(updatePost(updatedPost));

    let reqType = post.isLiked ? "DELETE" : "POST";

    try {
      const token = await getToken("accessToken");
      if (!token) throw new Error("Token not found");
      console.log("Token : ", token);
      // Actual API call
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/post/like`,
        {
          method: reqType,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
          body: JSON.stringify({ targetId, targetType }),
        }
      );

      if (!response.ok) throw new Error("Failed to like post");

      return updatedPost;
    } catch (error) {
      // Rollback on error
      dispatch(updatePost(post));
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to like post"
      );
    }
  }
);

// Post Comment
export const postComment = createAsyncThunk(
  "feed/postComment",
  async (
    {
      targetId,
      targetType,
      text,
    }: { targetId: string; targetType: string; text: string },
    { getState, dispatch, rejectWithValue }
  ) => {
    console.log("Called");
    const state = getState() as RootState;
    let post;
    let updatedPost;
    if (targetType === "Post") {
      post = selectPostById(state, targetId);
      // Optimistic update
      updatedPost = {
        ...post,
        commentsCount: post.commentsCount + 1,
      };

      // Update Redux state immediately
      dispatch(updatePost(updatedPost));
    }

    try {
      const token = await getToken("accessToken");
      if (!token) throw new Error("Authorization token not found");
      console.log("Token : ", token);

      // Actual API call
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/post/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ targetId, targetType, text }),
        }
      );

      if (!response.ok) throw new Error("Failed to post comment");

      return updatedPost;
    } catch (error: any) {
      // Rollback on error
      if (targetType === "Post" && post) {
        dispatch(updatePost(post));
      }
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to comment on post"
      );
    }
  }
);

// Delete Comment

// Vote in poll
export const voteInPoll = createAsyncThunk(
  "feed/voteInPoll",
  async (
    {
      targetId,
      targetType,
      selectedOption,
    }: { targetId: string; targetType: string; selectedOption: number },
    { getState, dispatch, rejectWithValue }
  ) => {
    console.log("Called");
    const state = getState() as RootState;
    let post;
    let updatedPost;
    if (targetType === "Post") {
      post = selectPostById(state, targetId);
      // Optimistic update
      updatedPost = {
        ...post,
        isVoted: true,
        votedOption: Number(selectedOption),
      };

      // Update Redux state immediately
      dispatch(updatePost(updatedPost));
    }

    try {
      const token = await getToken("accessToken");
      if (!token) throw new Error("Authorization token not found");
      console.log("Token : ", token);

      // Actual API call
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/post/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ targetId, targetType, selectedOption }),
        }
      );

      console.log(response);
      if (!response.ok) throw new Error("Failed to vote in the poll !");

      return updatedPost;
    } catch (error: any) {
      // Rollback on error
      if (targetType === "Post" && post) {
        dispatch(updatePost(post));
      }
      console.log(error);
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to vote in the poll"
      );
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
    mergePosts: (state, action: PayloadAction<Post[]>) => {
      postsAdapter.upsertMany(state.posts, action.payload);
    },
    updateAllPostsFollowStatus: (
      state,
      action: PayloadAction<{
        userId: string;
        isFollowing: boolean;
      }>
    ) => {
      const { userId, isFollowing } = action.payload;

      // Find all posts by this user
      const updates = Object.values(state.posts.entities)
        .filter((post) => post?.postedBy._id === userId)
        .map((post) => ({
          id: post._id,
          changes: { isFollowing },
        }));

      // Update all matching posts
      if (updates.length > 0) {
        postsAdapter.updateMany(state.posts, updates);
      }
    },
    updateAllPostsReportStatus: (
      state,
      action: PayloadAction<{
        postId: string;
        isReported: boolean;
      }>
    ) => {
      const { postId, isReported } = action.payload;

      // Find all posts by this postId
      const updates = Object.values(state.posts.entities)
        .filter((post) => post?._id === postId)
        .map((post) => ({
          id: post._id,
          changes: { isReported },
        }));

      // Update all matching posts
      if (updates.length > 0) {
        postsAdapter.updateMany(state.posts, updates);
      }
    },
    resetFeed: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch feed posts
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
      })
      // Fetch user specific posts
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        const { posts, lastTimestamp, nextPage } = action.payload;
        console.log("\n\nPosts : ", posts);

        postsAdapter.upsertMany(state.posts, posts);

        state.lastTimestamp = lastTimestamp;
        // state.currentPage = nextPage;
        // state.hasMore = !!lastTimestamp;
        state.loading = false;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    // Add
  },
});

export const {
  updatePost,
  mergePosts,
  updateAllPostsFollowStatus,
  updateAllPostsReportStatus,
  resetFeed,
} = feedSlice.actions;

export const { selectAll: selectAllPosts, selectById: selectPostById } =
  postsAdapter.getSelectors((state: RootState) => state.feed.posts);

export const selectPostsByUserId = createSelector(
  [
    postsAdapter.getSelectors().selectAll,
    (state: RootState, userId: string) => userId,
  ],
  (allPosts, userId) => {
    return allPosts.filter((post) => post.postedBy._id === userId);
  }
);

export const selectFeedState = createSelector(
  [
    (state: RootState) => state.feed.loading,
    (state: RootState) => state.feed.error,
    (state: RootState) => state.feed.lastTimestamp,
    (state: RootState) => state.feed.currentPage,
    (state: RootState) => state.feed.hasMore,
  ],
  (loading, error, lastTimestamp, currentPage, hasMore) => ({
    loading,
    error,
    lastTimestamp,
    currentPage,
    hasMore,
  })
);

export default feedSlice.reducer;
