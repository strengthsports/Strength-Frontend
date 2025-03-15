import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  FlatList,
  RefreshControl,
  Text,
  Platform,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import debounce from "lodash.debounce";
import { Colors } from "~/constants/Colors";
import {
  feedPostApi,
  useGetFeedPostQuery,
} from "~/reduxStore/api/feed/features/feedApi.getFeed";
import PostContainer from "~/components/Cards/postContainer";
import DiscoverPeopleList from "~/components/discover/discoverPeopleList";
import { pushFollowings } from "~/reduxStore/slices/user/profileSlice";
import { Divider } from "react-native-elements";
import TextScallingFalse from "~/components/CentralText";
import { showFeedback } from "~/utils/feedbackToast";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import MoreModal from "~/components/feedPage/moreModal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Portal } from "react-native-paper";
import { StyleSheet } from "react-native";
import { Post } from "~/types/post";
import { BackHandler } from "react-native";

export default function Home() {
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);
  const [lastTimestamp, setLastTimestamp] = useState(Date.now().toString());
  // Track the current page; starting at 1
  const [page, setPage] = useState(1);
  // Local state for storing accumulated posts
  const [posts, setPosts] = useState<Post[]>([]);
  // A flag to prevent duplicate load-more calls
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isBottomSheetOpen, setBottomSheetOpen] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post>();

  const {
    data,
    error,
    isLoading: isFetching,
    refetch,
  } = useGetFeedPostQuery({
    limit: 10,
    page,
    lastTimeStamp: lastTimestamp,
  });

  // Optionally update your followings based on fetched posts
  useEffect(() => {
    if (data?.data?.posts && Array.isArray(data.data.posts)) {
      data.data.posts.forEach((post: any) => {
        if (post?.isFollowing) {
          dispatch(pushFollowings(post.postedBy._id));
        }
      });
    }
  }, [data, dispatch]);

  // Append new posts to the posts state (or reset if it's a refresh)
  useEffect(() => {
    if (data?.data?.posts) {
      if (page === 1) {
        setPosts(data.data.posts);
      } else {
        setPosts((prevPosts) => {
          // Filter out any post that already exists in the list based on _id.
          const newPosts = data.data.posts.filter(
            (post) => !prevPosts.some((prevPost) => prevPost._id === post._id)
          );
          return [...prevPosts, ...newPosts];
        });
      }
      // Reset the loading more flag once new data arrives
      setIsLoadingMore(false);
    }
  }, [data, page]);

  // Handler to refresh the list (pull-to-refresh)
  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      // Reset to the first page and update timestamp for a complete refresh
      setPage(1);
      setLastTimestamp(Date.now().toString());
      dispatch(feedPostApi.util.invalidateTags(["FeedPost"]));
      console.log("Refetching feed data on refresh...");
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const debouncedRefresh = debounce(handleRefresh, 1000);

  // Create an interleaved data array: for every 6 posts, add a discover marker
  const interleavedData = useMemo(() => {
    const data: Array<
      { type: "post"; data: Post } | { type: "discover"; id: string }
    > = [];
    posts.forEach((post, index) => {
      data.push({ type: "post", data: post });
      // After every 6 posts (but not after the last item if not needed)
      if ((index + 1) % 6 === 0) {
        data.push({ type: "discover", id: `discover-${index}` });
      }
    });
    return data;
  }, [posts]);

  // Callback to handle the three dot press from a post
  const handlePressMore = useCallback((post: Post) => {
    setSelectedPost(post);
    setBottomSheetOpen(true);
    bottomSheetRef.current?.expand();
  }, []);

  // Close the more bottom sheet
  const handleCloseBottomSheet = () => {
    setBottomSheetOpen(false);
    bottomSheetRef.current?.close();
  };

  // Close the more bottom sheet on back button press
  useEffect(() => {
    const handleBackPress = () => {
      if (isBottomSheetOpen) {
        handleCloseBottomSheet();
        return true; // Prevent default back action
      }
      return false;
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [isBottomSheetOpen]);

  // Render item based on its type
  const renderItem = useCallback(
    ({
      item,
    }: {
      item: { type: "post"; data: Post } | { type: "discover"; id: string };
    }) => {
      if (item.type === "post") {
        return (
          <View className="w-screen">
            <PostContainer item={item.data} onPressMore={handlePressMore} />
            <Divider
              style={{ marginHorizontal: "auto", width: "100%" }}
              width={0.4}
              color="#282828"
            />
          </View>
        );
      }
      if (item.type === "discover") {
        return <DiscoverPeopleList />;
      }
      return null;
    },
    []
  );

  // Key extractor based on type
  const keyExtractor = useCallback(
    (
      item: { type: "post"; data: Post } | { type: "discover"; id: string },
      index: number
    ) => {
      if (item.type === "post") {
        return item.data._id;
      }
      return item.id;
    },
    []
  );

  const EmptyComponent = ({ error }: { error: any }) => {
    if (error) {
      console.error("Feed Error:", error);
      <>
        {showFeedback(`Can't retrieve posts now! Try again later!`, "error")}
      </>;
    }
    return (
      <Text className="text-white text-center p-4">No new posts available</Text>
    );
  };

  const MemoizedEmptyComponent = memo(EmptyComponent);

  // Initial fetch on component mount
  useLayoutEffect(() => {
    const fetchData = async () => {
      setRefreshing(true);
      try {
        console.log("Fetching feed data on mount...");
        const result = await refetch();
        console.log("API Response:", result);
      } finally {
        setRefreshing(false);
      }
    };

    fetchData();
  }, []);

  // Load more posts when the end of the list is reached
  const handleLoadMore = () => {
    // Only fetch more if:
    // - Not already loading more
    // - There is a next page from the API
    if (!isFetching && !isLoadingMore && data?.data?.nextPage != null) {
      // Set a flag to prevent duplicate calls
      setIsLoadingMore(true);
      // Update the page to the next page
      setPage(data.data.nextPage);
    }
  };

  const isAndroid = Platform.OS === "android";

  if (isFetching && page === 1) {
    // Show a full-screen loader on the initial fetch.
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={Colors.themeColor} />
      </View>
    );
  }

  // List footer to display the loader during pagination
  const ListFooterComponent = () => {
    if (isLoadingMore) {
      return (
        <View style={{ padding: 10, height: 30 }}>
          <ActivityIndicator size="small" color={Colors.themeColor} />
        </View>
      );
    }
    if (data?.data?.nextPage === null) {
      return (
        <View className="px-10 mt-10 h-80">
          <TextScallingFalse className="text-[60px] font-bold text-[#808080c6]">
            you
          </TextScallingFalse>
          <TextScallingFalse className="text-[60px] font-bold text-[#808080c6]">
            did it!
          </TextScallingFalse>
          <TextScallingFalse className="text-4xl text-neutral-400">
            Crafted with &#10084; in Kolkata, IN{" "}
          </TextScallingFalse>
        </View>
      );
    }
    return <View className="mt-10" />;
  };

  return (
    <View className="flex-1">
      {isBottomSheetOpen && (
        <Pressable style={styles.overlay} onPress={handleCloseBottomSheet} />
      )}
      <GestureHandlerRootView>
        <FlatList
          data={interleavedData}
          keyExtractor={keyExtractor}
          initialNumToRender={5}
          removeClippedSubviews={isAndroid}
          windowSize={11}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={debouncedRefresh}
              colors={["#12956B", "#6E7A81"]}
              tintColor="#6E7A81"
              title="Refreshing Your Feed..."
              titleColor="#6E7A81"
              progressBackgroundColor="#181A1B"
            />
          }
          renderItem={renderItem}
          ListEmptyComponent={<MemoizedEmptyComponent error={error} />}
          ListFooterComponent={ListFooterComponent}
          bounces={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5} // Adjust as needed
        />
        <Portal>
          <BottomSheet
            ref={bottomSheetRef}
            backgroundStyle={{
              backgroundColor: "#171717",
              borderColor: "#404040",
            }}
            handleIndicatorStyle={{
              backgroundColor: "#fff",
              width: 64,
              height: 4,
            }}
            backgroundComponent={({ style }) => (
              <View style={[style, styles.customBackground]} />
            )}
            enablePanDownToClose
            onClose={handleCloseBottomSheet}
          >
            <BottomSheetView style={{ position: "absolute", zIndex: 50 }}>
              {selectedPost && (
                <MoreModal
                  firstName={selectedPost.postedBy.firstName}
                  followingStatus={selectedPost.followingStatus}
                  isOwnPost={
                    selectedPost.postedBy._id === selectedPost.currUser
                  }
                  postId={selectedPost._id}
                  isReported={selectedPost.isReported}
                />
              )}
            </BottomSheetView>
          </BottomSheet>
        </Portal>
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black", // Color overlay when bottom sheet is open
    opacity: 0.5, // Adjust opacity as needed
    zIndex: 50,
  },
  customBackground: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderColor: "#404040",
    borderWidth: 0.5,
  },
});
