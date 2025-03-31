// AppBottomSheet.js - Updated with explicit height control
import React, { useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
  Keyboard,
} from "react-native";
import { useBottomSheet } from "@/context/BottomSheetContext";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const AppBottomSheet = () => {
  const { bottomSheetState, closeBottomSheet } = useBottomSheet();
  const { isVisible, content, height, bgcolor, border } = bottomSheetState;
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const sheetHeight =
    typeof height === "string"
      ? (SCREEN_HEIGHT * parseFloat(height.replace("%", ""))) / 100
      : height;

  // Animation handling
  useEffect(() => {
    if (isVisible) {
      Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT - sheetHeight,
        useNativeDriver: true,
        bounciness: 4,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, sheetHeight]);

  // Pan responder for drag interactions
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newY = SCREEN_HEIGHT - sheetHeight + gestureState.dy;
        if (newY > SCREEN_HEIGHT - sheetHeight) {
          translateY.setValue(newY);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.vy > 0.5 || gestureState.dy > 45) {
          closeBottomSheet();
        } else {
          Animated.spring(translateY, {
            toValue: SCREEN_HEIGHT - sheetHeight,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
        }
      },
    })
  ).current;

  if (!isVisible) return null;

  return (
    <>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.backdrop}
        onPress={closeBottomSheet}
      />

      <Animated.View
        style={[
          styles.container,
          {
            height: sheetHeight,
            transform: [{ translateY }],
            backgroundColor: bgcolor,
            borderWidth: border ? 0.5 : 0,
            borderTopColor: border ? "#808080" : "transparent",
          },
        ]}
      >
        <View {...panResponder.panHandlers} style={styles.dragHandle}>
          <View style={styles.handle} />
        </View>

        <View style={[styles.content, { height: sheetHeight - 40 }]}>
          {content}
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    marginHorizontal: "auto",
    marginTop: 8,
  },
  content: {
    paddingHorizontal: 10,
  },
});

export default AppBottomSheet;
