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
import { Platform, View, TouchableOpacity, Text } from "react-native";
import CommunityIcon from "~/components/SvgIcons/navbar/CommunityIcon";
import SearchIcon from "~/components/SvgIcons/navbar/SearchIcon";
import HomeIcon from "~/components/SvgIcons/navbar/HomeIcon";
import NotificationIcon from "~/components/SvgIcons/navbar/NotificationIcon";
import ProfileIcon from "~/components/SvgIcons/navbar/ProfileIcon";
import { DrawerProvider } from "~/context/DrawerContext";

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
                borderColor:'black',
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
                  return (
                    <TouchableOpacity
                      onPress={onPress}
                      activeOpacity={0.4}
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        height: 40, 
                      }}
                    >
                      <Icon color={isSelected ? "#12956B" : "#CECECE"} />
                      <Text
                        style={{
                          fontSize: 9,
                          fontWeight: '500',
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
