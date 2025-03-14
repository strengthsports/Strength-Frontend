import { Stack } from "expo-router";

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "modal", // Enables modal animation
        animation: "slide_from_bottom", // Slide-up animation
      }}
    />
  );
}
