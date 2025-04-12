import { createSlice } from "@reduxjs/toolkit";

// Initial State
const initialState = {
  isPosting: false,
  isAddPostContainerOpen: false,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPostProgressOn: (state, action) => {
      state.isPosting = action.payload;
    },
    setAddPostContainerOpen: (state, action) => {
      state.isAddPostContainerOpen = action.payload;
    },
  },
});

export const { setPostProgressOn, setAddPostContainerOpen } = postSlice.actions;
export default postSlice.reducer;
