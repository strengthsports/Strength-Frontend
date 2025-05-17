// searchSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TeamSearchResult {
  _id: string;
  name: string;
  logo?: { url: string };
  sportname: string;
  membersLength: number;
  // Add other team fields you need
}

interface SearchState {
  // ... existing state
  teamSearchResults: TeamSearchResult[];
  teamSearchHistory: any[];
}

const initialState: SearchState = {
  // ... existing initial state
  teamSearchResults: [],
  teamSearchHistory: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    // ... existing reducers
    setTeamSearchResults: (state, action: PayloadAction<TeamSearchResult[]>) => {
      state.teamSearchResults = action.payload;
    },
    addTeamSearchHistory: (state, action: PayloadAction<any>) => {
      state.teamSearchHistory.unshift(action.payload);
    },
    resetTeamSearchHistory: (state) => {
      state.teamSearchHistory = [];
    },
  },
});

export const { 
  setTeamSearchResults, 
  addTeamSearchHistory, 
  resetTeamSearchHistory 
} = searchSlice.actions;
export default searchSlice.reducer;