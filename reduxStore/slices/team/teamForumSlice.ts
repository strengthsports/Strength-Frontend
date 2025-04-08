import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  id: number;
  text: string;
}

interface TeamForumState {
  messages: Message[];
}

const initialState: TeamForumState = {
  messages: [],
};

const teamForumSlice = createSlice({
  name: "teamForum",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { setMessages, addMessage, clearMessages } = teamForumSlice.actions;
export default teamForumSlice.reducer;
