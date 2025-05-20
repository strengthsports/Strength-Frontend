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
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen
          name="add-post"
          options={{
            animation: "slide_from_bottom",
            contentStyle: {
              backgroundColor: "black",
            },
          }}
        />
        <Stack.Screen
          name="searchPage/index"
          options={{
            animation: "none",
            contentStyle: {
              backgroundColor: "black",
            },
          }}
        />
      </Stack>
      <AppBottomSheet />
    </BottomSheetProvider>
  );
}
