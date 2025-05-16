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

  const selectHashtagPosts = useCallback(
    makeSelectHashtagPosts(hashtag, "media"),
    [hashtag]
  );
  const selectUserPosts = useCallback(makeSelectUserPosts(userId, "media"), [
    userId,
  ]);

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
  const loadPosts = async (cursor?: string | null) => {
    if (pageType === "Hashtag")
      await dispatch(
        fetchHashtagPosts({ hashtag, type: "media", limit: 10, cursor })
      );
    else if (pageType === "Activity")
      await dispatch(
        fetchUserPosts({ userId, type: "media", limit: 10, cursor })
      );
  };

  useEffect(() => {
    setIsInitialLoad(true);
    loadPosts().finally(() => setIsInitialLoad(false));
  }, [pageType, userId, hashtag]);

  const handleLoadMore = async () => {
    if (pageType === "Activity") {
      if (!nextUserCursor || isLoadingMore) return;
      setIsLoadingMore(true);
      await loadPosts(nextUserCursor);
      setIsLoadingMore(false);
    } else if (pageType === "Hashtag") {
      if (!nextHashtagCursor || isLoadingMore) return;
      setIsLoadingMore(true);
      await loadPosts(nextHashtagCursor);
      setIsLoadingMore(false);
    }
  };

  // Process posts into media items
  const initialImageData = useMemo<MediaItem[]>(() => {
    let posts: Post[];
    pageType === "Activity"
      ? (posts = userposts)
      : pageType === "Hashtag"
      ? (posts = hashtagposts)
      : (posts = []);

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
  }, [pageType, userId, hashtag]);

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

  if (isInitialLoad) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.themeColor} />
      </View>
    );
  }

  console.log("Hashtag posts : ", hashtagposts, " userposts : ", userposts);

  if (
    (!hashtagposts || hashtagposts.length === 0) &&
    (!userposts || userposts.length === 0)
  ) {
    return (
      <View className="w-full items-center mt-8 gap-y-2">
        <TextScallingFalse className="text-[#808080] font-normal text-4xl mb-3 text-center">
          No Media posts yet
        </TextScallingFalse>
      </View>
    );
  }

  return (
    <View className="flex-1 pb-5">
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
            <ActivityIndicator size="small" color={Colors.themeColor} />
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
