// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import signupReducer from "./slices/signupSlice";
import profileReducer from "./slices/profileSlice";
import forgotPasswordReducer from "./slices/forgotPasswordSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    signup: signupReducer,
    // logout: logoutReducer. 
    // more reducers 
    profile:profileReducer,
    forgotPassword: forgotPasswordReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
