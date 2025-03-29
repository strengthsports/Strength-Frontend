import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Image } from "react-native";
import AnimatedAddPostBar from "../feedPage/AnimatedAddPostBar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import defaultPic from "../../assets/images/nopic.jpg";
import { useScroll } from "~/context/ScrollContext";
import { Animated } from "react-native";

const HEADER_HEIGHT = 60;

const CustomHomeHeader = () => {
  const { error, loading, user } = useSelector((state: any) => state?.profile);
  const possibleMessages = [
    "What's going on...",
    "What's on your mind...",
    "Share your sports moment...",
  ];

  // Select a random message each time the component mounts
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    const randomIndex = Math.floor(Math.random() * possibleMessages.length);
    setMessage(possibleMessages[randomIndex]);
  }, []);

  // Get the shared scrollY animated value
  const { scrollY } = useScroll();

  // Clamp the scroll value between 0 and HEADER_HEIGHT.
  const clampedScrollY = Animated.diffClamp(scrollY, 0, HEADER_HEIGHT);

  // Interpolate to get a translateY value that moves the header up as you scroll down.
  const headerTranslateY = clampedScrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.headerContainer,
        { transform: [{ translateY: headerTranslateY }] },
      ]}
    >
      {/* Avatar Profile Picture */}
      <TouchableOpacity>
        <Image
          source={user?.profilePic ? { uri: user?.profilePic } : defaultPic}
          style={{ width: 36, height: 36, borderRadius: 18 }}
        />
      </TouchableOpacity>

      {/* Add Post Section */}
      <View style={{ flex: 1 }}>
        <AnimatedAddPostBar suggestionText={message} />
      </View>

      {/* Message Icon */}
      <TouchableOpacity>
        <MaterialCommunityIcons
          name="message-reply-text-outline"
          size={27.5}
          color="white"
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CustomHomeHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "black",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    borderBottomWidth: 0.5,
    borderBottomColor: "#525252",
    height: HEADER_HEIGHT,
  },
});
