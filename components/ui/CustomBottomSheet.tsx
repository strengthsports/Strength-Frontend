import { Dimensions, StyleSheet, View } from "react-native";
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
    // - In flexible mode: open position is defined as before.
    const openPosition = isFixed
      ? -(SCREEN_HEIGHT - fixedHeight)
      : -SCREEN_HEIGHT + FLEXIBLE_OPEN_OFFSET;
    const flexibleMaxTranslateY = -SCREEN_HEIGHT + FLEXIBLE_OPEN_OFFSET; // same as MAX_TRANSLATE_Y

    // Shared value for vertical translation. Initial state: closed = 0.
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

    // In fixed mode, the sheet is meant to be opened only programmatically to openPosition.
    // The user can only drag downward (to close).
    // In flexible mode, normal bidirectional drag applies.
    const context = useSharedValue({ y: 0 });

    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.value };
      })
      .onUpdate((event) => {
        if (isFixed) {
          // Only allow downward dragging (positive translationY)
          // And only if the sheet is already open
          if (translateY.value < 0) {
            // Sheet is open (translateY < 0)
            // Only allow downward dragging (translationY > 0)
            if (event.translationY > 0) {
              translateY.value = context.value.y + event.translationY;
            } else {
              // Keep at current position when trying to drag upward
              translateY.value = context.value.y;
            }
          } else {
            // Sheet is closed, maintain position
            translateY.value = 0;
          }
        } else {
          // Flexible mode: allow bidirectional dragging
          translateY.value = event.translationY + context.value.y;
          // Clamp to not go beyond fully open position
          translateY.value = Math.max(translateY.value, flexibleMaxTranslateY);
        }
      })
      .onEnd(() => {
        if (isFixed) {
          // For fixed mode
          const threshold = 60;
          // If sheet was open and dragged enough, close it
          if (
            translateY.value < 0 &&
            translateY.value > openPosition + threshold
          ) {
            scrollTo(0);
            if (onClose) runOnJS(onClose)();
          } else if (translateY.value < 0) {
            // Otherwise snap back to open position
            scrollTo(openPosition);
          }
        } else {
          // For flexible mode
          if (translateY.value > -SCREEN_HEIGHT / 3) {
            scrollTo(0);
            if (onClose) runOnJS(onClose)();
          } else if (translateY.value < -SCREEN_HEIGHT / 1.5) {
            scrollTo(flexibleMaxTranslateY);
          }
        }
      });

    const rBottomSheetStyle = useAnimatedStyle(() => {
      const borderRadius = interpolate(
        translateY.value,
        [
          isFixed ? openPosition + 50 : flexibleMaxTranslateY + 50,
          isFixed ? openPosition : flexibleMaxTranslateY,
        ],
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
    // borderRadius: 25,
    // borderWidth: 0.5,
    // borderColor: "#404040",
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
