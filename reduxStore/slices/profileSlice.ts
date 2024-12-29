import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getToken } from "@/utils/secureStore";

// Async thunk for fetching sports data
export const fetchSportsData = createAsyncThunk(
  "profile/fetchSportsData",
  async (_, { rejectWithValue }) => {
    try {
      const token = await getToken("accessToken");
      if (!token) throw new Error("Token not found");
      const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/fetch-allSports`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Error fetching sports data");
      }
      return data.data;
    } catch (error: unknown) {
      // Type assertion to Error
      const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

interface ProfileState {
  sportsData: { _id: string; name: string }[]; // Adjust sportsData type based on your response
  selectedSports: string[]; // Array to store selected sports IDs
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  sportsData: [],
  selectedSports: [],
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // Action to toggle selection of a sport
    toggleSportSelection(state, action) {
      const sportId = action.payload;
      const updatedSelectedSports = state.selectedSports.includes(sportId)
        ? state.selectedSports.filter((id) => id !== sportId) // Remove sport if it's already selected
        : [...state.selectedSports, sportId]; // Add sport if not selected
      state.selectedSports = updatedSelectedSports;
    },
    setSelectedSports(state, action) {
        state.selectedSports = action.payload;
      },

    // Optional: Action to update selected sports directly (e.g., from another part of your app)
    updateSelectedSports(state, action) {
      state.selectedSports = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSportsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSportsData.fulfilled, (state, action) => {
        state.loading = false;
        state.sportsData = action.payload;
      })
      .addCase(fetchSportsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { toggleSportSelection, updateSelectedSports, setSelectedSports } = profileSlice.actions;

export default profileSlice.reducer;
