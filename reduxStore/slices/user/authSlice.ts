import {
  getToken,
  removeRToken,
  removeToken,
  removeUserId,
  saveRToken,
  saveToken,
  saveUserId,
  setExpiry,
} from "@/utils/secureStore";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User, AuthState } from "@/types/user";
import { Platform } from "react-native";

type LoginPayload = {
  email?: string;
  username?: string;
  password: string;
};

type GoogleLoginResponse =
  | {
      newUser: boolean;
      accessToken: string;
      refreshToken: string;
      user: User;
      message: string;
    }
  | {
      newUser: boolean;
      email: string;
      firstName: string;
      lastName: string;
      message: string;
    };

// Initial State
const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  error: null,
  loading: false,
  success: false,
  status: null,
  msgBackend: null,
  fcmToken: null,
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

// Login User
export const loginUser = createAsyncThunk<
  { user: User; message: string },
  LoginPayload,
  { rejectValue: string }
>("auth/loginUser", async (LoginPayload, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(LoginPayload),
      }
    );
    const data = await response.json();

    if (!response.ok) {
      console.log("data.message-", data.message);
      return rejectWithValue(data.message);
    }

    // Convert tokens to strings and save in Secure Store
    console.log("saving accessToken,refreshToken and user id");
    saveToken("accessToken", data.data.accessToken);
    setExpiry();
    saveRToken("refreshToken", data.data.refreshToken);
    saveUserId("user_id", data.data.user._id);

    return { user: data.data.user, message: data.message };
  } catch (err: any) {
    return rejectWithValue(
      err.message || "Something went wrong. Please try again."
    );
  }
});

// Logout User
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

      // Disconnect socket connection
      // disconnectSocket();

      // Clear Secure Store
      removeToken("accessToken");
      removeRToken("refreshToken");
      removeUserId("user_id");
      console.log("From Redux - Logged out successfully!");

      return;
    } catch (err: any) {
      return rejectWithValue(
        err.message || "Something went wrong. Please try again."
      );
    }
  }
);

//google signin
export const loginWithGoogle = createAsyncThunk<
  GoogleLoginResponse,
  { email: string; idToken: string; name?: string; photo?: string },
  { rejectValue: string }
>("auth/loginWithGoogle", async (googleData, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/googlesignin`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: googleData.idToken }),
      }
    );
    // console.log("Response from Google Signin:", response);

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      return rejectWithValue(data.message || "Google login failed");
    }

    if (!data.data.newUser) {
      // ✅ Store user credentials securely
      // console.log(data);
      await saveToken("accessToken", data.data.accessToken);
      await saveRToken("refreshToken", data.data.refreshToken);
      await saveUserId("user_id", data.data.user._id);
      await setExpiry();

      return {
        newUser: false,
        user: data.data.user,
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
        message: data.message,
      };
    } else {
      // ✅ Handle new user case
      return {
        email: data.data.email,
        firstName: data.data.firstName,
        lastName: data.data.lastName,
        newUser: data.data.newUser,
        message: data.message,
      };
    }
  } catch (err: any) {
    return rejectWithValue(err.message || "Google login failed");
  }
});

// Refresh access token
export const refreshAccessToken = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>("auth/refreshAccessToken", async (refreshToken, { rejectWithValue }) => {
  try {
    console.log("ReTo", refreshToken);
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/refresh-token`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      }
    );
    const data = await response.json();
    console.log("Data : ", data);

    if (!response.ok) {
      return rejectWithValue("Refresh failed.");
    }

    // Convert tokens to strings and save in Secure Store
    console.log("saving new accessToken,refreshToken");
    console.log(data.data.accessToken, data.data.refreshToken);
    removeToken("accessToken");
    removeRToken("refreshToken");
    saveToken("accessToken", data.data.accessToken);
    saveRToken("refreshToken", data.data.refreshToken);

    return;
  } catch (err: any) {
    return rejectWithValue(
      err.message || "Something went wrong. Please try again."
    );
  }
});

//save fcm token
export const sendFcmToken = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("auth/sendFcmToken", async (fcmToken, { rejectWithValue }) => {
  try {
    const accessToken = await getToken("accessToken");

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/save-fcm-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ fcmToken, device: Platform.OS }),
      }
    );

    if (!response.ok) {
      const data = await response.json();
      return rejectWithValue(data.message || "Failed to save FCM token");
    }
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to save FCM token");
  }
});

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state) => {
      state.isLoggedIn = true;
      setExpiry();
    },
    resetAuthState: (state) => {
      state.error = null;
      state.msgBackend = null;
      state.status = null;
    },
    resetUserData: (state) => {
      // Reset all user-related data (added part)
      state.isLoggedIn = false;
      state.user = null;
      state.error = null;
      state.msgBackend = null;
      state.status = null;
      state.fcmToken = null;
    },
  },
  extraReducers: (builder) => {
    //login State
    builder.addCase(initializeAuth.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    });
    //missing extra reducer (added part)
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.isLoggedIn = true;
      state.error = null;
      state.msgBackend = action.payload.message;
    });

    //Google Signin
    builder.addCase(loginWithGoogle.fulfilled, (state, action) => {
      if (action.payload.userExists) {
        state.user = action.payload.user;
        state.isLoggedIn = true;
        state.error = null;
        state.msgBackend = action.payload.message;
      } else {
        // New user — show a message or redirect to signup step (optional)
        state.user = null;
        state.isLoggedIn = false;
        state.error = null;
        state.msgBackend = action.payload.message;
      }
    });
    builder.addCase(loginWithGoogle.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginWithGoogle.rejected, (state, action) => {
      state.error = action.payload || "Google login failed";
    });

    //fcm token
    builder.addCase(sendFcmToken.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(sendFcmToken.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
    });

    builder.addCase(sendFcmToken.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to send FCM token";
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isLoggedIn = false;
      state.error = null;
      state.msgBackend = null;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const { resetAuthState, setAuthState, resetUserData } =
  authSlice.actions;
export default authSlice.reducer;
