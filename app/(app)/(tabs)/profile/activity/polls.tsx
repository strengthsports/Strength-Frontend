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
// import { Post } from "~/reduxStore/api/feed/feedPostApi";
import { Post } from "~/types/post";
import TextScallingFalse from "~/components/CentralText";
import { selectPostsByUserId } from "~/reduxStore/slices/feed/feedSlice";
import { RootState } from "~/reduxStore";

const Polls = () => {
  // const { posts, error, loading } = useSelector((state: any) => state?.profile);
  const { error, loading, user } = useSelector((state: any) => state?.profile);
  const isAndroid = Platform.OS === "android";

  const userPosts = useSelector((state: RootState) =>
    selectPostsByUserId(state.feed.posts as any, user?._id)
  );

  const pollPosts = userPosts?.filter((post: Post) => post.isPoll);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <View className="w-screen">
        <PostContainer item={item} />
      </View>
    ),
    []
  );

  //empty component message
  const MemoizedEmptyComponent = memo(() => (
    <Text className="text-white text-center p-4">No polls available</Text>
  ));

  if (loading)
    return (
      <View className="flex justify-center items-center flex-1">
        <ActivityIndicator color="#12956B" size={22} />
      </View>
    );

  if (error)
    return (
      <View className="flex justify-center items-center flex-1">
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
