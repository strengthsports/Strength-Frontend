import React, { useCallback, useImperativeHandle } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Portal } from "react-native-paper";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
// Define the drawer width (e.g., 75% of screen width)
const DRAWER_WIDTH = SCREEN_WIDTH * 0.75;

export type DrawerRefProps = {
  toggle: () => void;
  open: () => void;
  close: () => void;
  isOpen: () => boolean;
};

type DrawerProps = {
  children?: React.ReactNode;
  onClose?: () => void; // callback when drawer is closed
  onOpen?: () => void; // callback when drawer is fully opened
};

const CustomDrawer = React.forwardRef<DrawerRefProps, DrawerProps>(
  ({ children, onClose, onOpen }, ref) => {
    // Shared value for horizontal translation
    // Closed state: -DRAWER_WIDTH, Open state: 0
    const translateX = useSharedValue(-DRAWER_WIDTH);
    const active = useSharedValue(false);

    const openDrawer = useCallback(() => {
      "worklet";
      active.value = true;
      translateX.value = withSpring(0, { damping: 50 });
    }, []);

    const closeDrawer = useCallback(() => {
      "worklet";
      active.value = false;
      translateX.value = withSpring(-DRAWER_WIDTH, { damping: 50 });
    }, []);

    const toggleDrawer = useCallback(() => {
      if (active.value) {
        closeDrawer();
      } else {
        openDrawer();
      }
    }, [active.value]);

    const isOpen = useCallback(() => {
      return active.value;
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        toggle: toggleDrawer,
        open: openDrawer,
        close: closeDrawer,
        isOpen: isOpen,
      }),
      [toggleDrawer, openDrawer, closeDrawer, isOpen]
    );

    const context = useSharedValue({ x: 0 });
    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { x: translateX.value };
      })
      .onUpdate((event) => {
        // Update translation based on gesture and clamp between closed and open values
        translateX.value = event.translationX + context.value.x;
        if (translateX.value > 0) translateX.value = 0;
        if (translateX.value < -DRAWER_WIDTH) translateX.value = -DRAWER_WIDTH;
      })
      .onEnd(() => {
        // If drawer is dragged more than halfway open, snap it open
        if (translateX.value > -DRAWER_WIDTH / 2) {
          openDrawer();
          if (onOpen) {
            runOnJS(onOpen)();
          }
        } else {
          closeDrawer();
          if (onClose) {
            runOnJS(onClose)();
          }
        }
      });

    const rDrawerStyle = useAnimatedStyle(() => {
      // Optional: interpolate borderRadius for a subtle effect
      const borderRadius = interpolate(
        translateX.value,
        [-DRAWER_WIDTH, 0],
        [0, 25],
        Extrapolate.CLAMP
      );
      return {
        transform: [{ translateX: translateX.value }],
        borderTopRightRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
      };
    });

    return (
      <Portal>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.drawerContainer, rDrawerStyle]}>
            {children}
          </Animated.View>
        </GestureDetector>
      </Portal>
    );
  }
);

const styles = StyleSheet.create({
  drawerContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: "#fff",
    // Optional shadow for depth:
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 5, height: 0 },
    shadowRadius: 10,
    elevation: 10,
  },
});

export default CustomDrawer;
