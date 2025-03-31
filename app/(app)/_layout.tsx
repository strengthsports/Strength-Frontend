import { Text } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxStore";
import { BottomSheetProvider } from "~/context/BottomSheetContext";
import AppBottomSheet from "~/components/ui/AppBottomSheet";

export default function AppLayout() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <BottomSheetProvider>
      <Stack
        screenOptions={{
          headerShown: false, // Disable headers globally
          animation: "none",
        }}
      />
      <AppBottomSheet />
    </BottomSheetProvider>
  );
}
