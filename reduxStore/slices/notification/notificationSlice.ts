import { createSlice } from "@reduxjs/toolkit";
import { Notification } from "~/types/others";
import { logoutUser } from "../user/authSlice";

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
  extraReducers: (builder) => {
    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.hasNewNotification = false;
      state.notificationCount = 0;
      state.notifications = [];
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const { incrementCount, resetCount, setHasNewNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
