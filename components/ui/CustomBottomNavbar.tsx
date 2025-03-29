// components/CustomBottomNavbar.tsx
import React, { useRef } from "react";
import { Animated, TouchableOpacity, StyleSheet, View } from "react-native";
import { RelativePathString, useRouter, useSegments } from "expo-router";
import HomeIcon from "~/components/SvgIcons/navbar/HomeIcon";
import SearchIcon from "~/components/SvgIcons/navbar/SearchIcon";
import CommunityIcon from "~/components/SvgIcons/navbar/CommunityIcon";
import NotificationIcon from "~/components/SvgIcons/navbar/NotificationIcon";
import ProfileIcon from "~/components/SvgIcons/navbar/ProfileIcon";
import { useScroll } from "@/context/ScrollContext";
import { Platform } from "react-native";
import TextScallingFalse from "../CentralText";

interface CustomBottomNavbarProps {
  hasNewNotification: boolean;
  setHasNewNotification: (value: boolean) => void;
}

const CustomBottomNavbar: React.FC<CustomBottomNavbarProps> = ({
  hasNewNotification,
  setHasNewNotification,
}) => {
  const router = useRouter();
  const segments = useSegments();
  const { scrollY } = useScroll();

  // New animation logic
  const translateY = scrollY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  const navbarTranslate = Animated.add(
    scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [0, Platform.OS === "ios" ? 80 : 60],
      extrapolate: "clamp",
    }),
    translateY.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -1],
    })
  );

  // Combine segments to create current route string
  let activeRoute = segments.join("/");

  // Define nav items with label, route, and the icon component.
  const navItems = [
    { label: "Home", route: "/(app)/(tabs)/home", Icon: HomeIcon },
    {
      label: "Explore",
      route: "/(app)/(tabs)/explore/allCategory",
      Icon: SearchIcon,
    },
    {
      label: "Community",
      route: "/(app)/(tabs)/community",
      Icon: CommunityIcon,
    },
    {
      label: "Notification",
      route: "/(app)/(tabs)/notification",
      Icon: NotificationIcon,
    },
    { label: "Profile", route: "/(app)/(tabs)/profile", Icon: ProfileIcon },
  ];

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: navbarTranslate }] },
      ]}
    >
      {navItems.map((item, index) => {
        activeRoute = "/" + activeRoute;
        const isActive = activeRoute.includes(item.route);
        console.log(activeRoute);
        console.log(item.route);
        console.log(isActive);
        const iconColor = isActive ? "#12956B" : "white";
        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              if (item.label === "Notification") {
                setHasNewNotification(false);
              }
              router.push(item.route as RelativePathString);
            }}
            style={styles.navItem}
            activeOpacity={0.5}
          >
            <View style={styles.iconContainer}>
              <item.Icon color={iconColor} />
              {item.label === "Notification" && hasNewNotification && (
                <View style={styles.notificationDot} />
              )}
            </View>
            <TextScallingFalse style={[styles.label, { color: iconColor }]}>
              {item.label}
            </TextScallingFalse>
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute", // Add this
    bottom: 0, // Add this
    left: 0, // Add this
    right: 0, // Add this
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#000000",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderTopWidth: 0.2,
    borderColor: "#808080",
    overflow: "hidden",
    height: 65,
  },
  navItem: {
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    position: "relative",
    alignItems: "center",
  },
  notificationDot: {
    position: "absolute",
    top: 0,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#12956B",
  },
  label: {
    color: "white",
    fontSize: 10,
    marginTop: 4,
  },
});

export default CustomBottomNavbar;
