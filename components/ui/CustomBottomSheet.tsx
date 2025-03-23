import { Dimensions, StyleSheet, View, PixelRatio } from "react-native";
import React, { useCallback, useImperativeHandle } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Portal } from "react-native-paper";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// Default values
const DEFAULT_ANIMATION_SPEED = 50; // lower means snappier
const DEFAULT_FIXED_HEIGHT = 250; // default fixed height when isFixed is true
const FLEXIBLE_OPEN_OFFSET = 50; // when not fixed, open position offset from top

export type BottomSheetRefProps = {
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
};

type BottomSheetProps = {
  children?: React.ReactNode;
  onClose?: () => void; // callback when sheet is closed
  isFixed?: boolean; // if true, user cannot drag upward to open
  fixedHeight?: number; // used when isFixed is true; bottom sheet will open to fixed height
  animationSpeed?: number; // controls the spring damping (lower is snappier)
  bgColor?: string;
  controllerVisibility?: boolean;
};

const CustomBottomSheet = React.forwardRef<
  BottomSheetRefProps,
  BottomSheetProps
>(
  (
    {
      children,
      onClose,
      isFixed = false,
      fixedHeight = DEFAULT_FIXED_HEIGHT,
      animationSpeed = DEFAULT_ANIMATION_SPEED,
      bgColor,
      controllerVisibility = true,
    },
    ref
  ) => {
    // Compute the open position:
    // - In fixed mode: top of sheet = SCREEN_HEIGHT - fixedHeight.
    // - In flexible mode: open position is defined as offset from the top.
    const openPosition = isFixed
      ? -(SCREEN_HEIGHT - fixedHeight)
      : -SCREEN_HEIGHT + FLEXIBLE_OPEN_OFFSET;

    // Shared value for vertical translation. Initial state: closed (0).
    const translateY = useSharedValue(0);
    const active = useSharedValue(false);

    const scrollTo = useCallback(
      (destination: number) => {
        "worklet";
        active.value = destination !== 0;
        translateY.value = withSpring(destination, { damping: animationSpeed });
      },
      [animationSpeed]
    );

    const isActive = useCallback(() => active.value, []);

    useImperativeHandle(ref, () => ({ scrollTo, isActive }), [
      scrollTo,
      isActive,
    ]);

    // We'll only allow two snap points: closed (0) and open (openPosition)
    const context = useSharedValue({ y: 0 });

    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.value };
      })
      .onUpdate((event) => {
        // For fixed mode, allow only downward drag (if already open)
        if (isFixed) {
          if (translateY.value < 0 && event.translationY > 0) {
            translateY.value = context.value.y + event.translationY;
          } else {
            // Prevent upward drag in fixed mode when closed or open
            translateY.value = context.value.y;
          }
        } else {
          // Flexible mode: allow bidirectional dragging
          translateY.value = context.value.y + event.translationY;
          // Clamp to not go beyond fully open position
          translateY.value = Math.max(translateY.value, openPosition);
        }
      })
      .onEnd(() => {
        // Calculate the threshold as halfway between open and closed.
        const threshold = openPosition / 2;
        // If the sheet is dragged past the halfway point (remember openPosition is negative)
        if (translateY.value < threshold) {
          // Snap to open position
          scrollTo(openPosition);
        } else {
          // Snap to closed position
          scrollTo(0);
          if (onClose) runOnJS(onClose)();
        }
      });

    const rBottomSheetStyle = useAnimatedStyle(() => {
      // Optional interpolation for borderRadius as an example.
      const borderRadius = interpolate(
        translateY.value,
        [openPosition + 50, openPosition],
        [25, 5],
        Extrapolate.CLAMP
      );
      return {
        borderRadius,
        transform: [{ translateY: translateY.value }],
      };
    });

    return (
      <Portal>
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[styles.bottomSheetContainer, rBottomSheetStyle]}
            className={`${
              bgColor ||
              "bg-[#121212] rounded-[25px] border-[0.5px] border-[#404040]"
            }`}
          >
            {controllerVisibility && <View style={styles.line} />}
            {children}
          </Animated.View>
        </GestureDetector>
      </Portal>
    );
  }
);

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: "100%",
    position: "absolute",
    top: SCREEN_HEIGHT,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: "grey",
    alignSelf: "center",
    marginVertical: 15,
    borderRadius: 2,
  },
});

export default CustomBottomSheet;
