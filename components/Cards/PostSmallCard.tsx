import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  NativeSyntheticEvent,
} from "react-native";
import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import TextScallingFalse from "../CentralText";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import {
  AntDesign,
  Feather,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { Post } from "~/types/post";
import { formatTimeAgo } from "~/utils/formatTime";
import Swiper from "react-native-swiper";
import { RelativePathString, router } from "expo-router";
import { toggleLike } from "~/reduxStore/slices/feed/feedSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import * as VideoThumbnails from "expo-video-thumbnails";
import ClipsIconRP from "../SvgIcons/profilePage/ClipsIconRP";
import { TextLayoutEventData } from "react-native";
import { Platform } from "react-native";

type TaggedUser = {
  _id: string;
  username: string;
  type: string;
};

const shadowStyle = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  android: {
    elevation: 10,
    shadowColor: "#000",
  },
});

const PostSmallCard = ({
  post,
  highlightedHashtag,
}: {
  post: Post;
  highlightedHashtag?: string;
}) => {
  const { width: screenWidth2 } = Dimensions.get("window");
  const scaleFactor = screenWidth2 / 410;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef<Swiper>(null);
  const fullTextRef = useRef<string>("");

  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
  const [thumbnailLoading, setThumbnailLoading] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const { isLiked } = post;

  useEffect(() => {
    let isMounted = true;
    const generateThumbnail = async () => {
      if (post.isVideo && post.assets?.[0]?.url) {
        setThumbnailLoading(true);
        setThumbnailUri(null);
        try {
          const { uri } = await VideoThumbnails.getThumbnailAsync(
            post.assets[0].url,
            {
              time: 1000,
              quality: 0.5,
            }
          );
          if (isMounted) setThumbnailUri(uri);
        } catch (e) {
          console.warn(
            `Could not generate thumbnail for video ${post.assets[0].url}:`,
            e
          );
          if (isMounted) setThumbnailUri(null);
        } finally {
          if (isMounted) setThumbnailLoading(false);
        }
      } else {
        setThumbnailUri(null);
        setThumbnailLoading(false);
      }
    };

    generateThumbnail();
    return () => {
      isMounted = false;
    };
  }, [post.isVideo, post.assets?.[0]?.url]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const imageUrls = post.assets
    .filter((asset) => asset.url && !post.isVideo)
    .map((asset) => asset.url);

  const handleLike = () => {
    dispatch(toggleLike({ targetId: post._id, targetType: "Post" }));
  };

  const renderCaptionWithTags = useCallback(
    (
      caption: string,
      taggedUsers: TaggedUser[],
      isExpanded: boolean,
      onPressSeeMore: () => void
    ) => {
      if (!caption) return { elements: null, fullText: "" };

      const parts = caption.split(/(#[a-zA-Z0-9_]+|@[a-zA-Z0-9_]+)/g);
      const elements = [];
      let fullText = "";

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        fullText += part;
        if (part.startsWith("#")) {
          const tag = part.slice(1);
          elements.push(
            <TextScallingFalse
              key={i}
              onPress={() => router.push(`/(app)/(post)/hashtag/${tag}`)}
              className={`text-sm text-[#12956B] ${
                highlightedHashtag?.toLowerCase() === tag.toLowerCase() &&
                "font-semibold"
              }`}
            >
              {part}
            </TextScallingFalse>
          );
        } else if (part.startsWith("@")) {
          const username = part.slice(1);
          const user = taggedUsers.find((u) => u.username === username);
          if (user) {
            elements.push(
              <TextScallingFalse
                key={i}
                onPress={() =>
                  router.push(
                    `/(app)/(profile)/profile/${encodeURIComponent(
                      JSON.stringify({ id: user._id, type: user.type })
                    )}`
                  )
                }
                className="text-sm text-[#12956B]"
              >
                {part}
              </TextScallingFalse>
            );
          } else {
            elements.push(
              <TextScallingFalse key={i} className="text-white text-sm">
                {part}
              </TextScallingFalse>
            );
          }
        } else {
          elements.push(
            <TextScallingFalse key={i} className="text-white text-sm">
              {part}
            </TextScallingFalse>
          );
        }
      }
      return { elements, fullText };
    },
    [highlightedHashtag]
  );

  const { elements, fullText } = useMemo(
    () =>
      renderCaptionWithTags(
        post.caption || "",
        post.taggedUsers || [],
        isExpanded,
        handleToggle
      ),
    [post.caption, post.taggedUsers, isExpanded, renderCaptionWithTags]
  );

  fullTextRef.current = fullText;

  const handleTextLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    const renderedText = e.nativeEvent.lines.map((line) => line.text).join("");
    setIsTruncated(renderedText !== fullTextRef.current);
  };

  const navigateToPostDetails = () => {
    router.push({
      pathname: `/post-details/${post._id}` as RelativePathString,
    });
  };

  return (
    <View style={{ width: 301 * scaleFactor }}>
      {/* User Info */}
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          gap: "3%",
          position: "relative",
          top: "6.5%",
          zIndex: 100,
        }}
      >
        <View style={{ paddingLeft: "8%" }}>
          <View style={[{ height: 10 }, shadowStyle]} />
          <Image
            source={{ uri: post.postedBy?.profilePic }}
            style={{
              width: 50 * scaleFactor,
              height: 50 * scaleFactor,
              borderRadius: 100,
              backgroundColor: "white",
            }}
          />
        </View>
        <View
          style={{ width: "60%", flex: 1, flexDirection: "column", gap: 2 }}
        >
          <TextScallingFalse
            style={{
              color: "white",
              fontSize: responsiveFontSize(1.64),
              fontWeight: "500",
              marginTop: 8,
            }}
          >
            {post.postedBy?.firstName} {post.postedBy?.lastName}
          </TextScallingFalse>
          <View
            style={{
              position: "relative",
              top: -2 * scaleFactor,
              width: "75%",
            }}
          >
            <TextScallingFalse
              numberOfLines={1}
              style={{
                color: "white",
                fontSize: responsiveFontSize(1.19),
                fontWeight: "200",
                marginBottom: 3,
              }}
            >
              @{post.postedBy.username} | {post.postedBy?.headline}
            </TextScallingFalse>
          </View>
          <View className="flex flex-row items-center mt-1">
            <TextScallingFalse className="text-[8px] text-neutral-400">
              {formatTimeAgo(post.createdAt)} •{" "}
            </TextScallingFalse>
            <MaterialIcons
              name="public"
              size={9}
              color="gray"
              className="mt-1"
            />
          </View>
        </View>
      </View>

      {/* Caption Section */}
      <View className="relative left-[5%] bottom-0 w-[95%] mt-3 min-h-16 h-auto rounded-tl-[45px] rounded-tr-[15px] pb-2 bg-[#151515]">
        <TouchableOpacity activeOpacity={0.7} onPress={navigateToPostDetails}>
          <MaterialIcons
            className="absolute right-5 top-[4px]"
            name="more-horiz"
            size={18}
            color="#a3a3a3"
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={navigateToPostDetails}
          style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 36 }}
        >
          <TextScallingFalse
            numberOfLines={isExpanded ? 0 : 2}
            onTextLayout={!isExpanded ? handleTextLayout : undefined}
            style={{ color: "white", fontSize: 14 }}
          >
            {elements}
          </TextScallingFalse>
          {!isExpanded && isTruncated && (
            <TextScallingFalse
              onPress={handleToggle}
              className="text-[#808080] text-sm"
            >
              {" ...see more"}
            </TextScallingFalse>
          )}
        </TouchableOpacity>
      </View>

      {/* Media Section */}
      <TouchableOpacity activeOpacity={0.7} onPress={navigateToPostDetails}>
        <View style={{ height: 240 * scaleFactor, width: "100%" }}>
          {post.isVideo ? (
            <View style={styles.mediaContainer}>
              {thumbnailLoading ? (
                <ActivityIndicator
                  style={StyleSheet.absoluteFill}
                  size="large"
                  color="#CCCCCC"
                />
              ) : thumbnailUri ? (
                <>
                  <Image
                    source={{ uri: thumbnailUri }}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                  <View style={styles.iconOverlay}>
                    <ClipsIconRP />
                  </View>
                </>
              ) : (
                <View style={styles.thumbnailPlaceholder}>
                  <TextScallingFalse style={{ color: "grey" }}>
                    No Thumbnail
                  </TextScallingFalse>
                </View>
              )}
            </View>
          ) : imageUrls.length > 0 ? (
            <Swiper
              ref={swiperRef}
              loop={false}
              onIndexChanged={setCurrentSlide}
              showsPagination={false}
              style={{ height: 240 * scaleFactor }}
            >
              {imageUrls.map((uri) => (
                <Image
                  key={uri}
                  source={{ uri }}
                  style={{
                    width: "100%",
                    height: 240 * scaleFactor,
                    backgroundColor: "white",
                    borderTopLeftRadius: 22,
                    borderBottomLeftRadius: 22,
                  }}
                  resizeMode="cover"
                />
              ))}
            </Swiper>
          ) : null}
        </View>
      </TouchableOpacity>

      {/* Interaction Section */}
      <View style={{ width: "100%", alignItems: "flex-end" }}>
        <View
          style={{
            backgroundColor: "#151515",
            height: 30 * scaleFactor,
            width: "94%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 14,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ flexDirection: "row" }}
            onPress={navigateToPostDetails}
          >
            <AntDesign name="like1" size={12 * scaleFactor} color="#FFC436" />
            <TextScallingFalse
              style={{
                fontSize: responsiveFontSize(1.25),
                color: "white",
                fontWeight: "300",
                paddingLeft: "2%",
              }}
            >
              {post.likesCount} Likes
            </TextScallingFalse>
          </TouchableOpacity>
          <View className="pt-9">
            {imageUrls.length > 1 && !post.isVideo && (
              <View style={styles.dotContainer}>
                {imageUrls.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      index === currentSlide && styles.activeDot,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={navigateToPostDetails}>
            <TextScallingFalse
              style={{
                color: "white",
                fontSize: responsiveFontSize(1.25),
                fontWeight: "300",
              }}
            >
              {post.commentsCount} Comments
            </TextScallingFalse>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "94%",
            backgroundColor: "#151515",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{ backgroundColor: "#505050", height: 0.5, width: "85%" }}
          />
        </View>
        <View
          style={{
            width: "94%",
            gap: "5%",
            backgroundColor: "#151515",
            height: 57 * scaleFactor,
            borderBottomLeftRadius: 45,
            borderBottomRightRadius: 15,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ width: "0.8%" }} />
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.ButtonsContainer}
            onPress={handleLike}
          >
            <View className="flex flex-row justify-between items-center gap-2">
              <AntDesign
                name={isLiked ? "like1" : "like2"}
                size={12}
                color={isLiked ? "#FFC436" : "white"}
              />
              <TextScallingFalse
                className={`${isLiked ? "text-amber-400" : "text-white"}`}
                style={{ fontSize: 10, fontWeight: "300" }}
              >
                {isLiked ? "Liked" : "Like"}
              </TextScallingFalse>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.ButtonsContainer}
            onPress={navigateToPostDetails}
          >
            <Feather
              name="message-square"
              size={12 * scaleFactor}
              color="white"
            />
            <TextScallingFalse
              style={{ color: "white", fontSize: 10, fontWeight: "300" }}
            >
              Comment
            </TextScallingFalse>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.ButtonsContainer}
            onPress={navigateToPostDetails}
          >
            <FontAwesome5
              name="location-arrow"
              size={10 * scaleFactor}
              color="white"
            />
            <TextScallingFalse
              style={{ color: "white", fontSize: 10, fontWeight: "300" }}
            >
              Share
            </TextScallingFalse>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostSmallCard;

const styles = StyleSheet.create({
  ButtonsContainer: {
    backgroundColor: "black",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 25,
    width: "auto",
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  dotContainer: {
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    alignSelf: "center",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.4)",
    margin: 3,
  },
  activeDot: {
    backgroundColor: "white",
  },
  mediaContainer: {
    height: "100%",
    width: "100%",
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
    overflow: "hidden",
    backgroundColor: "#1c1c1c",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  thumbnailPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  iconOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});
