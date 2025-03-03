// features/explore/exploreSlice.js
import { createSlice } from "@reduxjs/toolkit";

const hashtagPageSlice = createSlice({
  name: "hashtagPage",
  initialState: {
    selectedHashtagPageCategory: "Top", // Default selected category
  },
  reducers: {
    setSelectedHashtagPageCategory: (state, action) => {
      state.selectedHashtagPageCategory = action.payload;
    },
  },
});

export const { setSelectedHashtagPageCategory } = hashtagPageSlice.actions;
export default hashtagPageSlice.reducer;
