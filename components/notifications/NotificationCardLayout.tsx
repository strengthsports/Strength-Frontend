import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import TextScallingFalse from "../CentralText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import nopic from "@/assets/images/nopic.jpg";

const NotificationCardLayout = ({
  type,
  date,
  user,
}: {
  type: string;
  date: string;
  user: string;
}) => {
  const renderTextsOnTypes = (type: string) => {
    switch (type) {
      case "Like":
        return "liked your post";
      case "Comment":
        return "commented on your post";
      case "Follow":
        return "started following you";
      case "TeamInvitation":
        return "is inviting you to join";
      case "JoinTeamRequest":
        return "is requesting to join team";
      case "Report":
        return "You are reported";
      default:
        return "";
    }
  };

  return (
    <View className="flex-row w-full min-w-[320px] lg:min-w-[400px] max-w-[600px] rounded-lg p-3">
      {/* Profile Image */}
      <View className="w-12 h-12 rounded-full justify-center items-center flex-shrink-0">
        <Image
          source={nopic}
          className="w-10 h-10 rounded-full"
          style={{
            maxWidth: 50,
            maxHeight: 50,
          }}
        />
      </View>

      {/* Notification Content */}
      <View className="flex-1 pl-3 justify-center">
        {/* Top Section: Notification Text + Options */}
        <View className="flex-row justify-between items-center">
          <TextScallingFalse className="text-white text-lg flex-1">
            {user}{" "}
            <TextScallingFalse className="font-bold">
              {renderTextsOnTypes(type)}
            </TextScallingFalse>{" "}
            {date}
          </TextScallingFalse>
          {type !== "Follow" ? (
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={18}
              color="#808080"
            />
          ) : (
            <TouchableOpacity className="px-3 py-1 rounded-md bg-[#12956B]">
              <TextScallingFalse className="text-white text-base">
                Follow
              </TextScallingFalse>
            </TouchableOpacity>
          )}
        </View>

        {/* Post Preview (For Like, Comment, JoinTeamRequest, TeamInvitation) */}
        {["Like", "Comment", "JoinTeamRequest", "TeamInvitation"].includes(
          type
        ) && (
          <View className="flex-row mt-1.5 items-center bg-[#121212] rounded-md overflow-hidden w-full">
            {/* Post Image (Now Responsive on Web & Mobile) */}
            <Image
              source={nopic}
              resizeMode="cover"
              className="rounded-md flex-shrink-0"
              style={{
                width: 50,
                height: 50,
                maxWidth: 64,
                maxHeight: 64,
              }}
            />

            {/* Text Container (Adjustable Width) */}
            <View className="flex-1 ml-3 p-3">
              <Text
                className="text-[#808080] text-sm"
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                "Hello, this is a sample post text that can easily be up to
                fifteen words long without breaking UI."
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default NotificationCardLayout;
