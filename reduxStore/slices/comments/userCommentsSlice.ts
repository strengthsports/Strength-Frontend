import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getToken } from "@/utils/secureStore";
import { CommentWithPostInfo, UserCommentsState } from '@/types/comments'; 
import { RootState } from "~/reduxStore";

interface FetchCommentsResponse {
  comments: CommentWithPostInfo[];
  hasNextPage: boolean;
  endCursor: string | null;
}

interface UserCommentsSliceState {
  commentsByUserId: {
    [userId: string]: UserCommentsState | undefined; 
  }
}

const singleUserInitialState: UserCommentsState = {
    comments: [],
    loading: false,
    loadingMore: false,
    error: null,
    cursor: null,
    hasNextPage: true,
};

const initialState: UserCommentsSliceState = {
  commentsByUserId: {}
};

interface FetchCommentsArgs {
    userId: string;
    limit?: number;
}
interface FetchMoreCommentsArgs {
    userId: string;
    limit?: number;
}


// Fetch initial batch or refresh comments for a specific user
export const fetchCommentsByUserId = createAsyncThunk<
  FetchCommentsResponse,
  FetchCommentsArgs,
  { rejectValue: string; state: RootState }
>(
  'userComments/fetchByUserId',
  async ({ userId, limit = 15 }, { rejectWithValue }) => {
    if (!userId) return rejectWithValue('User ID is required.');

    try {
      const token = await getToken("accessToken");
      // if (!token) throw new Error("Token not found");

      const url = `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/post/comments/${userId}?limit=${limit}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          "Content-type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Error fetching comments");
      }
      if (!data.data || !data.data.comments) {
          return rejectWithValue("Invalid response structure from server.");
      }
      return data.data as FetchCommentsResponse;

    } catch (error: unknown) {
      console.error("fetchCommentsByUserId Actual api error : ", error);
      const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch more comments for a specific user (pagination)
export const fetchMoreCommentsByUserId = createAsyncThunk<
  FetchCommentsResponse,
  FetchMoreCommentsArgs,
  { rejectValue: string; state: RootState }
>(
  'userComments/fetchMoreByUserId',
  async ({ userId, limit = 15 }, { getState, rejectWithValue }) => {
    const userState = getState().userComments.commentsByUserId[userId]; // Get specific user's state

    if (!userState || userState.loadingMore || !userState.hasNextPage || !userState.cursor) {
        const reason = !userState ? 'state not found' : userState.loadingMore ? 'already loading' : !userState.hasNextPage ? 'no more pages' : 'no cursor';
        return rejectWithValue(`Cannot fetch more comments: ${reason}.`);
    }

    try {
      const token = await getToken("accessToken");
      // if (!token) throw new Error("Token not found");

      const url = `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/post/comments/${userId}?limit=${limit}&cursor=${encodeURIComponent(userState.cursor)}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          "Content-type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch more comments');
      }
      if (!data.data || !data.data.comments) {
          return rejectWithValue("Invalid response structure from server.");
      }
      return data.data as FetchCommentsResponse;

    } catch (error: unknown) {
      console.error("fetchMoreCommentsByUserId Actual api error : ", error);
      const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

const userCommentsSlice = createSlice({
  name: 'userComments',
  initialState,
  reducers: {
    // Action to clear comments for a specific user (when leaving profile)
    clearUserCommentsState: (state, action: PayloadAction<string>) => {
        const userId = action.payload;
        delete state.commentsByUserId[userId];
    },
    // Action to clear all cached user comments (on logout)
    clearAllUserCommentsState: (state) => {
        state.commentsByUserId = {};
    }
  },
  extraReducers: (builder) => {
    // Helper to get or initialize user state
    const getUserState = (state: UserCommentsSliceState, userId: string): UserCommentsState => {
        if (!state.commentsByUserId[userId]) {
            state.commentsByUserId[userId] = { ...singleUserInitialState };
        }
        // Non-null assertion because we just created it if it was null
        return state.commentsByUserId[userId]!;
    };

    builder
      .addCase(fetchCommentsByUserId.pending, (state, action) => {
        const userId = action.meta.arg.userId;
        // console.log(`[Reducer] fetchCommentsByUserId.pending for ${userId}`);
        const currentUserState = getUserState(state, userId);
        currentUserState.loading = true;
        currentUserState.error = null;
      })
      .addCase(fetchCommentsByUserId.fulfilled, (state, action) => {
        const userId = action.meta.arg.userId;
        // console.log(`[Reducer] fetchCommentsByUserId.fulfilled for ${userId}. Payload comments count: ${action.payload.comments.length}`);
        const currentUserState = state.commentsByUserId[userId]!;
        currentUserState.loading = false;
        currentUserState.comments = action.payload.comments;
        currentUserState.cursor = action.payload.endCursor;
        currentUserState.hasNextPage = action.payload.hasNextPage;
        // console.log(`[Reducer] State updated for ${userId}. New length: ${currentUserState.comments.length}, Loading: ${currentUserState.loading}`);
      })
      .addCase(fetchCommentsByUserId.rejected, (state, action) => {
        const userId = action.meta.arg.userId;
        // console.error(`[Reducer] fetchCommentsByUserId.rejected for ${userId}`, action.payload);
        const currentUserState = getUserState(state, userId);
        currentUserState.loading = false;
        currentUserState.error = action.payload ?? 'Failed to fetch comments';
        // console.log(`[Reducer] State updated for ${userId} after rejection. Loading: ${currentUserState.loading}, Error: ${currentUserState.error}`);
      })
      .addCase(fetchMoreCommentsByUserId.pending, (state, action) => {
        const userId = action.meta.arg.userId;
        const currentUserState = state.commentsByUserId[userId];
        if (currentUserState) {
            currentUserState.loadingMore = true;
        }
      })
      .addCase(fetchMoreCommentsByUserId.fulfilled, (state, action) => {
        const userId = action.meta.arg.userId;
        const currentUserState = state.commentsByUserId[userId];
        if (currentUserState) {
            currentUserState.loadingMore = false;
            currentUserState.comments.push(...action.payload.comments);
            currentUserState.cursor = action.payload.endCursor;
            currentUserState.hasNextPage = action.payload.hasNextPage;
        }
      })
      .addCase(fetchMoreCommentsByUserId.rejected, (state, action) => {
        const userId = action.meta.arg.userId;
        const currentUserState = state.commentsByUserId[userId];
        if (currentUserState) {
            currentUserState.loadingMore = false;
            console.warn(`Failed to fetch more comments for ${userId}:`, action.payload);
        }
      });
  },
});

export const { clearUserCommentsState, clearAllUserCommentsState } = userCommentsSlice.actions;
export default userCommentsSlice.reducer;

const selectCommentsStateForUser = (state: RootState, userId: string): UserCommentsState => {
    return state.userComments.commentsByUserId[userId] ?? singleUserInitialState;
};

export const selectCommentsForUser = (state: RootState, userId: string): CommentWithPostInfo[] => {
    return selectCommentsStateForUser(state, userId).comments;
};

export const selectLoadingForUser = (state: RootState, userId: string): boolean => {
    return selectCommentsStateForUser(state, userId).loading;
};

export const selectLoadingMoreForUser = (state: RootState, userId: string): boolean => {
    return selectCommentsStateForUser(state, userId).loadingMore;
};

export const selectErrorForUser = (state: RootState, userId: string): string | null => {
    return selectCommentsStateForUser(state, userId).error;
};

export const selectHasNextPageForUser = (state: RootState, userId: string): boolean => {
    return selectCommentsStateForUser(state, userId).hasNextPage;
};