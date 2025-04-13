import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { memo, useContext, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import TextScallingFalse from "~/components/CentralText";
import { useLocalSearchParams } from "expo-router";
import { useLazyGetSpecificUserPostQuery } from "~/reduxStore/api/profile/profileApi.post";
import { ProfileContext } from "./_layout";

const Media = () => {
  const params = useLocalSearchParams();
     
  const fetchedUserId = useMemo(() => {
    return params.userId
      ? JSON.parse(decodeURIComponent(params?.userId as string))
      : null;
  }, [params.userId]);
 
  const [getUserSpecificPost, { data: posts }] = useLazyGetSpecificUserPostQuery();
       
  useEffect(() => {
    getUserSpecificPost({
      postedBy: fetchedUserId?.id,
      postedByType: fetchedUserId?.type,
      limit: 10,
      skip: 0,
    });
  }, []);
 
  const { profileData, isLoading, error } = useContext(ProfileContext);

  const memoizedEmptyComponent = memo(() => (
    <Text className="text-white text-center p-4">No images available</Text>
  ));

  // Extract URLs from posts
  const imageUrls = posts
    ?.flatMap((post: any) => post.assets) // Flatten assets from all posts
    ?.map((asset: any) => asset.url) // Extract URLs
    ?.filter((url: any) => url); // Remove empty values

  if (isLoading)
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
    <View className="flex-1 mt-[2px]">
      <FlatList
        data={imageUrls}
        keyExtractor={(item, index) => `${item}-${index}`}
        numColumns={3}
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
    width: width / 3 - 4,
    height: width / 3 - 4,
    margin: 2,
  },
});
