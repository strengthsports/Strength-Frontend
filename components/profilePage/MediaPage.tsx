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
import nothumbnail from "@/assets/images/DefaultImage.png";

// Updated MediaItem interface
interface MediaItem {
  imageUrl: string;
  thumbnailUrl?: string;
  postId: string;
  isVideoAsset: boolean;
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

  const hashtagPosts = useSelector(selectHashtagPosts);
  const userPosts = useSelector(selectUserPosts);

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
      const config = { type: "media", limit: 21, cursor: cursor || undefined };
      try {
        if (pageType === "Hashtag" && hashtag) {
          await dispatch(fetchHashtagPosts({ ...config, hashtag }));
        } else if (pageType === "Activity" && userId) {
          await dispatch(fetchUserPosts({ ...config, userId }));
        }
      } catch (error) {
        console.error("Failed to load posts:", error);
      }
    },
    [dispatch, pageType, hashtag, userId]
  );

  useEffect(() => {
    setIsInitialLoad(true);
    // No need to clear local data, Redux handles the state
    loadPosts().finally(() => setIsInitialLoad(false));
  }, [loadPosts]);

  const handleLoadMore = async () => {
    const cursor = pageType === "Activity" ? nextUserCursor : nextHashtagCursor;
    if (!cursor || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      await loadPosts(cursor);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const processedImageData = useMemo((): MediaItem[] => {
    const posts = pageType === "Activity" ? userPosts : hashtagPosts;

    return posts.flatMap((post): MediaItem[] => {
      if (!post?._id || !post.assets?.length) return [];

      // Assuming the first asset is the one to display in the grid
      const primaryAsset = post.assets[0];
      if (!primaryAsset?.url) return [];

      return [
        {
          postId: post._id,
          imageUrl: primaryAsset.url,
          thumbnailUrl: post.isVideo ? post.thumbnail?.url : undefined,
          isVideoAsset: post.isVideo,
          hasMultipleAssets: post.assets.filter((a: any) => a?.url).length > 1,
        },
      ];
    });
  }, [userPosts, hashtagPosts, pageType]);

  const renderGridItem = useCallback(({ item }: { item: MediaItem }) => {
    if (!item?.postId) return null;

    // For videos, use the thumbnail URL. For images, use the image URL.
    const displayUri = item.isVideoAsset ? item.thumbnailUrl : item.imageUrl;

    const handlePress = () => {
      router.push({
        pathname: "/post-details/[postId]",
        params: { postId: item.postId },
      } as Href);
    };

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.itemContainer}
        onPress={handlePress}
      >
        <Image
          source={displayUri ? { uri: displayUri } : nothumbnail}
          resizeMode="cover"
          style={styles.image}
          onError={(e) =>
            console.warn(
              "Failed to load image:",
              displayUri,
              e.nativeEvent.error
            )
          }
        />

        {item.isVideoAsset && (
          <BlurView
            intensity={30}
            tint="dark"
            style={styles.videoIconContainer}
          >
            <ClipsIconMedia size={iconSizeInsideCircle} />
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

  if (processedImageData.length === 0 && !isLoadingMore) {
    const message =
      pageType === "Hashtag" && hashtag
        ? `No media found for #${hashtag}`
        : "No media found";
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
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={Colors.themeColor} />
            </View>
          ) : null
        }
        windowSize={11}
        initialNumToRender={21}
        maxToRenderPerBatch={10}
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
    backgroundColor: "#000",
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
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
});

export default MediaPage;
