// features/explore/exploreSlice.js
import { createSlice } from '@reduxjs/toolkit';

const exploreSlice = createSlice({
  name: 'explore',
  initialState: {
    selectedCategory: 'All', // Default selected category
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const { setSelectedCategory } = exploreSlice.actions;
export default exploreSlice.reducer;