import {
  View,
  FlatList,
  RefreshControl,
  Text,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { memo, useCallback, useEffect, useLayoutEffect, useState } from "react";
import PostContainer from "~/components/Cards/postContainer";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import debounce from "lodash.debounce";
import { Colors } from "~/constants/Colors";
import {
  feedPostApi,
  Post,
  useGetFeedPostQuery,
} from "~/reduxStore/api/feed/features/feedApi.getFeed";
import { pushFollowings } from "~/reduxStore/slices/user/authSlice";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [lastTimestamp, setLastTimestamp] = useState(Date.now().toString());

  const {
    data,
    error,
    isLoading: isFetching,
    refetch,
  } = useGetFeedPostQuery({
    limit: 20, // Fixed limit
    lastTimeStamp: lastTimestamp,
  });

  // console.log("Post Data : ", data);

  const isAndroid = Platform.OS === "android";

  // Set following statuses
  useEffect(() => {
    if (data?.data?.posts && Array.isArray(data.data.posts)) {
      data.data.posts.forEach((post: any) => {
        if (post?.isFollowing) {
          dispatch(pushFollowings(post.postedBy._id));
        }
      });
    }
  }, [data, dispatch]);

  const handleRefresh = async () => {
    if (refreshing) return; // Prevent concurrent refreshes
    setRefreshing(true);
    try {
      const newTimestamp = Date.now().toString();
      setLastTimestamp(newTimestamp); // Refresh with latest timestamp

      // Invalidate the cache for 'Posts' tag
      dispatch(feedPostApi.util.invalidateTags(["FeedPost"]));
      console.log("Refetching feed data from handle refetch...");
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const debouncedRefresh = debounce(handleRefresh, 1000); // prevents frequent refresh in the time interval of 1s

  const renderItem = useCallback(
    ({ item }: { item: Post }) => {
      return (
        <View className="w-screen">
          <PostContainer item={item} />
        </View>
      );
    },
    []
  );
  const EmptyComponent = ({ error }: { error: any }) => {
    if (error) {
      console.error("Feed Error:", error);
    }
    return (
      <Text className="text-white text-center p-4">No new posts available</Text>
    );
  };

  const MemoizedEmptyComponent = memo(EmptyComponent);

  // Fetch data only once on initial mount
  useLayoutEffect(() => {
    const fetchData = async () => {
      setRefreshing(true);
      try {
        console.log("Fetching feed data on initial mount...");
        const result = await refetch();
        console.log("API Response:", result);
      } finally {
        setRefreshing(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

  if (isFetching) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={Colors.themeColor} />
      </View>
    );
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1">
      <FlatList
        data={data?.posts || []}
        keyExtractor={(item) => item._id}
        initialNumToRender={5}
        removeClippedSubviews={isAndroid}
        windowSize={11}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={debouncedRefresh}
            colors={["#12956B", "#6E7A81"]} // Customize indicator colors
            tintColor="#6E7A81" // Color for iOS
            title="Refreshing Your Feed..." // Optional refresh title - iOS
            titleColor="#6E7A81"
            progressBackgroundColor="#181A1B" // Background color of the loader
          />
        }
        renderItem={renderItem}
        ListEmptyComponent={<MemoizedEmptyComponent error={error} />}
        bounces={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}