import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { memo, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextScallingFalse from "~/components/CentralText";
import { AppDispatch } from "~/reduxStore";
import { getOwnPosts } from "~/reduxStore/slices/user/profileSlice";
import PostContainer, {
  PostContainerHandles,
} from "~/components/Cards/postContainer";
import { Post } from "~/types/post";

const Clips = () => {
  const { posts, error, loading } = useSelector((state: any) => state?.profile);
  const dispatch = useDispatch<AppDispatch>();
  const isAndroid = Platform.OS === "android";
  const postRefs = useRef<Record<string, PostContainerHandles | null>>({});

  // Filter posts to only include video posts
  const videoPosts = posts?.filter((post: Post) => post?.isVideo);

  useEffect(() => {
    if (!posts || posts.length === 0) {
      dispatch(getOwnPosts(null));
    }
  }, [dispatch, posts]);

  // const viewabilityConfig = useRef({
  //   itemVisiblePercentThreshold: 70,
  //   minimumViewTime: 500,
  // });

  // const handleViewableItemsChanged = useRef(
  //   ({ changed }: { changed: Array<any> }) => {
  //     changed.forEach((item) => {
  //       const postId = item.item._id;
  //       if (item.isViewable) {
  //         postRefs.current[postId]?.playVideo();
  //       } else {
  //         postRefs.current[postId]?.pauseVideo();
  //       }
  //     });
  //   }
  // );

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <View className="w-screen pl-3">
        <PostContainer
          item={item}
          isMyActivity={true}
          // autoPlay={false}
        />
      </View>
    ),
    []
  );

  const memoizedEmptyComponent = memo(() => (
    <TextScallingFalse className="text-white text-center p-4">
      No video posts available
    </TextScallingFalse>
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
          Error loading videos
        </TextScallingFalse>
      </View>
    );

  return (
    <View>
      <FlatList
        data={videoPosts || []}
        keyExtractor={(item) => item._id}
        initialNumToRender={3}
        removeClippedSubviews={isAndroid}
        windowSize={7}
        renderItem={renderItem}
        ListEmptyComponent={memoizedEmptyComponent}
        bounces={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        // viewabilityConfig={viewabilityConfig.current}
        // onViewableItemsChanged={handleViewableItemsChanged.current}
      />
    </View>
  );
};

export default Clips;

const styles = StyleSheet.create({});
