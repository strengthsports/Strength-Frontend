// // AppLayout.tsx
// import { View } from "react-native";
// import { Redirect, Stack } from "expo-router";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/reduxStore";
// import CustomBottomNavbar from "@/components/ui/CustomBottomNavbar";
// import { ScrollProvider } from "@/context/ScrollContext";
// import React, { useEffect, useState } from "react";
// import { DrawerProvider } from "~/context/DrawerContext";
// import { connectSocket } from "~/utils/socket";
// import {
//   incrementCount,
//   setHasNewNotification,
// } from "~/reduxStore/slices/notification/notificationSlice";
// import { useGetNotificationsQuery } from "~/reduxStore/api/notificationApi";

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
import React from "react";
import { Platform } from "react-native";
import CommunityIcon from "~/components/SvgIcons/navbar/CommunityIcon";
import SearchIcon from "~/components/SvgIcons/navbar/SearchIcon";
import HomeIcon from "~/components/SvgIcons/navbar/HomeIcon";
import NotificationIcon from "~/components/SvgIcons/navbar/NotificationIcon";
import ProfileIcon from "~/components/SvgIcons/navbar/ProfileIcon";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#12956B",
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            height: 60, // Increase height to create space
            paddingBottom: 15, // Adds space at the bottom
            paddingTop: 5, // Adds space at the top
            borderTopLeftRadius: 10, // Rounded top-left corner
            borderTopRightRadius: 10, // Rounded top-right corner
            overflow: "hidden", // Prevents background bleed
            backgroundColor: "#000",
          },
          default: {
            height: 60, // Ensures consistent height
            paddingBottom: 15,
            paddingTop: 5,
            borderTopLeftRadius: 10, // Rounded top-left corner
            borderTopRightRadius: 10, // Rounded top-right corner
            overflow: "hidden", // Prevents background bleed
            backgroundColor: "#000",
          },
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          href: "/(app)/(tabs)/home",
          tabBarIcon: () => <HomeIcon />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          href: "/(app)/(tabs)/explore/allCategory",
          tabBarIcon: () => <SearchIcon />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          href: "/(app)/(tabs)/community",
          tabBarIcon: () => <CommunityIcon />,
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: "Notification",
          tabBarIcon: () => <NotificationIcon />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          href: "/(app)/(tabs)/profile",
          tabBarIcon: () => <ProfileIcon />,
        }}
      />
    </Tabs>
  );
}
