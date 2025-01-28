import {
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Text,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import TextScallingFalse from "~/components/CentralText";
import { memo, useCallback, useMemo, useState } from "react";
import {
  feedPostApi,
  Post,
  useGetFeedPostQuery,
} from "~/reduxStore/api/feedPostApi";
import PostContainer from "~/components/Cards/postContainer";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import debounce from "lodash.debounce";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [postLimit, setPostLimit] = useState(1); // Initial limit

  const user = { id: "67667870ba4cfa5c24a3dc0b", type: "User" };
  const serializedUser = encodeURIComponent(JSON.stringify(user));
  const [lastTimestamp, setLastTimestamp] = useState(Date.now().toString());
  const { data, error, isLoading, refetch } = useGetFeedPostQuery({
    limit: 20, // Fixed limit
    lastTimeStamp: lastTimestamp,
  });

  const isAndroid = Platform.OS === "android";

  const handleRefresh = async () => {
    if (refreshing) return; // Prevent concurrent refreshes
    setRefreshing(true);
    try {
      const newTimestamp = Date.now().toString();
      setLastTimestamp(newTimestamp); // Refresh with latest timestamp

      // Invalidate the cache for 'Posts' tag
      dispatch(feedPostApi.util.invalidateTags(["Posts"]));

      await refetch();
    } finally {
      setRefreshing(false);
    }
  };
  const debouncedRefresh = debounce(handleRefresh, 100); // prevents frequent refresh in the time interval of 1s

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <View className="w-screen pl-3">
        <PostContainer item={item} />
      </View>
    ),
    [] // Empty dependency array ensures the function is memoized and doesn't re-create
  );
  const memoizedEmptyComponent = memo(() => (
    <Text className="text-white text-center p-4">No new posts available</Text>
  ));
  return (
    <SafeAreaView edges={["top", "bottom"]} className="pt-16 flex-1">
      <TouchableOpacity
        onPress={() => router.push(`../(main)/profile/${serializedUser}`)}
      >
        <TextScallingFalse className="p-6 self-center text-2xl text-white">
          Chats
        </TextScallingFalse>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(app)/(main)/teams/InitiateCreateTeam")}
      >
        <TextScallingFalse className="p-6 self-center text-2xl text-white">
          Team
        </TextScallingFalse>
      </TouchableOpacity>

      <FlatList
        data={data?.data?.posts || []}
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
        ListEmptyComponent={memoizedEmptyComponent}
        bounces={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}
