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
import eventBus from "~/utils/eventBus";

const BOTTOM_NAVBAR_HEIGHT = 70;
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

  // // New animation logic
  // const translateY = scrollY.interpolate({
  //   inputRange: [-1, 0, 1],
  //   outputRange: [0, 0, 1],
  //   extrapolate: "clamp",
  // });

  // const navbarTranslate = Animated.add(
  //   scrollY.interpolate({
  //     inputRange: [0, 100],
  //     outputRange: [0, Platform.OS === "ios" ? 80 : 60],
  //     extrapolate: "clamp",
  //   }),
  //   translateY.interpolate({
  //     inputRange: [0, 1],
  //     outputRange: [0, -1],
  //   })
  // );

  // Clamp the scroll value between 0 and HEADER_HEIGHT.
  const clampedScrollY = Animated.diffClamp(scrollY, 0, BOTTOM_NAVBAR_HEIGHT);

  // Interpolate to get a translateY value that moves the header up as you scroll down.
  const headerTranslateY = clampedScrollY.interpolate({
    inputRange: [0, BOTTOM_NAVBAR_HEIGHT],
    outputRange: [0, BOTTOM_NAVBAR_HEIGHT],
    // extrapolate: "",
  });

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
        activeRoute === "(app)/(tabs)/home"
          ? { transform: [{ translateY: headerTranslateY }] }
          : {},
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
              // if (item.label === "Notification") {
              //   setHasNewNotification(false);
              // }
              if (item.label === "Home") {
                // Check if already on Home route
                if (activeRoute.includes(item.route)) {
                  // Emit event to trigger scroll and refresh
                  eventBus.emit("scrollToTop");
                  return;
                }
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
    overflow: "hidden",
    height: BOTTOM_NAVBAR_HEIGHT,
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
    color: "#000",
    fontSize: 10,
    marginTop: 4,
    fontFamily: "Inter",
  },
});

export default CustomBottomNavbar;
