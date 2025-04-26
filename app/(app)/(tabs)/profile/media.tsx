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
import React, { memo, useEffect, useMemo, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import TextScallingFalse from "~/components/CentralText";
import { router, Href } from "expo-router";
import { RootState } from "~/reduxStore";
import { selectPostsByUserId } from "~/reduxStore/slices/feed/feedSlice";
import { Post } from "~/types/post";
import ClipsIcon from "~/components/SvgIcons/addpost/ClipsIcon";
import * as VideoThumbnails from "expo-video-thumbnails";
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
  const {
    error: profileError,
    loading: profileLoading,
    user,
  } = useSelector((state: any) => state?.profile);
  const { loading: feedLoading, error: feedError } = useSelector(
    (state: RootState) => state.feed
  );
  const userPosts = useSelector((state: RootState) =>
    user?._id ? selectPostsByUserId(state.feed.posts as any, user._id) : []
  );
  const [processedImageData, setProcessedImageData] = useState<MediaItem[]>([]);
  const [thumbnailsLoading, setThumbnailsLoading] = useState(false);

  const initialImageData = useMemo<MediaItem[]>(() => {
    return (
      (userPosts as Post[] | undefined)?.flatMap((post: Post): MediaItem[] => {
        if (!post?._id || !post.assets || post.assets.length === 0) {
          return [];
        }

        const isVideoPost = post.isVideo === true;

        if (isVideoPost) {
          return (
            post.assets
              ?.filter((asset: any) => asset?.url)
              ?.map(
                (asset: any): MediaItem => ({
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
  }, [userPosts]);

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
        if (currentData.length !== mediaItems.length) {
          console.warn(
            "State inconsistency detected in thumbnail generation. Using latest data."
          );
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
                `Thumbnail result index ${result.index} out of bounds.`
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

  const renderGridItem = useCallback(({ item }: { item: MediaItem }) => {
    const displayUri = item.isVideoAsset
      ? item.thumbnailUrl || item.imageUrl
      : item.imageUrl;
    const sourceUri = typeof displayUri === "string" ? displayUri : null;

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
            {item.isVideoAsset && (
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
  }, []);

  const keyExtractor = useCallback(
    (item: MediaItem, index: number) =>
      `${item.postId}-${item.imageUrl}-${index}-${item.isVideoAsset}`,
    []
  );

  const isLoading = profileLoading;
  const error = profileError || feedError;

  if (isLoading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator color="#12956B" size={22} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContent}>
        <TextScallingFalse className="text-red-500">
          Error loading media:{" "}
          {typeof error === "string" ? error : "An error occurred"}
        </TextScallingFalse>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        data={processedImageData}
        keyExtractor={keyExtractor}
        numColumns={3}
        renderItem={renderGridItem}
        ListEmptyComponent={MemoizedEmptyComponent}
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
