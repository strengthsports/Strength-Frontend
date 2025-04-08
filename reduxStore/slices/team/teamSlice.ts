// teamSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Team, TeamMember } from "~/types/team";
import { getToken } from "~/utils/secureStore";

// --- Types ---
interface MemberSuggestionsState {
  members: TeamMember[];
  totalPlayers: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

interface TeamState {
  team: Team | null;
  invited: TeamMember[] | null;
  error: string | null;
  loading: boolean;
  user: any | null;
  memberSuggestionsState: MemberSuggestionsState;
}

export type TeamPayload = {
  name: string;
  logo: Blob | File | Object | string;
  sport: {
    _id: string;
    name: string;
    logo: string;
  };
  address: {
    city: string;
    state: string;
    country: string;
    location: { coordinates: number[] };
  };
  establishedOn: Date;
  gender: string;
  description: string;
  role: string;
  position: string;
  [key: string]: any;
};

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

// --- Utils ---
const convertToDate = (dateString: string): string => {
  const [month, year] = dateString.split("/").map(Number);
  const date = new Date(Date.UTC(year, month - 1, 1));
  if (isNaN(date.getTime())) throw new Error("Invalid date format");
  return date.toISOString().split("T")[0];
};


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

export const fetchTeamDetails = createAsyncThunk<Team, string, { rejectValue: string }>(
  "team/fetchTeamDetails",
  async (teamId, { rejectWithValue }) => {
    try {
      const token = await getToken("accessToken");
      const response = await fetch(`${BASE_URL}/api/v1/team/${teamId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getTeams = createAsyncThunk<Team[], void, { rejectValue: string }>(
  "team/fetchTeams",
  async (_, { rejectWithValue }) => {
    try {
      const token = await getToken("accessToken");
      const response = await fetch(`${BASE_URL}/api/v1/team`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteTeam = createAsyncThunk<string, string, { rejectValue: string }>(
  "team/deleteTeam",
  async (teamId, { rejectWithValue }) => {
    try {
      const token = await getToken("accessToken");
      const response = await fetch(`${BASE_URL}/api/v1/team/${teamId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      return data.message;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateTeam = createAsyncThunk<
  Team,
  { teamId: string; teamData: Partial<TeamPayload> },
  { rejectValue: string }
>(
  "team/updateTeam",
  async ({ teamId, teamData }, { rejectWithValue }) => {
    try {
      const token = await getToken("accessToken");
      const formData = new FormData();
      if (teamData.name) formData.append("name", teamData.name);
      if (teamData.sport) formData.append("sport", JSON.stringify(teamData.sport));
      if (teamData.establishedOn) formData.append("establishedOn", convertToDate(teamData.establishedOn));
      if (teamData.gender) formData.append("gender", teamData.gender);
      if (teamData.description) formData.append("description", teamData.description);
      if (teamData.address) formData.append("address", JSON.stringify(teamData.address));
      if (teamData.logo) formData.append("assets", teamData.logo);

      const response = await fetch(`${BASE_URL}/api/v1/team/${teamId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMemberSuggestions = createAsyncThunk<
  MemberSuggestionsState,
  { teamId: string; userId: string; page?: number; limit?: number },
  { rejectValue: string }
>(
  "team/fetchMemberSuggestions",
  async ({ teamId, userId, page, limit }, { rejectWithValue }) => {
    try {
      const token = await getToken("accessToken");
      const response = await fetch(`${BASE_URL}/api/v1/team/player-suggestions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamId, userId, page, limit }),
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      return {
        members: data.data,
        totalPlayers: data.pagination.totalPlayers,
        totalPages: data.pagination.totalPages,
        currentPage: data.pagination.currentPage,
        loading: false,
        error: null,
      };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);


// --- Async Action for Sending Invitations ---
export const sendInvitations = createAsyncThunk<
  TeamMember[], 
  {
    teamId: string;
    receiverIds: [];
    role: string;
  },
  { rejectValue: string }
>(
  "team/sendInvitations",
  async (payload, { rejectWithValue }) => {
    const { teamId, receiverIds, role } = payload;
    console.log(teamId);
    console.log(receiverIds);
    console.log(role);

    // --- Early validation ---
    // if (!teamId || !receiver || !role) {
    //   return rejectWithValue("All fields (Team ID, Receiver IDs, and Role) are required!");
    // }

    try {
      const token = await getToken("accessToken");

      const response = await fetch(`${BASE_URL}/api/v1/team/send-invitation`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamId,
          receiverIds,
          role,
        }),
      });

      const result = await response.json();
      console.log(result);

      if (!response.ok) {
        console.error("Invitation Error:", result.message);
        return rejectWithValue(result.message || "Failed to send invitations.");
      }

      return result.data;
    } catch (error: any) {
      console.error("Invitation Catch Error:", error.message);
      return rejectWithValue(error.message || "Something went wrong.");
    }
  }
);




// --- Initial State ---
const initialState: TeamState = {
  team: null,
  invited: null,
  error: null,
  loading: false,
  user: null,
  memberSuggestionsState: {
    members: [],
    totalPlayers: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
  },
};

// --- Slice ---
const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    resetTeamState(state) {
      state.team = null;
      state.error = null;
      state.loading = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTeam.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.team = action.payload;
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error creating team";
      })
      .addCase(fetchTeamDetails.fulfilled, (state, action) => {
        state.team = action.payload;
      })
      .addCase(fetchMemberSuggestions.pending, (state) => {
        state.memberSuggestionsState.loading = true;
        state.memberSuggestionsState.error = null;
      })
      .addCase(fetchMemberSuggestions.fulfilled, (state, action) => {
        state.memberSuggestionsState = action.payload;
      })
      .addCase(fetchMemberSuggestions.rejected, (state, action) => {
        state.memberSuggestionsState.loading = false;
        state.memberSuggestionsState.error = action.payload ?? "Error fetching suggestions";
      })

      .addCase(sendInvitations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(sendInvitations.fulfilled, (state, action) => {
        state.loading = false;
        state.invited = action.payload;
      })
      .addCase(sendInvitations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error sending invitations";
      })
  },
});

export const { resetTeamState } = teamSlice.actions;
export default teamSlice.reducer;