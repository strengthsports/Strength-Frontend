import { Tabs } from "expo-router";
import React, { useState } from "react";
import { Platform, View } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useSelector } from "react-redux";
import { RootState } from "~/reduxStore";

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
            <View style={{ position: "relative" }}>
              <IconSymbol
                name={focused ? "bell" : "bell-outline"}
                color={color}
              />
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
