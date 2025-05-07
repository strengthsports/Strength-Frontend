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

import { Tabs } from "expo-router";
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
import { useGetNotificationsQuery } from "~/reduxStore/api/notificationApi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/reduxStore";
import { Redirect } from "expo-router";
import eventBus from "~/utils/eventBus";
import { GestureResponderEvent } from "react-native";

const tabs = [
  {
    name: "home",
    title: "Home",
    icon: HomeIcon,
    href: "/(app)/(tabs)/home",
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
  const { data: notificationsData, refetch } = useGetNotificationsQuery();
  const { notificationCount } = useSelector(
    (state: RootState) => state.notification
  );

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
    if (notificationsData) {
      const unreadCount = notificationsData.unreadCount || 0;
      console.log(unreadCount);
      dispatch(incrementCount(unreadCount));
      dispatch(setHasNewNotification(unreadCount > 0));
    }
  }, [notificationsData, dispatch]);

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <DrawerProvider>
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
                            <Text style={styles.notificationText}>
                              {notificationCount > 9 ? "9+" : notificationCount}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text
                        style={{
                          fontSize: 9,
                          fontWeight: "500",
                          color: isSelected ? "#12956B" : "#CECECE",
                          marginTop: 2,
                        }}
                      >
                        {title}
                      </Text>
                    </TouchableOpacity>
                  );
                },
              }}
            />
          ))}
        </Tabs>
      </DrawerProvider>
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
});
