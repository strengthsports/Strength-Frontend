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
import sportsReducer from "./slices/team/sportSlice";
import teamForumReducer from "./slices/team/teamForumSlice";
import feedReducer from "./slices/feed/feedSlice";
import postReducer from "./slices/post/postSlice";
import userSuggestionsReducer from "./slices/team/userSuggestionSlice";
import { profileApi } from "./api/profile/profileApi";
import { feedApi } from "./api/feed/services/feedApi";
import { sportsApi } from "./api/sportsApi";
import { postsApi } from "./api/posts/postsApi";
import { notificationApi } from "./api/notificationApi";
import { communityApi } from "./api/community/communityApi";
import { searchApi } from "./api/explore/searchApi";
import { hashtagApi } from "./api/explore/hashtagApi";
import notificationReducer from "./slices/notification/notificationSlice";
import { cricketApi } from "./api/explore/cricketApi";
import { footballApi } from "./api/explore/footballApi";
import { basketballApi } from "./api/explore/basketballApi";
// import { badmintonApi } from "./api/explore/badmintonApi";
import { articleApi } from "./api/explore/article/articleApi";
import userCommentsReducer from './slices/comments/userCommentsSlice';

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
    "teamForum",
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
  teamForum: teamForumReducer,
  userSuggestions: userSuggestionsReducer,
  feed: feedReducer,
  post: postReducer,
  notification: notificationReducer,
  userComments: userCommentsReducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [sportsApi.reducerPath]: sportsApi.reducer,
  [notificationApi.reducerPath]: notificationApi.reducer,
  [communityApi.reducerPath]: communityApi.reducer,
  [cricketApi.reducerPath]: cricketApi.reducer,
  [footballApi.reducerPath]: footballApi.reducer,
  [basketballApi.reducerPath]: basketballApi.reducer,
  // [badmintonApi.reducerPath]: badmintonApi.reducer,
  [feedApi.reducerPath]: feedApi.reducer,
  [postsApi.reducerPath]: postsApi.reducer,
  [searchApi.reducerPath]: searchApi.reducer,
  [articleApi.reducerPath]: articleApi.reducer,
  [hashtagApi.reducerPath]: hashtagApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      immutableCheck: false,
    }).concat(
      profileApi.middleware,
      sportsApi.middleware,
      notificationApi.middleware,
      communityApi.middleware,
      cricketApi.middleware,
      footballApi.middleware,
      basketballApi.middleware,
      // badmintonApi.middleware,
      feedApi.middleware,
      postsApi.middleware,
      searchApi.middleware,
      articleApi.middleware,
      hashtagApi.middleware
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
