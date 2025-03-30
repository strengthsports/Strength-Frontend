import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Easing } from "react-native";

const AnimatedAddPostBar = ({ suggestionText = "What's on your mind..." }) => {
  const router = useRouter();

  // Use layout animation approach instead of mixing native and JS drivers
  const containerWidthAnim = useRef(new Animated.Value(37)).current;
  const textOpacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation should run only once
    Animated.parallel([
      // Expand the width
      Animated.timing(containerWidthAnim, {
        toValue: 280, // Fixed width in pixels instead of percentage
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false, // Width changes must use JS driver
      }),

      // Fade in text
      Animated.timing(textOpacityAnim, {
        toValue: 1,
        duration: 350,
        delay: 100,
        useNativeDriver: false, // Consistent with other animations
      }),
    ]).start();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <View style={{ alignItems: "center" }}>
      <Animated.View
        style={{
          width: containerWidthAnim,
          maxWidth: "100%",
        }}
      >
        <TouchableOpacity
          style={{
            position: "relative",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#141414",
            padding: 6,
            borderRadius: 12,
            height: 37,
            justifyContent: "space-between",
            paddingHorizontal: 6,
          }}
          onPress={() => router.push(`/addPost?text=${suggestionText}`)}
        >
          <Animated.Text
            allowFontScaling={false}
            style={{
              color: "grey",
              fontSize: 14,
              fontWeight: "400",
              marginLeft: 6,
              flex: 1,
              opacity: textOpacityAnim,
            }}
          >
            {suggestionText}
          </Animated.Text>
          <Animated.View
            style={{
              width: 25,
              height: 25,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 2,
              borderColor: "grey",
              borderRadius: 7,
            }}
          >
            <Feather name="plus" size={15} color="grey" />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default AnimatedAddPostBar;
