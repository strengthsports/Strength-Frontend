import { FlatList, Platform, StyleSheet, Text, View } from "react-native";
import React, { memo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextScallingFalse from "~/components/CentralText";
import { AppDispatch } from "~/reduxStore";
import { getOwnPosts } from "~/reduxStore/slices/user/profileSlice";
import PostContainer from "~/components/Cards/postContainer";
import { Post } from "~/reduxStore/api/feedPostApi";

const Posts = () => {
  const { posts, error, loading } = useSelector((state: any) => state?.profile);
  console.log("\n\n\nPosts : ", posts);
  const dispatch = useDispatch<AppDispatch>();
  const isAndroid = Platform.OS === "android";

  useEffect(() => {
    if (!posts) {
      dispatch(getOwnPosts(null));
    }
  }, [dispatch, posts]);

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
  if (loading) {
    return (
      <View>
        <TextScallingFalse className="text-white">Loading...</TextScallingFalse>
      </View>
    );
  }

  // Error
  if (error) {
    return (
      <View>
        <TextScallingFalse className="text-red-500">
          {error as string}
        </TextScallingFalse>
      </View>
    );
  }
  return (
    <View>
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
    </View>
  );
};

export default Posts;

const styles = StyleSheet.create({});
