// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/user/authSlice";
import signupReducer from "./slices/user/signupSlice";
import onboardingReducer from "./slices/user/onboardingSlice";
import forgotPasswordReducer from "./slices/user/forgotPasswordSlice";
import profileReducer from "./slices/user/profileSlice";
import { profileApi } from "./api/profileApi";
import { feedPostApi } from "./api/feedPostApi";

const store = configureStore({
  reducer: {
    auth: authReducer,
    signup: signupReducer,
    onboarding: onboardingReducer,
    forgotPassword: forgotPasswordReducer,
    profile: profileReducer,

    // Add both API reducers
    [profileApi.reducerPath]: profileApi.reducer,
    [feedPostApi.reducerPath]: feedPostApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(
        profileApi.middleware,
        feedPostApi.middleware // Add feed API middleware
      ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
