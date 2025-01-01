import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Types
interface SignupState {
  loading: boolean;
  success: boolean;
  error: string | null;
  userId: string | null; // Track user ID for OTP verification
}

interface SignupPayload {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
}

interface OTPPayload {
  _id: string;
  otp: string;
}

// Initial State
const initialState: SignupState = {
  loading: false,
  success: false,
  error: null,
  userId: null, // Initially, no user is associated
};

// Thunk for Signup
export const signupUser = createAsyncThunk<
  { message: string; userId: string }, // Returned data type on success
  SignupPayload, // Argument type
  { rejectValue: string } // Rejected value type
>("auth/signupUser", async (signupPayloadData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/initiate-signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupPayloadData),
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Signup failed. Please try again.");
    }
    // console.log('redux userid ', data.data.user._id)
    return { message: data.message, userId: data.data.user._id };
  } catch (error: any) {
    console.error("Signup Error:", error);
    return rejectWithValue("Something went wrong. Please try again later.");
  }
});

// Thunk for Verify OTP
export const verifyOTPSignup = createAsyncThunk<
  { message: string }, // Returned data type on success
  OTPPayload, // Argument type
  { rejectValue: string } // Rejected value type
>("auth/verifyOtp", async (OTPPayload, { rejectWithValue }) => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(OTPPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Verification failed. Please try again.");
    }

    return { message: data.message };
  } catch (error: any) {
    console.error("Verification Error:", error);
    return rejectWithValue("Something went wrong. Please try again later.");
  }
});

// Slice
const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    resetSignupState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.userId = null;
    },
  },
  extraReducers: (builder) => {
    // Signup Thunk
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.userId = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.userId = action.payload.userId; // Store user ID for OTP verification
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Unexpected error occurred during signup.";
      });

    // Verify OTP Thunk
    builder
      .addCase(verifyOTPSignup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTPSignup.fulfilled, (state) => {
        state.loading = false;
        state.success = true; // OTP verification is successful
        state.error = null;
      })
      .addCase(verifyOTPSignup.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Unexpected error occurred during OTP verification.";
      });
  },
});

export const { resetSignupState } = signupSlice.actions;
export default signupSlice.reducer;
