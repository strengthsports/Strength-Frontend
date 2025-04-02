// AppLayout.tsx
import { View } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/reduxStore";
import CustomBottomNavbar from "@/components/ui/CustomBottomNavbar";
import { ScrollProvider } from "@/context/ScrollContext";
import React, { useEffect, useState } from "react";
import { DrawerProvider } from "~/context/DrawerContext";
import { connectSocket } from "~/utils/socket";
import {
  incrementCount,
  setHasNewNotification,
} from "~/reduxStore/slices/notification/notificationSlice";

export default function AppLayout() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

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
        console.log("Notification Data : ", data);
        dispatch(setHasNewNotification(true));
        dispatch(incrementCount(1));
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
            <CustomBottomNavbar />
          </View>
        </View>
      </ScrollProvider>
    </DrawerProvider>
  );
}
