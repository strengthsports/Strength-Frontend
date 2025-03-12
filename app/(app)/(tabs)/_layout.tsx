import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#12956B",
        headerShown: false,
        // tabBarButton: HapticTab,
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
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              name={focused ? "home-outline" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          href: "/(app)/(tabs)/explore/allCategory",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol name="magnify" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              name={focused ? "account-group" : "account-group-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: "Notification",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              name={focused ? "bell" : "bell-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          href: "/(app)/(tabs)/profile",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              name={
                focused
                  ? "card-account-details"
                  : "card-account-details-outline"
              }
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
