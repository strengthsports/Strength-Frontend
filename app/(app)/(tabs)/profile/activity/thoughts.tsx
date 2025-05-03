import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PostContainer from "~/components/Cards/postContainer";
import { Post } from "~/types/post";
import TextScallingFalse from "~/components/CentralText";
import { useLazyGetUserPostsByCategoryQuery } from "~/reduxStore/api/profile/profileApi.post";
import { Divider } from "react-native-elements";

const WrittenPost = () => {
  const { loading, user } = useSelector((state: any) => state?.profile);
  const isAndroid = Platform.OS === "android";

  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [trigger, { isLoading, isError, isFetching, error }] =
    useLazyGetUserPostsByCategoryQuery();

  const fetchPosts = async (isInitial = false) => {
    if (!user?._id) return;
    try {
      const res = await trigger({
        userId: user._id,
        type: "thoughts", // specifically for written/thought posts
        limit: 10,
        cursor: isInitial ? null : cursor,
      }).unwrap();

      if (res) {
        setPosts((prev) => (isInitial ? res.data : [...prev, ...res.data]));
        setCursor(res.nextCursor);
      }
    } catch (err) {
      console.log("Fetch failed:", err);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchPosts(true);
    }
  }, [user?._id]);

  const handleLoadMore = () => {
    if (!isFetching && cursor) {
      setIsFetchingMore(true);
      fetchPosts().finally(() => setIsFetchingMore(false));
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <View className="w-screen">
        <PostContainer item={item} />
        <Divider style={{ width: "100%" }} width={0.4} color="#282828" />
      </View>
    ),
    []
  );

  const MemoizedEmptyComponent = useCallback(() => {
    return (
      <View className="flex justify-center items-center flex-1 p-4">
        {isLoading ? (
          <ActivityIndicator color="#12956B" size={22} />
        ) : (
          <Text className="text-white text-center">No posts available</Text>
        )}
      </View>
    );
  }, [isLoading]);

  if (error || isError)
    return (
      <View className="flex justify-center items-center">
        <TextScallingFalse className="text-red-500">
          Error loading posts
        </TextScallingFalse>
      </View>
    );

  return (
    <View className="flex-1 mt-4">
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        initialNumToRender={5}
        removeClippedSubviews={isAndroid}
        windowSize={11}
        renderItem={renderItem}
        ListEmptyComponent={MemoizedEmptyComponent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        bounces={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListFooterComponent={
          isFetchingMore ? (
            <ActivityIndicator
              size="small"
              color="#12956B"
              style={{ marginVertical: 10 }}
            />
          ) : null
        }
      />
    </View>
  );
};

export default WrittenPost;

const styles = StyleSheet.create({});
