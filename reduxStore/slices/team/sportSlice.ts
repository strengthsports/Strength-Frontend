import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getToken } from "~/utils/secureStore";

export const fetchSports = createAsyncThunk(
  "sports/fetchSports",
  async (_, { rejectWithValue }) => {
    try {
      const token = await getToken("accessToken");
      const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/fetch-allSports?type=team`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
            });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) return rejectWithValue(data.message || "Error fetching sports");
      return data?.data ?? [];  // Ensure data is an array

    } catch (error: any) {
      return rejectWithValue(error.message || "Network error!");
    }
  }
);
const sportsSlice = createSlice({
  name: "sports",
  initialState: {
    sports: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSports.fulfilled, (state, action) => {
        state.loading = false;
        state.sports = action.payload;
      })
      .addCase(fetchSports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default sportsSlice.reducer;
