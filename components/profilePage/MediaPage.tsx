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
import { AppDispatch, RootState } from "~/reduxStore";
import * as VideoThumbnails from "expo-video-thumbnails";
import ClipsIconMedia from "~/components/SvgIcons/profilePage/ClipsIconMedia";
import { BlurView } from "expo-blur";
import MultipleImageIcon from "~/components/SvgIcons/profilePage/MultipleImageIcon";
import { Colors } from "~/constants/Colors";
import {
  makeSelectHashtagPosts,
  makeSelectUserPosts,
} from "~/reduxStore/slices/post/selectors";
import {
  fetchHashtagPosts,
  fetchUserPosts,
} from "~/reduxStore/slices/post/hooks";

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

  const selectHashtagPosts = useMemo(
    () => makeSelectHashtagPosts(hashtag, "media"),
    [hashtag]
  );
  const selectUserPosts = useMemo(
    () => makeSelectUserPosts(userId, "media"),
    [userId]
  );

  const hashtagposts = useSelector(selectHashtagPosts);
  const userposts = useSelector(selectUserPosts);

  const nextHashtagCursor = useSelector(
    (state: RootState) =>
      state.views.hashtag[hashtag]?.["media"]?.nextCursor ?? null
  );
  const nextUserCursor = useSelector(
    (state: RootState) =>
      state.views.user[userId]?.["media"]?.nextCursor ?? null
  );

  const loadPosts = useCallback(
    async (cursor?: string | null) => {
      try {
        if (pageType === "Hashtag" && hashtag) {
          await dispatch(
            fetchHashtagPosts({
              hashtag,
              type: "media",
              limit: 10,
              cursor,
            })
          );
        } else if (pageType === "Activity" && userId) {
          await dispatch(
            fetchUserPosts({
              userId,
              type: "media",
              limit: 10,
              cursor,
            })
          );
        }
      } catch (error) {
        console.error("Failed to load posts:", error);
      }
    },
    [dispatch, pageType, hashtag, userId]
  );

  useEffect(() => {
    setIsInitialLoad(true);
    setProcessedImageData([]);
    loadPosts().finally(() => setIsInitialLoad(false));
  }, [loadPosts]);

  const handleLoadMore = async () => {
    let cursor: string | null = null;
    if (pageType === "Activity") {
      cursor = nextUserCursor;
    } else if (pageType === "Hashtag") {
      cursor = nextHashtagCursor;
    }

    if (!cursor || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      await loadPosts(cursor);
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const initialImageData = useMemo(() => {
    const posts = pageType === "Activity" ? userposts : hashtagposts;

    return posts.flatMap((post): MediaItem[] => {
      if (!post?._id || !post.assets?.length) return [];

      return post.assets
        .filter((asset) => asset?.url)
        .slice(0, post.isVideo ? undefined : 1)
        .map(
          (asset): MediaItem => ({
            imageUrl: asset.url,
            postId: post._id!,
            isVideoAsset: post.isVideo,
            hasMultipleAssets: post.assets.filter((a) => a?.url).length > 1,
          })
        )
        .filter((item) => !!item.postId && !!item.imageUrl);
    });
  }, [userposts, hashtagposts, pageType]);

  useEffect(() => {
    if (isInitialLoad) {
      return;
    }
    if (initialImageData.length === 0 && processedImageData.length === 0) {
      setProcessedImageData([]);
      return;
    }

    const videosToProcess = initialImageData.filter(
      (item) => item.isVideoAsset && !item.thumbnailUrl
    );

    if (videosToProcess.length > 0) {
      setThumbnailsLoading(true);

      const generateAndMergeThumbnails = async () => {
        try {
          const thumbnailGenerationPromises = videosToProcess.map(
            async (item) => {
              if (item.isVideoAsset && item.imageUrl) {
                try {
                  const { uri } = await VideoThumbnails.getThumbnailAsync(
                    item.imageUrl,
                    { time: 1000, quality: 0.5 }
                  );
                  return {
                    postId: item.postId,
                    imageUrl: item.imageUrl,
                    thumbnailUrl: uri,
                  };
                } catch (error) {
                  console.warn(
                    "Failed to generate thumbnail for:",
                    item.imageUrl,
                    error
                  );
                  return {
                    postId: item.postId,
                    imageUrl: item.imageUrl,
                    thumbnailUrl: null,
                  };
                }
              }
              return null;
            }
          );

          const thumbnailResults = (
            await Promise.all(thumbnailGenerationPromises)
          ).filter(
            (
              r
            ): r is {
              postId: string;
              imageUrl: string;
              thumbnailUrl: string | null;
            } => r !== null
          );

          const thumbnailMap = new Map<string, string | null>();
          thumbnailResults.forEach((result) => {
            thumbnailMap.set(
              `${result.postId}-${result.imageUrl}`,
              result.thumbnailUrl
            );
          });

          setProcessedImageData(() => {
            return initialImageData.map((item) => {
              const key = `${item.postId}-${item.imageUrl}`;
              if (thumbnailMap.has(key)) {
                return {
                  ...item,
                  thumbnailUrl: thumbnailMap.get(key) || undefined,
                };
              }
              return item;
            });
          });
        } catch (error) {
          console.error("Error in thumbnail generation process:", error);
          setProcessedImageData(initialImageData);
        } finally {
          setThumbnailsLoading(false);
        }
      };

      generateAndMergeThumbnails();
    } else {
      setProcessedImageData(initialImageData);
      if (thumbnailsLoading) {
        setThumbnailsLoading(false);
      }
    }
  }, [initialImageData, isInitialLoad]);

  const renderGridItem = useCallback(
    ({ item }: { item: MediaItem }) => {
      if (!item?.postId) return null;

      const displayUri = item.isVideoAsset
        ? item.thumbnailUrl || item.imageUrl
        : item.imageUrl;

      const sourceUri = typeof displayUri === "string" ? displayUri : null;

      const handlePress = () => {
        if (item.postId) {
          router.push({
            pathname: "/post-details/[postId]",
            params: { postId: item.postId },
          } as Href<"pathname">);
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
          {item.isVideoAsset && !item.thumbnailUrl && thumbnailsLoading && (
            <View style={[styles.image, styles.placeholder]}>
              <ActivityIndicator size="small" color="#ccc" />
            </View>
          )}
          {sourceUri &&
            (!item.isVideoAsset || item.thumbnailUrl || !thumbnailsLoading) && (
              <Image
                source={{ uri: sourceUri }}
                resizeMode="cover"
                style={styles.image}
                onError={(e) =>
                  console.warn(
                    "Failed to load image:",
                    sourceUri,
                    e.nativeEvent.error
                  )
                }
              />
            )}
          {(!sourceUri ||
            (item.isVideoAsset && !item.thumbnailUrl && !thumbnailsLoading)) &&
            !(item.isVideoAsset && !item.thumbnailUrl && thumbnailsLoading) && (
              <View style={[styles.image, styles.placeholder]}></View>
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
      `${item.postId}-${item.imageUrl}-${index}`,
    []
  );

  if (isInitialLoad && processedImageData.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.themeColor} />
      </View>
    );
  }

  if (!isInitialLoad && processedImageData.length === 0 && !isLoadingMore) {
    const message =
      pageType === "Hashtag" && hashtag ? `No media found for #${hashtag}` : "";
    return (
      <View style={styles.centerContent}>
        <TextScallingFalse style={styles.emptyListText}>
          {message}
        </TextScallingFalse>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={processedImageData}
        keyExtractor={keyExtractor}
        numColumns={3}
        renderItem={renderGridItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={[
          styles.listContentContainer,
          processedImageData.length === 0 && styles.emptyListContainer,
        ]}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={Colors.themeColor} />
            </View>
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

const { width } = Dimensions.get("window");
const itemMargin = 1;
const numColumns = 3;
const availableWidth = width - itemMargin * 2 * numColumns;
const itemSize = availableWidth / numColumns;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyListText: {
    color: "#808080",
    fontSize: 18,
    textAlign: "center",
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
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  listContentContainer: {
    padding: itemMargin,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
});

export default MediaPage;
