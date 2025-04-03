import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Notification } from "~/types/others";
import { getToken } from "~/utils/secureStore";

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

// Fetch Notifications
export const fetchNotifications = createAsyncThunk<
  any,
  any,
  { rejectValue: string }
>("notification/fetchNotifications", async (_, { rejectWithValue }) => {
  try {
    const token = await getToken("accessToken");
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/notification`,
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

    console.log("Notification : ", data);

    return data.data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Network error!");
  }
});

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
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.hasNewNotification = false;
        state.error = null;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { incrementCount, resetCount, setHasNewNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
