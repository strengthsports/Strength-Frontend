import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextScallingFalse from "~/components/CentralText";
import { AppDispatch, RootState } from "~/reduxStore";
import { getOwnPosts } from "~/reduxStore/slices/user/profileSlice";
import PostContainer from "~/components/Cards/postContainer";
// import { Post } from "~/reduxStore/api/feed/features/feedApi.getFeed";
import { Post } from "~/types/post";
import { selectPostsByUserId } from "~/reduxStore/slices/feed/feedSlice";
import { useFocusEffect } from "expo-router";

const Posts = () => {
  // const { posts, error, loading } = useSelector((state: any) => state?.profile);
  // console.log("\n\n\nPosts : ", posts);
  // const dispatch = useDispatch<AppDispatch>();
  const { error, loading, user } = useSelector((state: any) => state?.profile);
  const dispatch = useDispatch<AppDispatch>();
  const isAndroid = Platform.OS === "android";
  const flatListRef = useRef<FlatList>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const userPosts = useSelector((state: RootState) =>
    selectPostsByUserId(state.feed.posts as any, user?._id)
  );

  const scrollToTop = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }, 100);
  }, []);

  useFocusEffect(
    useCallback(() => {
      scrollToTop();
      setInitialLoad(true);
    }, [scrollToTop])
  );

  useEffect(() => {
    if ((!userPosts || userPosts.length === 0) && initialLoad) {
      dispatch(getOwnPosts(null));
      setInitialLoad(false);
    }
  }, [dispatch, userPosts, initialLoad]);

  useEffect(() => {
    if (userPosts && userPosts.length > 0) {
      scrollToTop();
    }
  }, [userPosts, scrollToTop]);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <View className="w-screen">
        <PostContainer isVisible={true} item={item} isMyActivity={true} />
      </View>
    ),
    [] // Empty dependency array ensures the function is memoized and doesn't re-create
  );
  const memoizedEmptyComponent = memo(() => (
    <Text className="text-white text-center p-4">No new posts available</Text>
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
    <View className="mt-4">
      <FlatList
        ref={flatListRef}
        initialScrollIndex={0}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        data={userPosts || []}
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
