import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  Text,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useGetHashtagContentsQuery } from "~/reduxStore/api/feed/features/feedApi.hashtag";
import PostContainer from "~/components/Cards/postContainer";
import { Post } from "~/reduxStore/api/feed/features/feedApi.getFeed";
import TextScallingFalse from "~/components/CentralText";
import { Divider } from "react-native-elements";
import { Colors } from "~/constants/Colors";
import HashtagNotFound from "../notfound/hashtagNotFound";

type ContentType = "top" | "latest" | "polls" | "media" | "people";

const screenWidth = Dimensions.get("window").width;

const HashtagPosts = ({
  type,
  hashtag,
}: {
  type: ContentType;
  hashtag: string;
}) => {
  const { data, error, isLoading, refetch } = useGetHashtagContentsQuery({
    hashtag,
    type,
    limit: 10,
  });

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const posts = useMemo(() => data?.data || [], [data]);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <View style={{ width: screenWidth }}>
        <PostContainer item={item} highlightedHashtag={`#${hashtag}`} />
        <Divider
          style={{ marginHorizontal: "auto", width: "100%" }}
          width={0.4}
          color="#282828"
        />
      </View>
    ),
    [hashtag]
  );

  if (error) {
    return (
      <View className="justify-center items-center">
        <Text className="text-red-400">Something went wrong.</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={Colors.themeColor} />
      </View>
    );
  }

  if (!posts.length) {
    return (
      <View className="flex-1 justify-center items-center">
        <HashtagNotFound text={hashtag} />
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item._id.toString()}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={["#12956B", "#6E7A81"]}
          tintColor="#6E7A81"
          title="Refreshing..."
          titleColor="#6E7A1"
          progressBackgroundColor="#181A1B"
        />
      }
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={10}
      removeClippedSubviews
      ListFooterComponent={<View className="mt-20" />}
    />
  );
};

export default React.memo(HashtagPosts);
