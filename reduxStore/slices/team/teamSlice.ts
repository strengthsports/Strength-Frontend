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
function convertToDate(dateString) {
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

  return dateObject; // MongoDB will store this as ISODate
}



export const createTeam = createAsyncThunk<
  Team,
  TeamPayload,
  { rejectValue: string }
>("team/createTeam", async (teamData: TeamPayload, { rejectWithValue }) => {
  try {
    const token = await getToken("accessToken");
    console.log("Team Data:", teamData);
    
    const formData = new FormData();
    const datee = convertToDate(teamData.establishedOn);
    console.log("datee", datee);
    formData.append("name", teamData.name);
    formData.append("sport", "6771941c77a19c8141f2f1b7");
    
    formData.append("establishedOn", datee);
    formData.append("gender", teamData.gender);
    formData.append("description", teamData.description);
    // formData.append("location",null);
    formData.append("assets", teamData.logo);
    
  
    

    console.log("Sending FormData:", formData);
    
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/team`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // FormData does not need JSON.stringify()
      }
    );

    const data = await response.json();
    console.log("redux data", data);

    if (!response.ok) {
      return rejectWithValue(data.message || "Something went wrong!");
    }

    return data; // Return the response data for the fulfilled state
  } catch (error: any) {
    console.error("error:", error);
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
