// teamSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Team, TeamMember } from "~/types/team";
import { getToken } from "~/utils/secureStore";

interface Supporter {
  user: string;
  name: string;
  username: string;
  profilePic?: string;
  headline?: string;
  supportedAt: Date;
}

// --- Types ---
interface MemberSuggestionsState {
  members: TeamMember[];
  totalPlayers: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

export type TeamsList = {
  team: {
    logo: {
      url: string;
      public_id: string;
    };
    name: string;
    _id: string;
    membersLength: number;
    sportname: string;
  };
  [key: string]: any;
};

interface TeamState {
  currentTeam: null;
  members:[];
  currentTeamDescription: string;
  team: Team | null;
  invited: TeamMember[] | null;
  error: string | null;
  loading: boolean;
  user: any | null;
  memberSuggestionsState: MemberSuggestionsState;
  positionUpdateLoading?: boolean;
  positionUpdateError?: string | null;
  teams: TeamsList[];
  supporters: Supporter[];
  supporterCount: number;
  isSupporting: boolean;
  allTeams: TeamBasicInfo[];
  allTeamsLoading: boolean;
  allTeamsError: string | null;
  allTeamsPagination: PaginationInfo;
  currentFilters: TeamFilterParams;
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

export type AcceptPayload = {
  teamId: string;
  notificationId: string;
  senderId: string;
  userId: string;
};

export type RejectPayload = {
  notificationId: string;
  userId: string;
};

export type TeamBasicInfo = {
  _id: string;
  name: string;
  logo: {
    url: string;
    public_id: string;
  };
  sport: {
    _id: string;
    name: string;
    logo: string;
  };
  address: {
    city: string;
  };
  gender: string;
  admin: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    profilePic: string;
  }>;
  establishedOn: string;
  membersLength: number;
  sportname?: string;
};

// Pagination Info Type
export type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalTeams: number;
  teamsPerPage: number;
};

// Response Data Type
export type AllTeamsResponse = {
  teams: TeamBasicInfo[];
  pagination: PaginationInfo;
};

// Filter Parameters Type
export type TeamFilterParams = {
  page?: number;
  limit?: number;
  sportId?: string;
  gender?: string;
  searchQuery?: string;
};


export type AcceptJoinRequestResponse = {
  success: boolean;
  message: string;
  data: {
    teamId: string;
    newMemberId: string;
  };
};

export type AcceptJoinRequestPayload = {
  senderId: string;
  teamId: string;
  notificationId: string;
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
    
    // Append all required fields
    formData.append("name", teamData.name);
    formData.append("sport", teamData.sport);
    formData.append("gender", teamData.gender);
    formData.append("description", teamData.description || "");
    
    // Handle establishedOn date - ensure it's in ISO format
    if (teamData.establishedOn) {
      formData.append("establishedOn", new Date(teamData.establishedOn).toISOString());
    }
    
    // Handle location/address
    if (teamData.address) {
      formData.append("location", JSON.stringify({
        city: teamData.address.city,
        state: teamData.address.state,
        country: teamData.address.country,
        location: teamData.address.location
      }));
    }
    
    // Append logo file if exists
    if (teamData.logo) {
      formData.append("assets", {
        uri: teamData.logo.uri,
        name: teamData.logo.name || "logo.jpg",
        type: teamData.logo.type || "image/jpeg",
      });
    }

    
    console.log("Sending Data to backend--->",JSON.stringify(teamData, null, 2));

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
    console.log("data recieved -->",data);

    if (!response.ok) {
      return rejectWithValue(data.message || "Something went wrong!");
    }

    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Network error!");
  }
});







export const fetchTeamDetails = createAsyncThunk<
  Team,
  string,
  { rejectValue: string }
>("team/fetchTeamDetails", async (teamId, { rejectWithValue }) => {
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
});






export const fetchTeams = createAsyncThunk<any, void, { rejectValue: string }>(
  "team/fetchTeams",
  async (_, { rejectWithValue }) => {
    try {
      const token = await getToken("accessToken");
      // console.log("Called")
      const response = await fetch(`${BASE_URL}/api/v1/team`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      console.log("Teams data : ", data);
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);




export const deleteTeam = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("team/deleteTeam", async (teamId, { rejectWithValue }) => {
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
});






export const updateTeam = createAsyncThunk<
  Team,
  { teamId: string; formData: FormData },
  { rejectValue: string }
>("team/updateTeam", async ({ teamId, formData }, { rejectWithValue }) => {
  try {
    const token = await getToken("accessToken");

    const response = await fetch(`${BASE_URL}/api/v1/team/${teamId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) return rejectWithValue(data.message);
    return data.data;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});







export const fetchMemberSuggestions = createAsyncThunk<
  MemberSuggestionsState,
  { teamId: string; userId: string; page?: number; limit?: number },
  { rejectValue: string }
>(
  "team/fetchMemberSuggestions",
  async ({ teamId, userId, page, limit }, { rejectWithValue }) => {
    try {
      const token = await getToken("accessToken");
      const response = await fetch(
        `${BASE_URL}/api/v1/team/player-suggestions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ teamId, userId, page, limit }),
        }
      );

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
>("team/sendInvitations", async (payload, { rejectWithValue }) => {
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
});










// --- Initial State ---
const initialState: TeamState = {
  currentTeam: null,
  team: null,
  teams: [],
  currentTeamDescription: "",
  invited: null,
  error: null,
  loading: false,
  user: null,
  supporterCount: 0,
  isSupporting: false,
  supporters: [],
   allTeams: [],
  allTeamsLoading: false,
  allTeamsError: null,
  allTeamsPagination: {
    currentPage: 1,
    totalPages: 1,
    totalTeams: 0,
    teamsPerPage: 10,
  },
  currentFilters: {
    page: 1,
    limit: 10,
  },
  memberSuggestionsState: {
    members: [],
    totalPlayers: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
  },
};






//change user position
export const changeUserPosition = createAsyncThunk<
  TeamMember,
  { teamId: string; userId: string; newPosition: string }, // Changed parameter name to match usage
  { rejectValue: string }
>(
  "team/changeUserPosition",
  async ({ teamId, userId, newPosition }, { rejectWithValue }) => {
    try {
      const token = await getToken("accessToken");

      const response = await fetch(`${BASE_URL}/api/v1/team/change-position`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamId, userId, newPosition }),
      });

      const data = await response.json();

      if (!response.ok)
        return rejectWithValue(data.message || "Failed to change position");

      return data.data; // Expected to return updated member
    } catch (err: any) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);






export const changeUserRole = createAsyncThunk<
  TeamMember,
  { teamId: string; userId: string; newRole: string },
  { rejectValue: string }
>(
  "team/changeUserRole",
  async ({ teamId, userId, newRole }, { rejectWithValue }) => {
    try {
      const token = await getToken("accessToken");

      const response = await fetch(`${BASE_URL}/api/v1/team/change-role`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamId, userId, newRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to change role");
      }

      return data.data; // Expected to return updated member
    } catch (err: any) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);

// export const removeTeamMember = createAsyncThunk<
//   { success: boolean; message: string },
//   { teamId: string; userId: string },
//   { rejectValue: string }
// >("team/removeTeamMember", async ({ teamId, userId }, { rejectWithValue }) => {
//   try {
//     const token = await getToken("accessToken");

//     const response = await fetch(`${BASE_URL}/api/v1/team/remove-member`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ teamId, userId }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return rejectWithValue(data.message || "Failed to remove team member");
//     }

//     return data;
//   } catch (err: any) {
//     return rejectWithValue(err.message || "Network error");
//   }
// });

//join team request by user who not present in the team





export const joinTeam = createAsyncThunk<
  { team: Team; message: string }, // Return type
  { teamId: string; userId: string }, // Only requires teamId and userId
  { rejectValue: string }
>("team/joinTeam", async ({ teamId, userId }, { rejectWithValue }) => {
  try {
    const token = await getToken("accessToken");

    const response = await fetch(`${BASE_URL}/api/v1/send-teamJoinRequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ teamId, userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Failed to join team");
    }

    return {
      team: data.data.team,
      message: data.message || "Successfully joined team",
    };
  } catch (err: any) {
    return rejectWithValue(err.message || "Network error");
  }
});





//accept team invitation
export const acceptTeamInvitation = createAsyncThunk(
  "teams/acceptInvitation",
  async (
    { teamId, notificationId, senderId, userId }: AcceptPayload,
    { rejectWithValue }
  ) => {
    try {
      const token = await getToken("accessToken");
      if (!token) throw new Error("Authentication token missing");

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/accept-teamInvitation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            teamId,
            notificationId,
            senderId,
            userId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to accept invitation");
      }

      console.log(response);
      const data = await response.json();
      console.log(data);

      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);






//reject team invitation
export const rejectTeamInvitation = createAsyncThunk(
  "teams/rejectInvitation",
  async ({ notificationId, userId }: RejectPayload, { rejectWithValue }) => {
    try {
      if (!notificationId) {
        throw new Error("Missing notification ID");
      }

      const token = await getToken("accessToken");
      if (!token) {
        throw new Error("Authentication token missing");
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/team/reject-invitation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            notificationId,
            userId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reject invitation");
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


//remove user from team-----> 
// In teamSlice.ts, ensure the removeTeamMember thunk is properly implemented:





export const removeTeamMember = createAsyncThunk<
  { success: boolean; message: string },
  { teamId: string; userId: string },
  { rejectValue: string }
>("team/removeTeamMember", async ({ teamId, userId }, { rejectWithValue }) => {
  try {
    const token = await getToken("accessToken");

    const response = await fetch(`${BASE_URL}/api/v1/team/remove-member`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ teamId, userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Failed to remove team member");
    }

    return data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Network error");
  }
});







// Add this to your teamSlice.ts file with the other async thunks
export const transferAdmin = createAsyncThunk<
  { team: Team; message: string },
  { teamId: string; userId: string },
  { rejectValue: string }
>("team/transferAdmin", async ({ teamId, userId }, { rejectWithValue }) => {
  try {
    const token = await getToken("accessToken");

    const response = await fetch(`${BASE_URL}/api/v1/team/transfer-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ teamId, userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Failed to transfer admin rights");
    }

    return {
      team: data.data.team,
      message: data.message || "Admin rights transferred successfully",
    };
  } catch (err: any) {
    return rejectWithValue(err.message || "Network error");
  }
});






export const fetchAllTeams = createAsyncThunk<
  AllTeamsResponse,
  TeamFilterParams,
  { rejectValue: string }
>('team/fetchAllTeams', async (filters, { rejectWithValue }) => {
  try {
    const token = await getToken('accessToken');
    
    // Construct query string from filters
    const queryParams = new URLSearchParams();
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.sportId) queryParams.append('sportId', filters.sportId);
    if (filters.gender) queryParams.append('gender', filters.gender);
    if (filters.searchQuery) queryParams.append('search', filters.searchQuery);

    const response = await fetch(
      `${BASE_URL}/api/v1/team/all-teams?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      return rejectWithValue(data.message || 'Failed to fetch teams');
    }

    return {
      teams: data.data.teams,
      pagination: data.data.pagination,
    };
  } catch (err: any) {
    return rejectWithValue(err.message || 'Network error');
  }
});


// Add to your teamSlice.ts
// Update the acceptJoinRequest thunk to match your Postman response
export const acceptJoinRequest = createAsyncThunk<
  { 
    success: boolean;
    message: string;
    data: {
      teamId: string;
      newMemberId: string;
    }
  },
  { senderId: string; teamId: string; notificationId: string },
  { rejectValue: string }
>(
  'team/acceptJoinRequest',
  async ({ senderId, teamId, notificationId }, { rejectWithValue }) => {
    try {
      const token = await getToken('accessToken');
      
      const response = await fetch(
        `${BASE_URL}/api/v1/team/accept-request`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ senderId, teamId, notificationId }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || 'Failed to accept join request');
      }

      // Return the entire response structure
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);








export const rejectJoinRequest = createAsyncThunk<
  { success: boolean; message: string },
  { notificationId: string; userId: string },
  { rejectValue: string }
>(
  'team/rejectJoinRequest',
  async ({ notificationId, userId }, { rejectWithValue }) => {
    try {
      const token = await getToken('accessToken');
      
      const response = await fetch(
        `${BASE_URL}/api/v1/team/reject-join-request`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ notificationId, userId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to reject join request');
      }

      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);







const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    resetTeamState(state) {
      state.team = null;
      state.currentTeam = null;
      state.user = null;
      state.supporterCount = 0;
      state.isSupporting = false;
    },
    setTeamDescription: (state, action: PayloadAction<string>) => {
      state.currentTeamDescription = action.payload;
    },
    toggleSupporterCount: (state, action) => {
      state.supporterCount += action.payload;
    },
    toggleIsSupporting: (state, action) => {
      state.isSupporting = action.payload;
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
        state.supporterCount = action.payload.supporterCount;
        state.isSupporting = action.payload.isSupporting;
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
        state.memberSuggestionsState.error =
          action.payload ?? "Error fetching suggestions";
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

      // --- changeUserPosition ---
      .addCase(changeUserPosition.pending, (state) => {
        state.positionUpdateLoading = true;
        state.positionUpdateError = null;
      })

      .addCase(changeUserPosition.fulfilled, (state, action) => {
        state.positionUpdateLoading = false;
        const updatedMember = action.payload;

        if (state.team && state.team.members && updatedMember) {
          // Make sure we have a valid ID before attempting to update
          if (updatedMember._id) {
            state.team.members = state.team.members.map((member: any) => {
              // Additional null checks
              if (member && member._id === updatedMember._id) {
                return updatedMember;
              }
              return member;
            });
          } else {
            // If the updated member has no ID, simply refresh the team details
            // This is a fallback in case the API returns unexpected data
            console.warn("Updated member is missing an ID field");
          }
        }
      })

      .addCase(changeUserPosition.rejected, (state, action) => {
        state.positionUpdateLoading = false;
        state.positionUpdateError =
          action.payload || "Could not update position";
      })

      // 👇 Update Team Slice Handlers
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error updating team details";
      })

      .addCase(changeUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        changeUserRole.fulfilled,
        (state, action: PayloadAction<TeamMember>) => {
          state.loading = false;
          if (state.currentTeam) {
            const memberIndex = state.currentTeam?.members.findIndex(
              (m) => m.user._id === action.payload?.user._id
            );
            if (memberIndex !== -1) {
              state.currentTeam.members[memberIndex].role = action.payload.role;
            }
          }
        }
      )
      .addCase(changeUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to change user role";
      })

 .addCase(removeTeamMember.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(removeTeamMember.fulfilled, (state, action) => {
  state.loading = false;
  
  if (state.team) {
    // Safely remove member from all possible arrays
    const userId = action.payload.userId;

    // Handle members array
    if (state.team.members) {
      state.team.members = state.team.members.filter(
        (member: any) => member.user?._id !== userId
      );
    }

    // Handle admin array (assuming it's an array of user objects)
    if (state.team.admin) {
      state.team.admin = state.team.admin.filter(
        (admin: any) => admin._id !== userId
      );
    }
 


    // Update members length if exists
    if (state.team.membersLength) {
      state.team.membersLength--;
    }
  }
})
.addCase(removeTeamMember.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload || "Failed to remove team member";
})


      .addCase(joinTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinTeam.fulfilled, (state, action) => {
        state.loading = false;
        // Update the team in state with the new member
        if (action.payload.team) {
          state.team = action.payload.team;
        }
      })
      .addCase(joinTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to join team";
      })

      //Transfer Admin
      // Add this to your extraReducers in teamSlice
.addCase(transferAdmin.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(transferAdmin.fulfilled, (state, action) => {
  state.loading = false;
  if (action.payload.team) {
    state.team = action.payload.team;
  }
})
.addCase(transferAdmin.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload || "Failed to transfer admin rights";
})

      // Accept Invitation
      .addCase(acceptTeamInvitation.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Accept Response : ", action.payload);
        state.teams.push(action.payload); // Add the new team to state
      })
      .addCase(acceptTeamInvitation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Reject Invitation
      .addCase(rejectTeamInvitation.fulfilled, (state) => {
        state.loading = false;
        // No team to add for rejection, just update loading state
      })
      .addCase(rejectTeamInvitation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // fetchAllTeams cases
    .addCase(fetchAllTeams.pending, (state, action) => {
      state.allTeamsLoading = true;
      state.allTeamsError = null;
      // Update current filters with the new ones
      state.currentFilters = {
        ...state.currentFilters,
        ...action.meta.arg,
      };
    })
    .addCase(fetchAllTeams.fulfilled, (state, action) => {
      state.allTeamsLoading = false;
      state.allTeams = action.payload.teams;
      state.allTeamsPagination = action.payload.pagination;
    })
    .addCase(fetchAllTeams.rejected, (state, action) => {
      state.allTeamsLoading = false;
      state.allTeamsError = action.payload || 'Failed to fetch teams';
    });
      builder
  .addCase(acceptJoinRequest.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
 .addCase(acceptJoinRequest.fulfilled, (state, action) => {
  state.loading = false;
  const { teamId, newMemberId } = action.payload.data; // Now properly accessing nested data
  
  // Update the team in state
  if (state.team && state.team._id === teamId) {
    // Check if member already exists
    const isAlreadyMember = state.team.members.some(
      member => member.user.toString() === newMemberId
    );
    
    if (!isAlreadyMember) {
      state.team.members.push({
        user: newMemberId,
        role: '',
        position: '',
        joinedAt: new Date().toISOString()
      });
      state.team.membersLength++;
    }
  }
})
  .addCase(acceptJoinRequest.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload || 'Failed to accept join request';
  })
      
      ;
  },
});

export const {
  resetTeamState,
  setTeamDescription,
  toggleIsSupporting,
  toggleSupporterCount,
} = teamSlice.actions;
export const selectSupporters = (state: { team: TeamState }) =>
  state.team.supporters;
export const selectAllTeams = (state: { team: TeamState }) => state.team.allTeams;
export const selectAllTeamsLoading = (state: { team: TeamState }) => state.team.allTeamsLoading;
export const selectAllTeamsError = (state: { team: TeamState }) => state.team.allTeamsError;
export const selectTeamsPagination = (state: { team: TeamState }) => state.team.allTeamsPagination;
export const selectCurrentFilters = (state: { team: TeamState }) => state.team.currentFilters;
export default teamSlice.reducer;
