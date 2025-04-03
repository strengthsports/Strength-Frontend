import React, { useMemo, useCallback } from "react";
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

const BOTTOM_NAVBAR_HEIGHT = 70;

const CustomBottomNavbar = () => {
  const router = useRouter();
  const segments = useSegments();
  const dispatch = useDispatch<AppDispatch>();
  const { notificationCount } = useSelector(
    (state: RootState) => state.notification
  );
  const { scrollY } = useScroll();

  // Compute the active route only once.
  const computedActiveRoute = useMemo(() => {
    return segments.length ? "/" + segments.join("/") : "/(app)/(tabs)/home";
  }, [segments]);

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
    <Animated.View
      style={[
        styles.container,
        // Only apply the animated translate if on the home route.
        computedActiveRoute === "/(app)/(tabs)/home" && {
          transform: [{ translateY: headerTranslateY }],
        },
      ]}
    >
      {navItems.map((item, index) => {
        const isActive = computedActiveRoute.includes(item.route);
        const iconColor = isActive ? "#12956B" : "white";

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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
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
    fontSize: 10,
    marginTop: 4,
    fontFamily: "Inter",
  },
});

export default React.memo(CustomBottomNavbar);
