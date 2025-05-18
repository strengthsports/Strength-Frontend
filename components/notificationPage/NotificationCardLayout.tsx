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
import renderCaptionWithTags from "~/utils/renderCaptionWithTags";
import TickIcon from "../SvgIcons/Common_Icons/TickIcon";

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
          <>
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
              image={target.assets?.length > 0 && target.assets[0].url}
              comment={comment}
              handlePostPress={handlePostPress}
            />
          </>
        );
      }

      if (type === "Like" && target.type === "Post") {
        return (
          <>
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
              image={target.assets?.length > 0 && target.assets[0].url}
              handlePostPress={handlePostPress}
            />
          </>
          // </View>
          // </View>
        );
      }

      if (type === "Comment" && target.type === "Comment") {
        return (
          <>
            <NotificationHeader
              sender={sender}
              type="Reply"
              timeAgo={timeAgo}
              count={count}
              isNew={isNew}
            />

            {/* Comment preview */}
            {/* Post preview */}
            <PostPreview
              caption={target.caption}
              image={target.assets?.length > 0 && target.assets[0].url}
              comment={comment}
              handlePostPress={handlePostPress}
            />
          </>
        );
      }

      if (type === "Follow") {
        return (
          <>
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
          </>
        );
      }

      if (type === "TeamPromotion") {
        return (
          <>
            <NotificationHeader
              sender={sender}
              type={type}
              timeAgo={timeAgo}
              isNew={isNew}
              customText={`promoted you as the `}
              teamName={target.name}
              // role={role}
            />
          </>
        );
      }

      if (type === "TeamInvitation") {
        return (
          <>
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
          </>
        );
      }

      if (type === "Tag") {
        return (
          <>
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
              image={target.assets?.length > 0 && target.assets[0].url}
              handlePostPress={handlePostPress}
            />
          </>
        );
      }

      // Default rendering
      return (
        <NotificationHeader
          sender={sender}
          type={type}
          timeAgo={timeAgo}
          isNew={isNew}
          count={count}
        />
      );
    };

    return (
      <View className={`py-3 px-3 h-fit ${isNew && "bg-[#181818]"}`}>
        <View className="flex-row h-fit gap-x-3">
          {/* Profile Image */}
          <TouchableOpacity onPress={handleProfilePress} activeOpacity={0.7}>
            <Image
              source={profileImageSource}
              className="rounded-full"
              style={{
                borderWidth: 1,
                borderColor: "#1c1c1c",
                width: 38,
                height: 38,
              }}
            />
          </TouchableOpacity>
          <View
            className="flex-1 flex-col"
            // style={{ backgroundColor: "yellow" }}
          >
            {renderNotificationContent()}
          </View>
        </View>
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
    <View className="mt-1">
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
      className={`mt-2 overflow-hidden ${
        comment ? "rounded-[10px] border border-b-0" : "rounded-xl"
      }`}
      style={{ borderColor: comment ? "#262626" : "transparent", width: "86%" }}
    >
      {comment && (
        <View className="p-3">
          <TextScallingFalse className="text-white text-xl" numberOfLines={1}>
            {comment}
          </TextScallingFalse>
        </View>
      )}
      <View
        className="flex-row items-center bg-[#262626]"
        style={{ paddingHorizontal: 9, paddingVertical: 7, columnGap: 16 }}
      >
        {image && (
          <Image
            source={{ uri: image }}
            className="rounded-sm"
            style={{ width: comment ? 42 : 50, height: comment ? 42 : 50 }}
          />
        )}
        <View className="flex-1" style={{ padding: image ? 0 : 5 }}>
          <TextScallingFalse
            style={{ color: "#AEAEAE", fontSize: 12, lineHeight: 17 }}
            numberOfLines={2}
          >
            {renderCaptionWithTags(caption, "#AEAEAE", 12)}
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
  }) => {
    const [isAccepted, setIsAccepted] = useState(false);
    const [isDeclined, setIsDeclined] = useState(false);

    return (
      <View
        className={`mt-2 overflow-hidden rounded-xl`}
        style={{ width: "86%" }}
      >
        <View className="flex-row bg-[#262626] justify-between items-center">
          {image && (
            <Image
              source={{ uri: image }}
              style={{
                width: 64,
                height: 64,
                borderWidth: 1,
                borderColor: "#262626",
              }}
            />
          )}
          <View className="flex-row items-center justify-center gap-x-5 flex-1">
            {!isAccepted && (
              <TouchableOpacity
                className="bg-transparent self-start px-4 justify-center rounded-lg border"
                style={{ height: 32, borderColor: "#646464" }}
                onPress={() => {
                  setIsDeclined(true);
                  handleDecline();
                }}
              >
                <TextScallingFalse
                  className="font-medium text-[12px]"
                  style={{ color: "#DFDFDF" }}
                >
                  {isDeclined ? "Declined" : "Decline"}
                </TextScallingFalse>
              </TouchableOpacity>
            )}
            {!isDeclined && (
              <TouchableOpacity
                className="bg-theme self-start px-4 justify-center rounded-lg border-theme"
                style={{ height: 32 }}
                onPress={() => {
                  setIsAccepted(true);
                  handleAccept();
                }}
              >
                <TextScallingFalse className="text-white font-medium text-[12px]">
                  {isAccepted ? (
                    <>
                      <TickIcon /> Accepted
                    </>
                  ) : (
                    "Accept"
                  )}
                </TextScallingFalse>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  }
);

export default NotificationCardLayout;
