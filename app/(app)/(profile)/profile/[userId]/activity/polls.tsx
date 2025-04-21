import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { memo, useCallback, useEffect, useMemo } from "react";
import PostContainer from "~/components/Cards/postContainer";
import { useLocalSearchParams } from "expo-router";
import { useLazyGetSpecificUserPostQuery } from "~/reduxStore/api/profile/profileApi.post";
import TextScallingFalse from "~/components/CentralText";
// import { Post } from "~/reduxStore/api/feed/features/feedApi.getFeed";
import { Post } from "~/types/post";

const Polls = () => {
  const params = useLocalSearchParams();
  const isAndroid = Platform.OS === "android";

  const fetchedUserId = useMemo(() => {
    return params.userId
      ? JSON.parse(decodeURIComponent(params?.userId as string))
      : null;
  }, [params.userId]);

  const [getPollPosts, { data: posts, isLoading, isError }] =
    useLazyGetSpecificUserPostQuery();

  useEffect(() => {
    // Only fetch if we have a valid user ID
    if (fetchedUserId?.id) {
      getPollPosts({
        postedBy: fetchedUserId.id,
        postedByType: fetchedUserId.type,
        limit: 10,
        skip: 0,
      });
    }
  }, [getPollPosts, fetchedUserId]);

  const pollPosts = posts?.filter((post: Post) => post.isPoll);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <View className="w-screen pl-3">
        <PostContainer item={item} />
      </View>
    ),
    []
  );

  const MemoizedEmptyComponent = memo(() => (
    <Text className="text-white text-center p-4">No polls available</Text>
  ));

  if (isLoading)
    return (
      <View className="flex justify-center items-center flex-1">
        {" "}
        {/* Added flex-1 */}
        <ActivityIndicator color="#12956B" size={22} />
      </View>
    );

  if (isError)
    return (
      <View className="flex justify-center items-center flex-1">
        {" "}
        {/* Added flex-1 */}
        <TextScallingFalse className="text-red-500">
          {" "}
          Error loading posts
        </TextScallingFalse>
      </View>
    );

  return (
    <View className="flex-1 mt-4">
      <FlatList
        data={pollPosts || []}
        keyExtractor={(item) => item._id}
        initialNumToRender={5}
        removeClippedSubviews={isAndroid}
        windowSize={11}
        renderItem={renderItem}
        ListEmptyComponent={MemoizedEmptyComponent}
        bounces={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
};

export default Polls;
