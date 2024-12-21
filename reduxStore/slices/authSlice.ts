import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";

// Types
interface User {
  id: string;
  email: string;
  [key: string]: any;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  error: string | null;
  status: number | null;
  msgBackend: string | null;
}

// Initial State
const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  error: null,
  status: null,
  msgBackend: null,
};

// Thunks
export const loginUser = createAsyncThunk<
  { user: User; message: string },
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Login failed. Please try again.");
    }

    // Convert tokens to strings and save in Secure Store
    await SecureStore.setItemAsync("accessToken", String(data.accessToken));
    await SecureStore.setItemAsync("refreshToken", String(data.refreshToken));

    return { user: data.data.user, message: data.message };
  } catch (err: any) {
    return rejectWithValue(err.message || "Something went wrong. Please try again.");
  }
});


export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await SecureStore.getItemAsync("accessToken")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return rejectWithValue(data.message || "Logout failed. Please try again.");
    }

    // Clear Secure Store
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");

    return;
  } catch (err: any) {
    return rejectWithValue(err.message || "Something went wrong. Please try again.");
  }
});

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
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
