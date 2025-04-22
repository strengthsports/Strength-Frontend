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
import React, {
  memo,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import TextScallingFalse from "~/components/CentralText";
import { useLocalSearchParams, router, Href } from "expo-router";
import { useLazyGetSpecificUserPostQuery } from "~/reduxStore/api/profile/profileApi.post";
import { ProfileContext } from "./_layout";
import * as VideoThumbnails from "expo-video-thumbnails";
import ClipsIcon from "~/components/SvgIcons/addpost/ClipsIcon";
import { Post } from "~/types/post";
import ClipsIconMedia from "~/components/SvgIcons/profilePage/ClipsIconMedia";

interface MediaItem {
  imageUrl: string;
  postId: string;
  isVideoAsset: boolean;
  thumbnailUrl?: string;
}

const Media = () => {
  const params = useLocalSearchParams();
  const {
    profileData,
    isLoading: profileIsLoading,
    error: profileHasError,
  } = useContext(ProfileContext);

  const fetchedUserId = useMemo(() => {
    try {
      return params.userId
        ? JSON.parse(decodeURIComponent(params?.userId as string))
        : null;
    } catch (e) {
      console.error("Failed to parse userId param:", e);
      return null;
    }
  }, [params.userId]);

  const [
    getUserSpecificPost,
    {
      data: postsData,
      isLoading: postsIsLoading,
      isFetching: postsIsFetching,
      error: postsError,
      isError: postsIsError,
    },
  ] = useLazyGetSpecificUserPostQuery();

  // console.log("Raw postsData from API:", JSON.stringify(postsData, null, 2));

  const [processedImageData, setProcessedImageData] = useState<MediaItem[]>([]);
  const [thumbnailsLoading, setThumbnailsLoading] = useState(false);

  useEffect(() => {
    if (fetchedUserId?.id && fetchedUserId?.type) {
      getUserSpecificPost({
        postedBy: fetchedUserId.id,
        postedByType: fetchedUserId.type,
        limit: 30,
        skip: 0,
      });
    }
  }, [fetchedUserId?.id, fetchedUserId?.type, getUserSpecificPost]);

  const initialImageData = useMemo<MediaItem[]>(() => {
    const posts: Post[] = postsData || [];

    const mappedData =
      posts.flatMap((post: Post): MediaItem[] => {
        if (!post?._id || !post.assets || post.assets.length === 0) {
          return [];
        }

        const isVideoPost = post.isVideo === true;

        return (
          post.assets
            ?.filter((asset) => asset && asset.url)
            ?.map(
              (asset): MediaItem => ({
                imageUrl: asset.url,
                postId: post._id,
                isVideoAsset: isVideoPost,
                thumbnailUrl: undefined,
              })
            ) || []
        );
      }) || [];
    return mappedData;
  }, [postsData]);

  useEffect(() => {
    const generateThumbnails = async (mediaItems: MediaItem[]) => {
      setThumbnailsLoading(true);
      let updated = false;
      const thumbnailPromises = mediaItems.map(async (item, index) => {
        if (item.isVideoAsset && item.imageUrl && !item.thumbnailUrl) {
          try {
            const { uri } = await VideoThumbnails.getThumbnailAsync(
              item.imageUrl,
              { time: 1000, quality: 0.5 }
            );
            return { index, thumbnailUrl: uri };
          } catch (error) {
            console.warn(
              `Failed to generate thumbnail for ${item.imageUrl}:`,
              error
            );
            return { index, thumbnailUrl: null };
          }
        }
        return null;
      });
      const results = await Promise.all(thumbnailPromises);
      setProcessedImageData((currentData) => {
        const newData = [...currentData];
        results.forEach((result) => {
          if (result && result.thumbnailUrl !== undefined) {
            if (
              newData[result.index] &&
              newData[result.index].thumbnailUrl !== result.thumbnailUrl
            ) {
              newData[result.index] = {
                ...newData[result.index],
                thumbnailUrl: result.thumbnailUrl ?? undefined,
              };
              updated = true;
            }
          }
        });
        return updated ? newData : currentData;
      });
      setThumbnailsLoading(false);
    };

    setProcessedImageData(initialImageData);
    const videosToProcess = initialImageData.filter(
      (item) => item.isVideoAsset && !item.thumbnailUrl
    );
    if (videosToProcess.length > 0) {
      generateThumbnails(initialImageData);
    } else {
      setThumbnailsLoading(false);
    }
  }, [initialImageData]);

  const MemoizedEmptyComponent = memo(() => (
    <View style={styles.centerContent}>
      <Text className="text-white text-center p-4">No media available</Text>
    </View>
  ));

  const renderGridItem = useCallback(
    ({ item }: { item: MediaItem }) => {
      const displayUri = item.isVideoAsset ? item.thumbnailUrl : item.imageUrl;
      const sourceUri = displayUri || null;
      const handlePress = () => {
        if (item.postId) {
          router.push({
            pathname: "/post-details/[postId]",
            params: { postId: item.postId },
          } as Href);
        } else {
          console.warn(
            "Could not navigate: postId is missing for media item",
            item.imageUrl
          );
        }
      };
      const iconSize = 20;

      return (
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.itemContainer}
          onPress={handlePress}
        >
          {sourceUri ? (
            <Image
              source={{ uri: sourceUri }}
              resizeMode="cover"
              style={styles.image}
            />
          ) : (
            <View style={[styles.image, styles.placeholder]}>
              {(item.isVideoAsset || thumbnailsLoading) && (
                <ActivityIndicator size="small" color="#ccc" />
              )}
            </View>
          )}
          {item.isVideoAsset && (
            <>
              <View style={styles.videoOverlay} />
              <View style={styles.iconContainer}>
                <ClipsIconMedia size={iconSize} />
              </View>
            </>
          )}
        </TouchableOpacity>
      );
    },
    [thumbnailsLoading]
  );

  const keyExtractor = useCallback(
    (item: MediaItem, index: number) =>
      `${item.postId}-${item.imageUrl}-${index}`,
    []
  );

  const isLoading = profileIsLoading || postsIsLoading || postsIsFetching;
  const hasError = profileHasError || postsIsError;
  const error = profileHasError || postsError;

  if (isLoading && !processedImageData.length) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator color="#12956B" size={22} />
      </View>
    );
  }

  if (hasError && !processedImageData.length) {
    return (
      <View style={styles.centerContent}>
        <TextScallingFalse className="text-red-500">
          Error loading media. {JSON.stringify(error)}
        </TextScallingFalse>
      </View>
    );
  }

  return (
    <View className="flex-1 mt-[5px]">
      <FlatList
        data={processedImageData}
        keyExtractor={keyExtractor}
        numColumns={3}
        renderItem={renderGridItem}
        ListEmptyComponent={MemoizedEmptyComponent}
        contentContainerStyle={styles.listContentContainer}
        windowSize={11}
        initialNumToRender={12}
        maxToRenderPerBatch={12}
      />
    </View>
  );
};

export default Media;

const { width } = Dimensions.get("window");
const itemMargin = 2;
const numColumns = 3;
const itemSize = (width - itemMargin * (numColumns * 2)) / numColumns;

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    width: itemSize,
    height: itemSize,
    margin: itemMargin,
    position: "relative",
    backgroundColor: "#222",
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  iconContainer: {
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 2,
  },
  listContentContainer: {
    paddingBottom: 4,
  },
});
