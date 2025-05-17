import React from "react";
import { Stack } from "expo-router";

const HomeLayout = () => {
  return (
    <Stack
      initialRouteName="index"
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

export default HomeLayout;
