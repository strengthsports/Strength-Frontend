import React, { useMemo, useCallback, useEffect, useState } from "react";
import {
  Animated,
  TouchableOpacity,
  StyleSheet,
  View,
  Platform,
} from "react-native";
import { RelativePathString, useRouter, useSegments } from "expo-router";
import HomeIcon from "~/components/SvgIcons/navbar/HomeIcon";
import SearchIcon from "~/components/SvgIcons/navbar/SearchIcon";
import CommunityIcon from "~/components/SvgIcons/navbar/CommunityIcon";
import NotificationIcon from "~/components/SvgIcons/navbar/NotificationIcon";
import ProfileIcon from "~/components/SvgIcons/navbar/ProfileIcon";
import { useScroll } from "@/context/ScrollContext";
import TextScallingFalse from "../CentralText";
import eventBus from "~/utils/eventBus";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/reduxStore";
import { resetCount } from "~/reduxStore/slices/notification/notificationSlice";

const BOTTOM_NAVBAR_HEIGHT = Platform.OS === "ios" ? 80 : 60;
const CustomBottomNavbar = () => {
  const router = useRouter();
  const segments = useSegments();
  const dispatch = useDispatch<AppDispatch>();
  const { notificationCount } = useSelector(
    (state: RootState) => state.notification
  );
  const { scrollY } = useScroll();
  const [activeRoute, setActiveRoute] = useState("/(app)/(tabs)/home");

  // Compute the active route only once.
  useEffect(() => {
    setActiveRoute(
      segments.length ? "/" + segments.join("/") : "/(app)/(tabs)/home"
    );
  }, [segments]);
  const computedActiveRoute = useMemo(() => activeRoute, [activeRoute]);

  // Compute the clamped scroll value.
  const clampedScrollY = useMemo(
    () => Animated.diffClamp(scrollY, 0, BOTTOM_NAVBAR_HEIGHT),
    [scrollY]
  );

  // Interpolate for header translate.
  const headerTranslateY = useMemo(
    () =>
      clampedScrollY.interpolate({
        inputRange: [0, BOTTOM_NAVBAR_HEIGHT],
        outputRange: [0, BOTTOM_NAVBAR_HEIGHT],
      }),
    [clampedScrollY]
  );

  // Memoize nav items as they are static.
  const navItems = useMemo(
    () => [
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
    ],
    []
  );

  // Memoized press handler factory.
  const handlePress = useCallback(
    (item: {
        label: string;
        route: string;
        Icon: React.ComponentType<{ color: string }>;
      }) =>
      () => {
        if (item.label === "Notification") {
          dispatch(resetCount());
        }
        if (item.label === "Home" && computedActiveRoute.includes(item.route)) {
          // If already on Home, trigger scroll-to-top event.
          eventBus.emit("scrollToTop");
          return;
        }
        router.push(item.route as RelativePathString);
      },
    [computedActiveRoute, router, dispatch]
  );

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
        const isActive = computedActiveRoute.startsWith(item.route);
        const iconColor = isActive ? "#12956B" : "#cccccc";

        return (
          <TouchableOpacity
            key={index}
            onPress={handlePress(item)}
            style={styles.navItem}
            activeOpacity={0.5}
          >
            <View style={styles.iconContainer}>
              <item.Icon color={iconColor} />
              {item.label === "Notification" && notificationCount > 0 && (
                <View style={styles.notificationDot}>
                  <TextScallingFalse style={styles.notificationText}>
                    {notificationCount}
                  </TextScallingFalse>
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
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
    borderRadius: "35%",
    height: "100%",
    flex: 1,
  },
  iconContainer: {
    position: "relative",
    alignItems: "center",
    paddingVertical: 15,
  },
  notificationDot: {
    position: "absolute",
    top: -4, // Adjust position
    right: -8,
    minWidth: 18, // Dynamic width
    height: 18, // Larger circle
    borderRadius: 9,
    backgroundColor: "#12956B",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  notificationText: {
    color: "white",
    fontSize: 10,
  },
  label: {
    color: "#000",
    fontSize: 9,
    marginTop: 2,
    fontFamily: "Inter",
  },
});

export default React.memo(CustomBottomNavbar);
