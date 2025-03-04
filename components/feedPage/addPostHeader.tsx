import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import TextScallingFalse from "~/components/CentralText";
import { useSelector } from "react-redux";
import defaultPic from "../../assets/images/nopic.jpg";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddPostHeader({
  onBackPress,
}: {
  onBackPress: () => void;
}) {
  const { user } = useSelector((state: any) => state?.profile);

  return (
    <SafeAreaView className="flex flex-row items-center gap-4">
      <TouchableOpacity onPress={onBackPress}>
        <MaterialCommunityIcons
          name="keyboard-backspace"
          size={24}
          color="white"
        />
      </TouchableOpacity>
      <Image
        source={user?.profilePic ? { uri: user?.profilePic } : defaultPic}
        style={{ width: 40, height: 40, borderRadius: 20 }}
      />
      <TextScallingFalse className="text-white text-3xl">
        {user?.firstName} {user?.lastName}
      </TextScallingFalse>
    </SafeAreaView>
  );
}
