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
import React, { useEffect, useMemo, useState } from "react";
import TextScallingFalse from "@/components/CentralText";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Tabs, TabsContent, TabsList } from "~/components/ui/tabs";
import { Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { Href, useRouter } from "expo-router";
import { AppDispatch, RootState } from "~/reduxStore";
import RecentPostsSection from "~/components/profilePage/RecentPostsSection";
import EditIcon from "~/components/SvgIcons/profilePage/EditIcon";
import AddIcon from "~/components/SvgIcons/profilePage/AddIcon";
import AddPostFTU from "~/components/ui/FTU/profilePage/AddPostFTU";
import TeamEntry from "~/components/profilePage/TeamEntry";
import MembersSection from "~/components/profilePage/MembersSection";
import { fetchAssociates } from "~/reduxStore/slices/user/profileSlice";
import { Member } from "~/types/user";
import ProfileFTU from "~/components/ui/FTU/profilePage/ProfileFTU";
import { fetchUserPosts } from "~/reduxStore/slices/post/hooks";
import { makeSelectUserPosts } from "~/reduxStore/slices/post/selectors";

// const EMPTY_ARRAY_GENERAL: any[] = [];
const EMPTY_MEMBER_ARRAY: Member[] = [];
const EMPTY_SELECTED_SPORTS_ARRAY: any[] = [];

const Overview = () => {
  const { error, loading, user } = useSelector((state: any) => state?.profile);
  const dispatch = useDispatch<AppDispatch>();
  //  console.log("Profile Data comming from backend --------> ",JSON.stringify(user,null,2));
  const router = useRouter();
  const { width } = useWindowDimensions();
  const selectedSportsToRender =
    user?.selectedSports ?? EMPTY_SELECTED_SPORTS_ARRAY;

  // Dynamic scaling for responsiveness
  const containerWidth = width > 768 ? "50%" : "96%";
  const { width: screenWidth2 } = useWindowDimensions();
  const scaleFactor = screenWidth2 / 410;

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSubSection, setActiveSubSection] = useState(
    () => selectedSportsToRender[0]?.sport?.name || ""
  );

  useEffect(() => {
    if (selectedSportsToRender.length > 0) {
      const currentSportStillExists = selectedSportsToRender.some(
        (s: any) => s.sport?.name === activeSubSection
      );
      if (!currentSportStillExists) {
        setActiveSubSection(selectedSportsToRender[0]?.sport?.name || "");
      }
    } else {
      setActiveSubSection("");
    }
  }, [selectedSportsToRender, activeSubSection]);

  // Get filtered posts from Redux
  // const userPosts = useSelector((state: RootState) =>
  //   selectPostsByUserId(state.feed.posts as any, user?._id)
  // );
  // const postsWithImages = useMemo(
  //   () => userPosts?.filter((post) => post.assets?.length > 0) || [],
  //   [userPosts]
  // );

  const selectUserPosts = useMemo(
    () => makeSelectUserPosts(user?._id, "recent"),
    [user?._id]
  );
  const postsWithImages = useSelector(selectUserPosts);

  // Get associates list
  const associates = useSelector(
    (state: RootState) =>
      (state.profile.user?.associates as Member[]) ?? EMPTY_MEMBER_ARRAY
  );

  // Fetch initial posts
  useEffect(() => {
    if (user?._id) {
      dispatch(
        fetchUserPosts({
          userId: user._id,
          limit: 10,
          type: "recent",
        })
      );
    }
  }, [user?._id, dispatch]);

  // Fetch page associates
  useEffect(() => {
    if (user?.type === "Page") {
      dispatch(fetchAssociates(null));
    }
  }, [user?.type, dispatch]);

  // Memoized athlete and coach data
  const athletes = useMemo(
    () => associates.filter((member) => member.role === "Athlete"),
    [associates]
  );

  const coaches = useMemo(
    () => associates.filter((member) => member.role === "Coach"),
    [associates]
  );

  //toggle see more
  const maxAboutLength = 150;
  const aboutText = user?.about || "";
  const needsTruncation = aboutText.length > maxAboutLength;
  const truncatedText = needsTruncation
    ? `${aboutText.substring(0, maxAboutLength).trim()}...`
    : aboutText;

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // Filter teams to only show joined teams (not created or admin teams)
  const getFilteredTeams = (sport) => {
    if (!sport.teams || !Array.isArray(sport.teams)) return [];

    // Filter out admin roles and created teams
    const joinedTeams = sport.teams.filter((team) => {
      // Skip teams where role is "Admin" or user is creator
      const isAdmin = team.role && team.role.toLowerCase() === "admin";
      const isCreator = team.isCreator === true || team.createdBy === user?._id;

      return !isAdmin && !isCreator;
    });

    // Remove duplicates by team ID
    const uniqueTeamsMap = new Map();
    joinedTeams.forEach((team) => {
      const teamId = team._id || team.id || JSON.stringify(team);
      if (!uniqueTeamsMap.has(teamId)) {
        uniqueTeamsMap.set(teamId, team);
      }
    });

    return Array.from(uniqueTeamsMap.values());
  };

  return (
    <ScrollView style={{ flex: 1, paddingBottom: 120 }}>
      {selectedSportsToRender.length > 0 && (
        <Tabs value={activeSubSection} onValueChange={setActiveSubSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingStart: 15 * scaleFactor }}
          >
            <TabsList className="flex-row gap-x-2 w-[100%] py-1 px-0.5">
              {selectedSportsToRender.map((sport: any) => (
                <TouchableOpacity
                  key={`sport-tab-${sport.sport?._id}`}
                  onPress={() => setActiveSubSection(sport.sport?.name)}
                  className={`px-5 py-2 flex flex-row gap-x-3 items-center ${activeSubSection === sport.sport?.name
                      ? "bg-[#12956B]"
                      : "bg-black border-[0.5px] border-[#686868]"
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
                      zIndex: 10,
                    }}
                    resizeMode="contain"
                  />
                  <TextScallingFalse
                    className={`text-lg font-medium ${activeSubSection === sport.sport?.name
                        ? "text-white"
                        : "text-[#CCCCCC]"
                      }`}
                  >
                    {sport.sport?.name
                      ? sport.sport.name.charAt(0).toUpperCase() + sport.sport.name.slice(1)
                      : "Unnamed"}
                  </TextScallingFalse>
                </TouchableOpacity>
              ))}
              {/* Add Tab Button */}
              <TouchableOpacity
                className="border-[0.5px] border-[#686868] rounded-lg flex items-center justify-center mr-40"
                style={{ width: 36 * scaleFactor, height: 36 * scaleFactor }}
                onPress={() => router.push("/(app)/(profile)/edit-overview")}
              >
                <Feather name="plus" size={20 * scaleFactor} color="#CCCCCC" />
              </TouchableOpacity>
            </TabsList>
          </ScrollView>

          {/* Tab Contents */}
          {user?.selectedSports?.map((sport: any) => (
            <TabsContent
              key={`sport-content-${sport.sport?._id}`}
              value={sport.sport?.name}
            >
              {/* Sports Overview */}
              <View className="w-full md:max-w-[600px] mx-auto flex-1 items-center py-2 px-1">
                {sport.details && (
                  <View className="relative bg-[#161616] w-[96%] px-5 py-4 rounded-[15px] flex-row justify-start flex-wrap gap-8 gap-y-4">
                    {Object.entries(sport.details)
                      .filter(
                        ([key, value]) =>
                          value &&
                          (typeof value === "string" ? value.trim() : true)
                      )
                      .map(([key, value], index) => (
                        <View key={`detail-${sport.sport?._id}-${index}`}>
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
                  </View>
                )}

                {sport.teams?.length > 0 &&
                  getFilteredTeams(sport).length > 0 && (
                    <View className="bg-[#161616] w-[96%] px-5 py-4 rounded-xl mt-2">
                      {/* Two-Column Header */}
                      <View className="flex-row justify-between items-center mb-3">
                        <TextScallingFalse
                          className="text-[#8A8A8A] "
                          style={{
                            fontFamily: "Montserrat",
                            fontWeight: 700,
                            fontSize: 14,
                          }}
                        >
                          CURRENT TEAMS
                        </TextScallingFalse>
                        <View className="flex items-center justify-center flex-row gap-4">
                          <TouchableOpacity
                            onPress={() => router.push("/(app)/(team)/teams")}
                          >
                            <AddIcon />
                          </TouchableOpacity>
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() =>
                              router.push(
                                "/(app)/(profile)/edit-overview/(modal)/current-team"
                              )
                            }
                          >
                            <EditIcon />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Teams Mapping with Filtered Teams */}
                      {getFilteredTeams(sport).map(
                        (team: any, index: number) => (
                          <View
                            key={`team-${sport.sport?._id}-${team._id || index
                              }`}
                            style={{ marginVertical: 1 }}
                          >
                            <TeamEntry team={team} />
                            {index !== sport.teams.length - 1 && (
                              <View
                                style={{
                                  height: 0.5,
                                  backgroundColor: "#3B3B3B",
                                  marginVertical: 16,
                                }}
                              />
                            )}
                          </View>
                        )
                      )}
                    </View>
                  )}
              </View>
            </TabsContent>
          ))}
        </Tabs>
      )}

      <ProfileFTU />

      {/* about */}
      {user?.about && (
        <View className="w-full flex-1 items-center py-2 px-1">
          {/* About Container */}
          <View
            className="bg-[#161616] px-5 py-4 rounded-xl"
            style={{
              width: containerWidth,
            }}
          >
            <View className="p-0.5 relative">
              {/* About Heading */}
              <TextScallingFalse
                className="text-[#808080] font-bold"
                style={{
                  fontSize: 14,
                }}
              >
                ABOUT
              </TextScallingFalse>

              {/* About Content */}
              <TextScallingFalse
                className="text-white font-light pt-4 leading-5"
                style={{
                  fontSize: 13,
                }}
              >
                {isExpanded ? aboutText : truncatedText}
                {needsTruncation && (
                  <TextScallingFalse
                    onPress={handleToggle}
                    className="text-[#808080] font-light text-lg"
                  >
                    {isExpanded ? "" : " more"}
                  </TextScallingFalse>
                )}
              </TextScallingFalse>

              {/* edit button */}
              <TouchableOpacity
                className="absolute top-0 right-0"
                activeOpacity={0.7}
                onPress={() =>
                  router.push("/(app)/(profile)/edit-overview?about=true")
                }
              >
                <EditIcon />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* recent posts */}
      {postsWithImages?.length > 0 && (
        <RecentPostsSection
          posts={postsWithImages}
          onSeeAllPress={() =>
            router.push("/(app)/(tabs)/profile/activity" as Href)
          }
          scaleFactor={scaleFactor}
        />
      )}

      {/* members */}
      {user?.type === "Page" && coaches?.length > 0 && (
        <MembersSection
          members={coaches}
          sectionHeader="Coaches"
          moreText="Show all coaches"
          isOwnProfile={true}
        />
      )}
      {user?.type === "Page" && athletes?.length > 0 && (
        <MembersSection
          members={athletes}
          sectionHeader="Athletes"
          moreText="Show all athletes"
          isOwnProfile={true}
        />
      )}

      {postsWithImages?.length === 0 && <AddPostFTU />}
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
    fontSize: responsiveFontSize(1.3),
    color: "white",
    fontWeight: "bold",
  },
  DetailText: {
    fontSize: responsiveFontSize(1.5),
    color: "#C1C1C1",
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
