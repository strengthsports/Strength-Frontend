import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  Text,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import PostSmallCard from "components/Cards/PostSmallCard";
import { Post } from "~/types/post";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import PostContainerSmall from "../Cards/postContainerSmall";
import { responsiveFontSize } from "react-native-responsive-dimensions";

interface RecentPostsSectionProps {
  posts?: Post[];
  onSeeAllPress: () => void;
  scaleFactor: number;
}

const RecentPostsSection: React.FC<RecentPostsSectionProps> = ({
  posts,
  onSeeAllPress,
  scaleFactor,
}) => {
  const { width: screenWidth2 } = useWindowDimensions();
  const gap = 20; // Space between posts
  const postWidth = (screenWidth2 - gap) / 1.3; // Width of each post

  const [currentIndex, setCurrentIndex] = useState(0);
  // console.log(posts);

  // const postsWithImages = useMemo(() => posts?.filter(post => post.assets.length > 0) || [], [posts]);
  const displayedPosts = useMemo(() => posts?.slice(0, 5) || [], [posts]);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setCurrentIndex(index);
    }
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [posts]);

  const renderItem = ({ item }: { item: Post }) => (
    <View style={{ width: postWidth, marginRight: gap }}>
      <PostSmallCard post={item} />
    </View>
  );

  const ListEmptyComponent = () => (
    <View
      style={{
        width: screenWidth2,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TextScallingFalse className="text-gray-500 text-[16px]">
        No recent posts
      </TextScallingFalse>
    </View>
  );

  const ListFooterComponent = useCallback(() => {
    if (displayedPosts?.length < 1) return null;
    return (
      <View
        style={{
          justifyContent: "center",
          flex: 1,
          paddingLeft: 15,
          paddingTop: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "auto",
            padding: 75,
            justifyContent: "center",
            alignItems: "center",
            height: 385,
          }}
          className="border-[#2C2C2C] border-[0.3px] rounded-[15px] bg-[#0B0B0B]"
        >
          <TouchableOpacity
            activeOpacity={0.3}
            style={{ flex: 1, flexDirection: "row", gap: 5 }}
            onPress={onSeeAllPress}
          >
            <TextScallingFalse style={{ color: "green", paddingLeft: 15 }}>
              View more
            </TextScallingFalse>
            <MaterialIcons
              name="keyboard-double-arrow-right"
              size={22}
              color="green"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [displayedPosts.length, scaleFactor, onSeeAllPress]);

  return (
    <View
      className="py-2 my-2 ml-4 w-auto border-[#2E2E2E] border-[1px] rounded-l-[20px] border-r-0"
      style={{ height: 650 * scaleFactor }}
    >
      {/* Header */}
      <View className="w-full h-8 justify-end pl-5">
        <TextScallingFalse
          className="text-[#8A8A8A] font-bold"
          style={{ fontSize: responsiveFontSize(1.9) }}
        >
          POSTS
        </TextScallingFalse>
      </View>

      {/* Posts List */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={displayedPosts}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListEmptyComponent={ListEmptyComponent}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          // snapToInterval={postWidth + gap}
          decelerationRate="normal"
          contentContainerStyle={{
            paddingRight: gap,
            paddingLeft: 20,
          }}
          initialNumToRender={5}
          removeClippedSubviews={Platform.OS === "android"}
          windowSize={11}
          bounces={false}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          onScroll={(event) => {
            const contentOffsetX = event.nativeEvent.contentOffset.x;
            const index = Math.round(contentOffsetX / (postWidth + gap));
            setCurrentIndex(index);
          }}
          scrollEventThrottle={16}
          style={{ flex: 1 }}
          ListFooterComponent={ListFooterComponent}
        />
        {/* dot carousel */}
        {displayedPosts?.length > 0 && (
          <View className="flex-row justify-center my-6">
            {Array.from({ length: displayedPosts?.length + 1 }).map(
              (_, index) => (
                <View
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    index === currentIndex ? "bg-white" : "bg-gray-500"
                  }`}
                />
              )
            )}
          </View>
        )}
      </View>

      {/* Footer */}
      <View className="w-auto h-[8%] justify-center items-center">
        <View className="h-[0.5px] w-[90%] bg-gray-500" />
        <TouchableOpacity
          activeOpacity={0.3}
          onPress={() => console.log("Navigate to Full Insights")}
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 6,
          }}
        >
          <Text
            style={{
              color: "#808080",
              fontSize: 15,
              fontWeight: "700", // Bold
            }}
          >
            See all posts
          </Text>
          <Feather
            name="arrow-right"
            size={20}
            color={"#808080"}
            style={{ marginLeft: 5 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RecentPostsSection;
