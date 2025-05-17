import React, { useEffect } from "react";
import { Stack, useNavigation } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack
      initialRouteName="login"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right", // or 'slide_from_right', 'fade_from_bottom', etc.
        contentStyle: {
          backgroundColor: "black",
        },
      }}
    />
  );
};

export default AuthLayout;
