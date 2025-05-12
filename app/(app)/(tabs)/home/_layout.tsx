import React, { useEffect } from "react";
import { Stack, useNavigation } from "expo-router";

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
    >
      <Stack.Screen
        name="add-post"
        options={{
          animation: "slide_from_bottom",
          presentation: "modal",
          contentStyle: {
            backgroundColor: "black",
          },
        }}
      />
    </Stack>
  );
};

export default HomeLayout;
