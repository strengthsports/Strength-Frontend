import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Animated, Easing } from "react-native";

const AnimatedAddPostBar = ({ suggestionText = "What's on your mind..." }) => {
  const router = useRouter();

  // Use layout animation approach instead of mixing native and JS drivers
  const [expanded, setExpanded] = useState(false);
  const containerWidthAnim = useRef(new Animated.Value(37)).current;
  const textOpacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // All animations will use the JS driver (useNativeDriver: false)
    Animated.parallel([
      // Expand the width
      Animated.timing(containerWidthAnim, {
        toValue: expanded ? 280 : 37, // Fixed width in pixels instead of percentage
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false, // Width changes must use JS driver
      }),

      // Fade in text
      Animated.timing(textOpacityAnim, {
        toValue: expanded ? 1 : 0,
        duration: 350,
        delay: expanded ? 100 : 0,
        useNativeDriver: false, // Consistent with other animations
      }),
    ]).start(() => {
      // Animation completed
    });

    // Start expanded after a brief delay when component mounts
    if (!expanded) {
      const timer = setTimeout(() => {
        setExpanded(true);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [expanded, containerWidthAnim, textOpacityAnim]);

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
          onPress={() => router.push("/addPost")}
        >
          <Animated.Text
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
