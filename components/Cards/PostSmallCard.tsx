import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import React, { useRef, useState, useCallback, useEffect } from "react";
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
import ClipsIcon from "~/components/SvgIcons/addpost/ClipsIcon";
import ClipsIconRP from "../SvgIcons/profilePage/ClipsIconRP";
import ClipsIconMedia from "../SvgIcons/profilePage/ClipsIconMedia";

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef<Swiper>(null);

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
          if (isMounted) {
            setThumbnailUri(uri);
          }
        } catch (e) {
          console.warn(
            `Could not generate thumbnail for video ${post.assets[0].url}:`,
            e
          );
          if (isMounted) {
            setThumbnailUri(null);
          }
        } finally {
          if (isMounted) {
            setThumbnailLoading(false);
          }
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

  const maxCaptionLength = 25;
  const captionText = post.caption || "";
  const needsTruncation = captionText.length > maxCaptionLength;
  const truncatedText = needsTruncation
    ? `${captionText.substring(0, maxCaptionLength).trim()}... `
    : captionText;

  const imageUrls = post.assets
    .filter((asset) => asset.url && !post.isVideo)
    .map((asset) => asset.url);

  const handleLike = () => {
    dispatch(toggleLike({ targetId: post._id, targetType: "Post" }));
  };

  const renderCaptionWithHashtags = (caption: string) => {
    return caption?.split(/(\#[a-zA-Z0-9_]+)/g).map((word, index) => {
      if (word.startsWith("#")) {
        return (
          <Text
            key={index}
            onPress={() =>
              router.push(
                `/(app)/(post)/hashtag/${word.substring(1, word.length)}`
              )
            }
            className={`text-xl text-[#12956B] ${
              highlightedHashtag?.toLowerCase() === word.toLowerCase() &&
              "font-semibold"
            }`}
          >
            {word}
          </Text>
        );
      }
      return word;
    });
  };

  const navigateToPostDetails = () => {
    router.push({
      pathname: `/post-details/${post._id}` as RelativePathString,
    });
  };

  return (
    <View style={{ width: 301 * scaleFactor }}>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          gap: "3%",
          position: "relative",
          top: "6%",
          zIndex: 100,
        }}
      >
        <View style={{ paddingLeft: "8%" }}>
          <View style={{ height: 10 }} />
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
              width: "100%",
            }}
          >
            <TextScallingFalse
              numberOfLines={1}
              style={{
                color: "white",
                fontSize: responsiveFontSize(1.19),
                fontWeight: "200",
              }}
            >
              {post.postedBy?.headline}
            </TextScallingFalse>
          </View>
          <View className="flex flex-row items-center">
            <TextScallingFalse className="text-base text-neutral-400">
              {formatTimeAgo(post.createdAt)} &bull;{" "}
            </TextScallingFalse>
            <MaterialIcons name="public" size={12} color="gray" />
          </View>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.5}
        onPress={navigateToPostDetails}
        className={`relative left-[5%] bottom-0 w-[95%] mt-3 min-h-16 h-auto rounded-tl-[45px] rounded-tr-[15px] pb-1 bg-[#151515] flex flex-row`}
      >
        <MaterialIcons
          className="absolute right-5 top-2"
          name="more-horiz"
          size={18}
          color="#a3a3a3"
        />
        <TextScallingFalse className=" pl-10 pr-6 pt-10 text-sm text-white">
          {renderCaptionWithHashtags(isExpanded ? captionText : truncatedText)}
          {needsTruncation && (
            <TextScallingFalse
              onPress={handleToggle}
              className="text-[#808080] font-light text-base"
            >
              {isExpanded ? " see less" : " see more"}
            </TextScallingFalse>
          )}
        </TextScallingFalse>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.5} onPress={navigateToPostDetails}>
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
                  <Text style={{ color: "grey" }}>No Thumbnail</Text>
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

      <View style={{ width: "100%", alignItems: "flex-end" }}>
        <View
          style={{
            backgroundColor: "#151515",
            height: 30 * scaleFactor,
            width: "94%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 12,
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
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{ backgroundColor: "#505050", height: 0.5, width: "85%" }}
          ></View>
        </View>
        <View
          style={{
            width: "94%",
            gap: "6%",
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
  seeMore: {
    color: "grey",
    fontSize: responsiveFontSize(1.29),
    fontWeight: "400",
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
  navButton: {
    position: "absolute",
    top: "50%",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 5,
    borderRadius: 20,
    transform: [{ translateY: -10 }],
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
