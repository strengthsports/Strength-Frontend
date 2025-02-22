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
import signupReducer from "./slices/user/signupSlice";
import onboardingReducer from "./slices/user/onboardingSlice";
import forgotPasswordReducer from "./slices/user/forgotPasswordSlice";
import exploreReducer from "./slices/explore/exploreSlice";
import profileReducer from "./slices/user/profileSlice";
import { profileApi } from "./api/profile/profileApi";
import { sportsApi } from "./api/sportsApi";
import { notificationApi } from "./api/notificationApi";
import { communityApi } from "./api/community/communityApi";
import { cricketApi } from "./api/explore/cricketApi";

// Single feedApi
import { feedApi } from "./api/feed/services/feedApi";
import { footballApi } from "./api/explore/footballApi";

// Persist configuration
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "signup", "onboarding", "forgotPassword", "profile"],
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  signup: signupReducer,
  onboarding: onboardingReducer,
  forgotPassword: forgotPasswordReducer,
  explore: exploreReducer,
  profile: profileReducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [sportsApi.reducerPath]: sportsApi.reducer,
  [notificationApi.reducerPath]: notificationApi.reducer,
  [communityApi.reducerPath]: communityApi.reducer,
  [cricketApi.reducerPath]: cricketApi.reducer,
  [footballApi.reducerPath]: footballApi.reducer,
  [feedApi.reducerPath]: feedApi.reducer, // Use feedApi as the single reducer for all feed-related features
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: ["auth.user.followings"],
      },
    }).concat(
      profileApi.middleware,
      sportsApi.middleware,
      notificationApi.middleware,
      communityApi.middleware,
      cricketApi.middleware,
      footballApi.middleware,
      feedApi.middleware // Single middleware for all feed features
    ),
});

// Create persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
