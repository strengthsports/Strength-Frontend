// Home.tsx
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
  Image,
  ScrollView,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";
import PostContainer from "@/components/Cards/postContainer";
import DiscoverPeopleList from "@/components/discover/discoverPeopleList";
import { Divider } from "react-native-elements";
import {
  fetchFeedPosts,
  resetFeed,
  selectAllPosts,
  selectFeedState,
} from "~/reduxStore/slices/feed/feedSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/reduxStore";
import { Post } from "~/types/post";
import { showFeedback } from "~/utils/feedbackToast";
import TextScallingFalse from "~/components/CentralText";
import { useNavigation } from "@react-navigation/native";
import { useScroll } from "~/context/ScrollContext";
import CustomHomeHeader from "~/components/ui/CustomHomeHeader";
import debounce from "lodash.debounce";
import eventBus from "~/utils/eventBus";
import PageThemeView from "~/components/PageThemeView";
import PostSkeletonLoader1 from "~/components/skeletonLoaders/PostSkeletonLoader1";
import UploadProgressBar from "~/components/UploadProgressBar";

const INTERLEAVE_INTERVAL = 6;

// Moved outside to prevent re-creation on each render
const EmptyComponent = memo(({ error }: { error: any }) => {
  if (error) {
    console.error("Feed Error:", error);
    showFeedback(`Can't retrieve posts now! Try again later!`, "error");
  }
  return <Text style={styles.emptyText}>No new posts available</Text>;
});

const ListFooterComponent = memo(({ isLoading }: { isLoading: boolean }) => {
  if (isLoading) {
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.themeColor} />
      </View>
    );
  } else {
    return (
      <View style={styles.footerMessage}>
        <TextScallingFalse style={styles.footerLargeText}>
          you
        </TextScallingFalse>
        <TextScallingFalse style={styles.footerLargeText}>
          did it!
        </TextScallingFalse>
        <TextScallingFalse style={styles.footerSmallText}>
          Crafted with &#10084; in Kolkata, IN
        </TextScallingFalse>
      </View>
    );
  }
});

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { loading, error, hasMore, currentPage } = useSelector(selectFeedState);
  const posts = useSelector(selectAllPosts);
  const { progress } = useSelector((state: RootState) => state.post);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);
  const { scrollY } = useScroll();

  // state for visible posts; assume each post has a unique id in item.data.id
  const [visiblePostIds, setVisiblePostIds] = useState<string[]>([]);

  // viewabilityConfig: consider an item visible if 100% of it is onscreen
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 100,
  });

  // Handle updates to visible items
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<any> }) => {
      // Extract post IDs of visible items that are of type "post"
      const visibleIds = viewableItems
        .filter((vi) => vi.item.data && vi.item.data._id)
        .map((vi) => vi.item.data._id);
      setVisiblePostIds(visibleIds);
    }
  ).current;

  // Refresh posts handler
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    dispatch(resetFeed());
    dispatch(fetchFeedPosts({ page: 1 }));
    setIsRefreshing(false);
  }, [dispatch]);

  // Listener for tab press to scroll to top and refresh posts
  useEffect(() => {
    const scrollListener = () => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      // setIsRefreshing(true);
      // // You can add a slight delay if needed before refreshing
      // setTimeout(() => {
      //   handleRefresh();
      // }, 1000);
    };

    eventBus.addListener("scrollToTop", scrollListener);
    return () => {
      eventBus.removeListener("scrollToTop", scrollListener);
    };
  }, []);

  // Fetch posts on mount
  useEffect(() => {
    dispatch(fetchFeedPosts({ page: 1 }));
  }, [dispatch]);

  // Debounced refresh to avoid multiple rapid calls
  const debouncedRefresh = useMemo(
    () => debounce(handleRefresh, 1000),
    [handleRefresh]
  );

  useEffect(() => {
    return () => {
      debouncedRefresh.cancel();
    };
  }, [debouncedRefresh]);

  // Load more posts handler
  const handleLoadMore = useCallback(async () => {
    if (currentPage !== null && !loading) {
      setIsLoading(true);
      await dispatch(fetchFeedPosts({ page: currentPage }));
      setIsLoading(false);
    }
  }, [currentPage, dispatch, loading]);

  // Interleave posts with discover people items
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

  // Render items based on type
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

  // Key extractor based on item type
  const keyExtractor = useCallback(
    (item: { type: "post"; data: Post } | { type: "discover"; id: string }) => {
      return item.type === "post" ? item.data._id : item.id;
    },
    []
  );

  const isAndroid = Platform.OS === "android";

  if (loading && currentPage === 1) {
    console.log("\n\nLOADING...", currentPage);
    return (
      <PageThemeView>
        <CustomHomeHeader />
        <ScrollView
          contentContainerStyle={{
            marginTop: 65,
            alignItems: "flex-start",
            justifyContent: "flex-start",
            width: "100%",
            flex: 1,
            backgroundColor: "#000",
          }}
        >
          <PostSkeletonLoader1 />
          <PostSkeletonLoader1 />
          <PostSkeletonLoader1 />
        </ScrollView>
      </PageThemeView>
    );
  }

  return (
    <PageThemeView>
      <CustomHomeHeader />
      <UploadProgressBar />
      {loading && currentPage === 1 ? (
        <ActivityIndicator size="large" color={Colors.themeColor} />
      ) : (
        <GestureHandlerRootView>
          <Animated.FlatList
            ref={flatListRef}
            data={interleavedData}
            keyExtractor={keyExtractor}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig.current}
            scrollEventThrottle={16}
            renderItem={renderItem}
            initialNumToRender={5}
            removeClippedSubviews={isAndroid}
            windowSize={21}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing || (loading && currentPage === 1)}
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
            ListFooterComponent={<ListFooterComponent isLoading={isLoading} />}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          />
        </GestureHandlerRootView>
      )}
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
