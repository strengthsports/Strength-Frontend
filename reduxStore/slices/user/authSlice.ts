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

type LoginPayload = {
  email?: string;
  username?: string;
  password: string;
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
      console.log("data.message-", data.message)
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
