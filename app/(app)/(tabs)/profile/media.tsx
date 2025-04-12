import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { memo } from "react";
import { useSelector } from "react-redux";
import TextScallingFalse from "~/components/CentralText";

const Media = () => {
  const { posts, error, loading } = useSelector((state: any) => state?.profile);

  const memoizedEmptyComponent = memo(() => (
    <Text className="text-white text-center p-4">No images available</Text>
  ));

  // Extract URLs from posts
  const imageUrls = posts
    ?.flatMap((post: any) => post.assets) // Flatten assets from all posts
    ?.map((asset: any) => asset.url) // Extract URLs
    ?.filter((url: any) => url); // Remove empty values

  if (loading)
    return (
      <View className="flex justify-center items-center">
        <ActivityIndicator color="#12956B" size={22} />
      </View>
    );
  if (error)
    return (
      <View className="flex justify-center items-center">
        <TextScallingFalse className="text-red-500">
          {" "}
          Error loading posts
        </TextScallingFalse>
      </View>
    );

  return (
    <View className="h-full">
      <FlatList
        data={imageUrls}
        keyExtractor={(item, index) => `${item}-${index}`}
        numColumns={3} // Adjusts for responsiveness
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            resizeMode="cover"
            style={styles.image}
          />
        )}
        ListEmptyComponent={memoizedEmptyComponent}
      />
    </View>
  );
};

export default Media;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  image: {
    width: width / 2 - 10, // Responsive grid layout (2 columns)
    height: 105, // Fixed height (adjust if needed)
    margin: 5,
  },
});
