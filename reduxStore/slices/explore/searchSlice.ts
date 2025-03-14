import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  searchHistory: any[]; // Store full user objects
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
    addSearchHistory: (state, action: PayloadAction<any>) => {
      state.searchHistory = [action.payload, ...state.searchHistory].slice(0, 10); // Keep last 10 searches
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      state.recentSearches = [action.payload, ...state.recentSearches].slice(0, 10);
    },
    resetSearchHistory: (state) => {
      state.searchHistory = []; // Reset search history to empty array
    },
  },
});

export const { addSearchHistory, addRecentSearch, resetSearchHistory } = searchSlice.actions;
export default searchSlice.reducer;
