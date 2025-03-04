import { getToken, removeToken, saveToken } from "@/utils/secureStore";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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

// Login User
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

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
