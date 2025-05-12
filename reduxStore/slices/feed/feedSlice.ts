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
// Feed posts adapter
const feedPostsAdapter = createEntityAdapter<Post, string>({
  selectId: (post) => post._id,
  sortComparer: (a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
});

// Non-Feed posts adapter
const nonFeedPostsAdapter = createEntityAdapter<Post, string>({
  selectId: (post) => post._id,
});

interface FeedState {
  feedPosts: ReturnType<typeof feedPostsAdapter.getInitialState>;
  nonFeedPosts: ReturnType<typeof nonFeedPostsAdapter.getInitialState>;
  loading: boolean;
  error: string | null;
  cursor: string;
  hasMore: boolean;
  nonFeedLoading: boolean;
  nonFeedError: string | null;
  nonFeedCursor: string;
  nonFeedHasMore: boolean;
  lastQueryKey: string | null;
}

const initialState: FeedState = {
  feedPosts: feedPostsAdapter.getInitialState(),
  nonFeedPosts: nonFeedPostsAdapter.getInitialState(),
  loading: false,
  error: null,
  cursor: "",
  hasMore: false,
  nonFeedLoading: false,
  nonFeedError: null,
  nonFeedCursor: "",
  nonFeedHasMore: false,
  lastQueryKey: null,
};

// Fetch feed posts
export const fetchFeedPosts = createAsyncThunk<
  { posts: Post[]; nextCursor: string; hasMore: boolean },
  { limit?: number; cursor?: string },
  { state: RootState; dispatch: AppDispatch }
>("feed/fetchPosts", async (params, { rejectWithValue }) => {
  try {
    console.log("Feed Called");
    const token = await getToken("accessToken");
    if (!token) throw new Error("Token not found");

    // Build query string
    const queryParams = new URLSearchParams({
      limit: String(params.limit || 10),
      ...(params.cursor && { cursor: params.cursor }), // Only add cursor if provided
    });

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/get-feed?${queryParams}`, // <-- Attach cursor
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      }
    );

    const data: FeedResponse = await response.json();

    return {
      posts: data.data.posts || [],
      nextCursor: data.data.nextCursor ?? null,
      hasMore: data.data.hasMore, // <-- Read next cursor from backend
    };
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch feed");
  }
});

// Fetch non-feed posts
export const fetchNonFeedPosts = createAsyncThunk<
  { posts: Post[]; nextCursor: string; hasMore: boolean },
  {
    userId: string;
    type: string;
    limit?: number;
    cursor?: string;
    reset?: boolean;
  },
  { state: RootState; dispatch: AppDispatch }
>("feed/fetchUserPosts", async (params, { rejectWithValue }) => {
  try {
    console.log("User posts Called");
    const token = await getToken("accessToken");
    if (!token) throw new Error("Token not found");

    // Build query string
    const queryParams = new URLSearchParams({
      limit: String(params.limit || 10),
      type: params.type,
      ...(params.cursor && { cursor: params.cursor }), // Only add cursor if provided
    });

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/post/${params.userId}?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data: any = await response.json();
    console.log("Data ", data);

    return {
      posts: data.data || [],
      nextCursor: data.nextCursor ?? null,
      hasMore: data.hasMore, // <-- Read next cursor from backend
    };
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch feed");
  }
});

export const fetchHashtagContents = createAsyncThunk<
  { data: any; nextCursor: string },
  {
    hashtag: string;
    type: string;
    limit?: number;
    cursor?: string | null;
    reset?: boolean;
  },
  { state: RootState; dispatch: AppDispatch }
>("feed/fetchHashtagContents", async (params, { rejectWithValue }) => {
  try {
    console.log("Hashtag posts Called");
    const token = await getToken("accessToken");
    if (!token) throw new Error("Token not found");

    // Build query string
    const queryParams = new URLSearchParams({
      limit: String(params.limit || 10),
      hashtag: params.hashtag,
      ...(params.cursor && { cursor: params.cursor }), // Only add cursor if provided
    });

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/hashtag/${params.type}?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data: any = await response.json();
    // console.log("Data ", data);

    return {
      data: data.data || [],
      nextCursor: data.nextCursor ?? null,
    };
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch hashtag contents");
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

    // Determine which adapter to update
    // FIX: Explicitly check if the post exists in feedPosts
    const feedPost = selectFeedPostById(state, targetId);
    const isFeedPost = feedPost?._id === targetId; // Strict check
    console.log(isFeedPost);
    const adapterAction = isFeedPost ? updateFeedPost : updateNonFeedPost;

    dispatch(adapterAction(updatedPost));

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
      dispatch(adapterAction(post));
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to like post"
      );
    }
  }
);

// Delete Post
export const deletePost = createAsyncThunk(
  "feed/deletePost",
  async (
    { postId }: { postId: string },
    { getState, dispatch, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const post = selectPostById(state, postId);

    if (!post) throw new Error("Post not found");

    // Determine which adapter to update
    const feedPost = selectFeedPostById(state, postId);
    const isFeedPost = feedPost?._id === postId; // Strict check
    console.log(isFeedPost);
    const adapterAction = isFeedPost ? removeFeedPost : removeNonFeedPost;

    dispatch(adapterAction(postId));

    try {
      const token = await getToken("accessToken");
      if (!token) throw new Error("Token not found");
      console.log("Token : ", token);
      // Actual API call
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/post`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
          body: JSON.stringify({ postId }),
        }
      );

      if (!response.ok) throw new Error("Failed to delete post");
    } catch (error) {
      // Rollback on error
      dispatch(adapterAction(postId));
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete post"
      );
    }
  }
);

// Post Comment
export const postComment = createAsyncThunk(
  "feed/postComment",
  async (
    {
      postId,
      parentCommentId,
      text,
    }: { postId: string; parentCommentId: string | undefined; text: string },
    { getState, dispatch, rejectWithValue }
  ) => {
    console.log("Called");
    const state = getState() as RootState;
    let post;
    let updatedPost;
    post = selectPostById(state, postId);
    // Optimistic update
    updatedPost = {
      ...post,
      commentsCount: post.commentsCount + 1,
    };

    // Update Redux state immediately
    dispatch(updateFeedPost(updatedPost));

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
          body: JSON.stringify({ postId, parentCommentId, text }),
        }
      );

      // console.log(response);

      if (!response.ok) throw new Error("Failed to post comment");

      return response.json();
    } catch (error: any) {
      // Rollback on error
      if (post) {
        dispatch(updateFeedPost(post));
      }
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to comment on post"
      );
    }
  }
);

// Delete Comment
export const deleteComment = createAsyncThunk(
  "feed/deleteComment",
  async (
    { postId, commentId }: { postId: string; commentId: string | undefined },
    { getState, dispatch, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    let post;
    let updatedPost;
    post = selectPostById(state, postId);
    // Optimistic update
    updatedPost = {
      ...post,
      commentsCount: post.commentsCount - 1,
    };

    const feedPost = selectFeedPostById(state, postId);
    const isFeedPost = feedPost?._id === postId;
    const adapterAction = isFeedPost ? updateFeedPost : updateNonFeedPost;

    dispatch(adapterAction(updatedPost));

    try {
      const token = await getToken("accessToken");
      if (!token) throw new Error("Authorization token not found");
      console.log("Token : ", token);

      // Actual API call
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/post/comment`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ postId, commentId }),
        }
      );

      if (!response.ok) throw new Error("Failed to post comment");

      return response.json();
    } catch (error: any) {
      // Rollback on error
      if (post) {
        dispatch(updateFeedPost(post));
      }
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to comment on post"
      );
    }
  }
);

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
      dispatch(updateFeedPost(updatedPost));
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
        dispatch(updateFeedPost(post));
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
    updateFeedPost: (state, action: PayloadAction<Post>) => {
      feedPostsAdapter.updateOne(state.feedPosts, {
        id: action.payload._id,
        changes: action.payload,
      });
    },
    mergeFeedPosts: (state, action: PayloadAction<Post[]>) => {
      feedPostsAdapter.upsertMany(state.feedPosts, action.payload);
    },
    addPost: (state, action: PayloadAction<Post>) => {
      feedPostsAdapter.addOne(state.feedPosts, action.payload);
    },
    updateAllFeedPostsFollowStatus: (
      state,
      action: PayloadAction<{
        userId: string;
        isFollowing: boolean;
      }>
    ) => {
      const { userId, isFollowing } = action.payload;

      // Find all posts by this user
      const updates = Object.values(state.feedPosts.entities)
        .filter((post) => post?.postedBy._id === userId)
        .map((post) => ({
          id: post._id,
          changes: { isFollowing },
        }));

      // Update all matching posts
      if (updates.length > 0) {
        feedPostsAdapter.updateMany(state.feedPosts, updates);
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
      const updates = Object.values(state.feedPosts.entities)
        .filter((post) => post?._id === postId)
        .map((post) => ({
          id: post._id,
          changes: { isReported },
        }));

      // Update all matching posts
      if (updates.length > 0) {
        feedPostsAdapter.updateMany(state.feedPosts, updates);
      }
    },
    updateNonFeedPost: (state, action: PayloadAction<Post>) => {
      nonFeedPostsAdapter.updateOne(state.nonFeedPosts, {
        id: action.payload._id,
        changes: action.payload,
      });
    },
    addNonFeedPost: (state, action: PayloadAction<Post[]>) => {
      nonFeedPostsAdapter.upsertMany(state.nonFeedPosts, action.payload);
    },
    removeFeedPost: (state, action: PayloadAction<string>) => {
      feedPostsAdapter.removeOne(state.feedPosts, action.payload);
    },
    removeNonFeedPost: (state, action: PayloadAction<string>) => {
      nonFeedPostsAdapter.removeOne(state.nonFeedPosts, action.payload);
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
        const { posts, nextCursor, hasMore } = action.payload;
        console.log("\n\nPosts : ", posts);
        console.log("\n\nNextCursor : ", nextCursor);
        console.log("\n\nHasmore : ", hasMore);

        feedPostsAdapter.upsertMany(state.feedPosts, posts);

        state.hasMore = hasMore;
        state.cursor = nextCursor; // <-- Set nextCursor for future fetches
        state.loading = false;
      })
      .addCase(fetchFeedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch user posts
      .addCase(fetchNonFeedPosts.pending, (state) => {
        state.nonFeedLoading = true;
        state.nonFeedError = null;
      })
      .addCase(fetchNonFeedPosts.fulfilled, (state, action) => {
        const { posts, nextCursor, hasMore } = action.payload;
        const { userId, type, reset } = action.meta.arg;
        console.log("\n\nPosts : ", posts);
        console.log("\n\nNextCursor : ", nextCursor);
        console.log("\n\nHasmore : ", hasMore);

        // Create a unique key for this query combination
        const queryKey = `${userId}-${type}`;

        // Reset state if:
        // 1. It's a forced reset (reset: true)
        // 2. We're fetching without cursor (initial load)
        // 3. The queryKey changed from previous fetch
        const shouldReset =
          reset || !action.meta.arg.cursor || state.lastQueryKey !== queryKey;

        if (shouldReset) {
          nonFeedPostsAdapter.removeAll(state.nonFeedPosts);
        }

        // Upsert new posts
        nonFeedPostsAdapter.upsertMany(state.nonFeedPosts, posts);

        state.nonFeedHasMore = hasMore;
        state.nonFeedCursor = nextCursor; // <-- Set nextCursor for future fetches
        state.nonFeedLoading = false;
        state.lastQueryKey = queryKey;
      })
      .addCase(fetchNonFeedPosts.rejected, (state, action) => {
        state.nonFeedLoading = false;
        state.nonFeedError = action.payload as string;
      })
      // Fetch hashtag contents
      .addCase(fetchHashtagContents.pending, (state, action) => {
        const { hashtag, type, reset, cursor = "initial" } = action.meta.arg;
        // Create a unique key for this query combination
        const queryKey = `${hashtag}-${type}-${cursor}`;
        console.log(queryKey);

        // Reset state if:
        // 1. It's a forced reset (reset: true)
        // 2. We're fetching without cursor (initial load)
        // 3. The queryKey changed from previous fetch
        const shouldReset =
          reset || !action.meta.arg.cursor || state.lastQueryKey !== queryKey;

        if (shouldReset) {
          nonFeedPostsAdapter.removeAll(state.nonFeedPosts);
          state.nonFeedCursor = "";
        }
        state.nonFeedLoading = true;
        state.nonFeedError = null;
      })
      .addCase(fetchHashtagContents.fulfilled, (state, action) => {
        const { data, nextCursor } = action.payload;
        console.log(data);
        // Upsert new posts
        nonFeedPostsAdapter.upsertMany(state.nonFeedPosts, data);

        state.nonFeedCursor = nextCursor; // <-- Set nextCursor for future fetches
        state.nonFeedLoading = false;
      })
      .addCase(fetchHashtagContents.rejected, (state, action) => {
        state.nonFeedLoading = false;
        state.nonFeedError = action.payload as string;
      });
  },
});

export const {
  updateFeedPost,
  mergeFeedPosts,
  addPost,
  updateAllFeedPostsFollowStatus,
  updateAllFeedPostsReportStatus,
  updateNonFeedPost,
  addNonFeedPost,
  removeFeedPost,
  removeNonFeedPost,
  resetFeed,
} = feedSlice.actions;

export const { selectAll: selectAllFeedPosts, selectById: selectFeedPostById } =
  feedPostsAdapter.getSelectors((state: RootState) => state.feed.feedPosts);

export const {
  selectAll: selectAllNonFeedPosts,
  selectById: selectNonFeedPostById,
} = nonFeedPostsAdapter.getSelectors(
  (state: RootState) => state.feed.nonFeedPosts
);

// Unified selector (checks both adapters)
export const selectPostById = (state: RootState, postId: string) =>
  selectFeedPostById(state, postId) || selectNonFeedPostById(state, postId);

export const selectPostsByUserId = createSelector(
  [
    feedPostsAdapter.getSelectors().selectAll,
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
    (state: RootState) => state.feed.cursor,
    (state: RootState) => state.feed.hasMore,
  ],
  (loading, error, cursor, hasMore) => ({
    loading,
    error,
    cursor,
    hasMore,
  })
);

export const selectNonFeedState = createSelector(
  [
    (state: RootState) => state.feed.nonFeedLoading,
    (state: RootState) => state.feed.nonFeedError,
    (state: RootState) => state.feed.nonFeedCursor,
    (state: RootState) => state.feed.nonFeedHasMore,
    (state: RootState) => state.feed.lastQueryKey,
  ],
  (
    nonFeedLoading,
    nonFeedError,
    nonFeedCursor,
    nonFeedHasMore,
    lastQueryKey
  ) => ({
    nonFeedLoading,
    nonFeedError,
    nonFeedCursor,
    nonFeedHasMore,
    lastQueryKey,
  })
);

export default feedSlice.reducer;
