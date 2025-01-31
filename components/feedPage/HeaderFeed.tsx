import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import profilePic from "../../assets/images/nopic.jpg";
import ProfileDrawer from "~/components/profileDrawer"; // Renamed Sidebar to ProfileDrawer
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

// Text animation states
const textsArray = [
  "What's going on...",
  "What's on your mind...",
  "Share your sports moment...",
];

const HeaderFeed = ({}) => {
  const [currentText, setCurrentText] = useState(textsArray[0]);
  const [isProfileDrawerVisible, setProfileDrawerVisible] = useState(false); // Renamed state to match the new name

  // Trigger profile drawer visibility when header is clicked
  const handleHeaderClick = () => {
    setProfileDrawerVisible((prevState) => !prevState); // Toggle profile drawer visibility
  };

  const textOpacity = useSharedValue(0);
  const textContainerWidth = useSharedValue("0%");

  useEffect(() => {
    animatePostContainer();
  }, []);

  const textStyle = useAnimatedStyle(() => ({
    flexBasis: textContainerWidth.value,
    opacity: textOpacity.value,
  }));

  const animatePostContainer = () => {
    textContainerWidth.value = withDelay(
      1500,
      withTiming("90%", {
        duration: 1500,
        easing: Easing.out(Easing.exp),
      }),
    );
    textOpacity.value = withDelay(
      1700,
      withTiming(1, { duration: 900, easing: Easing.linear }),
    );
  };

  const changeText = () => {
    setCurrentText(
      textsArray[(textsArray.indexOf(currentText) + 1) % textsArray.length],
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      changeText();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Avatar - Profile Drawer Trigger */}
      <TouchableOpacity
        onPress={handleHeaderClick}
        style={styles.avatarContainer}
      >
        <Image source={profilePic} style={styles.avatarImage} />
      </TouchableOpacity>
      {/* Add Post Section */}
      <TouchableOpacity style={styles.postSection} activeOpacity={0.5}>
        <Animated.View style={styles.addPostContainer}>
          <Animated.View style={[styles.textContainer, textStyle]}>
            <Text style={styles.text}>{currentText}</Text>
          </Animated.View>
          <Animated.View style={styles.featherContainer}>
            <Feather name="plus" size={15} color="grey" />
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
      {/* Message Icon */}
      <TouchableOpacity style={styles.messageIconContainer}>
        <MaterialCommunityIcons
          name="message-reply-text-outline"
          size={27.5}
          color="white"
        />
      </TouchableOpacity>
      {/* Profile Drawer */}
      {isProfileDrawerVisible && (
        <ProfileDrawer onClose={() => setProfileDrawerVisible(false)} />
      )}{" "}
      {/* Renamed component */}
    </SafeAreaView>
  );
};

export default HeaderFeed;

// Styles
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    borderBottomColor: "#2F2F2F",
    borderBottomWidth: 0.3,
    alignItems: "center",
    top: Platform.OS === "android" ? 0 : 20,
    width: "100%",
    backgroundColor: "black",
    height: Platform.OS === "android" ? 55 : 65,
    zIndex: 100,
    flexDirection: "row",
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "15%",
  },
  avatarImage: {
    height: 36,
    width: 36,
    borderRadius: 18,
  },
  postSection: {
    width: "72%",
    position: "relative",
  },
  addPostContainer: {
    height: 37,
    marginLeft: "auto",
    marginRight: "auto",
    flexDirection: "row",
    backgroundColor: "#141414",
    justifyContent: "flex-end",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 6,
    overflow: "hidden",
    position: "relative",
  },
  featherContainer: {
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    flexBasis: "auto",
    borderWidth: 2,
    borderColor: "grey",
    borderRadius: 7,
  },
  textContainer: {
    flexBasis: "0%", // animate
  },
  text: {
    color: "grey",
    fontSize: 14,
    fontWeight: "400",
    marginLeft: 6,
  },
  messageIconContainer: {
    width: 42,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 3,
  },
});
