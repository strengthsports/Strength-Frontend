import { Entypo } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetHashtagContentsQuery } from "~/reduxStore/api/feed/features/feedApi.hashtag";
import { useFollow } from "~/hooks/useFollow";
import { FollowUser } from "~/types/user";
import { Colors } from "~/constants/Colors";
import TextScallingFalse from "~/components/CentralText";
import nopic from "@/assets/images/nopic.jpg";
import { RootState } from "~/reduxStore";

const People = () => {
  const { hashtagId } = useLocalSearchParams();
  const hashtag =
    typeof hashtagId === "string" ? hashtagId : hashtagId?.[0] || "";
  const router = useRouter();
  const user = useSelector((state: RootState) => state.profile.user);
  const { data, isLoading, isError } = useGetHashtagContentsQuery({
    hashtag,
    limit: 10,
    type: "people",
  });

  const { followUser, unFollowUser } = useFollow();

  const [followingMap, setFollowingMap] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    if (data?.data) {
      const map: { [key: string]: boolean } = {};
      data.data.forEach((item: any) => {
        map[item._id] = item.isFollowing;
      });
      setFollowingMap(map);
    }
  }, [data]);

  const handleFollowToggle = async (item: any) => {
    const currentlyFollowing = followingMap[item._id];
    const followData: FollowUser = {
      followingId: item._id,
      followingType: item.type || "User",
    };

    try {
      // Optimistic update
      setFollowingMap((prev) => ({
        ...prev,
        [item._id]: !currentlyFollowing,
      }));

      if (currentlyFollowing) {
        await unFollowUser(followData, true);
      } else {
        await followUser(followData, true);
      }
    } catch (err) {
      // Revert on error
      setFollowingMap((prev) => ({
        ...prev,
        [item._id]: currentlyFollowing,
      }));
      console.error("Follow toggle error:", err);
    }
  };

  const renderFollowerItem = ({ item }: { item: any }) => {
    const serializedUser = encodeURIComponent(
      JSON.stringify({ id: item._id, type: item.type })
    );
    const isFollowing = followingMap[item._id];

    console.log(item);

    return (
      <View className="flex-row mb-5 items-center justify-start">
        <TouchableOpacity
          onPress={() =>
            item._id === user?._id
              ? router.push("/(app)/(tabs)/profile")
              : router.push(`/(app)/(profile)/profile/${serializedUser}`)
          }
          className="w-12 h-12 rounded-full overflow-hidden"
        >
          <Image
            source={item.profilePic ? { uri: item.profilePic } : nopic}
            className="w-full h-full"
            resizeMode="cover"
          />
        </TouchableOpacity>

        <View className="ml-3">
          <Text className="text-white text-2xl font-medium" numberOfLines={1}>
            {item.firstName} {item.lastName}
          </Text>
          <Text className="text-white text-sm font-light" numberOfLines={1}>
            @{item.username} | {item.headline}
          </Text>
        </View>

        {item._id !== user?._id && (
          <View className="flex-1 items-end">
            <TouchableOpacity
              className={`border rounded-lg px-8 py-1.5 ${
                isFollowing ? "border border-[#ffffff]" : "bg-[#12956B]"
              }`}
              activeOpacity={0.6}
              onPress={() => handleFollowToggle(item)}
            >
              <TextScallingFalse className="text-center text-lg text-white">
                {isFollowing ? (
                  <>
                    <Entypo name="check" size={14} color="white" /> Following
                  </>
                ) : (
                  "Follow"
                )}
              </TextScallingFalse>
            </TouchableOpacity>
          </View>
        )}
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
      {!isLoading && !isError && data?.data?.length === 0 && (
        <Text style={styles.emptyText}>No people found.</Text>
      )}

      <FlatList
        data={data?.data}
        renderItem={renderFollowerItem}
        keyExtractor={(item, index) => item._id || index.toString()}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={<View className="mt-20" />}
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
