import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of the state
interface ForgotPasswordState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  resetToken: string;
}

interface OtpVerificationResponse {
  message: string;
  resetToken: string;
}

interface SetNewPasswordResponse {
  message: string;
}

// Initial state
const initialState: ForgotPasswordState = {
  isLoading: false,
  error: null,
  success: false,
  resetToken: "",
};

// Async thunk for taking email and sending OTP
export const forgotPassword = createAsyncThunk<
  any, // Success response type
  string, // Argument type (email)
  { rejectValue: string } // Rejected payload type
>("forgotPassword/forgotPassword", async (email, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/initiate-forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return rejectWithValue(data.message || "Failed to send OTP.");
    }
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Async thunk for OTP verification
export const verifyOtp = createAsyncThunk<
  OtpVerificationResponse, // Success response type
  { email: string; otp: string }, // Argument type (id and OTP)
  { rejectValue: string } // Rejected payload type
>("forgotPassword/verifyOtp", async ({ email, otp }, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/forgot-password-verifyOtp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      }
    );
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      return { resetToken: data.data.resetToken, message: data.message };
    } else {
      return rejectWithValue(data.message || "Failed to verify OTP.");
    }
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Async thunk for setting a new password
export const setNewPassword = createAsyncThunk<
  SetNewPasswordResponse, // Success response type
  { resetToken: string; newPassword: string }, // Argument type (email, new password)
  { rejectValue: string } // Rejected payload type
>(
  "forgotPassword/setNewPassword",
  async ({ resetToken, newPassword }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/setNew-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ resetToken, newPassword }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        return rejectWithValue(data.message || "Failed to set new password.");
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
      state.resetToken = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to send OTP.";
      })
      // OTP Verification
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.resetToken = action.payload.resetToken;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to verify OTP.";
      })
      // Set New Password
      .addCase(setNewPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setNewPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(setNewPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to set new password.";
      });
  },
});

export const { resetState } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
