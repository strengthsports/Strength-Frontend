// store/index.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authReducer from "./slices/user/authSlice";
import signupReducer from "./slices/user/signupSlice";
import onboardingReducer from "./slices/user/onboardingSlice";
import forgotPasswordReducer from "./slices/user/forgotPasswordSlice";
import profileReducer from "./slices/user/profileSlice";
import { profileApi } from "./api/profileApi";
import { feedPostApi } from "./api/feedPostApi";
import { likeUnlikeApi } from "./api/likeUnlikeApi";

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
      profileApi.middleware,
      feedPostApi.middleware,
      likeUnlikeApi.middleware // Add middleware for likeUnlikeApi

    ),
});

// Create persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;