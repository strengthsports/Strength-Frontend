// Home.tsx
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
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash.debounce";
import { Colors } from "~/constants/Colors";
import {
  feedPostApi,
  useGetFeedPostQuery,
} from "~/reduxStore/api/feed/features/feedApi.getFeed";
import PostContainer, {
  PostContainerHandles,
} from "~/components/Cards/postContainer";
import DiscoverPeopleList from "~/components/discover/discoverPeopleList";
import { Divider } from "react-native-elements";
import TextScallingFalse from "~/components/CentralText";
import { showFeedback } from "~/utils/feedbackToast";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  postsSelectors,
  setPosts,
  appendPosts,
} from "~/reduxStore/slices/post/postSlice";
import processFeedData from "~/utils/processFeed";
import { setUsers } from "~/reduxStore/slices/user/usersSlice";
import { Post } from "~/types/post";

export default function Home() {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [lastTimestamp, setLastTimestamp] = useState(Date.now().toString());
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isBottomSheetOpen, setBottomSheetOpen] = useState<boolean>(false);
  const postContainerRef = useRef<PostContainerHandles>(null);

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

  // When data is fetched, process and dispatch posts and users to the Redux store.
  useEffect(() => {
    if (data) {
      const { posts, users } = processFeedData(data.data.posts);

      if (page === 1) {
        dispatch(setPosts(posts)); // Replace for the first page
      } else {
        dispatch(appendPosts(posts)); // Append for pagination
      }

      dispatch(setUsers(users));
      setIsLoadingMore(false); // Reset loading state after fetching
    }
  }, [data, dispatch, page]);

  // Select posts directly from Redux
  const posts = useSelector((state: any) => postsSelectors.selectAll(state));

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      setPage(1);
      setLastTimestamp(Date.now().toString());
      dispatch(feedPostApi.util.invalidateTags(["FeedPost"]));
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const debouncedRefresh = debounce(handleRefresh, 1000);

  // Interleave discover markers every 6 posts.
  const interleavedData = useMemo(() => {
    const dataArray: Array<
      { type: "post"; data: Post } | { type: "discover"; id: string }
    > = [];
    posts.forEach((post, index) => {
      dataArray.push({ type: "post", data: post });
      if ((index + 1) % 6 === 0) {
        dataArray.push({ type: "discover", id: `discover-${index}` });
      }
    });
    return dataArray;
  }, [posts]);

  const renderItem = useCallback(
    ({
      item,
    }: {
      item: { type: "post"; data: Post } | { type: "discover"; id: string };
    }) => {
      if (item.type === "post") {
        return (
          <View style={{ width: "100%" }}>
            <PostContainer
              ref={postContainerRef}
              item={item.data}
              isFeedPage={true}
              handleBottomSheet={setBottomSheetOpen}
            />
            <Divider style={{ width: "100%" }} width={0.4} color="#282828" />
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

  const keyExtractor = useCallback(
    (
      item: { type: "post"; data: Post } | { type: "discover"; id: string },
      index: number
    ) => {
      return item.type === "post" ? item.data._id : item.id;
    },
    []
  );

  const ListFooterComponent = React.memo(() => {
    if (isLoadingMore) {
      return <ActivityIndicator size="large" color={Colors.themeColor} />;
    }
    if (data?.data?.nextPage === null) {
      return (
        <View className="px-10 mt-10 h-60">
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
    return <View style={{ marginVertical: 20 }} />;
  });

  useLayoutEffect(() => {
    const fetchData = async () => {
      setRefreshing(true);
      try {
        await refetch();
      } finally {
        setRefreshing(false);
      }
    };
    fetchData();
  }, [refetch]);

  const handleLoadMore = () => {
    if (!isFetching && !isLoadingMore && data?.data?.nextPage != null) {
      setIsLoadingMore(true); // Ensure loading state is set before fetching
      setPage((prev) => prev + 1);
    }
  };

  const isAndroid = Platform.OS === "android";

  if (isFetching && page === 1) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.themeColor} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      {isBottomSheetOpen && (
        <Pressable style={styles.overlay} onPress={handleRefresh} />
      )}
      <GestureHandlerRootView>
        <FlatList
          data={interleavedData}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.7}
          ListFooterComponent={ListFooterComponent}
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
          bounces={false}
          contentContainerStyle={{ paddingBottom: 40, minHeight: "100%" }}
        />
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
    opacity: 0.5,
    zIndex: 50,
  },
});
