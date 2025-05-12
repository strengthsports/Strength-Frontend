import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
} from "react-native";
import PostContainer from "~/components/Cards/postContainer";
import { Post } from "~/reduxStore/api/feed/features/feedApi.getFeed";
import TextScallingFalse from "~/components/CentralText";
import { Divider } from "react-native-elements";
import { Colors } from "~/constants/Colors";
import HashtagNotFound from "../notfound/hashtagNotFound";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import {
  fetchHashtagContents,
  selectAllNonFeedPosts,
  selectNonFeedState,
} from "~/reduxStore/slices/feed/feedSlice";

type ContentType = "top" | "latest" | "polls" | "media" | "people";

const screenWidth = Dimensions.get("window").width;

const HashtagPosts = ({
  type,
  hashtag,
}: {
  type: ContentType;
  hashtag: string;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { nonFeedLoading, nonFeedError, nonFeedCursor, lastQueryKey } =
    useSelector(selectNonFeedState);
  const posts = useSelector(selectAllNonFeedPosts);

  // const [se]

  // Initial load or when userId/type changes
  useEffect(() => {
    console.log("Initial Call");
    setIsInitialLoad(true);
    if (type && hashtag) {
      dispatch(
        fetchHashtagContents({
          limit: 10,
          type,
          hashtag,
          reset: true, // Always reset for new userId/type combination
        })
      );
    }
  }, [dispatch, hashtag, type]);

  // For subsequent loads
  const handleLoadMore = useCallback(() => {
    console.log("Load more call");
    setIsInitialLoad(false);
    if (nonFeedCursor && !nonFeedLoading && !isLoadingMore) {
      setIsLoadingMore(true);
      console.log("Time stamp : ", nonFeedCursor);
      dispatch(
        fetchHashtagContents({
          limit: 10,
          cursor: nonFeedCursor,
          type,
          hashtag,
        })
      ).finally(() => setIsLoadingMore(false));
    }
  }, [nonFeedCursor, nonFeedLoading, isLoadingMore]);

  // Refresh contents

  const handleRefresh = useCallback(async () => {
    console.log("Refresh call");
    setRefreshing(true);
    await dispatch(
      fetchHashtagContents({
        limit: 10,
        type,
        hashtag,
        reset: true, // Always reset for new userId/type combination
      })
    );
    setRefreshing(false);
  }, [dispatch]);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <View style={{ width: screenWidth }}>
        <PostContainer item={item as any} highlightedHashtag={`#${hashtag}`} />
        <Divider
          style={{ marginHorizontal: "auto", width: "100%" }}
          width={0.4}
          color="#282828"
        />
      </View>
    ),
    [hashtag]
  );

  const MemoizedEmptyComponent = useCallback(() => {
    return (
      <View className="flex justify-center items-center flex-1 p-4">
        {nonFeedLoading && <ActivityIndicator color="#12956B" size={22} />}
      </View>
    );
  }, [nonFeedLoading]);

  if (!posts.length) {
    return (
      <View className="flex-1 justify-center items-center">
        <HashtagNotFound text={hashtag} />
      </View>
    );
  }

  if (nonFeedError) {
    return (
      <View className="justify-center items-center">
        <TextScallingFalse className="text-red-400">
          Something went wrong.
        </TextScallingFalse>
      </View>
    );
  }

  return (
    <>
      {isInitialLoad && nonFeedLoading ? (
        <View style={styles.fullScreenLoader}>
          <ActivityIndicator size="large" color={Colors.themeColor} />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={MemoizedEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#12956B", "#6E7A81"]}
              tintColor="#6E7A81"
              title="Refreshing..."
              titleColor="#6E7A1"
              progressBackgroundColor="#181A1B"
            />
          }
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={21}
          removeClippedSubviews
          onEndReached={({ distanceFromEnd }) => {
            if (distanceFromEnd < 0) return;
            handleLoadMore();
          }}
          onEndReachedThreshold={0.6}
          ListFooterComponent={
            nonFeedLoading || isLoadingMore ? (
              <ActivityIndicator
                style={{ marginVertical: 20 }}
                color={Colors.themeColor}
              />
            ) : null
          }
          bounces={false}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  fullScreenLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default React.memo(HashtagPosts);
