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
import TextScallingFalse from "../CentralText";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const AppBottomSheet = () => {
  const { bottomSheetState, closeBottomSheet } = useBottomSheet();
  const {
    isVisible,
    content,
    height,
    bgcolor,
    border,
    maxHeight = "90%",
    heading,
  } = bottomSheetState;

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [isMounted, setIsMounted] = useState(false);

  // Calculate explicit pixel values
  const sheetHeight =
    typeof height === "string"
      ? (SCREEN_HEIGHT * parseFloat(height.replace("%", ""))) / 100
      : height;

  const maxHeightValue =
    typeof maxHeight === "string"
      ? (SCREEN_HEIGHT * parseFloat(maxHeight.replace("%", ""))) / 100
      : maxHeight;

  const minTranslateY = SCREEN_HEIGHT - sheetHeight;
  // We won't ever use maxTranslateY because we disallow upward drag.

  // Handle hardware back button
  useEffect(() => {
    const handleBackButton = () => {
      if (isVisible) {
        closeBottomSheet();
        return true;
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

  // Open / Close animations (no spring, just timing)
  useEffect(() => {
    if (isVisible) {
      setIsMounted(true);
      Animated.timing(translateY, {
        toValue: minTranslateY,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setIsMounted(false));
    }
  }, [isVisible, sheetHeight]);

  // PanResponder: only allow dragging DOWN to close; no upward movement
  let dragStartY = 0;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Keyboard.dismiss();
        dragStartY = translateY.__getValue(); // lock current position
      },
      onPanResponderMove: (_, gestureState) => {
        const dy = gestureState.dy;

        // Prevent dragging upward
        if (dy < 0) return;

        const newY = dragStartY + dy;
        translateY.setValue(newY);
      },
      onPanResponderRelease: (_, gestureState) => {
        const currentY = translateY.__getValue();
        const velocityThreshold = 0.5;
        const dragThreshold = SCREEN_HEIGHT * 0.1;

        const shouldClose =
          gestureState.vy > velocityThreshold ||
          gestureState.dy > dragThreshold;

        if (shouldClose) {
          closeBottomSheet();
        } else {
          Animated.timing(translateY, {
            toValue: dragStartY,
            duration: 200,
            useNativeDriver: true,
          }).start();
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

      {/* Bottom‐sheet container */}
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY }],
            height: sheetHeight,
            backgroundColor: bgcolor || "#fff",
            borderTopLeftRadius: border ? 30 : 20,
            borderTopRightRadius: border ? 30 : 20,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.dragHandle}>
          <View style={styles.handle} />
        </View>
        {heading && (
          <TextScallingFalse className="text-white text-4xl font-semibold text-center">
            {heading}
          </TextScallingFalse>
        )}
        <View
          onStartShouldSetResponder={() => true}
          onTouchEnd={(e) => e.stopPropagation()}
          style={styles.content}
        >
          {content}
        </View>
      </Animated.View>
    </>
  );
};

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
