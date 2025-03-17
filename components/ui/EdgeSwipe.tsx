import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";

const SWIPE_THRESHOLD = 60; // Minimum swipe distance to trigger opening
const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface EdgeSwipeProps {
  onSwipe: () => void;
}

export default function EdgeSwipe({ onSwipe }: EdgeSwipeProps) {
  const translateX = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      // Allow swiping from anywhere, but only move right
      translateX.value = Math.max(0, event.translationX);
    })
    .onEnd(() => {
      if (translateX.value > SWIPE_THRESHOLD) {
        onSwipe(); // Trigger drawer open
      }
      translateX.value = withSpring(0); // Smooth reset animation
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={styles.swipeArea} />
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  swipeArea: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH, // Full screen width to allow swipe from anywhere
    backgroundColor: "transparent", // Debugging: change to rgba(255, 0, 0, 0.2) to test
  },
});
