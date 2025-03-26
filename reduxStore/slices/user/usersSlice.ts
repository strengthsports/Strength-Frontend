import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from "@reduxjs/toolkit";

interface User {
  _id: string;
  type: string;
  profilePic: string;
  firstName: string;
  lastName: string;
  headline: string;
  isFollowing: boolean;
}

const usersAdapter = createEntityAdapter<User, string>({
  selectId: (user) => user._id, // Use `_id` as the unique identifier
});

const usersSlice = createSlice({
  name: "users",
  initialState: usersAdapter.getInitialState(),
  reducers: {
    setUsers: usersAdapter.setAll,
    updateFollowStatus: (
      state,
      action: PayloadAction<{ userId: string; isFollowing: boolean }>
    ) => {
      usersAdapter.updateOne(state, {
        id: action.payload.userId,
        changes: { isFollowing: action.payload.isFollowing },
      });
    },
  },
});

// Export actions and selectors
export const { setUsers, updateFollowStatus } = usersSlice.actions;
export const usersSelectors = usersAdapter.getSelectors(
  (state: any) => state.user
); // Adjust `state: any` to your root state type

export default usersSlice.reducer;
