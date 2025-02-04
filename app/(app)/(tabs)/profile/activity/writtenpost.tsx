import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { memo, useCallback } from "react";
import { useSelector } from "react-redux";
import PostContainer from "~/components/Cards/postContainer";
import { Post } from "~/reduxStore/api/feedPostApi";
import TextScallingFalse from "~/components/CentralText";

const WrittenPost = () => {
  const { posts, error, loading } = useSelector((state: any) => state?.profile);
  const isAndroid = Platform.OS === "android";

  // Filter posts where `assets` is missing or empty
  const textPosts = posts?.filter(
    (post: any) => !post.assets || post.assets.length === 0
  );

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <View className="w-screen pl-3">
        <PostContainer item={item} />
      </View>
    ),
    [] // Empty dependency array ensures the function is memoized and doesn't re-create
  );
  const memoizedEmptyComponent = memo(() => (
    <Text className="text-white text-center p-4">
      No new written posts available
    </Text>
  ));

  if (loading)
    return (
      <View className="flex justify-center items-center">
        <ActivityIndicator color="#12956B" size={22} />
      </View>
    );
  if (error)
    return (
      <View className="flex justify-center items-center">
        <TextScallingFalse className="text-red-500">
          {" "}
          Error loading posts
        </TextScallingFalse>
      </View>
    );

  return (
    <View className="flex-1">
      <FlatList
        data={textPosts || []}
        keyExtractor={(item) => item._id}
        initialNumToRender={5}
        removeClippedSubviews={isAndroid}
        windowSize={11}
        renderItem={renderItem}
        ListEmptyComponent={memoizedEmptyComponent}
        bounces={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
};

export default WrittenPost;

const styles = StyleSheet.create({});
