import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
  NativeSyntheticEvent,
  TextLayoutEventData,
  Pressable,
} from "react-native";
import React, { useRef, useState } from "react";
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
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import { toggleLike } from "~/reduxStore/slices/feed/feedSlice";

const PostSmallCard = ({
  post,
  highlightedHashtag,
}: {
  post: Post;
  highlightedHashtag?: string;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  // console.log("------------------------> ", post)
  const { width: screenWidth2 } = Dimensions.get("window");
  const scaleFactor = screenWidth2 / 410;

  const [isExpanded, setIsExpanded] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef<Swiper>(null);

  const handleTextLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    const { lines } = e.nativeEvent;
    const shouldShowSeeMore =
      lines.length > 2 || (lines as any).some((line: any) => line.truncated);
    setShowSeeMore(shouldShowSeeMore);
  };

  const imageUrls = post.assets
    .filter((asset) => asset.url)
    .map((asset) => asset.url);

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

  // Handle like unlike
  const handleLikeAction = () => {
    dispatch(toggleLike({ targetId: post._id, targetType: "Post" }));
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
          style={{ width: "60%", flex: 1, flexDirection: "column", gap: 1.5 }}
        >
          <TextScallingFalse
            style={{
              color: "white",
              fontSize: responsiveFontSize(1.64),
              fontWeight: "500",
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
          <View className="flex flex-row  items-center">
            <TextScallingFalse className="text-base text-neutral-400">
              {formatTimeAgo(post.createdAt)} &bull;{" "}
            </TextScallingFalse>
            <MaterialIcons name="public" size={12} color="gray" />
          </View>
        </View>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <View
          style={{
            width: "94%",
            backgroundColor: "#151515",
            padding: 10,
            justifyContent: "center",
            alignItems: "center",
            borderTopLeftRadius: 70,
            borderTopRightRadius: 15,
          }}
        >
          <Pressable
            onPress={() => router.push(`/post-details/${post._id}`)}
            style={{ width: "80.98%", paddingLeft: "1%", paddingTop: "10%" }}
          >
            <TextScallingFalse
              style={{
                color: "white",
                fontSize: responsiveFontSize(1.29),
                fontWeight: "400",
              }}
              numberOfLines={isExpanded ? undefined : 2}
              ellipsizeMode="tail"
              onTextLayout={handleTextLayout}
            >
              {renderCaptionWithHashtags(post.caption)}
            </TextScallingFalse>

            {showSeeMore && !isExpanded && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsExpanded(true)}
                className="mt-1"
              >
                <TextScallingFalse style={styles.seeMore}>
                  See more
                </TextScallingFalse>
              </TouchableOpacity>
            )}
          </Pressable>
        </View>
      </View>

      <View style={{ height: 210 * scaleFactor }}>
        {imageUrls.length > 0 && (
          <TouchableOpacity
            onPress={() => router.push(`/post-view/${post._id}`)}
            activeOpacity={0.8}
            style={{ position: "absolute" }}
          >
            <Swiper
              ref={swiperRef}
              loop={true}
              onIndexChanged={setCurrentSlide}
              showsPagination={false}
              style={{ height: 210 * scaleFactor }}
            >
              {imageUrls.map((uri) => (
                <Image
                  key={uri}
                  source={{ uri }}
                  style={{
                    width: "100%",
                    height: 210 * scaleFactor,
                    backgroundColor: "white",
                    borderTopLeftRadius: 22,
                    borderBottomLeftRadius: 22,
                  }}
                />
              ))}
            </Swiper>

            {/* left right navigation button */}
            {/* {imageUrls.length > 1 && (
              <>
                {currentSlide > 0 && (
                  <TouchableOpacity
                    style={[styles.navButton, { left: 10 }]}
                    onPress={handlePrev}
                  >
                    <AntDesign name="left" size={20} color="white" />
                  </TouchableOpacity>
                )}


                {currentSlide < imageUrls.length - 1 && (
                  <TouchableOpacity
                    style={[styles.navButton, { right: 10 }]}
                    onPress={handleNext}
                  >
                    <AntDesign name="right" size={20} color="white" />
                  </TouchableOpacity>
                )}
              </>
            )} */}
          </TouchableOpacity>
        )}
      </View>

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
            onPress={() => router.push(`/post-details/${post._id}/likes`)}
          >
            <AntDesign name="like1" size={14 * scaleFactor} color="#FFC436" />
            <TextScallingFalse
              style={{
                fontSize: responsiveFontSize(1.41),
                color: "white",
                fontWeight: "300",
                paddingLeft: "2%",
              }}
            >
              {post.likesCount} Likes
            </TextScallingFalse>
          </TouchableOpacity>

          {/* <View style={{ width: '15%'}}></View> */}
          {/* dot carousel for multiple images */}
          <View className="pt-9">
            {imageUrls.length > 1 && (
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

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push(`/post-details/${post._id}`)}
          >
            <TextScallingFalse
              style={{
                color: "white",
                fontSize: responsiveFontSize(1.41),
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
            gap: "4%",
            backgroundColor: "#151515",
            height: 57 * scaleFactor,
            borderBottomLeftRadius: 75,
            borderBottomRightRadius: 50,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ width: "1.5%" }} />
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.ButtonsContainer}
            onPress={handleLikeAction}
          >
            <AntDesign
              name={post.isLiked ? "like1" : "like2"}
              size={16 * scaleFactor}
              color={post.isLiked ? "#FFC436" : "white"}
            />
            <TextScallingFalse
              style={{
                color: "white",
                fontSize: responsiveFontSize(1.41),
                fontWeight: "300",
              }}
            >
              {post.isLiked ? "Liked" : "Like"}
            </TextScallingFalse>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.ButtonsContainer}
            onPress={() => router.push(`/post-details/${post._id}`)}
          >
            <Feather
              name="message-square"
              size={16 * scaleFactor}
              color="white"
            />
            <TextScallingFalse
              style={{
                color: "white",
                fontSize: responsiveFontSize(1.41),
                fontWeight: "300",
              }}
            >
              Comment
            </TextScallingFalse>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} style={styles.ButtonsContainer}>
            <FontAwesome5
              name="location-arrow"
              size={12 * scaleFactor}
              color="white"
            />
            <TextScallingFalse
              style={{
                color: "white",
                fontSize: responsiveFontSize(1.41),
                fontWeight: "300",
              }}
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
    padding: 7,
    borderRadius: 15,
    width: "auto",
    flexDirection: "row",
    gap: 8,
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
});
