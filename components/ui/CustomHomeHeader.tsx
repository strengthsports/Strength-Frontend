import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useMemo } from "react";
import { Image } from "react-native";
import AnimatedAddPostBar from "../feedPage/AnimatedAddPostBar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import defaultPic from "../../assets/images/nopic.jpg";
import { useDrawer } from "~/context/DrawerContext";
import AddPostContainer from "../modals/AddPostContainer";

const HEADER_HEIGHT = 60;

const CustomHomeHeader = () => {
  const { user } = useSelector((state: any) => state?.profile);
  const { isAddPostContainerOpen } = useSelector((state: any) => state?.post);
  const possibleMessages = [
    "What's going on...",
    "What's on your mind...",
    "Share your sports moment...",
  ];

  const [message, setMessage] = React.useState(possibleMessages[0]); // Set default message

  React.useEffect(() => {
    const randomIndex = Math.floor(Math.random() * possibleMessages.length);
    setMessage(possibleMessages[randomIndex]);
  }, []);

  // Memoized AnimatedAddPostBar to avoid unnecessary re-renders
  const memoizedAddPostBar = useMemo(() => {
    return <AnimatedAddPostBar suggestionText={message} />;
  }, [message]);

  // Get the shared scrollY animated value
  // const { scrollY } = useScroll();

  // Clamp the scroll value between 0 and HEADER_HEIGHT.
  // const clampedScrollY = Animated.diffClamp(scrollY, 0, HEADER_HEIGHT);

  // Interpolate to get a translateY value that moves the header up as you scroll down.
  // const headerTranslateY = clampedScrollY.interpolate({
  //   inputRange: [0, HEADER_HEIGHT],
  //   outputRange: [0, -HEADER_HEIGHT],
  //   extrapolate: "clamp",
  // });

  const { handleOpenDrawer } = useDrawer();

  return (
    <>
      <View style={[styles.headerContainer]}>
        {/* Avatar Profile Picture */}
        <TouchableOpacity onPress={handleOpenDrawer}>
          <Image
            source={user?.profilePic ? { uri: user?.profilePic } : defaultPic}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              borderColor: "#2F2F2F",
              borderWidth: 1,
            }}
          />
        </TouchableOpacity>

        {/* Add Post Section */}
        <View style={{ flex: 1 }}>{memoizedAddPostBar}</View>

        {/* Message Icon */}
        <TouchableOpacity>
          <MaterialCommunityIcons
            name="message-reply-text-outline"
            size={27.5}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {/* Add Post container modal */}
      <AddPostContainer
        text={message}
        isAddPostContainerOpen={isAddPostContainerOpen}
      />
    </>
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
