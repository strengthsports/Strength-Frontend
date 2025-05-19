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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/reduxStore";
import { Post } from "~/types/post";
import TextScallingFalse from "~/components/CentralText";
import CustomHomeHeader from "~/components/ui/CustomHomeHeader";
import debounce from "lodash.debounce";
import eventBus from "~/utils/eventBus";
import PageThemeView from "~/components/PageThemeView";
import UploadProgressBar from "~/components/UploadProgressBar";
import DiscoverPeopleList from "~/components/discover/discoverPeopleList";
import { setUploadingCompleted } from "~/reduxStore/slices/post/postSlice";
import FeedTopFtu from "~/components/ui/FTU/feedPage/FeedTopFtu";
import { makeSelectFeedPosts } from "~/reduxStore/slices/post/selectors";
import { fetchFeedPosts } from "~/reduxStore/slices/post/hooks";
import { resetFeed } from "~/reduxStore/slices/post/postsSlice";
import SuggestedArticlesCard from "~/components/Cards/SuggestedArticlesCard";
import { useGetSportArticleQuery } from "~/reduxStore/api/explore/article/sportArticleApi";

const INTERLEAVE_INTERVAL = 6;

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
            Level Unlocked:
          </TextScallingFalse>
          <TextScallingFalse style={styles.footerLargeText2}>
            Ultimate Scroller!
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
  const { isUploadingCompleted } = useSelector(
    (state: RootState) => state.post
  );
  const selectFeedPosts = useCallback(makeSelectFeedPosts, []);

  const posts = useSelector(selectFeedPosts);
  const nextCursor = useSelector(
    (state: RootState) => state.views.feed.nextCursor ?? null
  );
  const hasMore = useSelector(
    (state: RootState) => state.views.feed.hasMore ?? false
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);
  const profile = useSelector((state: RootState) => state.profile);

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

  // Load feed posts function
  const loadPosts = async (cursor?: string | null) => {
    await dispatch(fetchFeedPosts({ limit: 10, cursor }));
  };

  // Refresh function
  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return; // Prevent multiple simultaneous refreshes
    setIsRefreshing(true);
    try {
      dispatch(resetFeed());
      await dispatch(fetchFeedPosts({ limit: 10 }));
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

  // Fetch feed posts on initial page mount
  useEffect(() => {
    dispatch(fetchFeedPosts({ limit: 10 }));
  }, [dispatch]);

  // Handle load more feed posts
  const handleLoadMore = async () => {
    if (!nextCursor || isLoading) return;
    setIsLoadingMore(true);
    await loadPosts(nextCursor);
    setIsLoadingMore(false);
  };

  const debouncedRefresh = useMemo(
    () => debounce(handleRefresh, 100),
    [handleRefresh]
  );

  useEffect(() => {
    return () => {
      debouncedRefresh.cancel();
    };
  }, [debouncedRefresh]);

  // Scroll to top on press home option
  useEffect(() => {
    const scrollListener = () => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    };

    eventBus.addListener("scrollToTop", scrollListener);
    return () => {
      eventBus.removeListener("scrollToTop", scrollListener);
    };
  }, []);

  // Mix Posts and discover section
  const interleavedData = useMemo(() => {
  return posts.reduce(
    (
      acc: Array<
        { type: "post"; data: Post } | { type: "discover"; id: string } | { type: "article"; id: string }
      >,
      post,
      index
    ) => {
      acc.push({ type: "post", data: post });

      if ((index + 1) % INTERLEAVE_INTERVAL === 0) {
        const blockIndex = Math.floor((index + 1) / INTERLEAVE_INTERVAL);
        if (blockIndex % 2 === 1) {
          // odd block (1st, 3rd...) → Discover
          acc.push({ type: "discover", id: `discover-${index}` });
        } else {
          // even block (2nd, 4th...) → SuggestedArticle
          acc.push({ type: "article", id: `article-${index}` });
        }
      }

      return acc;
    },
    []
  );
}, [posts]);


  const {
    data: articles,
    error,
    refetch: refetchSportArticles,
  } = useGetSportArticleQuery();
  const topFiveArticles = articles?.slice(0, 6);

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
          <Divider style={styles.divider} width={1} color="#1c1c1c" />
        </View>
      );
    }

    if (item.type === "discover") {
      return <DiscoverPeopleList key={item.id} />;
    }

    if (item.type === "article" && topFiveArticles?.length) {
      return (
          <SuggestedArticlesCard swiperData={topFiveArticles ?? []} key={item.id}/>
      );
    }

    return null;
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

  if (isRefreshing || (isLoading && !nextCursor)) {
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
          ListHeaderComponent={
            // Show FeedTopFtu if at least one state is false, hide if all are true
            !(
              profile?.hasVisitedEditProfile &&
              profile?.hasVisitedEditOverview &&
              profile?.hasVisitedCommunity
            ) && <FeedTopFtu />
          }
          ListFooterComponent={
            <ListFooterComponent isLoading={isLoadingMore} hasMore={hasMore} />
          }
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        />
      </GestureHandlerRootView>
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
