import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  searchHistory: string[]; // Store only user IDs
  recentSearches: string[];
}

const initialState: SearchState = {
  searchHistory: [],
  recentSearches: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    addSearchHistory: (state, action: PayloadAction<string>) => {
      if (!state.searchHistory.includes(action.payload)) {
        state.searchHistory.unshift(action.payload);
      }
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      if (!state.recentSearches.includes(action.payload)) {
        state.recentSearches.unshift(action.payload);
      }
    },
  },
});

export const { addSearchHistory, addRecentSearch } = searchSlice.actions;
export default searchSlice.reducer;
