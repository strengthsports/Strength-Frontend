import { Redirect, Stack } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/reduxStore";
import { BottomSheetProvider } from "~/context/BottomSheetContext";
import AppBottomSheet from "~/components/ui/AppBottomSheet";
import { useEffect } from "react";
import { tokenMonitor } from "~/services/tokenMonitor";

export default function AppLayout() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  useEffect(() => {
    tokenMonitor.start(dispatch);
    return () => tokenMonitor.stop();
  }, [dispatch]);

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
