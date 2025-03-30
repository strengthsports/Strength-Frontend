// AppLayout.tsx
import { View } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxStore";
import CustomBottomNavbar from "@/components/ui/CustomBottomNavbar";
import { ScrollProvider } from "@/context/ScrollContext";
import React, { useState } from "react";
import { DrawerProvider } from "~/context/DrawerContext";

export default function AppLayout() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  // Called when an edge swipe is detected
  // const handleEdgeSwipe = () => {
  //   drawerRef.current?.open();
  // };

  // const handleCloseDrawer = () => {
  //   drawerRef.current?.close();
  //   setDrawerOpen(false);
  // };

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <DrawerProvider>
      <ScrollProvider>
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false, animation: "none" }} />
          <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
            <CustomBottomNavbar
              hasNewNotification={hasNewNotification}
              setHasNewNotification={setHasNewNotification}
            />
          </View>
        </View>
      </ScrollProvider>
    </DrawerProvider>
  );
}
