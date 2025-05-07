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
import { router, Href, useLocalSearchParams } from "expo-router";
import { RootState } from "~/reduxStore";
import { Post } from "~/types/post";
import ClipsIcon from "~/components/SvgIcons/addpost/ClipsIcon";
import * as VideoThumbnails from "expo-video-thumbnails";
import ClipsIconMedia from "~/components/SvgIcons/profilePage/ClipsIconMedia";
import { BlurView } from "expo-blur";
import { useLazyGetUserPostsByCategoryQuery } from "~/reduxStore/api/profile/profileApi.post";
import MultipleImageIcon from "~/components/SvgIcons/profilePage/MultipleImageIcon";

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
  const fetchedUserId = useMemo(() => {
    return params.userId
      ? JSON.parse(decodeURIComponent(params?.userId as string))
      : null;
  }, [params.userId]);

  // RTK Query setup
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [trigger, { isLoading, isError, isFetching, error: mediaError }] =
    useLazyGetUserPostsByCategoryQuery();

  const [processedImageData, setProcessedImageData] = useState<MediaItem[]>([]);
  const [thumbnailsLoading, setThumbnailsLoading] = useState(false);

  // Fetch posts with pagination
  const fetchPosts = async (isInitial = false) => {
    if (!fetchedUserId?.id) return;
    try {
      const res = await trigger({
        userId: fetchedUserId.id,
        type: "media",
        limit: 10,
        cursor: isInitial ? null : cursor,
      }).unwrap();

      if (res) {
        setPosts((prev) => (isInitial ? res.data : [...prev, ...res.data]));
        setCursor(res.nextCursor);
      }
    } catch (err) {
      console.error("Failed to fetch media posts:", err);
    }
  };

  useEffect(() => {
    if (fetchedUserId.id) {
      fetchPosts(true);
    }
  }, [fetchedUserId?.id]);

  const handleLoadMore = () => {
    if (cursor && !isFetching && !isFetchingMore) {
      setIsFetchingMore(true);
      fetchPosts().finally(() => setIsFetchingMore(false));
    }
  };

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

  const MemoizedEmptyComponent = memo(() => (
    <View style={styles.centerContent}>
      {isLoading ? (
        <ActivityIndicator color="#12956B" size={22} />
      ) : (
        <TextScallingFalse className="text-white text-center p-4">
          No media available
        </TextScallingFalse>
      )}
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
    (item: MediaItem) => `${item.postId}-${item.imageUrl}`,
    []
  );

  const loading = isLoading;
  const error = mediaError;

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator color="#12956B" size={22} />
      </View>
    );
  }

  if (error || isError) {
    return (
      <View style={styles.centerContent}>
        <TextScallingFalse className="text-red-500">
          Error loading media: {error?.toString()}
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
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={[
          styles.listContentContainer,
          processedImageData.length === 0 && styles.emptyListContainer,
        ]}
        ListFooterComponent={
          isFetchingMore ? (
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
});

export default Media;
