import { View, TouchableOpacity, Platform } from "react-native";
import React from "react";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import TextScallingFalse from "../CentralText";
import PostButton from "../PostButton";
import { useRouter } from "expo-router";
import { useDrawer } from "~/context/DrawerContext";
import { useBottomSheet } from "~/context/BottomSheetContext";

const Header = ({
  username,
  isBackButtonVisible,
  handlePostContainerOpen,
}: {
  username: string;
  isBackButtonVisible: boolean;
  handlePostContainerOpen?: () => void;
}) => {
  const router = useRouter();

    const { handleOpenDrawer } = useDrawer();
    const heightValue = Platform.OS === "ios" ? "27%" : "22%";
    const { openBottomSheet } = useBottomSheet();
  
    // Define the content separately
    const messagingBottomSheetConfig = {
      isVisible: true,
      content: (
        <View style={{ paddingVertical: 15, paddingHorizontal: 20 }}>
          <TextScallingFalse style={{ color: "white", fontSize: 20, fontWeight: 'bold' }}>
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
            We're currently working on bringing messaging to our platform. Stay tuned chatting with teammates and friends will be available in a future update!
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
    <View className="flex-row justify-between items-center h-[45px] px-3">
      <View className="flex-row">
        {/* back to home button */}
        {isBackButtonVisible && (
          <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 20, right: 24 }} activeOpacity={0.5} onPress={() => router.back()}>
            <Feather name="chevron-left" size={28} color="white" />
          </TouchableOpacity>
        )}
        {/* username */}
        <TextScallingFalse
          style={{
            color: "white",
            fontSize: 19,
            marginLeft: 10,
          }}
        >
          @{username}
        </TextScallingFalse>
      </View>
      {/* add post button and message button */}
      {!isBackButtonVisible && (
        <View className="flex-row gap-x-3">
          <PostButton onPress={handlePostContainerOpen} />
          <TouchableOpacity activeOpacity={0.5} onPress={() => openBottomSheet(messagingBottomSheetConfig)}>
            <MaterialCommunityIcons
              name="message-reply-text-outline"
              size={27}
              color="white"
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Header;
