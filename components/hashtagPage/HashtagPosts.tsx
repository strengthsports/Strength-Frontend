import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Divider } from "react-native-elements";
import { fetchHashtagPosts } from "~/reduxStore/slices/post/hooks";
import { makeSelectHashtagPosts } from "~/reduxStore/slices/post/selectors";
import { Post } from "~/types/post";
import PostContainer from "~/components/Cards/postContainer";
import HashtagNotFound from "../notfound/hashtagNotFound";
import TextScallingFalse from "~/components/CentralText";
import { Colors } from "~/constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/reduxStore";

const screenWidth = Dimensions.get("window").width;

const HashtagPosts = ({
  hashtag,
  type,
}: {
  hashtag: string;
  type: "top" | "latest" | "polls" | "media" | "people";
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const flatListRef = useRef<FlatList>(null);

  const selectHashtagPosts = useCallback(
    makeSelectHashtagPosts(hashtag, type),
    [hashtag, type]
  );

  const posts = useSelector(selectHashtagPosts);
  const nextCursor = useSelector(
    (state: RootState) =>
      state.views.hashtag[hashtag]?.[type]?.nextCursor ?? null
  );

  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [visiblePostIds, setVisiblePostIds] = useState<string[]>([]);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  });

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<any> }) => {
      const visibleIds = viewableItems
        .filter((vi) => vi.item && vi.item._id)
        .map((vi) => vi.item._id);
      console.log("\n\nVisible IDS :", visibleIds);
      setVisiblePostIds(visibleIds);
    }
  ).current;

  const loadPosts = async (cursor?: string | null) => {
    await dispatch(fetchHashtagPosts({ hashtag, type, limit: 10, cursor }));
  };

  useEffect(() => {
    setInitialLoading(true);
    loadPosts().finally(() => setInitialLoading(false));
  }, [hashtag, type]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPosts(); // no cursor => refresh
    setRefreshing(false);
  };

  const handleLoadMore = async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    await loadPosts(nextCursor);
    setLoadingMore(false);
  };

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <View style={{ width: screenWidth }}>
        <PostContainer
          item={item as any}
          highlightedHashtag={`#${hashtag}`}
          isVisible={visiblePostIds.includes(item._id)}
        />
        <Divider
          style={{ marginHorizontal: "auto", width: "100%" }}
          width={0.4}
          color="#282828"
        />
      </View>
    ),
    [hashtag, visiblePostIds]
  );

  if (initialLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.themeColor} />
      </View>
    );
  }

  if (!posts || posts.length === 0) {
    return <HashtagNotFound text={hashtag} />;
  }

  return (
    <FlatList
      ref={flatListRef}
      data={posts}
      keyExtractor={(item) => item.id}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig.current}
      scrollEventThrottle={16}
      renderItem={renderItem}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={Colors.themeColor}
        />
      }
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator size="small" color={Colors.themeColor} />
        ) : null
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HashtagPosts;
