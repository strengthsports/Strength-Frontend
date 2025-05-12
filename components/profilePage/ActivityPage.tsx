import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextScallingFalse from "~/components/CentralText";
import { Divider } from "react-native-elements";
import PostContainer from "~/components/Cards/postContainer";
import { Post } from "~/types/post";
import { AppDispatch } from "~/reduxStore";
import {
  fetchNonFeedPosts,
  selectAllNonFeedPosts,
  selectNonFeedState,
} from "~/reduxStore/slices/feed/feedSlice";
import { Colors } from "~/constants/Colors";

interface ActivityPageProps {
  userId: string;
  type: string;
}

const ActivityPage = ({ userId, type }: ActivityPageProps) => {
  console.log("Page rendered ");
  const dispatch = useDispatch<AppDispatch>();
  const isAndroid = Platform.OS === "android";
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { nonFeedLoading, nonFeedError, nonFeedCursor, nonFeedHasMore } =
    useSelector(selectNonFeedState);
  const posts = useSelector(selectAllNonFeedPosts);

  // Initial load or when userId/type changes
  useEffect(() => {
    setIsInitialLoad(true);
    if (userId) {
      dispatch(
        fetchNonFeedPosts({
          limit: 10,
          type: type || "all", // Default to "all" if not specified
          userId: userId,
          reset: true, // Always reset for new userId/type combination
        })
      );
    }
  }, [dispatch, userId, type]);

  // For subsequent loads
  const handleLoadMore = useCallback(() => {
    console.log("Load more conditions:", {
      cursor: nonFeedCursor,
      loading: nonFeedLoading,
    });
    setIsInitialLoad(false);
    if (nonFeedCursor && !nonFeedLoading && !isLoadingMore) {
      setIsLoadingMore(true);
      dispatch(
        fetchNonFeedPosts({
          limit: 10,
          cursor: nonFeedCursor,
          type: type || "all",
          userId: userId,
        })
      ).finally(() => setIsLoadingMore(false));
    }
  }, [nonFeedCursor, nonFeedLoading, isLoadingMore, type, userId]);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <View className="w-screen">
        <PostContainer isVisible={true} item={item} isMyActivity={true} />
        <Divider style={{ width: "100%" }} width={0.4} color="#282828" />
      </View>
    ),
    []
  );

  const MemoizedEmptyComponent = useCallback(() => {
    return (
      <View className="flex justify-center items-center flex-1 p-4">
        {nonFeedLoading ? (
          <ActivityIndicator color="#12956B" size={22} />
        ) : (
          <TextScallingFalse className="text-white text-center">
            No posts available
          </TextScallingFalse>
        )}
      </View>
    );
  }, [nonFeedLoading]);

  if (nonFeedError)
    return (
      <View className="flex justify-center items-center">
        <TextScallingFalse className="text-red-500">
          Error loading posts
        </TextScallingFalse>
      </View>
    );

  return (
    <View className="mt-4">
      {isInitialLoad && nonFeedLoading ? (
        <View style={styles.fullScreenLoader}>
          <ActivityIndicator size="large" color={Colors.themeColor} />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          initialNumToRender={5}
          removeClippedSubviews={isAndroid}
          windowSize={5}
          renderItem={renderItem}
          ListEmptyComponent={MemoizedEmptyComponent}
          onEndReached={({ distanceFromEnd }) => {
            if (distanceFromEnd < 0) return;
            handleLoadMore();
          }}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            nonFeedLoading || isLoadingMore ? (
              <ActivityIndicator
                style={{ marginVertical: 20 }}
                color={Colors.themeColor}
              />
            ) : null
          }
          bounces={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
};

export default React.memo(ActivityPage);

const styles = StyleSheet.create({
  fullScreenLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
