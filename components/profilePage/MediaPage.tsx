import {
  StyleSheet,
  View,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextScallingFalse from "~/components/CentralText";
import { router, Href } from "expo-router";
import { AppDispatch } from "~/reduxStore";
import { Post } from "~/types/post";
import * as VideoThumbnails from "expo-video-thumbnails";
import ClipsIconMedia from "~/components/SvgIcons/profilePage/ClipsIconMedia";
import { BlurView } from "expo-blur";
import MultipleImageIcon from "~/components/SvgIcons/profilePage/MultipleImageIcon";
import {
  fetchHashtagContents,
  fetchNonFeedPosts,
  selectAllNonFeedPosts,
  selectNonFeedState,
} from "~/reduxStore/slices/feed/feedSlice";
import { Colors } from "~/constants/Colors";

interface MediaItem {
  imageUrl: string;
  postId: string;
  isVideoAsset: boolean;
  thumbnailUrl?: string;
  hasMultipleAssets: boolean;
}

type MediaPageType = "Activity" | "Hashtag";

interface MediaPageProps {
  pageType: MediaPageType;
  userId?: string;
  hashtag?: string;
}

const iconContainerSize = 22;
const iconSizeInsideCircle = 18;

const MediaPage = ({ userId, hashtag, pageType }: MediaPageProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [processedImageData, setProcessedImageData] = useState<MediaItem[]>([]);
  const [thumbnailsLoading, setThumbnailsLoading] = useState(false);

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { nonFeedLoading, nonFeedError, nonFeedCursor, nonFeedHasMore } =
    useSelector(selectNonFeedState);
  const posts = useSelector(selectAllNonFeedPosts);

  // Initial load or when userId/type changes
  useEffect(() => {
    setIsInitialLoad(true);
    if (userId) {
      console.log("User id : ", userId);
      dispatch(
        fetchNonFeedPosts({
          limit: 10,
          type: "media",
          userId: userId,
          reset: true,
        })
      );
    } else if (hashtag) {
      console.log("Hashtag : ", hashtag);
      dispatch(
        fetchHashtagContents({
          limit: 10,
          type: "media",
          hashtag,
          reset: true,
        })
      );
    }
  }, [dispatch, userId]);

  // For subsequent loads
  const handleLoadMore = useCallback(() => {
    setIsInitialLoad(false);
    if (
      nonFeedCursor &&
      !nonFeedLoading &&
      !isLoadingMore &&
      pageType === "Activity"
    ) {
      setIsLoadingMore(true);
      dispatch(
        fetchNonFeedPosts({
          limit: 10,
          cursor: nonFeedCursor,
          type: "media",
          userId: userId as string,
        })
      ).finally(() => setIsLoadingMore(false));
    } else if (
      nonFeedCursor &&
      !nonFeedLoading &&
      !isLoadingMore &&
      pageType === "Hashtag"
    ) {
      setIsLoadingMore(true);
      dispatch(
        fetchHashtagContents({
          limit: 10,
          cursor: nonFeedCursor,
          type: "media",
          hashtag: hashtag as string,
        })
      ).finally(() => setIsLoadingMore(false));
    }
  }, [nonFeedCursor, nonFeedLoading, isLoadingMore, userId]);

  // Process posts into media items
  const initialImageData = useMemo<MediaItem[]>(() => {
    return posts.flatMap((post: Post): MediaItem[] => {
      if (!post?._id || !post.assets || post.assets.length === 0) return [];

      const isVideoPost = post.isVideo === true;

      if (isVideoPost) {
        return post.assets
          .filter((asset) => asset?.url)
          .map((asset) => ({
            imageUrl: asset.url,
            postId: post._id!,
            isVideoAsset: true,
            thumbnailUrl: undefined,
            hasMultipleAssets: false,
          }));
      } else {
        const firstAsset = post.assets[0];
        if (!firstAsset?.url) return [];
        return [
          {
            imageUrl: firstAsset.url,
            postId: post._id!,
            isVideoAsset: false,
            thumbnailUrl: undefined,
            hasMultipleAssets: post.assets.length > 1,
          },
        ];
      }
    });
  }, [posts]);

  // Thumbnail generation (existing logic)
  useEffect(() => {
    const generateThumbnails = async (mediaItems: MediaItem[]) => {
      setThumbnailsLoading(true);
      const thumbnailPromises = mediaItems.map(async (item, index) => {
        if (item.isVideoAsset && item.imageUrl && !item.thumbnailUrl) {
          try {
            const { uri } = await VideoThumbnails.getThumbnailAsync(
              item.imageUrl,
              {
                time: 1000,
                quality: 0.5,
              }
            );
            return { index, thumbnailUrl: uri };
          } catch (error) {
            console.warn("Failed to generate thumbnail:", error);
            return null;
          }
        }
        return null;
      });

      const results = await Promise.all(thumbnailPromises);
      setProcessedImageData((current) =>
        results.reduce(
          (acc, result) => {
            if (result) {
              acc[result.index] = {
                ...current[result.index],
                thumbnailUrl: result.thumbnailUrl,
              };
            }
            return acc;
          },
          [...current]
        )
      );
      setThumbnailsLoading(false);
    };

    if (initialImageData.length > 0) {
      setProcessedImageData(initialImageData);
      const videosToProcess = initialImageData.filter(
        (item) => item.isVideoAsset && !item.thumbnailUrl
      );
      if (videosToProcess.length > 0) {
        generateThumbnails(initialImageData);
      }
    }
  }, [initialImageData]);

  const renderGridItem = useCallback(({ item }: { item: MediaItem }) => {
    const displayUri = item.isVideoAsset
      ? item.thumbnailUrl || item.imageUrl
      : item.imageUrl;
    const sourceUri = typeof displayUri === "string" ? displayUri : null;

    const handlePress = () => {
      if (item.postId) {
        router.push({
          pathname: "/home/post-details/[postId]",
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
    (item: MediaItem) => `${item.postId}-${item.imageUrl}`,
    []
  );

  const MemoizedEmptyComponent = useCallback(() => {
    return (
      <View className="flex justify-center items-center flex-1 p-4">
        {nonFeedLoading && <ActivityIndicator color="#12956B" size={22} />}
      </View>
    );
  }, [nonFeedLoading]);

  if (nonFeedError)
    return (
      <View className="flex justify-center items-center">
        <TextScallingFalse className="text-red-500">
          Error loading posts
        </TextScallingFalse>
      </View>
    );

  return (
    <View className="flex-1">
      {isInitialLoad && nonFeedLoading ? (
        <View style={styles.fullScreenLoader}>
          <ActivityIndicator size="large" color={Colors.themeColor} />
        </View>
      ) : (
        <FlatList
          data={processedImageData}
          keyExtractor={keyExtractor}
          numColumns={3}
          renderItem={renderGridItem}
          ListEmptyComponent={MemoizedEmptyComponent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={[
            styles.listContentContainer,
            processedImageData.length === 0 && styles.emptyListContainer,
          ]}
          ListFooterComponent={
            nonFeedLoading || isLoadingMore ? (
              <ActivityIndicator
                style={styles.bottomLoader}
                color="#555"
                size="small"
              />
            ) : null
          }
          windowSize={11}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews={true}
        />
      )}
    </View>
  );
};

// Keep existing styles unchanged
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
  fullScreenLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MediaPage;
