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
import RecentPostsSection from "~/components/profilePage/RecentPostsSection";

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
  const { width: screenWidth2 } = useWindowDimensions();
  const scaleFactor = screenWidth2 / 410;

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSubSection, setActiveSubSection] = useState(
    sports[0]?.sport?.name
  );

  useEffect(() => {
    if (!posts || posts.length === 0) {
      dispatch(getOwnPosts(null));
    }
  }, [dispatch, posts]);

  // const renderItem = useCallback(
  //   ({ item }: { item: Post }) => (
  //     <View style={{ width: postWidth, marginRight: gap }}>
  //       <PostContainer item={item} />
  //     </View>
  //   ),
  //   [postWidth, gap]
  // );
  // const memoizedEmptyComponent = memo(() => (
  //   <Text className="text-white text-center p-4">No new posts available</Text>
  // ));

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
                  key={sport.sport?._id}
                  onPress={() => setActiveSubSection(sport.sport?.name)}
                  className={`px-5 py-2 flex flex-row gap-x-3 items-center ${
                    activeSubSection === sport.sport?.name
                      ? "bg-[#12956B]"
                      : "bg-black border-gray-600"
                  } border`}
                  style={{
                    borderRadius:
                      activeSubSection === sport.sport?.name ? 7 : 9,
                  }}
                >
                  <Image
                    source={{ uri: sport.sport?.logo }}
                    style={{
                      width: 20 * scaleFactor,
                      height: 20 * scaleFactor,
                    }}
                    resizeMode="contain"
                  />
                  <TextScallingFalse
                    className={`text-sm font-medium ${
                      activeSubSection === sport.sport?.name
                        ? "text-white"
                        : "text-gray-400"
                    }`}
                    style={styles.buttonText}
                  >
                    {sport.sport?.name.charAt(0).toUpperCase() +
                      sport.sport?.name.slice(1)}
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
            <TabsContent key={sport.sport?._id} value={sport.sport?.name}>
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
                        color="#717171"
                      />
                    </TouchableOpacity>
                  </View>
                )}

                {sport.teams?.length > 0 && (
                  <View className="bg-[#161616] w-[96%] px-5 py-4 rounded-xl mt-2">
                    {/* Two-Column Header */}
                    <View className="flex-row justify-between items-center mb-3">
                      <TextScallingFalse
                        className="text-[#808080] font-bold"
                      >
                        CURRENT TEAMS
                      </TextScallingFalse>
                      <View className="flex items-center justify-center flex-row gap-2">
                        <TouchableOpacity
                          className="flex items-center justify-center"
                          style={{ width: 36 * scaleFactor, height: 36 * scaleFactor }}
                          onPress={() => router.push("/(app)/(profile)/edit-overview")}
                        >
                          <Feather name="plus" size={20 * scaleFactor} color="#717171" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                          <Feather
                            name="edit"
                            size={18 * scaleFactor}
                            color="#717171"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Teams Mapping */}
                    {sport.teams.map((team:any, index:any) => (
                      <View key={index} style={{ marginVertical: 1 }}>
                        <TeamEntry team={team} />
                        <View
                          style={{
                            height: 0.5,
                            backgroundColor: "#717171",
                            marginVertical: 16,
                          }}
                        />
                      </View>
                    ))}
                    <TouchableOpacity
                      activeOpacity={0.3}
                      onPress={() => console.log('Navigate to Full Insights')}
                      style={{
                        flex:1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent:"center",
                        marginVertical: 6,
                      }}
                    >
                      <Text
                        style={{
                          color: "#808080",
                          fontSize: 15,
                          fontWeight: '700', // Bold
                        }}
                      >
                        Full Insights
                      </Text>
                      <Feather
                        name="arrow-right"
                        size={20}
                        color={"#808080"}
                        style={{ marginLeft: 5 }}
                      />
                    </TouchableOpacity>
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
              <Feather name="edit" size={18 * scaleFactor} color="#717171" /> 
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* recent posts */}
      <RecentPostsSection
        posts={posts}
        onSeeAllPress={() =>  router.push("/(app)/(tabs)/profile/activity/posts")}
        scaleFactor={scaleFactor}
      />
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


const textColor = '#FFFFFF';
const secondaryTextColor = '#A9A9A9';
const dividerColor = '#A9A9A9';

const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
export const TeamEntry = ({ team } : any) => {
  console.log(team);
  return (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap:10,}}>
    {/* Team Logo */}
    <Image
      source={{uri: team.team.logo.url}}
      // source={{uri: "https://logowik.com/content/uploads/images/kolkata-knight-riders6292.jpg"}}
      style={{
        width: 60 * scaleFactor,
        height: 60 * scaleFactor,
        borderRadius: 100,
        // marginRight: 10,
        marginBottom:18
      }}
    />
    {/* Team Details */}
    <View className="flex flex-col ml-5 items-start justify-between gap-2 py-3">
      <View className="flex flex-col gap-0.5">
        <Text
          style={{
            color: textColor,
            fontSize: 16,
            fontWeight: '700', // Bold
          }}
        >
          {team.team.name}
          {/* Kolkata Knight Riders */}
        </Text>
        <Text
          style={{
            color: secondaryTextColor,
            fontSize: 10,
            fontWeight: '400', // Regular
          }}
        >
          {team.location || "Location Not Available"}
          {/* Kolkata, West Bengal, India */}
        </Text>
      </View>
      <View
        style={{
          flex:1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent:"space-between",
          // gap:20,
          marginTop: 5,
        }}
      >
        <View style={{ flexDirection:"column", gap:2, alignItems: 'flex-start'}}>
          <Text style={{ color: textColor, fontSize: 12, fontWeight: "700" }}>Joined: </Text>
          <Text style={{ color: secondaryTextColor, fontSize: 12 }}>
            {team.creationDate || team.joiningDate
            ? `${month[new Date(
                team.creationDate || team.joiningDate
              ).getMonth()]}, ${new Date(
                team.creationDate || team.joiningDate
              ).getFullYear()}`
            : "NA"}
          </Text>
        </View>
        <View
          style={{
            width: 1,
            height: 30,
            backgroundColor: dividerColor,
            marginHorizontal: 20,
          }}
        />
        <View style={{ flexDirection:"column", gap:2, alignItems: 'flex-start'}}>
          <Text style={{ color: textColor, fontSize: 12, fontWeight: "700"}}>Role: </Text>
          <Text style={{ color: secondaryTextColor, fontSize: 12 }}>{team.role || "NA"}</Text>
        </View>
      </View>
    </View>
  </View>
)};

