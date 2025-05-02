import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { memo, useCallback, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import PostContainer from "~/components/Cards/postContainer";
import { useLocalSearchParams } from "expo-router";
import { useLazyGetSpecificUserPostQuery } from "~/reduxStore/api/profile/profileApi.post";
import TextScallingFalse from "~/components/CentralText";
// import { Post } from "~/reduxStore/api/feed/features/feedApi.getFeed";
import { Post } from "~/types/post";

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
    (post: Post) => (!post.assets || post.assets.length === 0) && !post.isPoll
  );

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <View className="w-screen">
        <PostContainer item={item} />
      </View>
    ),
    [] // Empty dependency array ensures the function is memoized and doesn't re-create
  );
  const memoizedEmptyComponent = memo(() => (
    <Text className="text-white text-center p-4">
      No written posts available
    </Text>
  ));

  if (isLoading)
    return (
      <View className="flex justify-center items-center">
        <ActivityIndicator color="#12956B" size={22} />
      </View>
    );
  if (isError)
    return (
      <View className="flex justify-center items-center">
        <TextScallingFalse className="text-red-500">
          {" "}
          Error loading posts
        </TextScallingFalse>
      </View>
    );

  return (
    <View className="flex-1 mt-4">
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
