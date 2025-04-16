// teamSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import { Team, TeamMember } from "~/types/team";
import { getToken } from "~/utils/secureStore";

// Interfaces
export interface TeamMember {
  _id: string;
  firstName: string;
  lastName: string;
  profilePic?: string;
  position?: string;
  preferredFoot?: string;
  followerCount?: number;
  distance?: number;
  address?: any;
  isFollowing?: boolean;
  hasSelectedSport?: boolean;
  priorityScore?: number;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalPlayers: number;
}

interface MemberSuggestionsState {
  data: TeamMember[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}

const initialState: MemberSuggestionsState = {
  data: [],
  pagination: null,
  loading: false,
  error: null,
};

// Thunk
export const fetchUserSuggestions = createAsyncThunk<
  { data: TeamMember[]; pagination: Pagination },
  { sportId: string; page?: number; limit?: number },
  { rejectValue: string }
>("memberSuggestions/fetch", async ({ sportId, page = 1, limit = 10 }, { rejectWithValue }) => {
  try {
    const token = await getToken("accessToken");

    const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/team/suggest-members`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sportId, page, limit }),
    });
   
    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Failed to fetch member suggestions");
    }
    
    return {
      data: data.data,
      pagination: data.pagination,
    };
  } catch (error: any) {
    return rejectWithValue(error.message || "Network error");
  }
});

const userSuggestionsSlice = createSlice({
  name: "userSuggestions",
  initialState,
  reducers: {
    clearSuggestions(state) {
      state.data = [];
      state.pagination = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUserSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearSuggestions } = userSuggestionsSlice.actions;

export default userSuggestionsSlice.reducer;
