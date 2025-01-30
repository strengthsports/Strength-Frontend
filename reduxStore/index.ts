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
import profileReducer from "./slices/user/profileSlice";
import { profileApi } from "./api/profile/profileApi";
import { feedPostApi } from "./api/feedPostApi";
import { likeUnlikeApi } from "./api/likeUnlikeApi";
import { sportsApi } from "./api/sportsApi";
import { notificationApi } from "./api/notificationApi";
// import { socialApi } from "./api/socialApi"; // Import the new socialApi
import { likerApi } from "./api/likerApi";

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
  profile: profileReducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [feedPostApi.reducerPath]: feedPostApi.reducer,
  [likeUnlikeApi.reducerPath]: likeUnlikeApi.reducer,
  [likerApi.reducerPath]: likerApi.reducer, // Add socialApi reducer
  [sportsApi.reducerPath]: sportsApi.reducer,
  [notificationApi.reducerPath]: sportsApi.reducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      // Middlewares for APIs
      profileApi.middleware,
      feedPostApi.middleware,
      likeUnlikeApi.middleware,
      likerApi.middleware, // Add socialApi middleware
      sportsApi.middleware,
      notificationApi.middleware
      // Add middleware for sportsApi
    ),
});

// Create persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
