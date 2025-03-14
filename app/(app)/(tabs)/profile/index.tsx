import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Text,
  useWindowDimensions,
} from "react-native";
import React, { memo, useCallback, useEffect, useState } from "react";
import TextScallingFalse from "@/components/CentralText";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Tabs, TabsContent, TabsList } from "~/components/ui/tabs";
import { Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { AppDispatch } from "~/reduxStore";
import { Platform } from "react-native";
import { getOwnPosts } from "~/reduxStore/slices/user/profileSlice";
import { FlatList } from "react-native";
import PostContainer from "~/components/Cards/postContainer";
import { Post } from "~/reduxStore/api/feed/features/feedApi.getFeed";

const Overview = () => {
  const { error, loading, user } = useSelector((state: any) => state?.profile);
  const {
    posts,
    error: recentPostsError,
    loading: recentPostLoading,
  } = useSelector((state: any) => state?.profile);
  // console.log("\n\n\nPosts : ", posts);
  const dispatch = useDispatch<AppDispatch>();
  const isAndroid = Platform.OS === "android";

  const router = useRouter();
  const { width } = useWindowDimensions();
  const sports = user?.selectedSports ? [...user.selectedSports] : [];
  // console.log(sports);

  // Dynamic scaling for responsiveness
  const containerWidth = width > 768 ? "50%" : "96%";
  const { width: screenWidth } = useWindowDimensions();
  const gap = 10; // Space between posts
  const postWidth = (screenWidth - gap) / 1.25; // Width of each post

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSubSection, setActiveSubSection] = useState(
    sports[0]?.sport?.name
  );

  useEffect(() => {
    if (!posts || posts.length === 0) {
      dispatch(getOwnPosts(null));
    }
  }, [dispatch, posts]);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <View style={{ width: postWidth, marginRight: gap }}>
        <PostContainer item={item} />
      </View>
    ),
    [postWidth, gap] // Empty dependency array ensures the function is memoized and doesn't re-create
  );
  const memoizedEmptyComponent = memo(() => (
    <Text className="text-white text-center p-4">No new posts available</Text>
  ));

  //toggle see more
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      {user?.selectedSports?.length > 0 && (
        <Tabs value={activeSubSection} onValueChange={setActiveSubSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingStart: 15 * scaleFactor }}
          >
            <TabsList className="flex-row gap-x-2 w-[100%]">
              {user?.selectedSports?.map((sport: any) => (
                <TouchableOpacity
                  key={sport.sport._id}
                  onPress={() => setActiveSubSection(sport.sport.name)}
                  className={`px-5 py-2 flex flex-row gap-x-3 items-center ${
                    activeSubSection === sport.sport.name
                      ? "bg-[#12956B]"
                      : "bg-black border-gray-600"
                  } border`}
                  style={{
                    borderRadius: activeSubSection === sport.sport.name ? 7 : 9,
                  }}
                >
                  <Image
                    source={{ uri: sport.sport.logo }}
                    style={{
                      width: 20 * scaleFactor,
                      height: 20 * scaleFactor,
                    }}
                    resizeMode="contain"
                  />
                  <TextScallingFalse
                    className={`text-sm font-medium ${
                      activeSubSection === sport.sport.name
                        ? "text-white"
                        : "text-gray-400"
                    }`}
                    style={styles.buttonText}
                  >
                    {sport.sport.name.charAt(0).toUpperCase() +
                      sport.sport.name.slice(1)}
                  </TextScallingFalse>
                </TouchableOpacity>
              ))}
              {/* Add Tab Button */}
              <TouchableOpacity
                className="border border-gray-700 rounded-lg flex items-center justify-center"
                style={{ width: 36 * scaleFactor, height: 36 * scaleFactor }}
                onPress={() => router.push("/(app)/(profile)/edit-overview")}
              >
                <Feather name="plus" size={20 * scaleFactor} color="white" />
              </TouchableOpacity>
            </TabsList>
          </ScrollView>

          {/* Tab Contents */}
          {user?.selectedSports?.map((sport: any) => (
            <TabsContent key={sport.sport._id} value={sport.sport.name}>
              {/* Sports Overview */}
              <View className="w-full md:max-w-[600px] mx-auto flex-1 items-center p-2">
                {sport.details && (
                  <View className="relative bg-[#121212] w-[96%] px-5 py-4 rounded-xl flex-row justify-start flex-wrap gap-y-4">
                    {Object.entries(sport.details).map(([key, value], idx) => (
                      <View
                        key={idx}
                        className={`${idx < 3 ? "basis-[33%]" : "w-full"}`}
                      >
                        <Text
                          className="text-white font-bold"
                          style={styles.HeadingText}
                        >
                          {key.toUpperCase()}
                        </Text>
                        <Text
                          className="text-white font-light pt-1"
                          style={styles.DetailText}
                        >
                          {value as string}
                        </Text>
                      </View>
                    ))}
                    <TouchableOpacity className="absolute bottom-4 right-5">
                      <Feather
                        name="edit"
                        size={18 * scaleFactor}
                        color="#373737"
                      />
                    </TouchableOpacity>
                  </View>
                )}

                {sport.teams?.length > 0 && (
                  <View className="bg-[#121212] w-[96%] px-5 py-4 rounded-xl mt-2">
                    {/* Two-Column Header */}
                    <View className="flex-row justify-between items-center mb-3">
                      <TextScallingFalse
                        className="text-white font-bold"
                        style={styles.HeadingText}
                      >
                        CURRENT TEAMS
                      </TextScallingFalse>
                      <TextScallingFalse
                        className="text-white font-bold"
                        style={styles.HeadingText}
                      >
                        QUICK INFO
                      </TextScallingFalse>
                    </View>

                    {/* Teams Mapping */}
                    {sport.teams.map((team: any, index: any) => (
                      <View
                        key={team._id || index}
                        className="flex-row justify-between items-center py-3 border-b border-gray-800"
                      >
                        {/* Left Column - Team Info */}
                        <View className="flex-row items-center gap-x-3 w-[50%]">
                          {/* Team Logo */}
                          <Image
                            source={{ uri: team.team.logo?.url }}
                            style={{
                              width: 45 * scaleFactor,
                              height: 45 * scaleFactor,
                              borderRadius: 100,
                            }}
                          />
                          <View>
                            <TextScallingFalse
                              className="text-white font-bold"
                              style={{
                                fontSize: responsiveFontSize(1.76),
                                fontWeight: "bold",
                              }}
                            >
                              {team.team.name}
                            </TextScallingFalse>
                            <TextScallingFalse
                              className="text-gray-400"
                              style={{ fontSize: 13 * scaleFactor }}
                            >
                              {team.location || "Location Not Available"}
                            </TextScallingFalse>
                          </View>
                        </View>

                        {/* Right Column - Quick Info */}
                        <View className="w-[50%] flex items-end">
                          <TextScallingFalse
                            className="text-white font-medium"
                            style={{ fontSize: 13 * scaleFactor }}
                          >
                            Position:{" "}
                            <TextScallingFalse className="font-light">
                              {team.position || "Not Specified"}
                            </TextScallingFalse>
                          </TextScallingFalse>

                          <TextScallingFalse
                            className="text-white font-light pt-2"
                            style={{ fontSize: 13 * scaleFactor }}
                          >
                            {team.creationDate
                              ? `${new Date(
                                  team.creationDate
                                ).getFullYear()} - Present`
                              : "Joining Date Not Available"}
                          </TextScallingFalse>

                          <TextScallingFalse
                            className="text-gray-400 pt-2"
                            style={{ fontSize: 13 * scaleFactor }}
                          >
                            Present:
                          </TextScallingFalse>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* about */}
      <View className="w-full flex-1 items-center p-2">
        {/* About Container */}
        <View
          className="bg-[#121212] px-5 py-4 rounded-xl"
          style={{
            width: containerWidth,
          }}
        >
          <View className="p-0.5 relative">
            {/* About Heading */}
            <Text
              className="text-[#808080] font-bold"
              style={{
                fontSize: responsiveFontSize(2.23),
              }}
            >
              About
            </Text>

            {/* About Content */}
            <Text
              className="text-white font-light pt-1.5 leading-5"
              style={{
                fontSize: responsiveFontSize(1.52),
              }}
              numberOfLines={isExpanded ? undefined : 3}
            >
              {user?.about}
            </Text>

            {/* See More / See Less */}
            <TouchableOpacity onPress={handleToggle}>
              <Text className="text-[#808080] font-light text-sm mt-1">
                {isExpanded ? "see less" : "see more"}
              </Text>
            </TouchableOpacity>

            {/* edit button */}
            <TouchableOpacity
              className="absolute top-0 right-0"
              activeOpacity={0.7}
              onPress={() =>
                router.push("/(app)/(profile)/edit-overview?about=true")
              }
            >
              <Feather name="edit" size={18 * scaleFactor} color="#373737" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* recent posts */}
      <View className="py-4 items-center">
        <View
          className="ml-1.5 w-auto border-[#494949] border-[0.3px] rounded-l-[20px] border-r-0"
          style={{ height: 582 * scaleFactor }}
        >
          <View className="w-full h-12 justify-end pl-5">
            <TextScallingFalse className="text-gray-500 text-[18px] font-bold">
              RECENT POSTS
            </TextScallingFalse>
          </View>
          <FlatList
            data={posts || []}
            keyExtractor={(item) => item._id}
            initialNumToRender={5}
            removeClippedSubviews={isAndroid}
            windowSize={11}
            renderItem={renderItem}
            ListEmptyComponent={memoizedEmptyComponent}
            bounces={false}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            snapToInterval={postWidth + gap} // Snap to each post plus the gap
            decelerationRate="normal" // Smooth snapping
            contentContainerStyle={{ paddingRight: (screenWidth - postWidth) / 1.5 }} // Spacer for last post alignment
          />
          <View className="w-auto h-[15%] justify-center items-center">
          <View className="h-[1px] w-[90%] bg-gray-500" />
          <TouchableOpacity activeOpacity={0.3} className="pt-4">
            <TextScallingFalse className="text-[#12956B] text-[13px] font-normal">
              See all posts...
            </TextScallingFalse>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </ScrollView>
  );
};

export default Overview;

const { width: screenWidth } = Dimensions.get("window");
const scaleFactor = screenWidth / 410;

const styles = StyleSheet.create({
  carouselContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30 * scaleFactor,
  },
  scrollView: {
    flexDirection: "row",
    paddingStart: 7.5 * scaleFactor,
    width: "100%",
  },
  DetailsContainer: {
    backgroundColor: "#121212",
    width: "96%",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
  },
  OuterView: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    padding: "2%",
  },
  HeadingText: {
    fontSize: responsiveFontSize(1.41),
    color: "white",
    fontWeight: "bold",
  },
  DetailText: {
    fontSize: responsiveFontSize(1.52),
    color: "white",
    fontWeight: "300",
    paddingTop: 2,
  },
  slideContainer: {
    borderWidth: 0.5 * scaleFactor,
    borderColor: "grey",
    width: screenWidth * 0.96,
    height: 115 * scaleFactor,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10 * scaleFactor,
    marginRight: screenWidth * 0.04,
  },
  slideText: {
    color: "grey",
    fontSize: 12 * scaleFactor,
    fontWeight: "300",
  },
  button: {
    width: screenWidth * 0.85,
    height: 33 * scaleFactor,
    borderRadius: 20 * scaleFactor,
    backgroundColor: "#12956B",
    marginTop: 15 * scaleFactor,
    justifyContent: "center",
    alignItems: "center",
  },
  tabsList: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 8 * scaleFactor,
  },
  tabTrigger: {
    flex: 1,
  },
  touchableHighlight: {
    borderRadius: 7, // Adjust radius as per design
    overflow: "hidden", // Ensures the highlight effect stays within bounds
  },
  buttonContainer: {
    borderWidth: 0.3,
    width: 117 * scaleFactor,
    height: 37 * scaleFactor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    gap: 10 * scaleFactor,
  },
  buttonText: {
    color: "white", // Adjust text color for better contrast
    fontSize: 13 * scaleFactor,
    fontWeight: 500,
  },
});
