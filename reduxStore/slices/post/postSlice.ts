import { createSlice } from "@reduxjs/toolkit";

// Initial State
const initialState = {
  isPosting: false,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPostProgressOn: (state, action) => {
      state.isPosting = action.payload;
    },
  },
});

export const { setPostProgressOn } = postSlice.actions;
export default postSlice.reducer;
