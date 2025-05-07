import { useRouter } from "expo-router";
import { Image, TouchableOpacity, View } from "react-native";
import TextScallingFalse from "../CentralText";
import nopic from "@/assets/images/nopic.jpg";
import FollowButton from "../FollowButton";

const UserCard = ({ user }: { user: any }) => {
  const router = useRouter();
  const serializedUser = encodeURIComponent(
    JSON.stringify({ id: user._id, type: user.type })
  );

  return (
    <>
      <View className="flex-row p-2 mt-2 h-[60px]">
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
            style={{ width: "85%" }}
            ellipsizeMode="tail"
            numberOfLines={2}
          >
            @{user.username}{" "}
            <TextScallingFalse className="text-lg">|</TextScallingFalse>{" "}
            {user.headline}
          </TextScallingFalse>
        </View>
        <View>
          <FollowButton
            followingStatus={true}
            size="small"
            handleFollow={() => {}}
            handleUnfollow={() => {}}
            handleOpenModal={() => {}}
          />
        </View>
      </View>
    </>
  );
};

export default UserCard;
