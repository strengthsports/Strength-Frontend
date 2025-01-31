import { StyleSheet, Text, View, FlatList, Platform } from "react-native";
import React, { memo, useCallback } from "react";
import { useSelector } from "react-redux";
import PostContainer from "~/components/Cards/postContainer";
import { Post } from "~/reduxStore/api/feedPostApi";

const WrittenPostScreen = () => {
  const { posts, error, loading } = useSelector((state: any) => state?.profile);
  const isAndroid = Platform.OS === "android";

  if (loading)
    return <Text className="text-white text-center">Loading...</Text>;
  if (error)
    return (
      <Text className="text-red-500 text-center">Error loading posts</Text>
    );

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

export default WrittenPostScreen;

const styles = StyleSheet.create({});
