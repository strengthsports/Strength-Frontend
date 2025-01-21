// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/user/authSlice";
import signupReducer from "./slices/user/signupSlice";
import onboardingReducer from "./slices/user/onboardingSlice";
import forgotPasswordReducer from "./slices/user/forgotPasswordSlice";
import profileReducer from "./slices/user/profileSlice";
import { profileApi } from "./api/profileApi";

const store = configureStore({
  reducer: {
    auth: authReducer,
    signup: signupReducer,
    onboarding: onboardingReducer,
    forgotPassword: forgotPasswordReducer,
    profile: profileReducer,

    // Add the RTK Query reducer
    [profileApi.reducerPath]: profileApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(profileApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
