import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { showFeedback } from "~/utils/feedbackToast";
import { getToken } from "~/utils/secureStore";
import { addPost, upsertPosts } from "./postsSlice";
import { addPostToTopOfFeed } from "./viewsSlice";

export type UploadPreviewType = 'image' | 'video' | 'text' | 'poll' | null;

export interface UploadPreviewData {
  type: UploadPreviewType;
  uri?: string;
}

// Initial State
const initialState = {
  isAddPostContainerOpen: false,
  progress: 0,
  isLoading: false,
  isUploadingCompleted: false,
  currentPost: null,
  uploadPreviewData: null as UploadPreviewData | null,
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
            const total = progressEvent.total ?? 1;
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / total
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
    setUploadLoading: (state, action: PayloadAction<boolean>) => {
  state.isLoading = action.payload;
  if (!action.payload) { 
    state.isUploadingCompleted = true;
  } else { 
    state.isUploadingCompleted = false;
    state.progress = 0;
  }
},
    setUploadingCompleted: (state, action) => {
      state.isUploadingCompleted = action.payload;
    },
    resetUploadProgress: (state) => { 
  return {
    ...initialState,
    isAddPostContainerOpen: state.isAddPostContainerOpen,
  };
},
setUploadPreviewData: (state, action: PayloadAction<UploadPreviewData | null>) => {
  state.uploadPreviewData = action.payload;
},
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
  setUploadPreviewData,
} = postSlice.actions;
export default postSlice.reducer;
