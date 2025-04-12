import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import React, { useState , useCallback, useMemo } from "react";
import { Dialog, Portal, Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { getToken } from "~/utils/secureStore";
import nopic from "@/assets/images/nopic.jpg";
import { formatTimeAgo } from "~/utils/formatTime";
import { RelativePathString, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import TextScallingFalse from "../CentralText";
import { NotificationType } from "~/types/others";

type NotificationCardProps = {
  type: NotificationType;
  date?: Date;
  sender: any;
  target: any;
  isNew: boolean;
  count?: number;
};

// Static configuration objects
const NOTIFICATION_TEXTS: Record<NotificationType, string> = {
  Like: "liked your post",
  Comment: "commented on your post",
  Follow: "started following you",
  TeamInvitation: "is inviting you to join",
  JoinTeamRequest: "is requesting to join team",
  Report: "You are reported",
  Tag: "tagged you",
};

const POST_PREVIEW_TYPES = new Set([
  "Like",
  "Comment",
  "JoinTeamRequest",
  "TeamInvitation",
]);

const NotificationCardLayout = React.memo(
  ({ type, date, sender, target, isNew, count }: NotificationCardProps) => {
    const router = useRouter();
    const userId = useSelector((state: any) => state.profile.user._id);

    // Memoized values
    const serializedUser = useMemo(
      () =>
        encodeURIComponent(
          JSON.stringify({ id: sender._id, type: sender.type })
        ),
      [sender._id, sender.type]
    );

    const profileImageSource = useMemo(
      () => (sender.profilePic ? { uri: sender.profilePic } : nopic),
      [sender.profilePic]
    );

    const timeAgo = useMemo(() => (date ? formatTimeAgo(date) : ""), [date]);

    const hasPostPreview = useMemo(() => POST_PREVIEW_TYPES.has(type), [type]);

    // Handlers
    const handleProfilePress = useCallback(() => {
      const route =
        userId === sender._id
          ? "/(app)/(tabs)/profile"
          : `../(profile)/profile/${serializedUser}`;
      router.push(route as RelativePathString);
    }, [userId, sender._id, serializedUser]);

    const handlePostPress = useCallback(() => {
      router.push(`/(app)/(post)/(modal)/post-details/${target._id}`);
    }, [target?._id]);

    // Rendered components
    const OptionsButton = useMemo(
      () =>
        type === "Follow" ? (
          <TouchableOpacity
            className="px-3 py-1 rounded-md bg-[#12956B]"
            activeOpacity={0.7}
          >
            <TextScallingFalse className="text-white text-base">
              Follow
            </TextScallingFalse>
          </TouchableOpacity>
        ) : (
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={18}
            color="#808080"
          />
        ),
      [type]
    );

    const PostPreview = useMemo(
      () =>
        hasPostPreview && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handlePostPress}
            className="flex-row mt-1.5 items-center h-auto bg-[#121212] rounded-lg overflow-hidden w-full"
          >
            {target?.assets?.length > 0 && (
              <Image
                source={{ uri: target.assets[0].url }}
                resizeMode="cover"
                className="rounded-l-lg flex-shrink-0"
                style={postStyle}
              />
            )}
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
        ),
      [hasPostPreview, target, handlePostPress]
    );

    return (
      <View style={{ backgroundColor: isNew ? "rgba(29, 155, 240, 0.1)" : "" }}>
        <View className="flex-row w-full min-w-[320px] lg:min-w-[400px] max-w-[600px] rounded-lg py-3">
          <ProfileImage
            source={profileImageSource}
            onPress={handleProfilePress}
          />

          <View className="flex-1 pl-3 justify-center">
            <View className="flex-row justify-between items-center">
              <NotificationText
                sender={sender}
                count={count}
                typeText={NOTIFICATION_TEXTS[type]}
                timeAgo={timeAgo}
              />
              {OptionsButton}
            </View>
            {PostPreview}
          </View>
        </View>
      </View>
    );
  }
);

// Sub-components for better readability and reusability
const ProfileImage = React.memo(
  ({ source, onPress }: { source: any; onPress: () => void }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="w-12 h-12 rounded-full justify-center items-center flex-shrink-0"
    >
      <Image source={source} className="w-10 h-10 rounded-full" />
    </TouchableOpacity>
  )
);

const NotificationText = React.memo(
  ({
    sender,
    count,
    typeText,
    timeAgo,
  }: {
    sender: any;
    count?: number;
    typeText: string;
    timeAgo: string;
  }) => {
    const countText = useMemo(() => {
      if (!count || count < 2) return " ";
      return count <= 2 ? ` and ${count - 1} other ` : ` and ${count} others `;
    }, [count]);

    return (
      <TextScallingFalse className="text-white text-lg font-light flex-1">
        {sender.firstName} {sender.lastName}
        {countText}
        <TextScallingFalse className="font-bold">
          {typeText}
        </TextScallingFalse>{" "}
        {timeAgo}
      </TextScallingFalse>
    );
  }
);

// Static styles
const postStyle = {
  width: 70,
  height: 70,
  maxWidth: 90,
  maxHeight: 90,
};

export default NotificationCardLayout;