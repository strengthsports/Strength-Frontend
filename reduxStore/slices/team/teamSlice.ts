import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Team, TeamMember } from "~/types/team";
import { getToken } from "~/utils/secureStore";

interface TeamState {
  team: Team | null;
  invited: TeamMember | null;
  error: any | null;
  loading: boolean;
}

// Initial State
const initialState: TeamState = {
  team: null,
  invited: null,
  error: null,
  loading: false,
};

type TeamPayload = {
  name: string;
  logo: Blob | File | Object;
  sport: string;
  address: {
    city: string;
    state: string;
    country: string;
    location: {
      coordinates: number[];
    };
  };
  establishedOn: Date;
  gender: string;
  description: string;
};

//create team
export const createTeam = createAsyncThunk<
  Team,
  TeamPayload,
  { rejectValue: string }
>("team/createTeam", async (teamData: TeamPayload, { rejectWithValue }) => {
  try {
    const token = await getToken("accessToken");
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/team`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(teamData), // as the payload type will be FormData, remove JSON.sttringify here
      }
    );

    const data = await response.json();
    console.log("redux data", data);

    if (!response.ok) {
      return rejectWithValue(data.message || "Something went wrong!");
    }

    return data; // Return the response data for the fulfilled state
  } catch (error: any) {
    console.error("Complete Signup Error:", error);
    return rejectWithValue(error.message || "Network error!");
  }
});

//edit team

//fetch team details

//invite member/s

const teamSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetTeamState: (state) => {
      state.team = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createTeam.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createTeam.fulfilled, (state, action) => {
      state.loading = false;
      state.team = action.payload;
      state.error = null;
    });
    builder.addCase(createTeam.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetTeamState } = teamSlice.actions;
export default teamSlice.reducer;
