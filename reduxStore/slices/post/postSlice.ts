import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { showFeedback } from "~/utils/feedbackToast";
import { getToken } from "~/utils/secureStore";
import { addPost, upsertPosts } from "./postsSlice";
import { addPostToTopOfFeed } from "./viewsSlice";

// Initial State
const initialState = {
  isAddPostContainerOpen: false,
  progress: 0,
  isLoading: false,
  isUploadingCompleted: false,
  currentPost: null,
};

// Upload Post
export const uploadPost = createAsyncThunk(
  "posts/uploadPost",
  async (formData: FormData, { dispatch }) => {
    console.log(formData);
    const token = await getToken("accessToken");
    dispatch(setUploadLoading(true));
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/post`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            dispatch(setUploadProgress(percentCompleted));
          },
        }
      );
      dispatch(upsertPosts([response.data.data]));
      dispatch(addPostToTopOfFeed(response.data.data._id));
      showFeedback("Post uploaded successfully !", "success");
      return response.data;
    } catch (error) {
      // Log detailed error
      console.log(error);
      throw error; // Re-throw for handling in the component
    } finally {
      dispatch(setUploadLoading(false));
      // ← let the component clear progress after its fade‑out animation
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setUploadProgress: (state, action) => {
      state.progress = action.payload;
    },
    setUploadLoading: (state, action) => {
      state.isLoading = action.payload;
      state.isUploadingCompleted = !action.payload;
    },
    setUploadingCompleted: (state, action) => {
      state.isUploadingCompleted = action.payload;
    },
    resetUploadProgress: () => initialState,
    setAddPostContainerOpen: (state, action) => {
      state.isAddPostContainerOpen = action.payload;
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
  },
});

export const {
  setUploadProgress,
  setUploadLoading,
  resetUploadProgress,
  setAddPostContainerOpen,
  setUploadingCompleted,
  setCurrentPost,
} = postSlice.actions;
export default postSlice.reducer;
