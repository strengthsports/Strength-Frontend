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

//async thunk for getting user suggestions
export const fetchUserSuggestions = createAsyncThunk(
  "profile/fetchUserSuggestions",
  async (_, { rejectWithValue }) => {
    try {
      const token = await getToken("accessToken");
      if (!token) throw new Error("Token not found");
      const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/user-suggestions`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Error fetching user suggestions");
      }
      return data.data;
    } catch (error: unknown) {
      // Type assertion to Error
      const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

//async thunk for onboarding users
interface OnboardingData {
  headline: any;
  assets: any;
  sports: any;
  followings: any;
}

export const onboardingUser = createAsyncThunk<
  any,  // The return type of the payload (data from the API)
  OnboardingData,  // The argument passed to the action (i.e., data)
  { rejectValue: string }  // The type for the error message
>(
  "profile/onboardingUser",
  async (data: OnboardingData, { rejectWithValue }) => {
    try {
      const token = await getToken("accessToken");
      if (!token) throw new Error("Token not found");

      const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/onboard-user`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const data1 = await response.json();
      if (!response.ok) {
        return rejectWithValue(data1.message || "Error onboarding user");
      }
      return data1.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);



interface User{
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
}
interface ProfileState {
  sportsData: { _id: string; name: string }[]; // Adjust sportsData type based on your response
  fetchedUsers: User[];
  selectedSports: string[]; // Array to store selected sports IDs
  profileImage: string | null; // Store profile image URI
  profileHeadline: string;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  sportsData: [],
  fetchedUsers: [],
  selectedSports: [],
  profileImage: null, // Initialize with null
  profileHeadline: "",
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

    // Action to set the selected sports array
    setSelectedSports(state, action) {
      state.selectedSports = action.payload;
    },

    // Optional: Action to update selected sports directly (e.g., from another part of your app)
    updateSelectedSports(state, action) {
      state.selectedSports = action.payload;
    },

    // Action to set profile image
    setProfileImage(state, action) {
      state.profileImage = action.payload;
    },

    // Action to clear profile image
    clearProfileImage(state) {
      state.profileImage = null;
    },

    // Action to set profile headline
    setProfileHeadline(state, action) {
      state.profileHeadline = action.payload;
    },
    //Action to clear profile headline
    clearProfileHeadline(state) {
      state.profileHeadline = "";
    },
    //Action to edit profile headline
    editProfileHeadline(state, action) {
      state.profileHeadline = action.payload;
    }
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
      })
      .addCase(fetchUserSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.fetchedUsers = action.payload;
      })
      .addCase(fetchUserSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },

});

export const {
  toggleSportSelection,
  updateSelectedSports,
  setSelectedSports,
  setProfileImage,
  clearProfileImage,
  setProfileHeadline,
  clearProfileHeadline,
  editProfileHeadline,
} = profileSlice.actions;

export default profileSlice.reducer;
