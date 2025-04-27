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
import { Post } from "~/types/post";
import ClipsIconMedia from "~/components/SvgIcons/profilePage/ClipsIconMedia";
import MultipleImageIcon from "~/components/SvgIcons/profilePage/MultipleImageIcon";
import { BlurView } from "expo-blur";

interface MediaItem {
  imageUrl: string;
  postId: string;
  isVideoAsset: boolean;
  thumbnailUrl?: string;
  hasMultipleAssets: boolean;
}

const iconContainerSize = 22;
const iconSizeInsideCircle = 18;

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

    return (
      posts.flatMap((post: Post): MediaItem[] => {
        if (!post?._id || !post.assets || post.assets.length === 0) {
          return [];
        }

        const isVideoPost = post.isVideo === true;

        if (isVideoPost) {
          return (
            post.assets
              ?.filter((asset) => asset && asset.url)
              ?.map(
                (asset): MediaItem => ({
                  imageUrl: asset.url,
                  postId: post._id!,
                  isVideoAsset: true,
                  thumbnailUrl: undefined,
                  hasMultipleAssets: false,
                })
              ) || []
          );
        } else {
          const firstAsset = post.assets[0];
          if (!firstAsset?.url) {
            return [];
          }
          const hasMultipleImages = post.assets.length > 1;
          return [
            {
              imageUrl: firstAsset.url,
              postId: post._id!,
              isVideoAsset: false,
              thumbnailUrl: undefined,
              hasMultipleAssets: hasMultipleImages,
            },
          ];
        }
      }) || []
    );
  }, [postsData]);

  useEffect(() => {
    const generateThumbnails = async (mediaItems: MediaItem[]) => {
      setThumbnailsLoading(true);
      let updated = false;

      const videoItemsToProcess = mediaItems
        .map((item, index) => ({ ...item, originalIndex: index }))
        .filter(
          (item) => item.isVideoAsset && item.imageUrl && !item.thumbnailUrl
        );

      const thumbnailPromises = videoItemsToProcess.map(async (item) => {
        try {
          const { uri } = await VideoThumbnails.getThumbnailAsync(
            item.imageUrl,
            { time: 1000, quality: 0.5 }
          );
          return { index: item.originalIndex, thumbnailUrl: uri };
        } catch (error) {
          console.warn(
            `Failed to generate thumbnail for ${item.imageUrl}:`,
            error
          );
          return { index: item.originalIndex, thumbnailUrl: null };
        }
      });

      const results = await Promise.all(thumbnailPromises);

      setProcessedImageData((currentData) => {
        if (currentData.length !== mediaItems.length) {
          console.warn(
            "State inconsistency detected before applying thumbnails. Using latest data structure."
          );
          const alignedData = mediaItems.map((item) => ({ ...item }));
          results.forEach((result) => {
            if (result && result.thumbnailUrl !== undefined) {
              if (result.index >= 0 && result.index < alignedData.length) {
                if (
                  alignedData[result.index].thumbnailUrl !== result.thumbnailUrl
                ) {
                  alignedData[result.index].thumbnailUrl =
                    result.thumbnailUrl ?? undefined;
                  updated = true;
                }
              } else {
                console.warn(
                  `Thumbnail result index ${result.index} out of bounds during alignment.`
                );
              }
            }
          });
          return updated ? alignedData : currentData;
        }

        const newData = [...currentData];
        results.forEach((result) => {
          if (result && result.thumbnailUrl !== undefined) {
            if (result.index >= 0 && result.index < newData.length) {
              if (newData[result.index].thumbnailUrl !== result.thumbnailUrl) {
                newData[result.index] = {
                  ...newData[result.index],
                  thumbnailUrl: result.thumbnailUrl ?? undefined,
                };
                updated = true;
              }
            } else {
              console.warn(
                `Thumbnail result index ${result.index} out of bounds for current data.`
              );
            }
          }
        });
        return updated ? newData : currentData;
      });
      setThumbnailsLoading(false);
    };

    setProcessedImageData(initialImageData);

    const videosToProcess = initialImageData.filter(
      (item) => item.isVideoAsset && item.imageUrl && !item.thumbnailUrl
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

      const sourceUri =
        displayUri || (item.isVideoAsset ? item.imageUrl : null);

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

      const currentIconSize = iconSizeInsideCircle;

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
              {(item.isVideoAsset ||
                (item.isVideoAsset && thumbnailsLoading)) && (
                <ActivityIndicator size="small" color="#ccc" />
              )}
            </View>
          )}

          {item.isVideoAsset && (
            <BlurView
              intensity={30}
              tint="dark"
              style={styles.videoIconContainer}
            >
              <ClipsIconMedia size={currentIconSize} />
            </BlurView>
          )}

          {item.hasMultipleAssets && !item.isVideoAsset && (
            <BlurView
              intensity={30}
              tint="dark"
              style={styles.multipleIconContainer}
            >
              <MultipleImageIcon size={16} />
            </BlurView>
          )}
        </TouchableOpacity>
      );
    },
    [thumbnailsLoading]
  );

  const keyExtractor = useCallback(
    (item: MediaItem, index: number) =>
      `${item.postId}-${item.imageUrl}-${index}-${item.isVideoAsset}-${item.hasMultipleAssets}`,
    []
  );

  const isLoading =
    profileIsLoading || postsIsLoading || (postsIsFetching && !postsData);
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
    const errorMessage = error
      ? typeof error === "string"
        ? error
        : JSON.stringify(error)
      : "An unknown error occurred";
    return (
      <View style={styles.centerContent}>
        <TextScallingFalse className="text-red-500 text-center">
          Error loading media: {errorMessage}
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
        ListEmptyComponent={!isLoading ? MemoizedEmptyComponent : null}
        contentContainerStyle={[
          styles.listContentContainer,
          processedImageData.length === 0 && styles.emptyListContainer,
        ]}
        windowSize={11}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={true}
      />
      {thumbnailsLoading && (
        <ActivityIndicator
          style={styles.bottomLoader}
          color="#555"
          size="small"
        />
      )}
    </View>
  );
};

export default Media;

const { width } = Dimensions.get("window");
const itemMargin = 1;
const numColumns = 3;
const itemSize = (width - itemMargin * (numColumns - 1) * 2) / numColumns;

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    backgroundColor: "#282828",
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    width: itemSize,
    height: itemSize,
    margin: itemMargin,
    position: "relative",
    backgroundColor: "#222",
    overflow: "hidden",
  },
  videoIconContainer: {
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 2,
    width: iconContainerSize,
    height: iconContainerSize,
    borderRadius: iconContainerSize / 2,
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  multipleIconContainer: {
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 2,
    width: iconContainerSize,
    height: iconContainerSize,
    borderRadius: iconContainerSize / 2,
    // backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  listContentContainer: {
    paddingBottom: itemMargin,
  },
  bottomLoader: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});
