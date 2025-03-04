import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getToken } from "@/utils/secureStore";
import { ProfileState, TargetUser, User } from "@/types/user";
import { loginUser, logoutUser } from "./authSlice";
import { PicData } from "~/types/others";
import { completeSignup } from "./signupSlice";
import { onboardingUser } from "./onboardingSlice";

// Initial State
const initialState: ProfileState = {
  user: null,
  followings: [],
  loading: false,
  error: null,
  msgBackend: null,
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

    // userdata.forEach((value, key) => {
    //   console.log(`${key}: ${value}`);
    // });

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
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/post`,
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

// Edit about
export const editUserAbout = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>("profile/editUserAbout", async (userAbout, { rejectWithValue }) => {
  try {
    const token = await getToken("accessToken");
    if (!token) throw new Error("Token not found");
    console.log("Token : ", token);
    console.log("User data input :", userAbout);

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/updateAbout`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ about: userAbout }),
      }
    );

    console.log("Response:", response);
    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Error editing sports overview");
    }
    console.log("Data : ", data);
    return data.data.about;
  } catch (error: unknown) {
    console.log("Actual api error : ", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unexpected error occurred";
    return rejectWithValue(errorMessage);
  }
});

// Upload Profile/Cover pic
export const uploadPic = createAsyncThunk<
  any,
  PicData,
  { rejectValue: string }
>("profile/uploadPic", async (picData, { rejectWithValue }) => {
  try {
    const token = await getToken("accessToken");
    if (!token) throw new Error("Token not found");

    const routeName =
      picData.type.charAt(0).toUpperCase() +
      picData.type.slice(1, picData.type.length);
    const picdata = picData.data;
    console.log(routeName);

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/update${routeName}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: picdata,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.log("Error updating pic :", response.json());
      return rejectWithValue(data.message || "Error updating pic");
    }

    return { type: picData.type, data: data.data[picData.type] };
  } catch (error: unknown) {
    console.log("Actual api error : ", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unexpected error occurred";
    return rejectWithValue(errorMessage);
  }
});

// Remove Profile/Cover pic
export const removePic = createAsyncThunk<any, string, { rejectValue: string }>(
  "profile/removePic",
  async (picType, { rejectWithValue }) => {
    try {
      const token = await getToken("accessToken");
      if (!token) throw new Error("Token not found");

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/remove-${picType}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("Data after removing pic api call : ", data);

      if (!response.ok) {
        console.log("Error removing pic :", response.json());
        return rejectWithValue(data.message || "Error removing pic");
      }

      return picType;
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
      state.user!.followingStatus = action.payload;
    },
    setFollowerCount: (state, action) => {
      action.payload === "follow"
        ? state.user!.followerCount++
        : state.user!.followerCount--;
    },
    setFollowingCount: (state, action) => {
      action.payload === "follow"
        ? state.user!.followingCount++
        : (state.user!.followingCount = state.user!.followingCount - 1);
    },
    pushFollowings: (state, action) => {
      state.followings = [...(state.followings || []), action.payload];
    },
    pullFollowings: (state, action) => {
      state.followings?.filter((id) => id !== action.payload);
    },
    resetProfile: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.posts = [];
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.error = null;
      state.msgBackend = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.followings = [];
      state.msgBackend = action.payload.message;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.error = action.payload as string;
      state.isLoggedIn = false;
      state.user = null;
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.posts = [];
      state.followings = [];
      state.error = null;
      state.loading = false;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Complete Signup Thunk State Handling
    builder
      .addCase(completeSignup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeSignup.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.msgBackend = action.payload.message;
        state.error = null;
      })
      .addCase(completeSignup.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.isLoggedIn = false;
        state.user = null;
        state.error =
          action.payload || "Unexpected error occurred during complete signup.";
      });

    // Save onboarding data to current user
    builder
      .addCase(onboardingUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onboardingUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
        state.msgBackend = action.payload.message;
        state.error = null;
      })
      .addCase(onboardingUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.isLoggedIn = false;
        state.error =
          action.payload || "Unexpected error occurred during onboarding user.";
      });

    // Update user data
    builder
      .addCase(editUserProfile.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
        state.msgBackend = action.payload.message;
        state.error = null;
      })
      .addCase(editUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload || "Unexpected error occurred during updating user.";
      });

    // Fetch my profile
    builder.addCase(fetchMyProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.user = action.payload;
    });
    builder.addCase(fetchMyProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Edit sports overview
    builder.addCase(editUserSportsOverview.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(editUserSportsOverview.fulfilled, (state, action) => {
      // Set loading to true, error to null initially
      state.loading = false;
      state.error = null;
    });
    builder.addCase(editUserSportsOverview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    //Edit user about
    builder.addCase(editUserAbout.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.user!.about = action.payload;
    });
    builder.addCase(editUserAbout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    //Remove profile/cover pic
    builder.addCase(removePic.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      if (action.payload === "profilePic") {
        state.user!.profilePic = null;
      } else {
        state.user!.coverPic = null;
      }
    });
    builder.addCase(removePic.rejected, (state) => {
      state.loading = false;
      state.error = "Failed to remove pic";
    });

    //Update profile/cover pic
    builder.addCase(uploadPic.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      if (action.payload.type === "profilePic") {
        state.user!.profilePic = action.payload.data;
      } else {
        state.user!.coverPic = action.payload.data;
      }
    });
    builder.addCase(uploadPic.rejected, (state) => {
      state.loading = false;
      state.error = "Failed to update pic";
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
  setFollowingCount,
  pullFollowings,
  pushFollowings,
} = profileSlice.actions;

export default profileSlice.reducer;
