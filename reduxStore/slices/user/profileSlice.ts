import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getToken } from "@/utils/secureStore";
import { ProfileState } from "@/types/user";
import { logoutUser } from "./authSlice";

// Initial State
const initialState: ProfileState = {
  user: null,
  loading: false,
  error: null,
  posts: [],
};

export const editUserProfile = createAsyncThunk<
  any,
  any,
  { rejectValue: string }
>("profile/editUserProfile", async (userdata, { rejectWithValue }) => {
  try {
    const token = await getToken("accessToken");
    if (!token) throw new Error("Token not found");
    console.log("Token : ", token);
    console.log("User data input :", userdata);

    userdata.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/updateProfile`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: userdata,
      }
    );

    console.log("Response:", response);
    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Error getting user");
    }
    console.log("Data : ", data.data.updatedUser);
    return data.data.updatedUser;
  } catch (error: unknown) {
    console.log("Actual api error : ", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unexpected error occurred";
    return rejectWithValue(errorMessage);
  }
});

export const getOwnPosts = createAsyncThunk<any, any, { rejectValue: string }>(
  "profile/getOwnPosts",
  async (_, { rejectWithValue }) => {
    try {
      const token = await getToken("accessToken");
      if (!token) throw new Error("Token not found");
      console.log("Token : ", token);

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/my-posts`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
        }
      );

      console.log("Response:", response);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Error getting posts");
      }
      console.log("Data : ", data.data.posts);
      return data.data.posts;
    } catch (error: unknown) {
      console.log("Actual api error : ", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unexpected error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.user = action.payload;
    },
    setFollowingStatus: (state, action) => {
      state.user.followingStatus = action.payload;
    },
    setFollowerCount: (state, action) => {
      action.payload === "follow"
        ? state.user.followerCount++
        : state.user.followerCount--;
    },
    resetProfile: (state, action) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.posts = [];
    },
  },
  extraReducers: (builder) => {
    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.error = action.payload as string;
    });
    // Get posts
    builder.addCase(getOwnPosts.pending, (state) => {
      state.error = null;
      state.loading = true;
    });
    builder.addCase(getOwnPosts.fulfilled, (state, action) => {
      state.error = null;
      state.loading = false;
      state.posts.push(action.payload);
    });
    builder.addCase(getOwnPosts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  resetProfile,
  setFollowingStatus,
  setFollowerCount,
  setUserProfile,
} = profileSlice.actions;

export default profileSlice.reducer;
