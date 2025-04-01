import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Team, TeamMember } from "~/types/team";
import { getToken } from "~/utils/secureStore";

interface TeamState {
  team: Team | null;
  invited: TeamMember | null;
  error: any | null;
  loading: boolean;
  user: any | null; // Add user field to store user data
}

// Initial state
const initialState: TeamState = {
  team: null,
  invited: null,
  error: null,
  loading: false,
  user: null, // Initialize user to null
};

export type TeamPayload = {
  name: string;
  logo: Blob | File | Object | string;
  sport: {
    _id: string;
    name: string;
    logo:string;
  };
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
  role:string;
  position: string;
  [key:string]: any;
};

function convertToDate(dateString: any) {
  // Validate input format (M/YYYY or MM/YYYY)
  if (!dateString || !/^\d{1,2}\/\d{4}$/.test(dateString)) {
    throw new Error("Invalid date format. Use 'M/YYYY' or 'MM/YYYY'.");
  }

  // Extract month and year
  const [month, year] = dateString.split("/").map(Number);

  // Convert to a Date object (first day of the month)
  const dateObject = new Date(Date.UTC(year, month - 1, 1));

  // Validate the date
  if (isNaN(dateObject.getTime())) {
    throw new Error("Invalid date conversion.");
  }

  return dateObject.toISOString().split("T")[0]; // MongoDB will store this as ISODate
}

// Create a new team
export const createTeam = createAsyncThunk<
  Team,
  TeamPayload,
  { rejectValue: string }
>("team/createTeam", async (teamData: TeamPayload, { rejectWithValue }) => {
  try {
    const token = await getToken("accessToken");

    const formData = new FormData();
    const datee = convertToDate(teamData.establishedOn);
    formData.append("name", teamData.name);
    formData.append("sport", teamData.sport);
    formData.append("establishedOn", datee);
    formData.append("gender", teamData.gender);
    formData.append("description", teamData.description);
    formData.append("address", JSON.stringify(teamData.address)); // Address needs to be a string
    formData.append("assets", teamData.logo);

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/team`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Something went wrong!");
    }

    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Network error!");
  }
});

// Fetch team details
export const fetchTeamDetails = createAsyncThunk<
  Team,
  string,
  { rejectValue: string }
>("team/fetchTeamDetails", async (teamId: string, { rejectWithValue }) => {
  try {
    const token = await getToken("accessToken");
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/team/${teamId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(data.message || "Something went wrong!");
    }

    return data.data; // Return team data
  } catch (error: any) {
    return rejectWithValue(error.message || "Network error!");
  }
});

// Fetch all teams
export const getTeams = createAsyncThunk<Team[], void, { rejectValue: string }>(
  "team/fetchTeams",
  async (_, { rejectWithValue }) => {
    try {
      const token = await getToken("accessToken");

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/team`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch teams");
      }

      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error!");
    }
  }
);

// Delete team
export const deleteTeam = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("team/deleteTeam", async (teamId: string, { rejectWithValue }) => {
  try {
    const token = await getToken("accessToken");
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/team/${teamId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Failed to delete team");
    }

    return data.message || "Team deleted successfully"; // Success message
  } catch (error: any) {
    return rejectWithValue(error.message || "Network error!");
  }
});





// Update the fetchUserSuggestion action
export const fetchUserSuggestion = createAsyncThunk<
  any,
  { 
    teamId: string;
    userId: string;
    page?: number;
    limit?: number;
  },
  { rejectValue: string }
>("team/fetchUserSuggestion", async (params, { rejectWithValue }) => {
  try {
    const token = await getToken("accessToken");

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/team/player-suggestions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamId: params.teamId,
          userId: params.userId,
          page: params.page ?? 1,   
          limit: params.limit ?? 10,
        
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Failed to fetch user suggestions");
    }

    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Network error!");
  }
});










const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    resetTeamState: (state) => {
      state.team = null;
      state.error = null;
      state.loading = false;
      state.user = null;  // Clear user data on reset
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.team = action.payload;
        state.error = null;
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //fetch team data
      .addCase(fetchTeamDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.team = action.payload;
        state.error = null;
      })
      .addCase(fetchTeamDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Handle delete team
      .addCase(deleteTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTeam.fulfilled, (state) => {
        state.loading = false;
        state.team = null; // Clear the team state after successful deletion
        state.error = null;
      })
      .addCase(deleteTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Handle fetchUser
      // Handle fetchUserSuggestion
      .addCase(fetchUserSuggestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSuggestion.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Or use a separate state field for suggestions
        state.error = null;
      })
      .addCase(fetchUserSuggestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetTeamState } = teamSlice.actions;

export default teamSlice.reducer;
