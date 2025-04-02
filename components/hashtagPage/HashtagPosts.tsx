import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  Text,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useGetPostsByHashtagQuery } from "~/reduxStore/api/posts/postsApi.hashtag";
import PostContainer from "~/components/Cards/postContainer";
import { Colors } from "~/constants/Colors";
import { Post } from "~/reduxStore/api/feed/features/feedApi.getFeed";
import TextScallingFalse from "~/components/CentralText";
import { Divider } from "react-native-elements";
import PostSkeletonLoader1 from "../skeletonLoaders/PostSkeletonLoader1";
import { ScrollView } from "react-native";

export default function HashtagPosts({ sort }: { sort?: number }) {
  const { hashtagId } = useLocalSearchParams(); // Get the hashtag from params
  console.log(hashtagId);
  const hashtag = hashtagId.toString();
  const { data, error, isLoading, refetch } = useGetPostsByHashtagQuery({
    hashtag,
    sort,
  });

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderItem = useCallback(({ item }: { item: Post }) => {
    return (
      <View className="w-screen">
        <PostContainer item={item} highlightedHashtag={`#${hashtag}`} />
        <Divider
          style={{ marginHorizontal: "auto", width: "100%" }}
          width={0.4}
          color="#282828"
        />
      </View>
    );
  }, []);

  if (error) {
    return (
      <View className="justify-center items-center">
        <Text className="text-red-400">Error</Text>
      </View>
    );
  }

  return isLoading ? (
    <ScrollView
      contentContainerStyle={{
        alignItems: "flex-start",
        justifyContent: "flex-start",
        width: "100%",
        flex: 1,
        backgroundColor: "#000",
      }}
    >
      <PostSkeletonLoader1 />
      <PostSkeletonLoader1 />
      <PostSkeletonLoader1 />
    </ScrollView>
  ) : !data?.data?.posts?.length ? (
    <View className="justify-center items-center h-20">
      <TextScallingFalse className="text-[#808080] text-2xl">
        No posts found for #{hashtag}
      </TextScallingFalse>
    </View>
  ) : (
    <FlatList
      data={data?.data?.posts}
      keyExtractor={(item, index) => index.toString()}
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
      ListFooterComponent={<View className="mt-20"></View>}
    />
  );
}
