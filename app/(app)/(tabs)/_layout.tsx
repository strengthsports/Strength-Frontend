// AppLayout.tsx
import { View } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxStore";
import CustomBottomNavbar from "@/components/ui/CustomBottomNavbar";
import { ScrollProvider } from "@/context/ScrollContext";
import React, { useEffect, useState } from "react";
import { DrawerProvider } from "~/context/DrawerContext";
import { connectSocket } from "~/utils/socket";

export default function AppLayout() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // Called when an edge swipe is detected
  // const handleEdgeSwipe = () => {
  //   drawerRef.current?.open();
  // };

  // const handleCloseDrawer = () => {
  //   drawerRef.current?.close();
  //   setDrawerOpen(false);
  // };

  useEffect(() => {
    console.log("Socket function mounted");
    const initSocket = async () => {
      const socket = await connectSocket();
      if (!socket) {
        console.log("connection failed");
        return;
      }
      // Listen for incoming notifications
      socket.on("newNotification", (data) => {
        setNotificationCount(
          (prevCount) => prevCount + data.newNotificationCount
        );
        console.log("Notification got !");
      });

      return () => {
        socket.off("newNotification"); // Cleanup on component unmount
      };
    };

    initSocket();
  }, []);

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
              notificationCount={notificationCount}
              setNotificationCount={setNotificationCount}
            />
          </View>
        </View>
      </ScrollProvider>
    </DrawerProvider>
  );
}
