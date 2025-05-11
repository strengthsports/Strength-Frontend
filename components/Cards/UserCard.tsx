import { useRouter } from "expo-router";
import { Image, TouchableOpacity, View } from "react-native";
import TextScallingFalse from "../CentralText";
import nopic from "@/assets/images/nopic.jpg";
import FollowButton from "../FollowButton";
import { useEffect, useState } from "react";
import { useFollow } from "~/hooks/useFollow";
import { FollowUser } from "~/types/user";
import { Alert } from "react-native";

const UserCard = ({ user }: { user: any }) => {
  const router = useRouter();
  const serializedUser = encodeURIComponent(
    JSON.stringify({ id: user._id, type: user.type })
  );

  // Initialize with member.isFollowing or false if member is null/undefined
  const [followingStatus, setFollowingStatus] = useState<boolean>(
    user?.isFollowing ?? false
  );

  useEffect(() => {
    setFollowingStatus(user?.isFollowing ?? false);
  }, [user]);

  const { followUser, unFollowUser } = useFollow();

  const handleFollowToggle = async () => {
    const wasFollowing = followingStatus;
    // Optimistic UI update
    setFollowingStatus(!wasFollowing);

    const followData: FollowUser = {
      followingId: user._id,
      followingType: user.type,
    };

    try {
      // Execute the appropriate action
      if (wasFollowing) {
        await unFollowUser(followData);
      } else {
        await followUser(followData);
      }
    } catch (err) {
      // Revert on error
      setFollowingStatus(wasFollowing);
      console.error(wasFollowing ? "Unfollow error:" : "Follow error:", err);
      Alert.alert("Error", `Failed to ${wasFollowing ? "unfollow" : "follow"}`);
    }
  };

  return (
    <>
      <View className="flex-row mt-2 h-[60px]">
        <TouchableOpacity
          onPress={() =>
            router.push(`/(app)/(profile)/profile/${serializedUser}`)
          }
        >
          <Image
            source={user.profilePic ? { uri: user.profilePic } : nopic}
            style={{
              width: 44,
              height: 44,
              borderRadius: 100,
              marginRight: 16,
              borderWidth: 1,
              borderColor: "#252525",
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <View className="flex-1 -ml-1">
          <TextScallingFalse className="text-white font-semibold text-xl">
            {user.firstName} {user.lastName}
          </TextScallingFalse>
          <TextScallingFalse
            className="text-[#9FAAB5] text-lg mt-[1px]"
            ellipsizeMode="tail"
            numberOfLines={2}
            style={{ width: "90%" }}
          >
            @{user.username}{" "}
            <TextScallingFalse className="text-lg">|</TextScallingFalse>{" "}
            {user.headline}
          </TextScallingFalse>
        </View>
        <View className="basis-[22%]">
          <FollowButton
            followingStatus={followingStatus}
            size="small"
            handleFollowToggle={handleFollowToggle}
            handleOpenModal={() => {}}
          />
        </View>
      </View>
    </>
  );
};

export default UserCard;
