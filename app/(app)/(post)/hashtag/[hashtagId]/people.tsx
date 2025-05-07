import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { useGetHashtagContentsQuery } from "~/reduxStore/api/feed/features/feedApi.hashtag";
import { useFollow } from "~/hooks/useFollow";
import { FollowUser } from "~/types/user";
import { Colors } from "~/constants/Colors";
import TextScallingFalse from "~/components/CentralText";
import UserCard from "~/components/Cards/UserCard";

const ITEM_HEIGHT = 60;

const PeopleScreen = ({ hashtag }: { hashtag: string }) => {
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

  const renderFollowerItem = ({ item }: { item: any }) => (
    <UserCard user={item} />
  );

  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  if (isLoading) {
    <ActivityIndicator
      size="large"
      color={Colors.themeColor}
      style={styles.loader}
    />;
  }
  if (isError) {
    <TextScallingFalse style={styles.errorText}>
      Failed to load people. Please try again.
    </TextScallingFalse>;
  }

  if (!isLoading && !isError && data?.length === 0) {
    <TextScallingFalse style={styles.emptyText}>
      No people found.
    </TextScallingFalse>;
  }

  return (
    <FlatList
      data={data?.data}
      renderItem={renderFollowerItem}
      keyExtractor={(item, index) => item._id || index.toString()}
      contentContainerStyle={{ padding: 10 }}
      getItemLayout={getItemLayout}
      ListFooterComponent={<View className="mt-20" />}
    />
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
});

export default PeopleScreen;
