import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

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
