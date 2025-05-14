// viewsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ViewState {
  ids: string[];
  nextCursor: string | null;
  hasMore?: boolean;
}

interface ViewsState {
  feed: ViewState;
  user: Record<string, Record<string, ViewState>>;
  hashtag: Record<string, Record<string, ViewState>>;
}

const initialState: ViewsState = {
  feed: { ids: [], nextCursor: null, hasMore: true },
  user: {},
  hashtag: {},
};

export const viewsSlice = createSlice({
  name: "views",
  initialState,
  reducers: {
    setFeedPage(state, action: PayloadAction<ViewState>) {
      const { ids, nextCursor, hasMore } = action.payload;

      const existingIds = state.feed?.ids ?? [];
      // Merge and deduplicate IDs
      const mergedIds = Array.from(new Set([...existingIds, ...ids]));

      state.feed = {
        ids: mergedIds,
        nextCursor,
        hasMore,
      };
    },
    setUserPage(
      state,
      action: PayloadAction<{ userId: string; type: string } & ViewState>
    ) {
      const { userId, type, ids, nextCursor, hasMore } = action.payload;

      if (!state.user[userId]) {
        state.user[userId] = {};
      }

      const existingIds = state.user[userId][type]?.ids ?? [];

      const mergedIds = Array.from(new Set([...existingIds, ...ids]));

      state.user[userId][type] = {
        ids: mergedIds,
        nextCursor,
        hasMore,
      };
    },
    setHashtagPage(
      state,
      action: PayloadAction<{ hashtag: string; type: string } & ViewState>
    ) {
      const { hashtag, type, ids, nextCursor, hasMore } = action.payload;

      if (!state.hashtag[hashtag]) {
        state.hashtag[hashtag] = {};
      }

      const existingIds = state.hashtag[hashtag][type]?.ids ?? [];

      // Merge and deduplicate IDs
      const mergedIds = Array.from(new Set([...existingIds, ...ids]));

      state.hashtag[hashtag][type] = {
        ids: mergedIds,
        nextCursor,
        hasMore,
      };
    },
  },
});

export const { setFeedPage, setUserPage, setHashtagPage } = viewsSlice.actions;
export default viewsSlice.reducer;
