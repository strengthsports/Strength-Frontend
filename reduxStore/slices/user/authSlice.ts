import { getToken, removeToken, saveToken } from "@/utils/secureStore";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { completeSignup } from "./signupSlice";
import { onboardingUser } from "./onboardingSlice";
import {
  editUserAbout,
  editUserProfile,
  editUserSportsOverview,
  fetchMyProfile,
  removePic,
} from "./profileSlice";
import { User, AuthState } from "@/types/user";

// Initial State
const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  error: null,
  loading: false,
  success: false,
  status: null,
  msgBackend: null,
};

// Thunks
export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async () => {
    const accessToken = await getToken("accessToken");
    if (accessToken) {
      return { isLoggedIn: true };
    }
    return { isLoggedIn: false };
  }
);
export const loginUser = createAsyncThunk<
  { user: User; message: string },
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );
    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Login failed. Please try again.");
    }

    // Convert tokens to strings and save in Secure Store
    console.log("saving accessToken");
    // console.log("accessToken", data.data.accessToken);
    saveToken("accessToken", data.data.accessToken);

    return { user: data.data.user, message: data.message };
  } catch (err: any) {
    return rejectWithValue(
      err.message || "Something went wrong. Please try again."
    );
  }
});

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${await getToken("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        return rejectWithValue(
          data.message || "Logout failed. Please try again."
        );
      }

      // Clear Secure Store
      removeToken("accessToken");
      console.log("From Redux - Logged out successfully!");

      return;
    } catch (err: any) {
      return rejectWithValue(
        err.message || "Something went wrong. Please try again."
      );
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setFollowingCount: (state, action) => {
      action.payload === "follow"
        ? state.user.followingCount++
        : (state.user.followingCount = state.user.followingCount - 1);
    },
    resetAuthState: (state) => {
      state.error = null;
      state.msgBackend = null;
      state.status = null;
    },
  },
  extraReducers: (builder) => {
    //login State
    builder.addCase(initializeAuth.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    });
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.error = null;
      state.msgBackend = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
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
      state.isLoggedIn = false;
      state.user = null;
      state.error = null;
      state.msgBackend = null;
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
    builder.addCase(fetchMyProfile.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
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
    builder.addCase(editUserAbout.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(editUserAbout.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.user.about = action.payload;
    });
    builder.addCase(editUserAbout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    //Remove profile/cover pic
    builder.addCase(removePic.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removePic.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      if (action.payload === "profilePic") {
        state.user.profilePic = null;
      } else {
        state.user.coverPic = null;
      }
    });
    builder.addCase(removePic.rejected, (state, action) => {
      state.loading = false;
      state.error = "Failed to remove pic";
    });
  },
});

export const { resetAuthState, setFollowingCount } = authSlice.actions;
export default authSlice.reducer;
