// features/explore/exploreSlice.js
import { createSlice } from '@reduxjs/toolkit';

const exploreSlice = createSlice({
  name: 'explore',
  initialState: {
    selectedExploreCategory: 'All', // Default selected category
    selectedExploreSportsCategory: 'Trending', // Default selected category
  },
  reducers: {
    setSelectedExploreCategory: (state, action) => {
      state.selectedExploreCategory = action.payload;
    },
    setSelectedExploreSportsCategory: (state, action) => {
      state.selectedExploreSportsCategory = action.payload;
    },
  },
});

export const { setSelectedExploreCategory, setSelectedExploreSportsCategory } = exploreSlice.actions;
export default exploreSlice.reducer;