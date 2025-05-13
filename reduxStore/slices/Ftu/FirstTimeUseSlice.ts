// redux/slices/firstTimeUseSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getToken } from "~/utils/secureStore";

type FirstTimeFields = "hasVisitedEditProfile" | "hasVisitedCommunity" | "hasVisitedEditOverview";

interface FirstTimeUseState {
  hasVisitedEditProfile:boolean,
  hasVisitedCommunity:boolean,
  hasVisitedEditOverview:boolean,
  loading: boolean;
  error: string | null;
}

const initialState: FirstTimeUseState = {
  hasVisitedEditProfile:false,
  hasVisitedCommunity:false,
  hasVisitedEditOverview:false,
  loading: false,
  error: null,
};

// ✅ Thunk
export const setFirstTimeUseFlag = createAsyncThunk<
  FirstTimeFields, // Return type
  { field: FirstTimeFields } // Argument type
>(
  "firstTimeUse/setFirstTimeUseFlag",
  async ({ field }, thunkAPI) => {
    const token = await getToken("accessToken");

    try {
      await axios.patch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/set-firstTimeUserFlag`,
        { field },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return field; // return updated field key
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Failed to update flag");
    }
  }
);

// ✅ Slice
const firstTimeUseSlice = createSlice({
  name: "firstTimeUse",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setFirstTimeUseFlag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setFirstTimeUseFlag.fulfilled, (state, action) => {
        state.loading = false;
        state[action.payload] = true;
        // state.profile.user[action.payload] = true; ← avoid this unless you merge into profile reducer
      })
      .addCase(setFirstTimeUseFlag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default firstTimeUseSlice.reducer;
