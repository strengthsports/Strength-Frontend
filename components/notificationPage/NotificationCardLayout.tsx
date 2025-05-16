import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState, useCallback, useMemo } from "react";
import nopic from "@/assets/images/nopic.jpg";
import { formatShortTimeAgo } from "~/utils/formatTime";
import { RelativePathString, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import TextScallingFalse from "../CentralText";
import { NotificationType } from "~/types/others";
import { AppDispatch } from "~/reduxStore";
import {
  acceptTeamInvitation,
  rejectTeamInvitation,
} from "~/reduxStore/slices/team/teamSlice";

type NotificationCardProps = {
  _id?: string;
  type: NotificationType;
  date?: Date;
  sender: any;
  target: any;
  isNew: boolean;
  count?: number;
  [key: string]: any;
};

// Static configuration objects
const NOTIFICATION_TEXTS: Record<NotificationType, string> = {
  Like: "liked your post",
  Comment: "commented on your post",
  Reply: "replied to your comment",
  Follow: "started following you",
  TeamInvitation: "is inviting you to join team - ",
  TeamPromotion: "promoted you as the",
  JoinTeamRequest: "has requested to join team - ",
  Report: "You are reported",
  Tag: "tagged you",
};

const NotificationCardLayout = React.memo(
  ({
    _id,
    type,
    date,
    sender,
    target,
    isNew,
    count,
    comment,
  }: NotificationCardProps) => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const userId = useSelector((state: any) => state.profile.user._id);

    // Memoized values
    const serializedUser = useMemo(
      () =>
        encodeURIComponent(
          JSON.stringify({ id: sender._id, type: sender.type })
        ),
      [sender._id, sender.type]
    );

    // Profile pic
    const profileImageSource = useMemo(
      () => (sender.profilePic ? { uri: sender.profilePic } : nopic),
      [sender.profilePic]
    );

    const timeAgo = formatShortTimeAgo
      ? formatShortTimeAgo(date)
      : date
      ? "10h"
      : "";

    // Handlers
    const handleProfilePress = useCallback(() => {
      const route =
        userId === sender._id
          ? "/(app)/(tabs)/profile"
          : `../(profile)/profile/${serializedUser}`;
      router.push(route as RelativePathString);
    }, [userId, sender._id, serializedUser]);

    const handlePostPress = useCallback(() => {
      router.push(`/post-details/${target._id}`);
    }, [target?._id]);

    const handleAcceptTeamInvitaion = useCallback(() => {
      dispatch(
        acceptTeamInvitation({
          teamId: target._id,
          notificationId: _id as string,
          senderId: sender._id,
          userId: userId,
        })
      );
    }, [dispatch]);

    const handleRejectTeamInvitaion = useCallback(() => {
      dispatch(
        rejectTeamInvitation({ notificationId: _id as string, userId: userId })
      );
    }, [dispatch]);

    // Custom rendering for different notification types
    const renderNotificationContent = () => {
      if (type === "Comment" && target.type === "Post") {
        return (
          <View className="flex-row">
            {/* Profile Image */}
            <TouchableOpacity onPress={handleProfilePress} activeOpacity={0.7}>
              <Image
                source={profileImageSource}
                className="w-10 h-10 rounded-full"
              />
            </TouchableOpacity>
            <View className="flex-1">
              <NotificationHeader
                sender={sender}
                type={type}
                timeAgo={timeAgo}
                count={count}
                isNew={isNew}
              />

              {/* Comment preview */}
              {/* Post preview */}
              <PostPreview
                caption={target.caption}
                image={target.assets.length > 0 && target.assets[0].url}
                comment={comment}
                handlePostPress={handlePostPress}
              />
            </View>
          </View>
        );
      }

      if (type === "Like" && target.type === "Post") {
        return (
          <View className="flex-row">
            {/* Profile Image */}
            <TouchableOpacity onPress={handleProfilePress} activeOpacity={0.7}>
              <Image
                source={profileImageSource}
                className="w-10 h-10 rounded-full"
              />
            </TouchableOpacity>
            <View className="flex-1">
              <NotificationHeader
                sender={sender}
                type={type}
                timeAgo={timeAgo}
                count={count}
                isNew={isNew}
              />

              {/* Post preview */}
              <PostPreview
                caption={target.caption}
                image={target.assets.length > 0 && target.assets[0].url}
                handlePostPress={handlePostPress}
              />
            </View>
          </View>
        );
      }

      if (type === "Follow") {
        return (
          <View className="flex-row">
            {/* Profile Image */}
            <TouchableOpacity onPress={handleProfilePress} activeOpacity={0.7}>
              <Image
                source={profileImageSource}
                className="w-10 h-10 rounded-full"
              />
            </TouchableOpacity>
            <View className="flex-1">
              <NotificationHeader
                sender={sender}
                type={type}
                timeAgo={timeAgo}
                isNew={isNew}
              />

              {/* <View className="ml-12 mt-1">
              <TouchableOpacity className="bg-theme px-5 py-1.5 self-start rounded-lg">
                <TextScallingFalse className="text-white font-medium text-2xl">
                  Follow back
                </TextScallingFalse>
              </TouchableOpacity>
            </View> */}
            </View>
          </View>
        );
      }

      if (type === "TeamPromotion") {
        return (
          <View className="flex-row">
            {/* Profile Image */}
            <TouchableOpacity onPress={handleProfilePress} activeOpacity={0.7}>
              <Image
                source={profileImageSource}
                className="w-10 h-10 rounded-full"
              />
            </TouchableOpacity>
            <View className="flex-1">
              <NotificationHeader
                sender={sender}
                type={type}
                timeAgo={timeAgo}
                isNew={isNew}
                customText={`promoted you as the `}
                teamName={target.name}
                // role={role}
              />
            </View>
          </View>
        );
      }

      if (type === "TeamInvitation") {
        return (
          <View className="flex-row">
            {/* Profile Image */}
            <TouchableOpacity onPress={handleProfilePress} activeOpacity={0.7}>
              <Image
                source={profileImageSource}
                className="w-10 h-10 rounded-full"
              />
            </TouchableOpacity>
            <View className="flex-1">
              <NotificationHeader
                sender={sender}
                type={type}
                timeAgo={timeAgo}
                isNew={isNew}
                customText={`is inviting you to join team`}
                teamName={target.name}
                // role={role}
              />
              <TeamPreview
                image={target.logo && target.logo.url}
                handleAccept={handleAcceptTeamInvitaion}
                handleDecline={handleRejectTeamInvitaion}
              />
            </View>
          </View>
        );
      }

      if (type === "Tag") {
        return (
          <View className="flex-row">
            {/* Profile Image */}
            <TouchableOpacity onPress={handleProfilePress} activeOpacity={0.7}>
              <Image
                source={profileImageSource}
                className="w-10 h-10 rounded-full"
              />
            </TouchableOpacity>
            <View className="flex-1">
              <NotificationHeader
                sender={sender}
                type={type}
                timeAgo={timeAgo}
                count={count}
                isNew={isNew}
              />

              {/* Post preview */}
              <PostPreview
                caption={target.caption}
                image={target.assets.length > 0 && target.assets[0].url}
                handlePostPress={handlePostPress}
              />
            </View>
          </View>
        );
      }

      // Default rendering
      return (
        <View className="flex-row">
          {/* Profile Image */}
          <TouchableOpacity onPress={handleProfilePress} activeOpacity={0.7}>
            <Image
              source={profileImageSource}
              className="w-10 h-10 rounded-full"
            />
          </TouchableOpacity>
          <View className="flex-1">
            <NotificationHeader
              sender={sender}
              type={type}
              timeAgo={timeAgo}
              isNew={isNew}
              count={count}
            />
          </View>
        </View>
      );
    };

    return (
      <View className={`py-3 px-6 ${isNew && "bg-[#181818]"}`}>
        {renderNotificationContent()}
      </View>
    );
  }
);

// Notification header with profile image, text and indicator
const NotificationHeader = ({
  sender,
  type,
  timeAgo,
  count,
  isNew,
  customText,
  teamName,
  role,
}: any) => {
  // Format count text
  const countText = count > 1 ? ` and ${count - 1} other` : "";

  // Get notification text based on type or use custom text
  const actionText = customText || NOTIFICATION_TEXTS[type] || "";

  return (
    <View className="flex-1 ml-4 mb-1">
      <View className="flex-row justify-between">
        <View className="flex-row flex-wrap pr-6">
          <TextScallingFalse className="text-white text-xl">
            <TextScallingFalse className="font-bold">
              {sender.firstName} {sender.lastName}
            </TextScallingFalse>
            {countText} {actionText}
            {role && (
              <TextScallingFalse className="text-[#35A700] font-bold">
                {" "}
                {role}{" "}
              </TextScallingFalse>
            )}
            {teamName && (
              <TextScallingFalse className="font-bold">
                {" "}
                "{teamName}"{" "}
              </TextScallingFalse>
            )}
            {role && type === "TeamInvitation" && (
              <TextScallingFalse> as a </TextScallingFalse>
            )}
            {role && type === "TeamInvitation" && (
              <TextScallingFalse className="font-bold">
                "{role}"
              </TextScallingFalse>
            )}
            <TextScallingFalse>.</TextScallingFalse>
            <TextScallingFalse className="text-zinc-500 font-medium">
              {" "}
              {timeAgo}
            </TextScallingFalse>
          </TextScallingFalse>
        </View>

        {/* New notification indicator */}
        {isNew && <View className="w-2 h-2 rounded-full bg-green-500 mt-2" />}
      </View>
    </View>
  );
};

// Post View
const PostPreview = React.memo(
  ({
    image,
    caption,
    comment,
    handlePostPress,
  }: {
    image?: string;
    caption: string;
    comment?: string;
    handlePostPress?: () => void;
  }) => (
    <TouchableOpacity
      onPress={handlePostPress}
      activeOpacity={0.7}
      className={`ml-4 mt-1 overflow-hidden ${
        comment ? "rounded-2xl border border-b-0" : "rounded-xl"
      }`}
      style={{ borderColor: comment ? "#262626" : "transparent" }}
    >
      {comment && (
        <View className="p-3">
          <TextScallingFalse className="text-white text-xl" numberOfLines={1}>
            {comment}
          </TextScallingFalse>
        </View>
      )}
      <View className="flex-row bg-[#262626] p-3">
        {image && (
          <Image source={{ uri: image }} className="w-16 h-16 rounded-lg" />
        )}
        <View className="p-3 flex-1">
          <TextScallingFalse
            style={{ color: "#AEAEAE", fontSize: 12 }}
            numberOfLines={2}
          >
            {caption}
          </TextScallingFalse>
        </View>
      </View>
    </TouchableOpacity>
  )
);

// Team view
const TeamPreview = React.memo(
  ({
    image,
    handleDecline,
    handleAccept,
  }: {
    image?: string;
    handleDecline: () => void;
    handleAccept: () => void;
  }) => (
    <View className={`ml-12 mt-1 overflow-hidden rounded-xl`}>
      <View className="flex-row bg-[#262626] justify-between items-center">
        {image && <Image source={{ uri: image }} className="w-20 h-20" />}
        <View className="flex-row items-center justify-center gap-x-3 flex-1">
          <TouchableOpacity
            className="bg-transparent px-5 py-1.5 self-start rounded-lg border border-white"
            onPress={handleDecline}
          >
            <TextScallingFalse className="text-white font-medium text-2xl">
              Decline
            </TextScallingFalse>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-theme px-5 py-1.5 self-start rounded-lg border border-theme"
            onPress={handleAccept}
          >
            <TextScallingFalse className="text-white font-medium text-2xl">
              Accept
            </TextScallingFalse>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
);

export default NotificationCardLayout;
