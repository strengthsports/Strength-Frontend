import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getToken } from "@/utils/secureStore";
import { ProfileState, TargetUser, User } from "@/types/user";
import { logoutUser } from "./authSlice";

// Initial State
const initialState: ProfileState = {
  user: null,
  loading: false,
  error: null,
  posts: [],
};

// Edit user profile details
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

// Get user's own posts
export const getOwnPosts = createAsyncThunk<any, null, { rejectValue: string }>(
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
      console.log("Data : ", data?.data?.formattedPosts);
      return data?.data?.formattedPosts;
    } catch (error: unknown) {
      console.log("Actual api error : ", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unexpected error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch user's own profile
export const fetchMyProfile = createAsyncThunk<
  User,
  TargetUser,
  { rejectValue: string }
>(
  "profile/fetchMyProfile",
  async (userData: TargetUser, { rejectWithValue }) => {
    try {
      const token = await getToken("accessToken");
      if (!token) throw new Error("Token not found");
      console.log("Token : ", token);

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/getProfile`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      console.log("Response:", response);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Error getting profile");
      }
      console.log("Data : ", data.data);
      return data.data;
    } catch (error: unknown) {
      console.log("Actual api error : ", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unexpected error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

// Edit user sports overview
export const editUserSportsOverview = createAsyncThunk<
  any,
  any,
  { rejectValue: string }
>("profile/editUserSportsOverview", async (sportsData, { rejectWithValue }) => {
  try {
    const token = await getToken("accessToken");
    if (!token) throw new Error("Token not found");
    console.log("Token : ", token);
    console.log("User data input :", sportsData);

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/add-sport`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(sportsData),
      }
    );

    console.log("Response:", response);
    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Error editing sports overview");
    }
    console.log("Data : ", data.data);
    return data.data;
  } catch (error: unknown) {
    console.log("Actual api error : ", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unexpected error occurred";
    return rejectWithValue(errorMessage);
  }
});

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
      state.posts = [];
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
      state.posts = action.payload;
      state.error = null;
      state.loading = false;
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
