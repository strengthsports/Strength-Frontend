import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { memo, useCallback, useEffect, useMemo } from "react";
import { useLazyGetSpecificUserPostQuery } from "~/reduxStore/api/profile/profileApi.post";
import TextScallingFalse from "~/components/CentralText";
import PostContainer from "~/components/Cards/postContainer";
import { useLocalSearchParams } from "expo-router";
import { Post } from "~/reduxStore/api/feed/features/feedApi.getFeed";

const Posts = () => {
  const params = useLocalSearchParams();

  const fetchedUserId = useMemo(() => {
    return params.userId
      ? JSON.parse(decodeURIComponent(params?.userId as string))
      : null;
  }, [params.userId]);

  console.log(fetchedUserId);
  const isAndroid = Platform.OS === "android";

  const [getUserSpecificPost, { data: posts, error, isLoading }] =
    useLazyGetSpecificUserPostQuery();

  useEffect(() => {
    getUserSpecificPost({
      postedBy: fetchedUserId?.id,
      postedByType: fetchedUserId?.type,
      limit: 10,
      skip: 0,
      // lastTimestamp: null,
    });
  }, []);

  console.log("\n\n\nPosts : ", posts);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <View className="w-screen pl-3">
        <PostContainer item={item} />
      </View>
    ),
    [] // Empty dependency array ensures the function is memoized and doesn't re-create
  );

  const memoizedEmptyComponent = memo(() => (
    <Text className="text-white text-center p-4">No new posts available</Text>
  ));

  // Loading
  if (isLoading) {
    return (
      <View className="flex justify-center items-center">
        <ActivityIndicator color="#12956B" size={22} />
      </View>
    );
  }

  // Error
  if (error) {
    console.log(error);
    return (
      <View>
        <TextScallingFalse className="text-red-500">
          {error?.message || "Error fetching posts"}
        </TextScallingFalse>
      </View>
    );
  }

  return (
    <FlatList
      data={posts || []}
      keyExtractor={(item) => item._id}
      initialNumToRender={5}
      removeClippedSubviews={isAndroid}
      windowSize={11}
      renderItem={renderItem}
      ListEmptyComponent={memoizedEmptyComponent}
      bounces={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    />
  );
};

export default Posts;

const styles = StyleSheet.create({});
