import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Text,
} from "react-native";
import React, { useContext, useEffect, useMemo, useState } from "react";
import TextScallingFalse from "~/components/CentralText";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Tabs, TabsContent, TabsList } from "~/components/ui/tabs";
import PageThemeView from "~/components/PageThemeView";
import { ThemedText } from "~/components/ThemedText";
import { ProfileContext } from "./_layout";
import DiscoverPeopleList from "~/components/discover/discoverPeopleList";
import RecentPostsSection from "~/components/profilePage/RecentPostsSection";
import { useDispatch, useSelector } from "react-redux";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import TeamEntry from "~/components/profilePage/TeamEntry";
import { AppDispatch, RootState } from "~/reduxStore";
import {
  fetchUserPosts,
  selectPostsByUserId,
} from "~/reduxStore/slices/feed/feedSlice";
import MembersSection from "~/components/profilePage/MembersSection";
import { fetchAssociates } from "~/reduxStore/slices/user/profileSlice";
import { Member } from "~/types/user";
import { useGetPageMembersQuery } from "~/reduxStore/api/profile/profileApi.profile";

const Overview = () => {
  const params = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const fetchedUserId = useMemo(() => {
    return params.userId
      ? JSON.parse(decodeURIComponent(params?.userId as string))
      : null;
  }, [params.userId]);

  const [isExpanded, setIsExpanded] = useState(false);
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const { profileData, isLoading, error } = useContext(ProfileContext);

  // Get filtered posts from Redux
  const userPosts = useSelector((state: RootState) =>
    selectPostsByUserId(state.feed.posts as any, fetchedUserId.id)
  );
  const postsWithImages = useMemo(
    () => userPosts?.filter((post) => post.assets.length > 0) || [],
    [userPosts]
  );

  // Get associates list
  // const associates = useSelector(
  //   (state: RootState) => (state.profile.user?.associates as Member[]) || []
  // );

  // Fetch initial posts
  useEffect(() => {
    dispatch(
      fetchUserPosts({
        postedBy: fetchedUserId.id,
        postedByType: fetchedUserId.type,
        limit: 10,
        skip: 0,
      })
    );
  }, [fetchedUserId, dispatch]);

  // // Fetch page associates
  const { data: associates } = useGetPageMembersQuery({
    pageId: fetchedUserId.id,
  });
  // useEffect(() => {
  //   dispatch(
  //     fetchAssociates({
  //       pageId: fetchedUserId.id,
  //     })
  //   );
  // }, [fetchedUserId, dispatch]);

  // Valid Sports data
  const validSports =
    profileData?.selectedSports?.filter((s: any) => s.sport) || [];
  const [activeSubSection, setActiveSubSection] = useState(
    validSports[0]?.sport.name || null
  );

  // Memoized athlete and coach data
  const athletes = useMemo(
    () => associates?.filter((member: Member) => member.role === "Athlete"),
    [associates]
  );

  const coaches = useMemo(
    () => associates?.filter((member: Member) => member.role === "Coach"),
    [associates]
  );

  if (error) {
    return (
      <PageThemeView>
        <ScrollView>
          <View>
            <ThemedText>{error}</ThemedText>
          </View>
        </ScrollView>
      </PageThemeView>
    );
  }

  if (isLoading) {
    return (
      <PageThemeView>
        <ScrollView>
          <View>
            <ThemedText>Loading...</ThemedText>
          </View>
        </ScrollView>
      </PageThemeView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {fetchedUserId?.type !== "Page" && validSports.length > 0 && (
        <Tabs value={activeSubSection} onValueChange={setActiveSubSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingStart: 15 * scaleFactor }}
            className="mt-2"
          >
            <TabsList className="flex-row gap-x-2 w-[100%]">
              {validSports.map((sport: any) => (
                <TouchableOpacity
                  key={sport.sport?._id}
                  onPress={() => setActiveSubSection(sport.sport?.name)}
                  className={`px-5 py-2 flex flex-row gap-x-3 items-center ${
                    activeSubSection === sport.sport?.name
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
                    }}
                    resizeMode="contain"
                  />
                  <TextScallingFalse
                    className={`text-lg font-medium ${
                      activeSubSection === sport.sport?.name
                        ? "text-white"
                        : "text-[#CCCCCC]"
                    }`}
                    // style={styles.buttonText}
                  >
                    {sport.sport?.name?.charAt(0).toUpperCase() +
                      sport.sport?.name?.slice(1)}
                  </TextScallingFalse>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                className="border-[0.5px] border-[#686868] rounded-lg flex items-center justify-center"
                style={{ width: 36 * scaleFactor, height: 36 * scaleFactor }}
                onPress={() => router.push("/(app)/(profile)/edit-overview")}
              >
                <Feather
                  name="chevron-right"
                  size={20 * scaleFactor}
                  color="#CCCCCC"
                />
              </TouchableOpacity>
            </TabsList>
          </ScrollView>

          {/* Tab Contents */}
          {validSports.map((sport: any) => (
            <TabsContent key={sport.sport._id} value={sport.sport.name}>
              {/* Sports Overview */}
              <View className="w-full md:max-w-[600px] mx-auto flex-1 items-center p-2">
                {sport.details && (
                  <View className="bg-[#161616] w-[96%] px-5 py-4 rounded-[15px]">
                    <View className="flex-row justify-start flex-wrap gap-y-4">
                      {Object.entries(sport.details).map(
                        ([key, value], idx) => (
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
                        )
                      )}
                    </View>
                  </View>
                )}

                {sport.teams.length > 0 && (
                  <View className="bg-[#121212] w-[96%] px-5 py-4 rounded-xl mt-2">
                    {/* Two-Column Header */}
                    <View className="flex-row justify-between items-center mb-3">
                      <TextScallingFalse
                        className="text-[#8A8A8A]"
                        style={{
                          fontFamily: "Montserrat",
                          fontWeight: 700,
                          fontSize: responsiveFontSize(1.8),
                        }}
                      >
                        CURRENT TEAMS
                      </TextScallingFalse>
                    </View>

                    {/* Teams Mapping */}
                    {sport.teams.map((team: any, index: any) => (
                      <View key={index} style={{ marginVertical: 1 }}>
                        <TeamEntry team={team} />
                        <View
                          style={{
                            height: 0.5,
                            backgroundColor: "#3B3B3B",
                            marginVertical: 16,
                          }}
                        />
                      </View>
                    ))}
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
                      <TextScallingFalse
                        style={{
                          color: "#808080",
                          fontSize: 15,
                          fontWeight: "700", // Bold
                        }}
                      >
                        Full Insights
                      </TextScallingFalse>
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
      {profileData?.about && (
        <View style={styles.OuterView}>
          <View style={styles.DetailsContainer}>
            <View style={{ padding: 2 }}>
              <TextScallingFalse
                style={{
                  color: "#808080",
                  fontSize: responsiveFontSize(1.9),
                  fontWeight: "bold",
                }}
              >
                ABOUT
              </TextScallingFalse>
              <TextScallingFalse
                className="text-white font-light pt-4 leading-5"
                style={{
                  fontSize: responsiveFontSize(1.6),
                }}
                numberOfLines={isExpanded ? undefined : 2}
              >
                {profileData?.about}
              </TextScallingFalse>
              <TouchableOpacity onPress={handleToggle}>
                <TextScallingFalse style={styles.seeMore}>
                  {profileData?.about?.length > 140 &&
                    (isExpanded ? "see less" : "see more")}
                </TextScallingFalse>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* recent posts */}
      {postsWithImages?.length > 0 && (
        <RecentPostsSection
          posts={postsWithImages}
          onSeeAllPress={() => {}}
          scaleFactor={scaleFactor}
        />
      )}

      {/* members */}
      {profileData?.type === "Page" && coaches?.length > 0 && (
        <MembersSection
          members={coaches}
          sectionHeader="Coaches"
          moreText="Show all coaches"
        />
      )}
      {profileData?.type === "Page" && athletes?.length > 0 && (
        <MembersSection
          members={athletes}
          sectionHeader="Athletes"
          moreText="Show all athletes"
        />
      )}

      <DiscoverPeopleList />

      <View
        style={{ height: 30, width: "100%", backgroundColor: "transparent" }}
      />
    </View>
  );
};

export default Overview;

const { width: screenWidth } = Dimensions.get("window");
const scaleFactor = screenWidth / 410;

const styles = StyleSheet.create({
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
  seeMore: {
    color: "grey",
    fontSize: responsiveFontSize(1.6),
    fontWeight: "300",
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
