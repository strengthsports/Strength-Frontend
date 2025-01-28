import {
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Text
} from "react-native";
import { useRouter } from "expo-router";
import TextScallingFalse from "~/components/CentralText";
import { useState } from "react";
import { useGetFeedPostQuery } from "~/reduxStore/api/feedPostApi";
import PostContainer from "~/components/Cards/postContainer";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [postLimit, setPostLimit] = useState(1); // Initial limit

  const user = { id: "67667870ba4cfa5c24a3dc0b", type: "User" };
  const serializedUser = encodeURIComponent(JSON.stringify(user));

  const { data, error, isLoading, refetch } = useGetFeedPostQuery({
    limit: postLimit,
    lastTimeStamp: "1738348200000",
  });

  const handleRefresh = async () => {
    console.log('refreshing started')
    setRefreshing(true);
    try {
      setPostLimit((prevLimit) => prevLimit + 1);
      await refetch(); // Fetch with updated limit
            console.log('refreshing done')
    } catch (error) {
      console.error("Refresh error:", error);
    }
    setRefreshing(false);
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} className="pt-16 flex-1">
      <TouchableOpacity
        onPress={() => router.push(`../(main)/profile/${serializedUser}`)}
      >
        <TextScallingFalse className="p-6 self-center text-2xl text-white">
          Chats
        </TextScallingFalse>
      </TouchableOpacity>

      <FlatList
        data={data?.data?.posts || []}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#12956B", "#6E7A81" ]} // Customize indicator colors
            tintColor="#6E7A81" // Color for iOS
            title="Refreshing Your Feed..." // Optional refresh title
            titleColor="#6E7A81"
            progressBackgroundColor="#181A1B" // Background color of the loader

          />
        }

        renderItem={({ item }) => (
          <View className="w-screen pl-3">
            <PostContainer item={item} />
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-white text-center p-4">No new posts available</Text>
        }
        bounces={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}