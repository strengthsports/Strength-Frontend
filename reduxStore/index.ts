// store.ts
import { enableMapSet } from "immer";
enableMapSet();

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authReducer from "./slices/user/authSlice";
import postReducer from "./slices/post/postSlice";
import profileReducer from "./slices/user/profileSlice";
import feedReducer from "./slices/feed/feedSlice"; // Your feed slice
import { communityApi } from "./api/community/communityApi";
import { likerApi } from "./api/feed/features/feedApi.getLiker";
import { handleCommentApi } from "./api/feed/features/feedApi.comment";
import { feedApi } from "./api/feed/services/feedApi";
import { profileApi } from "./api/profile/profileApi";
import { notificationApi } from "./api/notificationApi";

// Persist configuration
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "feed", "profile", "post"],
  blacklist: [], // Add any API reducers here
};

const rootReducer = combineReducers({
  auth: authReducer,
  feed: feedReducer,
  profile: profileReducer,
  post: postReducer,
  [communityApi.reducerPath]: communityApi.reducer,
  [feedApi.reducerPath]: feedApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [notificationApi.reducerPath]: notificationApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      communityApi.middleware,
      feedApi.middleware,
      profileApi.middleware,
      notificationApi.middleware
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
