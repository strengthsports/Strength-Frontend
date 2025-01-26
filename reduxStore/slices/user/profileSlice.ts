import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getToken } from "@/utils/secureStore";
import { TargetUser, ProfileState, UserData, User } from "@/types/user";
import { logoutUser } from "./authSlice";
import { RootState } from "~/reduxStore";

//Following user
interface FollowUser {
  followingId: string;
  followingType: string;
}

// Initial State
const initialState: ProfileState = {
  user: null,
  profiles: {},
  loading: false,
  error: null,
};

export const getUserProfile = createAsyncThunk<
  { user: User; fromCache: boolean },
  TargetUser,
  { state: RootState; rejectValue: string }
>(
  "profile/getUserProfile",
  async (userdata: TargetUser, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const cachedProfiles = state.profile.profiles;

      // Check if the profile is already cached
      if (cachedProfiles && cachedProfiles[userdata.targetUserId]) {
        return { user: cachedProfiles[userdata.targetUserId], fromCache: true };
      }

      const token = await getToken("accessToken");
      if (!token) throw new Error("Token not found");
      // console.log("Token : ", token);
      // console.log("User data input :", userdata);

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/getProfile`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userdata),
        }
      );

      console.log("Response:", response);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Error getting user");
      }
      console.log("Data : ", data.data);
      return { user: data.data };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unexpected error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

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

export const followUser = createAsyncThunk<
  any,
  FollowUser,
  { rejectValue: string }
>("profile/followUser", async (userdata: FollowUser, { rejectWithValue }) => {
  try {
    const token = await getToken("accessToken");
    if (!token) throw new Error("Token not found");
    console.log("Token : ", token);
    console.log("User data input :", userdata);

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/follow`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userdata),
      }
    );

    console.log("Response:", response);
    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Error following user");
    }
  } catch (error: unknown) {
    console.log("Actual api error : ", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unexpected error occurred";
    return rejectWithValue(errorMessage);
  }
});

export const unFollowUser = createAsyncThunk<
  any,
  FollowUser,
  { rejectValue: string }
>("profile/unFollowUser", async (userdata: FollowUser, { rejectWithValue }) => {
  try {
    const token = await getToken("accessToken");
    if (!token) throw new Error("Token not found");
    console.log("Token : ", token);
    console.log("User data input :", userdata);

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/unfollow`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userdata),
      }
    );

    console.log("Response:", response);
    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Error unfollowing user");
    }
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
    resetProfile: (state, action) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.profiles = {};
    },
  },
  extraReducers: (builder) => {
    //get user profile
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;

        const { user, fromCache } = action.payload;

        // Cache the profile if it's freshly fetched
        if (!fromCache && user) {
          if (!state.profiles) state.profiles = {}; // Initialize profiles if null
          state.profiles[user._id] = user;
        }

        console.log("Profile is cached");

        // Update the currently displayed user profile
        state.user = user;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    // follow an user
    builder
      .addCase(followUser.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user.followerCount += 1;
        state.user.followingStatus = true;
      })
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    // unfollow an user
    builder
      .addCase(unFollowUser.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(unFollowUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user.followerCount -= 1;
        state.user.followingStatus = false;
      })
      .addCase(unFollowUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
      state.profiles = {};
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const { resetProfile } = profileSlice.actions;

export default profileSlice.reducer;
