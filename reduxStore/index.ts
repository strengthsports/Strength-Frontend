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
import signupReducer from "./slices/user/signupSlice";
import onboardingReducer from "./slices/user/onboardingSlice";
import forgotPasswordReducer from "./slices/user/forgotPasswordSlice";
import exploreReducer from "./slices/explore/exploreSlice";
import hashtagReducer from "./slices/hashtagPage/hashtagPageSlice";
import profileReducer from "./slices/user/profileSlice";
import teamReducer from "./slices/team/teamSlice";
import searchReducer from "./slices/explore/searchSlice";
import feedReducer from "./slices/feed/feedSlice";
import postReducer from "./slices/post/postSlice";
// Your feed slice
import { profileApi } from "./api/profile/profileApi";
import { feedApi } from "./api/feed/services/feedApi";
import { sportsApi } from "./api/sportsApi";
import { postsApi } from "./api/posts/postsApi";
import { notificationApi } from "./api/notificationApi";
import { communityApi } from "./api/community/communityApi";
import { cricketApi } from "./api/explore/cricketApi";
import { searchApi } from "./api/explore/searchApi";
import sportsReducer from "./slices/team/sportSlice";
import notificationReducer from "./slices/notification/notificationSlice";
import { footballApi } from "./api/explore/footballApi";
import { articleApi } from "./api/explore/article/articleApi";

// Persist configuration
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: [
    "auth",
    "signup",
    "onboarding",
    "forgotPassword",
    "profile",
    "search",
    "feed",
  ],
  blacklist: [], // Add any API reducers here
};

const rootReducer = combineReducers({
  auth: authReducer,
  signup: signupReducer,
  onboarding: onboardingReducer,
  forgotPassword: forgotPasswordReducer,
  explore: exploreReducer,
  profile: profileReducer,
  hashtagPage: hashtagReducer,
  team: teamReducer,
  sports: sportsReducer,
  search: searchReducer,
  feed: feedReducer,
  post: postReducer,
  notification: notificationReducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [sportsApi.reducerPath]: sportsApi.reducer,
  [notificationApi.reducerPath]: notificationApi.reducer,
  [communityApi.reducerPath]: communityApi.reducer,
  [cricketApi.reducerPath]: cricketApi.reducer,
  [footballApi.reducerPath]: footballApi.reducer,
  [feedApi.reducerPath]: feedApi.reducer,
  [postsApi.reducerPath]: postsApi.reducer,
  [searchApi.reducerPath]: searchApi.reducer,
  [articleApi.reducerPath]: articleApi.reducer,
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
      profileApi.middleware,
      sportsApi.middleware,
      notificationApi.middleware,
      communityApi.middleware,
      cricketApi.middleware,
      footballApi.middleware,
      feedApi.middleware,
      postsApi.middleware,
      searchApi.middleware,
      articleApi.middleware
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
