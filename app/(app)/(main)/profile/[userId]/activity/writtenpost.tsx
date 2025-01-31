import { StyleSheet, Text, View, FlatList, Platform } from "react-native";
import React, { memo, useCallback, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import PostContainer from "~/components/Cards/postContainer";
import { Post } from "~/reduxStore/api/feedPostApi";
import { useLocalSearchParams } from "expo-router";
import { useLazyGetSpecificUserPostQuery } from "~/reduxStore/api/profile/profileApi.post";

const WrittenPostScreen = () => {
  const params = useLocalSearchParams();
  const isAndroid = Platform.OS === "android";

  const fetchedUserId = useMemo(() => {
    return params.userId
      ? JSON.parse(decodeURIComponent(params?.userId as string))
      : null;
  }, [params.userId]);
  const [getWrittenPosts, { data: posts, isLoading, isError }] =
    useLazyGetSpecificUserPostQuery();

  useEffect(() => {
    getWrittenPosts({
      postedBy: fetchedUserId?.id,
      postedByType: fetchedUserId?.type,
      limit: 10,
      skip: 0,
    });
  }, []);

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
