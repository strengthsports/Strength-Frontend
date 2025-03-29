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
import { SafeAreaView } from "react-native-safe-area-context";
import debounce from "lodash.debounce";

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
  const isPostProgressOn = useSelector(
    (state: RootState) => state.post.isPosting
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);
  const { scrollY } = useScroll();

  // Animated progress value for the progress bar
  const progress = useRef(new Animated.Value(0)).current;
  const widthInterpolated = useMemo(
    () =>
      progress.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
      }),
    [progress]
  );

  // Animate progress when posting comment
  useEffect(() => {
    if (isPostProgressOn) {
      Animated.timing(progress, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }).start();
    } else {
      progress.setValue(0);
    }
  }, [isPostProgressOn, progress]);

  // Listener for tab press to scroll to top and refresh posts
  useEffect(() => {
    const parentNavigation = navigation.getParent();
    let refetchStartTimeout: NodeJS.Timeout;

    const onTabPress = () => {
      if (navigation.isFocused()) {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        setIsRefreshing(true);
        refetchStartTimeout = setTimeout(() => {
          debouncedRefresh();
        }, 1000);
      }
    };

    const unsubscribe = parentNavigation?.addListener("tabPress", onTabPress);

    return () => {
      unsubscribe?.();
      clearTimeout(refetchStartTimeout);
    };
  }, [navigation]);

  // Fetch posts on mount
  useEffect(() => {
    dispatch(fetchFeedPosts({ page: 1 }));
  }, [dispatch]);

  // Refresh posts handler
  const handleRefresh = useCallback(() => {
    dispatch(resetFeed());
    dispatch(fetchFeedPosts({ page: 1 }));
    setIsRefreshing(false);
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
            <PostContainer item={item.data} isFeedPage={true} />
            <Divider style={styles.divider} width={0.4} color="#282828" />
          </View>
        );
      }
      return <DiscoverPeopleList key={item.id} />;
    },
    []
  );

  // Key extractor based on item type
  const keyExtractor = useCallback(
    (item: { type: "post"; data: Post } | { type: "discover"; id: string }) => {
      return item.type === "post" ? item.data._id : item.id;
    },
    []
  );

  const isAndroid = Platform.OS === "android";

  if (isLoading && currentPage === 1) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.themeColor} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHomeHeader />
      {isPostProgressOn && (
        <Animated.View
          style={[styles.progressBar, { width: widthInterpolated }]}
        />
      )}
      <GestureHandlerRootView>
        <Animated.FlatList
          ref={flatListRef}
          data={interleavedData}
          keyExtractor={keyExtractor}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
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
        />
      </GestureHandlerRootView>
    </SafeAreaView>
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
  },
});

export default memo(Home);
