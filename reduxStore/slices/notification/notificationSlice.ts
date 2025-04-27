import { createSlice } from "@reduxjs/toolkit";
import { Notification } from "~/types/others";

type NotificationState = {
  notificationCount: number;
  notifications: Notification[];
  hasNewNotification: boolean;
  loading: boolean;
  error: any | null;
};

// Initial State
const initialState = <NotificationState>{
  notificationCount: 0,
  notifications: [],
  hasNewNotification: false,
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setHasNewNotification: (state, action) => {
      state.hasNewNotification = action.payload;
    },
    incrementCount: (state, action) => {
      state.notificationCount += action.payload;
    },
    resetCount: (state) => {
      state.notificationCount = 0;
    },
  },
});

export const { incrementCount, resetCount, setHasNewNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
