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

const BOTTOM_NAVBAR_HEIGHT = Platform.OS === "ios" ? 80 : 60;
interface CustomBottomNavbarProps {
  hasNewNotification: boolean;
  setHasNewNotification: (value: boolean) => void;
  notificationCount: number;
  setNotificationCount: (value: number) => void;
}

const CustomBottomNavbar: React.FC<CustomBottomNavbarProps> = ({
  hasNewNotification,
  setHasNewNotification,
  notificationCount,
  setNotificationCount,
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
    <View
      style={[
        styles.container,
        // activeRoute === "(app)/(tabs)/home"
        //   ? { transform: [{ translateY: headerTranslateY }] }
        //   : {},
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
                setNotificationCount(0);
              }
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
            className="active:bg-neutral-800"
            activeOpacity={0.5}
          >
            <View style={styles.iconContainer}>
              <item.Icon color={iconColor} />
              {item.label === "Notification" && hasNewNotification && (
                <View style={styles.notificationDot}>
                  {notificationCount > 0 && (
                    <TextScallingFalse className="text-white text-xs">
                      {notificationCount}
                    </TextScallingFalse>
                  )}
                </View>
              )}
               <TextScallingFalse style={[styles.label, { color: iconColor }]}>
              {item.label}
            </TextScallingFalse>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
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
    backgroundColor: "black",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: "hidden",
    height: BOTTOM_NAVBAR_HEIGHT,
  },
  navItem: {
    alignItems: "center",
    borderRadius: '35%',
    height: '100%',
    flex: 1,
  },
  iconContainer: {
    position: "relative",
    alignItems: "center",
    paddingVertical: 15,
  },
  notificationDot: {
    position: "absolute",
    top: -2,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: "100%",
    backgroundColor: "#12956B",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "#000",
    fontSize: 9,
    marginTop: 2,
    fontFamily: "Inter",
  },
});

export default CustomBottomNavbar;
