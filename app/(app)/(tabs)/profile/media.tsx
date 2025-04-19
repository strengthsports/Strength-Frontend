import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { memo, useMemo } from "react";
import { useSelector } from "react-redux";
import TextScallingFalse from "~/components/CentralText";
import { router, Href } from "expo-router";

const Media = () => {
  const { posts, error, loading } = useSelector((state: any) => state?.profile);

  const memoizedEmptyComponent = memo(() => (
    <Text className="text-white text-center p-4">No images available</Text>
  ));

  const imageData = useMemo(() => {
    return (
      posts?.flatMap((post: any) => {
        if (!post?._id) return []; // Skip posts without an ID
        return (
          post.assets
            // Ensure asset and asset.url exist
            ?.filter((asset: any) => asset?.url)
            ?.map((asset: any) => ({
              imageUrl: asset.url,
              postId: post._id, // Associate the post ID with the image URL
            })) || [] // Handle case where assets might be null/undefined
        );
      }) || [] // Handle case where posts might be null/undefined
    );
  }, [posts]);

  if (loading)
    return (
      <View className="flex justify-center items-center h-full">
        <ActivityIndicator color="#12956B" size={22} />
      </View>
    );
  if (error)
    return (
      <View className="flex justify-center items-center h-full">
        <TextScallingFalse className="text-red-500">
          Error loading posts
        </TextScallingFalse>
      </View>
    );

  return (
    <View className="flex-1 bg-red-500">
      <FlatList
        data={imageData}
        keyExtractor={(item, index) =>
          `${item.postId}-${item.imageUrl}-${index}`
        }
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              if (item.postId) {
                console.log(
                  `Navigating to Post Details for postId: ${item.postId}` // Debug log
                );
                router.push({
                  pathname: "/post-details/[postId]",
                  params: { postId: item.postId },
                } as Href);
              } else {
                console.warn(
                  "Could not navigate: postId is missing for image",
                  item.imageUrl
                );
              }
            }}
          >
            <Image
              source={{ uri: item.imageUrl }}
              resizeMode="cover"
              style={styles.image}
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={memoizedEmptyComponent}
        contentContainerStyle={{ paddingBottom: 4 }}
      />
    </View>
  );
};

export default Media;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  image: {
    width: width / 3 - 4,
    height: width / 3 - 4,
    margin: 2,
    backgroundColor: "green",
  },
});
