// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/user/authSlice";
import signupReducer from "./slices/user/signupSlice";
import onboardingReducer from "./slices/user/onboardingSlice";
import forgotPasswordReducer from "./slices/user/forgotPasswordSlice";
import profileReducer from "./slices/user/profileSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    signup: signupReducer,
    onboarding: onboardingReducer,
    forgotPassword: forgotPasswordReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
