import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../reduxStore"; 
import { getToken } from "~/utils/secureStore";

interface Message {
  _id: string;
  text: string;
  userId: string;
  userName: string;
  userProfilePic?: string;
  teamId: string;
  teamName: string;
  timestamp: string;
}

interface ForumState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: ForumState = {
  messages: [],
  loading: false,
  error: null,
};

// Fetch messages for a team
export const fetchTeamMessages = createAsyncThunk(
  "forum/fetchTeamMessages",
  async (teamId: string, { rejectWithValue }) => {
    try {
      const token = await getToken("accessToken");
      const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/teamforum/${teamId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch messages");
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Send a new message
export const sendMessage = createAsyncThunk(
  "forum/sendMessage",
  async (
    { text, teamId, teamName }: { text: string; teamId: string; teamName: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = await getToken("accessToken");
      const user = state.profile.user;

      if (!user) {
        return rejectWithValue("User not found");
      }

      const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/teamforum/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          userId: user._id,
          userName: `${user.firstName} ${user.lastName}`,
          userProfilePic: user.profilePic,
          teamId,
          teamName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to send message");
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

const forumSlice = createSlice({
  name: "teamForum",
  initialState,
  reducers: {
    // Optional: Add a reducer to clear messages when needed
    clearMessages: (state) => {
      state.messages = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchTeamMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMessages } = forumSlice.actions;
export default forumSlice.reducer;