import React, { useRef, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
  Keyboard,
  BackHandler,
} from "react-native";
import { useBottomSheet } from "@/context/BottomSheetContext";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const AppBottomSheet = () => {
  const { bottomSheetState, closeBottomSheet } = useBottomSheet();
  const {
    isVisible,
    content,
    height,
    bgcolor,
    border,
    draggableDirection = "down",
    maxHeight = "90%",
  } = bottomSheetState;

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [isMounted, setIsMounted] = useState(false);

  // Height calculations
  const sheetHeight =
    typeof height === "string"
      ? (SCREEN_HEIGHT * parseFloat(height.replace("%", ""))) / 100
      : height;

  const maxHeightValue =
    typeof maxHeight === "string"
      ? (SCREEN_HEIGHT * parseFloat(maxHeight.replace("%", ""))) / 100
      : maxHeight;

  const minTranslateY = SCREEN_HEIGHT - sheetHeight;
  const maxTranslateY = SCREEN_HEIGHT - maxHeightValue;

  // Handle hardware back button
  useEffect(() => {
    const handleBackButton = () => {
      if (isVisible) {
        closeBottomSheet();
        return true; // Prevent default back action
      }
      return false;
    };

    if (isVisible) {
      BackHandler.addEventListener("hardwareBackPress", handleBackButton);
    } else {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    }

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    };
  }, [isVisible]);

  // Animation handling
  useEffect(() => {
    if (isVisible) {
      setIsMounted(true);
      Animated.spring(translateY, {
        toValue: minTranslateY,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsMounted(false));
    }
  }, [isVisible, sheetHeight]);

  // Pan responder configuration
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => Keyboard.dismiss(),
      onPanResponderMove: (_, gestureState) => {
        let newY = SCREEN_HEIGHT - sheetHeight + gestureState.dy;

        if (draggableDirection === "both") {
          newY = Math.min(Math.max(newY, maxTranslateY), minTranslateY);
        } else {
          newY = Math.max(minTranslateY, newY);
        }

        translateY.setValue(newY);
      },
      onPanResponderRelease: (_, gestureState) => {
        const currentY = translateY.__getValue();
        const velocityThreshold = 0.5;
        const dragThreshold = SCREEN_HEIGHT * 0.1;

        const shouldClose =
          (gestureState.vy > velocityThreshold ||
            gestureState.dy > dragThreshold) &&
          currentY >= minTranslateY;

        if (shouldClose) {
          closeBottomSheet();
        } else {
          let targetY = minTranslateY;

          if (draggableDirection === "both") {
            const midPoint = (maxTranslateY + minTranslateY) / 2;
            targetY = currentY < midPoint ? maxTranslateY : minTranslateY;
          }

          // Prevent animation if already at target
          if (currentY !== targetY) {
            Animated.spring(translateY, {
              toValue: targetY,
              useNativeDriver: true,
            }).start();
          }
        }
      },
    })
  ).current;

  if (!isMounted) return null;

  return (
    <>
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={closeBottomSheet}
      />

      {/* Sheet content */}
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY }],
            height: sheetHeight,
            backgroundColor: bgcolor || "#fff",
            borderTopLeftRadius: border || 20,
            borderTopRightRadius: border || 20,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.dragHandle}>
          <View style={styles.handle} />
        </View>
        <View
          onStartShouldSetResponder={() => true} // Allow content to handle touches
          onTouchEnd={(e) => e.stopPropagation()}
          style={styles.content}
        >
          {content}
        </View>
      </Animated.View>
    </>
  );
};

// Styles remain unchanged from original
const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 999,
  },
  container: {
    position: "absolute",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 1000,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  dragHandle: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#555",
    borderRadius: 3,
    marginTop: 8,
  },
  content: {
    paddingHorizontal: 10,
    flex: 1,
  },
});

export default AppBottomSheet;
