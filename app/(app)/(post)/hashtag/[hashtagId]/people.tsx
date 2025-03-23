import { Entypo } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import nopic from "@/assets/images/nopic.jpg";
import { useGetPeopleByHashtagQuery } from "~/reduxStore/api/posts/postsApi.hashtag";
import { Colors } from "~/constants/Colors";
import { useSelector } from "react-redux";
import TextScallingFalse from "~/components/CentralText";
import { RootState } from "~/reduxStore";
import { useFollow } from "~/hooks/useFollow";
import { FollowUser } from "~/types/user";

const People = () => {
  const { hashtagId } = useLocalSearchParams();
  const hashtag = hashtagId.toString();
  const router = useRouter();
  const { user } = useSelector((state: any) => state?.profile || {});
  const { data, isLoading, isError } = useGetPeopleByHashtagQuery({ hashtag });

  const isFollowing = useSelector((state: RootState) =>
    state.profile?.followings?.includes(user._id)
  );
  const [followingStatus, setFollowingStatus] = useState(isFollowing);

  useEffect(() => {
    setFollowingStatus(isFollowing);
  }, [isFollowing]); // Sync when Redux state changes
  const { followUser, unFollowUser } = useFollow();

  //handle follow
  const handleFollow = async () => {
    try {
      setFollowingStatus(true);
      const followData: FollowUser = {
        followingId: user._id,
        followingType: user.type || "User",
      };

      await followUser(followData);
    } catch (err) {
      setFollowingStatus(false);
      console.error("Follow error:", err);
    }
  };

  //handle unfollow
  const handleUnfollow = async () => {
    try {
      setFollowingStatus(false);
      const unfollowData: FollowUser = {
        followingId: user._id,
        followingType: user.type || "User",
      };

      await unFollowUser(unfollowData);
    } catch (err) {
      setFollowingStatus(true);
      console.error("Unfollow error:", err);
    }
  };

  const renderFollowerItem = ({ item }: { item: any }) => {
    const serializedUser = encodeURIComponent(
      JSON.stringify({ id: item._id, type: item.type })
    );
    console.log(item);
    return (
      <View className="flex-row mb-5 items-center justify-start">
        <TouchableOpacity
          onPress={() =>
            item._id === user._id
              ? router.push("/(app)/(tabs)/profile")
              : router.push(`/(app)/(profile)/profile/${serializedUser}`)
          }
          className="w-14 h-14 rounded-full overflow-hidden"
        >
          {item.profilePic ? (
            <Image
              source={{ uri: item.profilePic }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <Image
              source={nopic}
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          )}
        </TouchableOpacity>
        <View className="ml-3">
          <Text
            className="text-white text-2xl font-medium"
            numberOfLines={1}
            allowFontScaling={false}
          >
            {item.firstName} {item.lastName}
          </Text>
          <Text
            className="text-white text-sm font-light"
            numberOfLines={1}
            allowFontScaling={false}
          >
            {item.headline}
          </Text>
        </View>
        <View className="flex-1 items-end">
          <TouchableOpacity
            className={`border rounded-lg px-8 py-1.5 ${
              followingStatus ? "border border-[#ffffff]" : "bg-[#12956B]"
            } `}
            activeOpacity={0.6}
            onPress={followingStatus ? handleFollow : handleUnfollow}
          >
            {followingStatus ? (
              <TextScallingFalse className="text-center text-lg text-white">
                <Entypo className="mr-4" name="check" size={14} color="white" />
                Following
              </TextScallingFalse>
            ) : (
              <TextScallingFalse className="text-center text-lg text-white">
                Follow
              </TextScallingFalse>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View
      style={styles.container}
      className="relative w-[360px] lg:w-[600px] mx-auto"
    >
      {isLoading && (
        <ActivityIndicator
          size="large"
          color={Colors.themeColor}
          style={styles.loader}
        />
      )}

      {isError && (
        <Text style={styles.errorText}>
          Failed to load people. Please try again.
        </Text>
      )}

      {!isLoading && !isError && data?.length === 0 && (
        <Text style={styles.emptyText}>No people found.</Text>
      )}

      <FlatList
        data={data?.data}
        renderItem={renderFollowerItem}
        keyExtractor={(item) => item?._id.toString()}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={<View className="mt-20"></View>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
  },
  emptyText: {
    color: "gray",
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default People;
