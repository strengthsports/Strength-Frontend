// // AppLayout.tsx
// import { View } from "react-native";
// import { Redirect, Stack } from "expo-router";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/reduxStore";
// import CustomBottomNavbar from "@/components/ui/CustomBottomNavbar";
// import { ScrollProvider } from "@/context/ScrollContext";
// import React, { useEffect, useState } from "react";
// import { DrawerProvider } from "~/context/DrawerContext";

// export default function AppLayout() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { isLoggedIn } = useSelector((state: RootState) => state.auth);
//   const { data: notificationsData, refetch } = useGetNotificationsQuery();

//   useEffect(() => {
//     console.log("Socket function mounted");
//     const initSocket = async () => {
//       const socket = await connectSocket();
//       if (!socket) {
//         console.log("connection failed");
//         return;
//       }
//       // Listen for incoming notifications
//       socket.on("newNotification", (data) => {
//         console.log("Notification Data : ", data);
//         dispatch(setHasNewNotification(true));
//         dispatch(incrementCount(1));
//         console.log("Notification got !");
//       });

//       return () => {
//         socket.off("newNotification"); // Cleanup on component unmount
//       };
//     };

//     initSocket();
//   }, []);

//   // Update notification count when notifications data changes
//   useEffect(() => {
//     if (notificationsData) {
//       const unreadCount = notificationsData.unreadCount || 0;
//       console.log(unreadCount);
//       dispatch(incrementCount(unreadCount));
//       dispatch(setHasNewNotification(unreadCount > 0));
//     }
//   }, [notificationsData, dispatch]);

//   if (!isLoggedIn) {
//     return <Redirect href="/(auth)/login" />;
//   }

//   return (
//     <DrawerProvider>
//       <ScrollProvider>
//         <View style={{ flex: 1 }}>
//           <Stack screenOptions={{ headerShown: false, animation: "none" }} />
//           <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
//             <CustomBottomNavbar />
//           </View>
//         </View>
//       </ScrollProvider>
//     </DrawerProvider>
//   );
// }

import { router, Tabs, useRouter, useSegments, Link } from "expo-router";
import React, { useEffect } from "react";
import {
  Platform,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import CommunityIcon from "~/components/SvgIcons/navbar/CommunityIcon";
import SearchIcon from "~/components/SvgIcons/navbar/SearchIcon";
import HomeIcon from "~/components/SvgIcons/navbar/HomeIcon";
import NotificationIcon from "~/components/SvgIcons/navbar/NotificationIcon";
import ProfileIcon from "~/components/SvgIcons/navbar/ProfileIcon";
import { DrawerProvider } from "~/context/DrawerContext";
import { connectSocket } from "~/utils/socket";
import {
  incrementCount,
  setHasNewNotification,
} from "~/reduxStore/slices/notification/notificationSlice";
import { useGetUnreadNotificationsQuery } from "~/reduxStore/api/notificationApi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/reduxStore";
import { Redirect } from "expo-router";
import eventBus from "~/utils/eventBus";
import { GestureResponderEvent } from "react-native";
import TextScallingFalse from "~/components/CentralText";
import { useBottomSheet } from "~/context/BottomSheetContext";
import { useNavigation } from "@react-navigation/native";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

const tabs = [
  {
    name: "home",
    title: "Home",
    icon: HomeIcon,
    href: "(app)/(tabs)/home", // ⬅️ Correct route to the drawer-wrapped stack
  },
  {
    name: "explore",
    title: "Explore",
    icon: SearchIcon,
    href: "/(app)/(tabs)/explore/allCategory",
  },
  {
    name: "community",
    title: "Community",
    icon: CommunityIcon,
    href: "/(app)/(tabs)/community",
  },
  {
    name: "notification",
    title: "Notification",
    icon: NotificationIcon,
    href: "/(app)/(tabs)/notification",
  },
  {
    name: "profile",
    title: "Profile",
    icon: ProfileIcon,
    href: "/(app)/(tabs)/profile",
  },
] as const;

export default function TabLayout() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data } = useGetUnreadNotificationsQuery(null);
  const { notificationCount } = useSelector(
    (state: RootState) => state.notification
  );
  const { openBottomSheet } = useBottomSheet(); // get function from context

  console.log("Notification data : ", data);
  const segments = useSegments();
  const isHomeTab = segments[segments.length - 1] === "home";
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  // const { handleOpenDrawer } = useDrawer();
  const handleOpenDrawer = () => {
    navigation.openDrawer();
  };

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

  // Update notification count when notifications data changes
  useEffect(() => {
    if (data?.data.unreadCount) {
      const unreadCount = data?.data.unreadCount || 0;
      console.log("Notification count : ", unreadCount);
      dispatch(incrementCount(unreadCount));
      dispatch(setHasNewNotification(unreadCount > 0));
    }
  }, [data?.data.unreadCount, dispatch]);

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#12956B",
          tabBarInactiveTintColor: "#CECECE",
          headerShown: false,
          tabBarStyle: Platform.select({
            ios: {
              position: "absolute",
              height: 75,
              paddingTop: 20,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              overflow: "hidden",
              backgroundColor: "black",
              borderColor: "black",
              borderWidth: 0.5,
            },
            default: {
              height: 55,
              paddingBottom: 0,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              overflow: "hidden",
              backgroundColor: "black",
              borderWidth: 0.5,
              borderColor: "black",
              paddingTop: 5,
            },
          }),
        }}
      >
        {tabs.map(({ name, title, icon: Icon, href }) => (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              title,
              tabBarButton: ({ onPress, accessibilityState }) => {
                const isSelected = accessibilityState?.selected;
                const isNotificationTab = name === "notification";
                const isHomeTab = name === "home";

                const handlePress = (event: GestureResponderEvent) => {
                  // First call the original onPress
                  onPress?.(event);

                  if (isHomeTab && isSelected) {
                    eventBus.emit("scrollToTop");
                  }
                };

                return (
                  <TouchableOpacity
                    onPress={handlePress}
                    activeOpacity={0.4}
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      height: 40,
                    }}
                  >
                    {/* Wrap icon and text in relative view */}
                    <View style={{ position: "relative" }}>
                      <Icon color={isSelected ? "#12956B" : "#CECECE"} />

                      {/* Notification badge */}
                      {isNotificationTab && notificationCount > 0 && (
                        <View style={styles.notificationDot}>
                          <TextScallingFalse style={styles.notificationText}>
                            {notificationCount > 9 ? "9+" : notificationCount}
                          </TextScallingFalse>
                        </View>
                      )}
                    </View>
                    <TextScallingFalse
                      style={{
                        fontSize: 9,
                        fontWeight: "500",
                        color: isSelected ? "#12956B" : "#CECECE",
                        marginTop: 2,
                      }}
                    >
                      {title}
                    </TextScallingFalse>
                  </TouchableOpacity>
                );
              },
            }}
          />
        ))}
      </Tabs>

      {/* Floating Upload Button: Only on Home */}
      {isHomeTab && (
        <TouchableOpacity style={styles.uploadButton}>
          <Link href="/add-post" asChild>
            <Ionicons name="add" size={28} color="white" />
          </Link>
        </TouchableOpacity>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  notificationDot: {
    position: "absolute",
    top: -6, // Adjust position
    right: -8,
    minWidth: 16, // Dynamic width
    height: 16, // Larger circle
    borderRadius: 100,
    backgroundColor: "#12956B",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  uploadButton: {
    position: "absolute",
    right: 15,
    bottom: Platform.OS === 'ios' ? 90 : 70, // adjust based on tab height
    alignSelf: "flex-end",
    backgroundColor: "#12956B",
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 10,
  },
});
