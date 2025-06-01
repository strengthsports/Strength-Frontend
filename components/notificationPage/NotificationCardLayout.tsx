import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState, useCallback, useMemo } from "react";
import nopic from "@/assets/images/nopic.jpg";
import nothumbnail from "@/assets/images/nothumbnail.png";
import { formatShortTimeAgo } from "~/utils/formatTime";
import { RelativePathString, router, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import TextScallingFalse from "../CentralText";
import { NotificationType } from "~/types/others";
import { AppDispatch } from "~/reduxStore";
import {
  acceptJoinRequest,
  acceptTeamInvitation,
  rejectJoinRequest,
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
  TeamInvitationAccepted: "has accepted your invitation to join team - ",
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
    handleMarkNotificationVisited,
  }: NotificationCardProps) => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const userId = useSelector((state: any) => state.profile.user._id);

    let targetImage: any;
    let nonImagePost: boolean;
    if (target.isVideo) {
      targetImage = target.thumbnail?.url || null;
    } else if (target.assets?.length > 0) {
      targetImage = target.assets[0].url;
    } else {
      nonImagePost = true;
    }

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
      handleMarkNotificationVisited(_id);
    }, [userId, sender._id, serializedUser]);

    const handlePostPress = useCallback(() => {
      router.push(`/post-details/${target._id}`);
      handleMarkNotificationVisited(_id);
    }, [target?._id]);

    const handleTeamPress = useCallback(() => {
      router.push(`/teams/${target._id}`);
      handleMarkNotificationVisited(_id);
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

    const handleAcceptRequest = useCallback(() => {
      dispatch(
        acceptJoinRequest({
          senderId: sender._id,
          teamId: target._id,
          notificationId: _id as string,
        })
      )
        .unwrap()
        .then((response) => {
          // Now properly accessing the response data
          console.log("Join request accepted:", response.message);
          // You might want to update UI or show a success message here
        })
        .catch((error) => {
          console.error("Failed to accept join request:", error);
          // Show error message to user
        });
    }, [dispatch, sender._id, target._id, _id]);

    const handleRejectRequest = useCallback(() => {
      dispatch(
        rejectJoinRequest({
          notificationId: _id as string,
          userId: userId,
        })
      )
        .unwrap()
        .then(() => {
          // Optional: Show success message or update UI
        })
        .catch((error) => {
          // Optional: Show error message
          console.error("Failed to reject join request:", error);
        });
    }, [dispatch, _id, userId]);

    // Custom rendering for different notification types
    const renderNotificationContent = () => {
      if (type === "Comment" && target.type === "Post") {
        return (
          <>
            <NotificationHeader
              _id={_id}
              sender={sender}
              type={type}
              timeAgo={timeAgo}
              count={count}
              isNew={isNew}
              handleMarkNotificationVisited={handleMarkNotificationVisited}
            />

            {/* Comment preview */}
            {/* Post preview */}
            <PostPreview
              caption={target.caption}
              nonImagePost={nonImagePost}
              image={targetImage}
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
              _id={_id}
              sender={sender}
              type={type}
              timeAgo={timeAgo}
              count={count}
              isNew={isNew}
              handleMarkNotificationVisited={handleMarkNotificationVisited}
            />

            {/* Post preview */}
            <PostPreview
              caption={target.caption}
              image={targetImage}
              nonImagePost={nonImagePost}
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
              _id={_id}
              sender={sender}
              type="Reply"
              timeAgo={timeAgo}
              count={count}
              isNew={isNew}
              handleMarkNotificationVisited={handleMarkNotificationVisited}
            />

            {/* Comment preview */}
            {/* Post preview */}
            <PostPreview
              caption={target.caption}
              image={targetImage}
              nonImagePost={nonImagePost}
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
              _id={_id}
              sender={sender}
              type={type}
              timeAgo={timeAgo}
              isNew={isNew}
              handleMarkNotificationVisited={handleMarkNotificationVisited}
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
              _id={_id}
              sender={sender}
              type={type}
              timeAgo={timeAgo}
              isNew={isNew}
              customText={`promoted you as the `}
              teamName={target.name}
              handleMarkNotificationVisited={handleMarkNotificationVisited}
              // role={role}
            />
          </>
        );
      }

      if (type === "TeamInvitation") {
        return (
          <>
            <NotificationHeader
              _id={_id}
              sender={sender}
              type={type}
              timeAgo={timeAgo}
              isNew={isNew}
              customText={`is inviting you to join team`}
              teamName={target.name}
              handleMarkNotificationVisited={handleMarkNotificationVisited}
              // role={role}
            />
            <TeamPreview
              image={target.logo && target.logo.url}
              handleTeamPress={handleTeamPress}
              handleAccept={handleAcceptTeamInvitaion}
              handleDecline={handleRejectTeamInvitaion}
            />
          </>
        );
      }

      if (type === "JoinTeamRequest") {
        return (
          <>
            <NotificationHeader
              _id={_id}
              sender={sender}
              type={type}
              timeAgo={timeAgo}
              isNew={isNew}
              teamName={target.name}
              handleMarkNotificationVisited={handleMarkNotificationVisited}
              // role={role}
            />
            <TeamPreview
              image={target.logo && target.logo.url}
              handleTeamPress={handleTeamPress}
              handleAccept={handleAcceptRequest}
              handleDecline={handleRejectRequest}
            />
          </>
        );
      }
      // Add this case in the renderNotificationContent() function
      if (type === "TeamInvitationAccepted") {
        return (
          <>
            <NotificationHeader
              _id={_id}
              sender={sender}
              type={type}
              timeAgo={timeAgo}
              isNew={isNew}
              customText={`has accepted your invitation to join team`}
              teamName={target.name}
              role={roleInTeam}
              handleMarkNotificationVisited={handleMarkNotificationVisited}
            />
            <TeamPreview
              image={target.logo?.url}
              handleTeamPress={handleTeamPress}
              isAcceptedRequest={true}
            />
          </>
        );
      }

      if (type === "Tag") {
        return (
          <>
            <NotificationHeader
              _id={_id}
              sender={sender}
              type={type}
              timeAgo={timeAgo}
              count={count}
              isNew={isNew}
              handleMarkNotificationVisited={handleMarkNotificationVisited}
            />

            {/* Post preview */}
            <PostPreview
              caption={target.caption}
              image={targetImage}
              handlePostPress={handlePostPress}
            />
          </>
        );
      }

      // Default rendering
      return (
        <NotificationHeader
          _id={_id}
          sender={sender}
          caption={target.caption}
          type={type}
          timeAgo={timeAgo}
          isNew={isNew}
          count={count}
          handleMarkNotificationVisited={handleMarkNotificationVisited}
        />
      );
    };

    return (
      <View className={`py-3 px-[14px] h-fit ${isNew && "bg-[#181818]"}`}>
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
  _id,
  sender,
  caption,
  type,
  timeAgo,
  count,
  isNew,
  customText,
  teamName,
  role,
  handleMarkNotificationVisited,
}: any) => {
  // Format count text
  const countText = count > 1 ? ` and ${count - 1} other` : "";

  // Memoized values
  const serializedUser = useMemo(
    () =>
      encodeURIComponent(JSON.stringify({ id: sender._id, type: sender.type })),
    [sender._id, sender.type]
  );

  // Get notification text based on type or use custom text
  const actionText = customText || NOTIFICATION_TEXTS[type] || "";
  const userId = useSelector((state: any) => state.profile.user._id);

  // Handlers
  const handleProfilePress = useCallback(() => {
    const route =
      userId === sender._id
        ? "/(app)/(tabs)/profile"
        : `../(profile)/profile/${serializedUser}`;
    router.push(route as RelativePathString);
    handleMarkNotificationVisited(_id);
  }, [userId, sender._id, serializedUser]);

  return (
    <View className="mt-1">
      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={handleProfilePress}
          activeOpacity={0.5}
          className={`flex-row flex-wrap pr-6 ${
            actionText === "started following you" ? "mt-2" : "mt-0"
          }`}
        >
          <TextScallingFalse className="text-white text-xl px-1">
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
        </TouchableOpacity>

        {/* New notification indicator */}
        {isNew && <View className="w-2 h-2 rounded-full bg-green-500 mt-2" />}
      </View>
    </View>
  );
};

// Post View
const PostPreview = React.memo(
  ({
    nonImagePost,
    image,
    caption,
    comment,
    handlePostPress,
  }: {
    nonImagePost: boolean;
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
      style={{ borderColor: comment ? "#262626" : "transparent", width: "90%" }}
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
        {image ? (
          <Image
            source={{ uri: image }}
            className="rounded-sm"
            style={{ width: comment ? 42 : 50, height: comment ? 42 : 50 }}
          />
        ) : (
          !nonImagePost && (
            <Image
              source={nothumbnail}
              className="rounded-sm"
              style={{ width: comment ? 42 : 50, height: comment ? 42 : 50 }}
            />
          )
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
// Update your TeamPreview component to handle loading states
const TeamPreview = React.memo(
  ({
    image,
    handleTeamPress,
    handleDecline,
    handleAccept,
    isAcceptedRequest = false,
  }: {
    image?: string;
    handleTeamPress: () => void;
    handleDecline?: () => void;
    handleAccept?: () => void;
    isAcceptedRequest?: boolean;
  }) => {
    const [isAccepted, setIsAccepted] = useState(false);
    const [isDeclined, setIsDeclined] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAcceptPress = () => {
      setIsProcessing(true);
      handleAccept?.();
      setTimeout(() => {
        setIsAccepted(true);
        setIsProcessing(false);
      }, 500);
    };

    const handleDeclinePress = () => {
      setIsProcessing(true);
      handleDecline?.();
      setTimeout(() => {
        setIsDeclined(true);
        setIsProcessing(false);
      }, 500);
    };

    // For already accepted requests (read-only view)
    if (isAcceptedRequest) {
      return (
        <View className="mt-2" style={{ width: "86%" }}>
          <TouchableOpacity
            onPress={handleTeamPress}
            activeOpacity={0.7}
            className="flex-row bg-[#262626] items-center rounded-xl p-3"
          >
            {image && (
              <Image
                source={{ uri: image }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 8,
                  marginRight: 12,
                }}
              />
            )}
            <View className="flex-1">
              <View className="flex-row items-center">
                <TickIcon />
                <TextScallingFalse className="text-white font-medium text-[14px] ml-2">
                  Membership Accepted
                </TextScallingFalse>
              </View>
              <TextScallingFalse className="text-zinc-400 text-[12px] mt-1">
                Tap to view team
              </TextScallingFalse>
            </View>
          </TouchableOpacity>
        </View>
      );
    }

    // For pending invitations (with action buttons)
    return (
      <View
        className={`mt-2 overflow-hidden rounded-xl`}
        style={{ width: "86%" }}
      >
        <View className="flex-row bg-[#262626] justify-between items-center">
          {image && (
            <TouchableOpacity
              style={{
                width: 64,
                height: 64,
                borderWidth: 1,
                borderColor: "#262626",
              }}
              onPress={handleTeamPress}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: image }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                className="rounded-l-xl"
              />
            </TouchableOpacity>
          )}
          <View className="flex-row items-center justify-center gap-x-5 flex-1">
            {!isAccepted && (
              <TouchableOpacity
                className="bg-transparent self-start px-4 justify-center rounded-lg border"
                style={{
                  height: 32,
                  borderColor: "#646464",
                  opacity: isProcessing ? 0.7 : 1,
                }}
                onPress={handleDeclinePress}
                disabled={isProcessing}
              >
                <TextScallingFalse
                  className="font-medium text-[12px]"
                  style={{ color: "#DFDFDF" }}
                >
                  {isDeclined ? "Declined" : "Decline"}
                </TextScallingFalse>
              </TouchableOpacity>
            )}
            {!isDeclined && isAccepted ? (
              <TouchableOpacity
                className="bg-theme self-start px-4 flex-row justify-center items-center rounded-lg border-theme"
                style={{ height: 32 }}
                disabled
              >
                <TickIcon />
                <TextScallingFalse className="text-white font-medium text-[12px]">
                  Accepted
                </TextScallingFalse>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="bg-theme self-start px-4 justify-center items-center rounded-lg border-theme"
                style={{
                  height: 32,
                  opacity: isProcessing ? 0.7 : 1,
                }}
                onPress={handleAcceptPress}
                disabled={isProcessing}
              >
                <TextScallingFalse className="text-white font-medium text-[12px]">
                  {isProcessing ? "Processing..." : "Accept"}
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
