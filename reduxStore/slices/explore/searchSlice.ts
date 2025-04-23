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
      const newUser = action.payload;
      const filtered = state.searchHistory.filter(user => user._id !== newUser._id);
      state.searchHistory = [newUser, ...filtered].slice(0, 10);
    },    
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const term = action.payload.trim().toLowerCase(); // normalize casing/spacing
      const filtered = state.recentSearches.filter(item => item.trim().toLowerCase() !== term);
      state.recentSearches = [term, ...filtered].slice(0, 10);
    },
    resetSearchHistory: (state) => {
      state.searchHistory = []; // Reset search history to empty array
      state.recentSearches = [];
    },
  },
});

export const { addSearchHistory, addRecentSearch, resetSearchHistory } = searchSlice.actions;
export default searchSlice.reducer;
