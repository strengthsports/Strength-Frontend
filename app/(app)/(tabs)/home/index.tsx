import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  Text,
  Animated,
  Platform,
  ScrollView,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";
import PostContainer from "@/components/Cards/postContainer";
import { Divider } from "react-native-elements";
import {
  fetchFeedPosts,
  resetFeed,
  selectAllFeedPosts,
  selectFeedState,
} from "~/reduxStore/slices/feed/feedSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/reduxStore";
import { Post } from "~/types/post";
import { showFeedback } from "~/utils/feedbackToast";
import TextScallingFalse from "~/components/CentralText";
import CustomHomeHeader from "~/components/ui/CustomHomeHeader";
import debounce from "lodash.debounce";
import eventBus from "~/utils/eventBus";
import PageThemeView from "~/components/PageThemeView";
import PostSkeletonLoader1 from "~/components/skeletonLoaders/PostSkeletonLoader1";
import UploadProgressBar from "~/components/UploadProgressBar";
import DiscoverPeopleList from "~/components/discover/discoverPeopleList";
import { setUploadingCompleted } from "~/reduxStore/slices/post/postSlice";
import RunningLoader from "~/components/skeletonLoaders/PostSkeletonLoader1";
import AddPostContainer from "~/components/modals/AddPostContainer";
import { Link } from "expo-router";

const INTERLEAVE_INTERVAL = 6;

const EmptyComponent = memo(({ error }: { error: any }) => {
  if (error) {
    console.error("Feed Error:", error);
    showFeedback(`Can't retrieve posts now! Try again later!`, "error");
  }
  return <Text style={styles.emptyText}>No new posts available</Text>;
});

const ListFooterComponent = memo(
  ({ isLoading, hasMore }: { isLoading: boolean; hasMore: boolean }) => {
    if (isLoading) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={Colors.themeColor} />
        </View>
      );
    } else if (!hasMore) {
      return (
        <View style={styles.footerMessage}>
          <TextScallingFalse style={styles.footerLargeText}>
            Level Unlocked
          </TextScallingFalse>
          <TextScallingFalse style={styles.footerLargeText2}>
            Ultimate Scoller
          </TextScallingFalse>
          <TextScallingFalse style={styles.footerSmallText}>
            Crafted with &#10084; in Kolkata, IN
          </TextScallingFalse>
        </View>
      );
    } else {
      return null; // No footer needed if more posts are loading
    }
  }
);

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAddPostContainerOpen } = useSelector((state: any) => state?.post);
  console.log(isAddPostContainerOpen);
  const { loading, error, cursor, hasMore } = useSelector(selectFeedState);
  const { isUploadingCompleted } = useSelector(
    (state: RootState) => state.post
  );
  const posts = useSelector(selectAllFeedPosts);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);

  const [visiblePostIds, setVisiblePostIds] = useState<string[]>([]);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 100,
  });

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<any> }) => {
      const visibleIds = viewableItems
        .filter((vi) => vi.item.data && vi.item.data._id)
        .map((vi) => vi.item.data._id);
      setVisiblePostIds(visibleIds);
    }
  ).current;

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return; // Prevent multiple simultaneous refreshes
    setIsRefreshing(true);
    try {
      dispatch(resetFeed());
      await dispatch(fetchFeedPosts({}));
    } finally {
      setIsRefreshing(false);
    }
  }, [dispatch]);

  // Handle upload completion
  useEffect(() => {
    if (isUploadingCompleted) {
      setTimeout(() => {
        // handleRefresh();
      }, 500);
      dispatch(setUploadingCompleted(false));
    }
  }, [isUploadingCompleted, handleRefresh, dispatch]);

  useEffect(() => {
    const scrollListener = () => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    };

    eventBus.addListener("scrollToTop", scrollListener);
    return () => {
      eventBus.removeListener("scrollToTop", scrollListener);
    };
  }, []);

  useEffect(() => {
    dispatch(fetchFeedPosts({ limit: 10, cursor }));
  }, [dispatch]);

  const debouncedRefresh = useMemo(
    () => debounce(handleRefresh, 100),
    [handleRefresh]
  );

  useEffect(() => {
    return () => {
      debouncedRefresh.cancel();
    };
  }, [debouncedRefresh]);

  const handleLoadMore = useCallback(async () => {
    if (hasMore && !loading && cursor) {
      setIsLoading(true);
      await dispatch(fetchFeedPosts({ limit: 10, cursor }));
      setIsLoading(false);
    }
  }, [cursor, dispatch, loading, hasMore]);

  const interleavedData = useMemo(() => {
    return posts.reduce(
      (
        acc: Array<
          { type: "post"; data: Post } | { type: "discover"; id: string }
        >,
        post,
        index
      ) => {
        acc.push({ type: "post", data: post });
        if ((index + 1) % INTERLEAVE_INTERVAL === 0) {
          acc.push({ type: "discover", id: `discover-${index}` });
        }
        return acc;
      },
      []
    );
  }, [posts]);

  const renderItem = useCallback(
    ({ item }: { item: { type: string; data?: Post; id?: string } }) => {
      if (item.type === "post" && item.data) {
        return (
          <View style={styles.fullWidth}>
            <PostContainer
              item={item.data}
              isFeedPage={true}
              isVisible={visiblePostIds.includes(item.data._id)}
            />
            <Divider style={styles.divider} width={0.4} color="#282828" />
          </View>
        );
      }
      return <DiscoverPeopleList key={item.id} />;
    },
    [visiblePostIds]
  );

  const keyExtractor = useCallback(
    (item: { type: "post"; data: Post } | { type: "discover"; id: string }) => {
      return item.type === "post" ? item.data._id : item.id;
    },
    []
  );

  const isAndroid = Platform.OS === "android";

  if (loading && !cursor) {
    return (
      <PageThemeView>
        <CustomHomeHeader />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#12956B" />
        </View>
      </PageThemeView>
    );
  }

  return (
    <PageThemeView>
      <CustomHomeHeader />
      <UploadProgressBar />
      {loading && !cursor ? (
        <ActivityIndicator size="large" color={Colors.themeColor} />
      ) : (
        <GestureHandlerRootView>
          <Animated.FlatList
            ref={flatListRef}
            data={interleavedData}
            keyExtractor={keyExtractor}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig.current}
            scrollEventThrottle={16}
            renderItem={renderItem}
            initialNumToRender={5}
            removeClippedSubviews={isAndroid}
            windowSize={21}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={debouncedRefresh}
                colors={["#12956B", "#6E7A81"]}
                tintColor="#6E7A81"
                progressViewOffset={60}
                progressBackgroundColor="#181A1B"
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={2}
            ListEmptyComponent={<EmptyComponent error={error} />}
            ListFooterComponent={
              <ListFooterComponent isLoading={isLoading} hasMore={hasMore} />
            }
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          />
        </GestureHandlerRootView>
      )}
      {/* Add Post container modal */}
      <AddPostContainer
        text="What's on your mind"
        isAddPostContainerOpen={isAddPostContainerOpen}
      />
    </PageThemeView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "black",
  },
  progressBar: {
    position: "absolute",
    top: 60,
    height: 4,
    backgroundColor: "#12956B",
  },
  fullWidth: {
    width: "100%",
  },
  divider: {
    width: "100%",
  },
  emptyText: {
    color: "white",
    textAlign: "center",
    padding: 16,
  },
  footerLoader: {
    paddingVertical: 16,
  },
  footerMessage: {
    paddingHorizontal: 20,
    marginTop: 10,
    height: 240,
  },
  footerLargeText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#808080c6",
  },
  footerLargeText2: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#808080c6",
  },
  footerSmallText: {
    fontSize: 16,
    color: "#808080",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    paddingTop: 60,
    paddingBottom: 60,
  },
});

export default memo(Home);
