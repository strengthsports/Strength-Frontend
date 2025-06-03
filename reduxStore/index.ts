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
import postReducer from "./slices/post/postSlice";
import postsReducer from "./slices/post/postsSlice";
import viewsReducer from "./slices/post/viewsSlice";
import userSuggestionsReducer from "./slices/team/userSuggestionSlice";
import { profileApi } from "./api/profile/profileApi";
import { sportsApi } from "./api/sportsApi";
import { notificationApi } from "./api/notificationApi";
import { communityApi } from "./api/community/communityApi";
import { searchApi } from "./api/explore/searchApi";
import { hashtagApi } from "./api/explore/hashtagApi";
import notificationReducer from "./slices/notification/notificationSlice";
import { cricketApi } from "./api/explore/cricketApi";
import { footballApi } from "./api/explore/footballApi";
import { basketballApi } from "./api/explore/basketballApi";
import { articleApi } from "./api/explore/article/articleApi";
import userCommentsReducer from "./slices/comments/userCommentsSlice";
import { feedbackApi } from "./api/feedback/feedbackApi";

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
  post: postReducer,
  posts: postsReducer,
  views: viewsReducer,
  notification: notificationReducer,
  userComments: userCommentsReducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [sportsApi.reducerPath]: sportsApi.reducer,
  [notificationApi.reducerPath]: notificationApi.reducer,
  [communityApi.reducerPath]: communityApi.reducer,
  [cricketApi.reducerPath]: cricketApi.reducer,
  [footballApi.reducerPath]: footballApi.reducer,
  [basketballApi.reducerPath]: basketballApi.reducer,
  [searchApi.reducerPath]: searchApi.reducer,
  [articleApi.reducerPath]: articleApi.reducer,
  [hashtagApi.reducerPath]: hashtagApi.reducer,
  [feedbackApi.reducerPath]: feedbackApi.reducer,
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
      searchApi.middleware,
      articleApi.middleware,
      hashtagApi.middleware,
      feedbackApi.middleware
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
