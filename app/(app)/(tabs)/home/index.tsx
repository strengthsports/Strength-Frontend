// Home.tsx
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  Text,
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
import { AppDispatch } from "~/reduxStore";
import { Post } from "~/types/post";
import { showFeedback } from "~/utils/feedbackToast";
import TextScallingFalse from "~/components/CentralText";
import { Platform } from "react-native";

const INTERLEAVE_INTERVAL = 6;

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, hasMore, currentPage } = useSelector(selectFeedState);
  const posts = useSelector(selectAllPosts);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // console.log("Current page : ", currentPage);

  useEffect(() => {
    dispatch(fetchFeedPosts({ page: 1 }));
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(resetFeed());
    dispatch(fetchFeedPosts({ page: 1 }));
  }, [dispatch]);

  const handleLoadMore = useCallback(async () => {
    // console.log("Function called");
    if (currentPage !== null && !loading) {
      // console.log("Loading more...");
      setIsLoading(true);
      await dispatch(fetchFeedPosts({ page: currentPage }));
      setIsLoading(false);
    }
  }, [hasMore, loading, currentPage, dispatch]);

  // Posts and Discover People mixed
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
          <View style={{ width: "100%" }}>
            <PostContainer item={item.data} isFeedPage={true} />
            <Divider style={{ width: "100%" }} width={0.4} color="#282828" />
          </View>
        );
      }
      return <DiscoverPeopleList key={item.id} />;
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

  // Empty component
  const EmptyComponent = ({ error }: { error: any }) => {
    if (error) {
      console.error("Feed Error:", error);
      {
        showFeedback(`Can't retrieve posts now! Try again later!`, "error");
      }
    }
    return (
      <Text className="text-white text-center p-4">No new posts available</Text>
    );
  };

  const MemoizedEmptyComponent = memo(EmptyComponent);

  // List Footer component
  const ListFooterComponent = memo(() => {
    if (isLoading) {
      return (
        <View className="py-4">
          <ActivityIndicator size="small" color={Colors.themeColor} />;
        </View>
      );
    } else {
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
  });

  if (loading && currentPage === 1) {
    return (
      <View className="flex-1 bg-black flex justify-center">
        <ActivityIndicator size="large" color={Colors.themeColor} />;
      </View>
    );
  }

  const isAndroid = Platform.OS === "android";

  return (
    <View className="flex-1 bg-black">
      <GestureHandlerRootView>
        <FlatList
          data={interleavedData}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          initialNumToRender={5}
          removeClippedSubviews={isAndroid}
          windowSize={21}
          refreshControl={
            <RefreshControl
              refreshing={loading && currentPage === 1}
              onRefresh={handleRefresh}
              colors={["#12956B", "#6E7A81"]}
              tintColor="#6E7A81"
              progressBackgroundColor="#181A1B"
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={2}
          ListEmptyComponent={<MemoizedEmptyComponent error={error} />}
          ListFooterComponent={<ListFooterComponent />}
        />
      </GestureHandlerRootView>
    </View>
  );
};

export default Home;
