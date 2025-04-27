// components/UploadProgressBar.tsx
import React, { useEffect, useRef, useState } from "react";
import { Animated, View, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "~/reduxStore";
import { resetUploadProgress } from "~/reduxStore/slices/post/postSlice";
import TextScallingFalse from "./CentralText";

const UploadProgressBar: React.FC = () => {
  const dispatch = useDispatch();
  const { progress, isLoading } = useSelector((s: RootState) => s.post);

  const widthAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(false);
  const startTime = useRef<number>(0);

  // 1️⃣ Start / stop sequence
  useEffect(() => {
    if (isLoading) {
      // show immediately
      setVisible(true);
      startTime.current = Date.now();
      widthAnim.setValue(0);
      fadeAnim.setValue(1);

      // animate up to whatever progress the thunk has already emitted
      Animated.timing(widthAnim, {
        toValue: progress,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else if (visible) {
      // ensure at least 800ms visible
      const elapsed = Date.now() - startTime.current;
      const wait = Math.max(0, 800 - elapsed);

      setTimeout(() => {
        // fill → fade → hide
        Animated.sequence([
          Animated.timing(widthAnim, {
            toValue: 100,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setVisible(false);
          dispatch(resetUploadProgress());
        });
      }, wait);
    }
  }, [isLoading]);

  // 2️⃣ Bump the bar along if progress changes mid‑upload
  useEffect(() => {
    if (isLoading) {
      Animated.timing(widthAnim, {
        toValue: progress,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [progress]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.messageContainer}>
        <TextScallingFalse style={styles.messageText}>
          Keep Strength open to finish posting...
        </TextScallingFalse>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.bar,
            {
              width: widthAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    // position: "absolute",   // so top:60 actually works
    top: 60,
    width: "100%",
    backgroundColor: "#000",
    paddingVertical: 6,
  },
  messageContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 4,
  },
  messageText: {
    color: "#808080",
    fontSize: 16,
    fontWeight: "300",
  },
  track: {
    width: "100%",
    height: 4,
    backgroundColor: "#333",
  },
  bar: {
    height: "100%",
    backgroundColor: "#12956B",
  },
});

export default UploadProgressBar;
