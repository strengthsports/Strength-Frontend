import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface SignupState {
    loading: boolean;
    success: boolean;
    error: string | null;
  }
  
  interface SignupPayload {
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
  }
  
  // Initial State
  const initialState: SignupState = {
    loading: false,
    success: false,
    error: null,
  };

export const signupUser = createAsyncThunk<
    { message: string; userId: string }, // Returned data type on success
    SignupPayload, // Argument type
    { rejectValue: string } // Rejected value type
    >('auth/signupUser', async (validData, {rejectWithValue}) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/initiate-signup`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(validData),
            });
        
            const data = await response.json();
        
            if (!response.ok) {
              return rejectWithValue(data.message || "Signup failed. Please try again.");
            }
        
            return { message: data.message, userId: data.data.user._id };
          } catch (error: any) {
            console.error("Signup Error:", error);
            return rejectWithValue("Something went wrong. Please try again later.");
          }
        });

const signupSlice = createSlice({
    name: 'signup',
    initialState,
    reducers: {
        resetSignupState: (state) => {
            state.loading
            state.success
            state.error
        }
    }

})

export const {resetSignupState} = signupSlice.actions
export default signupSlice.reducer