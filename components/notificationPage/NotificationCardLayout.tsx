import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import TextScallingFalse from "../CentralText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import nopic from "@/assets/images/nopic.jpg";
import { formatTimeAgo } from "~/utils/formatTime";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";

const NotificationCardLayout = ({
  type,
  date,
  sender,
  target,
}: {
  type: string;
  date: Date;
  sender: any;
  target: any;
}) => {
  const router = useRouter();
  const userId = useSelector((state: any) => state.profile.user._id);

  const serializedUser = encodeURIComponent(
    JSON.stringify({ id: sender._id, type: sender.type })
  );

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
    <View className="flex-row w-full min-w-[320px] lg:min-w-[400px] max-w-[600px] rounded-lg py-3">
      {/* Profile Image */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          userId === sender._id
            ? router.push("/(app)/(tabs)/profile")
            : router.push(`../(main)/profile/${serializedUser}`)
        }
        className="w-12 h-12 rounded-full justify-center items-center flex-shrink-0"
      >
        <Image
          source={{ uri: sender.profilePic }}
          className="w-10 h-10 rounded-full"
          style={{
            maxWidth: 50,
            maxHeight: 50,
          }}
        />
      </TouchableOpacity>

      {/* Notification Content */}
      <View className="flex-1 pl-3 justify-center">
        {/* Top Section: Notification Text + Options */}
        <View className="flex-row justify-between items-center">
          <TextScallingFalse className="text-white text-lg flex-1">
            {sender.firstName} {sender.lastName}{" "}
            <TextScallingFalse className="font-bold">
              {renderTextsOnTypes(type)}
            </TextScallingFalse>{" "}
            {formatTimeAgo(date)}
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
          <TouchableOpacity
            activeOpacity={0.3}
            onPress={() => router.push("/")}
            className="flex-row mt-1.5 items-center bg-[#121212] rounded-md overflow-hidden w-full"
          >
            {/* Post Image (Now Responsive on Web & Mobile) */}
            {target?.assets?.length > 0 && (
              <Image
                source={{ uri: target.assets[0].url }}
                resizeMode="cover"
                className="rounded-l-md flex-shrink-0"
                style={{
                  width: 50,
                  height: 50,
                  maxWidth: 64,
                  maxHeight: 64,
                }}
              />
            )}

            {/* Text Container (Adjustable Width) */}
            <View className="flex-1 ml-3 p-3">
              <Text
                className="text-[#808080] text-sm"
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                "{target?.caption}"
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default NotificationCardLayout;
