import { Tabs } from "expo-router";
import React, { useState } from "react";
import { Platform, View, Text } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "~/reduxStore";
import SearchIcon from "~/components/SvgIcons/navbar/SearchIcon";
import HomeIcon from "~/components/SvgIcons/navbar/HomeIcon";
import CommunityIcon from "~/components/SvgIcons/navbar/CommunityIcon";
import NotificationIcon from "~/components/SvgIcons/navbar/NotificationIcon";
import ProfileIcon from "~/components/SvgIcons/navbar/ProfileIcon";

export default function TabLayout() {
  const userId = useSelector((state: RootState) => state?.profile?.user?._id);
  console.log("user Id : ", userId);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#12956B",
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            height: 100,
            paddingBottom: 15,
            paddingTop: 5,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            overflow: "hidden",
            backgroundColor: "#000", // Ensure consistent background
          },
          default: {
            height: 60,
            paddingBottom: 15,
            paddingTop: 5,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            overflow: "hidden",
            backgroundColor: "#000", // Ensure consistent background
            elevation: 0, // Remove shadow on Android
            borderTopWidth: 0, // Remove top border shadow
          },
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          href: "/(app)/(tabs)/home",
          tabBarIcon: ({ color, focused }) => (
            // <IconSymbol
            //   name={focused ? "home-outline" : "home-outline"}
            //   color={color}
            // />
            <HomeIcon color={focused ? "#12956B" : "white"} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{ color: focused ? "#12956B" : "white", fontSize: 10 }}
            >
              Home
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          href: "/(app)/(tabs)/explore/allCategory",
          tabBarIcon: ({ color, focused }) => (
            <SearchIcon color={focused ? "#12956B" : "white"} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{ color: focused ? "#12956B" : "white", fontSize: 10 }}
            >
              Explore
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({ color, focused }) => (
            <CommunityIcon color={focused ? "#12956B" : "white"} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{ color: focused ? "#12956B" : "white", fontSize: 10 }}
            >
              Community
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: "Notification",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ position: "relative" }}>
              {/* <IconSymbol
                name={focused ? "bell" : "bell-outline"}
                color={color}
              /> */}
              <NotificationIcon color={focused ? "#12956B" : "white"} />
              {hasNewNotification && (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#12956B",
                  }}
                />
              )}
            </View>
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{ color: focused ? "#12956B" : "white", fontSize: 10 }}
            >
              Notification
            </Text>
          ),
        }}
        listeners={{
          tabPress: () => {
            // When the notification tab is pressed, hide the dot
            setHasNewNotification(false);
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          href: "/(app)/(tabs)/profile",
          tabBarIcon: ({ color, focused }) => (
            // <IconSymbol
            //   name={
            //     focused
            //       ? "card-account-details"
            //       : "card-account-details-outline"
            //   }
            //   color={color}
            // />
            <ProfileIcon color={focused ? "#12956B" : "white"} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{ color: focused ? "#12956B" : "white", fontSize: 10 }}
            >
              Profile
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
