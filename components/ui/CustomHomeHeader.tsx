import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useMemo } from "react";
import { Image } from "expo-image";
import AnimatedAddPostBar from "../feedPage/AnimatedAddPostBar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProfile } from "~/reduxStore/slices/user/profileSlice";
import defaultPic from "../../assets/images/nopic.jpg";
import { useDrawer } from "~/context/DrawerContext";
import AddPostContainer from "../modals/AddPostContainer";
import { useBottomSheet } from "~/context/BottomSheetContext";
import TextScallingFalse from "../CentralText";
import { useNavigation } from "@react-navigation/native";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import MessageIcon from "../SvgIcons/TopBar/MessageIcon";

const HEADER_HEIGHT = 60;

const CustomHomeHeader = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state?.profile);
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { handleOpenDrawer: openCustomDrawer } = useDrawer();
  const possibleMessages = [
    "What's going on...",
    "What's on your mind...",
    "Share your sports moment...",
  ];

  const [message, setMessage] = React.useState(possibleMessages[0]); // Set default message
  const { openBottomSheet } = useBottomSheet(); // get function from context

  React.useEffect(() => {
    const randomIndex = Math.floor(Math.random() * possibleMessages.length);
    setMessage(possibleMessages[randomIndex]);
  }, []);

  // Memoized AnimatedAddPostBar to avoid unnecessary re-renders
  const memoizedAddPostBar = useMemo(() => {
    return <AnimatedAddPostBar suggestionText={message} />;
  }, [message]);

  // const { handleOpenDrawer } = useDrawer();
  const handleOpenDrawer = () => {
    // Refresh profile data
    if (user?._id) {
      console.log("Refreshing profile data ........");
      dispatch(
        fetchMyProfile({
          targetUserId: user._id,
          targetUserType: "User",
        })
      ).then(() => {
        console.log("Refreshed......");
        // Open drawer after profile is updated
        navigation.openDrawer();
        // console.log("Drawer opend---------");
        openCustomDrawer(); // If you need both
        console.log("Drawer opend---------");
      });
    } else {
      navigation.openDrawer();
      openCustomDrawer();
    }
  };
  console.log(
    "User profile on Header bar ------------>",
    JSON.stringify(user.createdTeams, null, 2),
    "UPDATED TEAMS LIST ----->"
  );

  const heightValue = Platform.OS === "ios" ? "28%" : "25%";

  // Define the content separately
  const messagingBottomSheetConfig = {
    isVisible: true,
    content: (
      <View style={{ paddingVertical: 15, paddingHorizontal: 20 }}>
        <TextScallingFalse
          style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
        >
          Messaging Coming Soon
        </TextScallingFalse>
        <TextScallingFalse
          style={{
            color: "gray",
            fontSize: 15,
            fontWeight: "400",
            paddingVertical: 10,
            lineHeight: 20,
          }}
        >
          We're currently working on bringing messaging to our platform. Stay
          tuned chatting with teammates and friends will be available in a
          future update!
        </TextScallingFalse>
      </View>
    ),
    height: heightValue,
    maxHeight: heightValue,
    bgcolor: "#151515",
    border: false,
    draggableDirection: "down",
  };

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
              borderColor: "#252525",
              borderWidth: 1,
            }}
          />
        </TouchableOpacity>

        {/* Add Post Section */}
        <View style={{ flex: 1 }}>{memoizedAddPostBar}</View>

        {/* Message Icon */}
        <TouchableOpacity
          onPress={() => openBottomSheet(messagingBottomSheetConfig)}
        >
          {/* <MaterialCommunityIcons
            name="message-reply-text-outline"
            size={27.5}
            color="white"
          /> */}
          <MessageIcon />
        </TouchableOpacity>
      </View>
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
