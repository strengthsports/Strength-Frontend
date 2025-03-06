import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getToken } from "@/utils/secureStore";
import { SuggestionUser, User } from "@/types/user";

interface OnboardingState {
  sportsData: { _id: string; name: string }[];
  fetchedUsers: SuggestionUser[];
  selectedSports: string[];
  profilePic: {
    newUri: string | null;
    fileObject: object | null;
  } | null;
  headline: string;
  username: string;
  address: object | null;
  loading: boolean;
  error: string | null;
}

//initial state
const initialState: OnboardingState = {
  sportsData: [],
  fetchedUsers: [],
  selectedSports: [],
  profilePic: null,
  headline: "",
  username: "",
  address: null,
  loading: false,
  error: null,
};

// Async thunk for fetching sports data
export const fetchSportsData = createAsyncThunk(
  "profile/fetchSportsData",
  async (_, { rejectWithValue }) => {
    try {
      const token = await getToken("accessToken");
      if (!token) throw new Error("Token not found");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/fetch-allSports`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Error fetching sports data");
      }
      return data.data;
    } catch (error: unknown) {
      // Type assertion to Error
      const errorMessage =
        error instanceof Error ? error.message : "Unexpected error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

//async thunk for getting user suggestions
export const fetchUserSuggestions = createAsyncThunk<
  any,
  { sportsData: Array<string>; limit: number; page: number },
  { rejectValue: string }
>(
  "profile/fetchUserSuggestions",
  async ({ sportsData, limit, page }, { rejectWithValue }) => {
    try {
      const token = await getToken("accessToken");
      if (!token) throw new Error("Token not found");
      console.log("sports : ", sportsData);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/user-suggestions?limit=${limit}&page=${page}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sportsData),
        }
      );

      // const text = await response.text();
      // let dataa;
      // try {
      //   dataa = JSON.parse(text);
      // } catch {
      //   throw new Error("Invalid JSON response");
      // }

      // console.log("Readable Response:", JSON.stringify(dataa, null, 2));

      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(
          data.message || "Error fetching user suggestions"
        );
      }
      console.log("Data fetched : ", data.data.users);
      return data.data.users;
    } catch (error: unknown) {
      // Type assertion to Error
      console.log(error);
      const errorMessage =
        error instanceof Error ? error.message : "Unexpected error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

// Final onboarding
export const onboardingUser = createAsyncThunk<
  any,
  FormData,
  { rejectValue: string }
>("profile/onboardingUser", async (data: FormData, { rejectWithValue }) => {
  try {
    const token = await getToken("accessToken");
    if (!token) throw new Error("Token not found");
    console.log("Onboard data : ", data);

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/onboard-user`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }
    );

    const data1 = await response.json();
    if (!response.ok) {
      return rejectWithValue(data1?.message || "Error onboarding user");
    }

    return data1;
  } catch (error: unknown) {
    console.log("Onboarding error : ", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unexpected error occurred";
    return rejectWithValue(errorMessage);
  }
});

const onboardingSlice = createSlice({
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
    setProfilePic(state, action) {
      state.profilePic = action.payload;
    },
    // Action to clear profile image
    clearProfilePic(state) {
      state.profilePic = null;
    },
    // Action to set profile headline
    setHeadline(state, action) {
      state.headline = action.payload;
    },
    //Action to clear profile headline
    clearHeadline(state) {
      state.headline = "";
    },
    setUsername(state, action) {
      state.username = action.payload;
    },
    clearUsername(state) {
      state.username = "";
    },
    setAddress(state, action) {
      state.address = action.payload;
    },
    clearAddress(state) {
      state.address = null;
    },
    resetOnboardingData(state) {
      state.sportsData = [];
      state.fetchedUsers = [];
      state.selectedSports = [];
      state.profilePic = null;
      state.headline = "";
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
  setProfilePic,
  clearProfilePic,
  setHeadline,
  clearHeadline,
  setAddress,
  setUsername,
  clearAddress,
  clearUsername,
  resetOnboardingData,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
