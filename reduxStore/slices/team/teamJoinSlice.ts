// teamJoinSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Team, TeamMember } from "~/types/team";
import { getToken } from "~/utils/secureStore";

interface JoinTeamState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: JoinTeamState = {
  loading: false,
  error: null,
  success: false
};
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export const sendTeamJoinRequest = createAsyncThunk(
  'teamJoin/sendRequest',
  async ({ UserId, teamId }: { UserId: string; teamId: string }, { rejectWithValue }) => {
    try {
      console.log("Slice me yeh data pass hua hai ---->",UserId,teamId);
      const token = await getToken('accessToken');
      const response = await fetch(`${BASE_URL}/api/v1/send-teamJoinRequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: UserId, teamId })
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to send join request');
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const teamJoinSlice = createSlice({
  name: 'teamJoin',
  initialState,
  reducers: {
    resetJoinStatus: (state) => {
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendTeamJoinRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(sendTeamJoinRequest.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(sendTeamJoinRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Request failed';
        state.success = false;
      });
  }
});

export const { resetJoinStatus } = teamJoinSlice.actions;
export default teamJoinSlice.reducer;