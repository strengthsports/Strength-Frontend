import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import React from "react";
import { useSelector } from "react-redux";

const ImagesScreen = () => {
  const { posts, error, loading } = useSelector((state: any) => state?.profile);

  if (loading)
    return <Text className="text-white text-center">Loading...</Text>;
  if (error)
    return (
      <Text className="text-red-500 text-center">Error loading images</Text>
    );

  // Extract URLs from posts
  const imageUrls = posts
    ?.flatMap((post: any) => post.assets) // Flatten assets from all posts
    ?.map((asset: any) => asset.url) // Extract URLs
    ?.filter((url: any) => url); // Remove empty values

  return (
    <View className="h-full flex-row justify-center">
      <FlatList
        data={imageUrls}
        keyExtractor={(item, index) => `${item}-${index}`}
        numColumns={2} // Adjusts for responsiveness
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            resizeMode="contain" // Maintains aspect ratio
            style={styles.image}
          />
        )}
      />
    </View>
  );
};

export default ImagesScreen;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  image: {
    width: width / 2 - 10, // Responsive grid layout (2 columns)
    height: 105, // Fixed height (adjust if needed)
    margin: 5,
    // borderRadius: 10,
  },
});
