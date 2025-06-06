import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { saveRToken, saveToken, setExpiry } from "~/utils/secureStore";
import { setAuthState } from "./authSlice";

// Types
interface SignupState {
  loading: boolean;
  success: boolean;
  error: string | null;
  userId: string | null; // Track user ID
  email: string | null; // Track user email
}
// Initial State
const initialState: SignupState = {
  loading: false,
  success: false,
  error: null,
  userId: null,
  email: null,
};

interface SignupPayload {
  userType: string;
  email: string;
  firstName: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  category?: string;
}
// Thunk for Signup
export const signupUser = createAsyncThunk<
  { message: string; userId: string; email: string }, // Returned daa type on success
  SignupPayload, // Argument type
  { rejectValue: string } // Rejected value type
>("auth/signupUser", async (SignupPayload, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/initiate-signup?userType=${SignupPayload.userType}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(SignupPayload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(
        data.message || "Signup failed. Please try again."
      );
    }
    return {
      message: data.message,
      userId: data.data.user._id,
      email: data.data.user.email,
    };
  } catch (error: any) {
    console.error("Signup Error:", error);
    return rejectWithValue("Something went wrong. Please try again later.");
  }
});

interface OTPPayload {
  _id: string;
  otp: string;
}
// Thunk for Verify OTP
export const verifyOTPSignup = createAsyncThunk<
  { message: string },
  OTPPayload,
  { rejectValue: string }
>("auth/verifyOtp", async (OTPPayload, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/verify-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(OTPPayload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(
        data.message || "Verification failed. Please try again."
      );
    }

    return { message: data.message };
  } catch (error: any) {
    console.error("Verification Error:", error);
    return rejectWithValue("Something went wrong. Please try again later.");
  }
});

interface resendOTPPayload {
  _id: string;
  email: string;
}
// Resend OTP Thunk
export const resendOtp = createAsyncThunk<
  { message: string },
  resendOTPPayload,
  { rejectValue: string }
>("auth/resendOtp", async (resendOTPPayload, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/resend-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resendOTPPayload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(
        data.message || "Resending OTP failed. Please try again."
      );
    }

    return { message: data.message };
  } catch (error: any) {
    console.error("Resend OTP Error:", error);
    return rejectWithValue("Something went wrong. Please try again later.");
  }
});

export interface completeSignupPayload {
  email: string;
  password: string | null;
  username: string;
  address: object;
}
export const completeSignup = createAsyncThunk<
  {
    user: any;
    message: string;
  },
  completeSignupPayload,
  { rejectValue: string }
>("user/completeSignup", async (completeSignupPayload, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/complete-signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeSignupPayload),
      }
    );

    const data = await response.json();
    console.log("redux data", data);

    if (!response.ok) {
      return rejectWithValue(data.message || "Something went wrong!");
    }

    // Convert tokens to strings and save in Secure Store
    console.log("saving accessToken");
    saveToken("accessToken", data.data.accessToken);
    saveRToken("refreshToken", data.data.refreshToken);
    // console.log(data.data.refreshToken);
    setExpiry();

    return { user: data.data.user, message: data.message }; // Return the response data for the fulfilled state
  } catch (error: any) {
    console.error("Complete Signup Error:", error);
    return rejectWithValue(error.message || "Network error!");
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
      state.email = null;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
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
        state.email = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.userId = action.payload.userId; // Store user ID
        state.email = action.payload.email; // Store userEmail
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload || "Unexpected error occurred during signup.";
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
        state.error =
          action.payload ||
          "Unexpected error occurred during OTP verification.";
      });
    // Resend OTP
    builder
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload || "Unexpected error occurred while resending OTP.";
      });
  },
});

export const { resetSignupState, setEmail } = signupSlice.actions;
export default signupSlice.reducer;
