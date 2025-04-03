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
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import TextScallingFalse from "~/components/CentralText";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import PostSmallCard from "@/components/Cards/PostSmallCard";
import { Tabs, TabsContent, TabsList } from "~/components/ui/tabs";
import PageThemeView from "~/components/PageThemeView";
import { ThemedText } from "~/components/ThemedText";
import { ProfileContext } from "./_layout";
import DiscoverPeopleList from "~/components/discover/discoverPeopleList";
import RecentPostsSection from "~/components/profilePage/RecentPostsSection";
import { useSelector } from "react-redux";
import { useLazyGetSpecificUserPostQuery } from "~/reduxStore/api/profile/profileApi.post";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { TeamEntry } from "~/app/(app)/(tabs)/profile";

// const posts = [
//   {
//     id: 1,
//     firstName: "Sebastian",
//     lastName: "Cilb",
//     profilepic:
//       "https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2F7ec7c81f-dedc-4a0f-8d4e-ddc6544dc96b.jpeg?alt=media&token=141060d7-b533-4e92-bce0-7e317a6ae9d8",
//     headline:
//       "Elite Performance | Specialized in Climbing, Sprinting/Time Trails | Driven By Precesion, Power, and Calmness",
//     caption:
//       "Another day, another ride. Focus, train,repeat. Pursing Peformance one mile at a time. The journey countinues",
//     image:
//       "https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2Fec810ca3-96d1-4101-981e-296240d60437.jpg?alt=media&token=da6e81af-e2d0-49c0-8ef0-fe923f837a07",
//     likes: ["harshal_123", "Miraj_123"],
//     comments: [
//       {
//         id: 1,
//         firstName: "harshl",
//         lastName: "mishra",
//         description: "kjaskjdashdkasjndjansjndjan",
//         comment: "amazing",
//       },
//       {
//         id: 2,
//         firstName: "harshl",
//         lastName: "mishra",
//         description: "kjaskjdashdkasjndjansjndjan",
//         comment: "agg laga deya",
//       },
//     ],
//   },
//   {
//     id: 2,
//     firstName: "Sebastian",
//     lastName: "Cilb",
//     profilepic:
//       "https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2F7ec7c81f-dedc-4a0f-8d4e-ddc6544dc96b.jpeg?alt=media&token=141060d7-b533-4e92-bce0-7e317a6ae9d8",
//     headline:
//       "Elite Performance | Specialized in Climbing, Sprinting/Time Trails | Driven By Precesion, Power, and Calmness",
//     caption:
//       "Another day, another ride. Focus, train,repeat. Pursing Peformance one mile at a time. The journey countinues",
//     image:
//       "https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2F409857d8-56c3-465f-9cac-dffddf0575e2.jpeg?alt=media&token=f3aa7516-8dac-4de5-90a5-b057c5d8703c",
//     likes: ["harshal_123", "Miraj_123"],
//     comments: [
//       {
//         id: 1,
//         firstName: "harshl",
//         lastName: "mishra",
//         description: "kjaskjdashdkasjndjansjndjan",
//         comment: "amazing",
//       },
//       {
//         id: 2,
//         firstName: "harshl",
//         lastName: "mishra",
//         description: "kjaskjdashdkasjndjansjndjan",
//         comment: "agg laga deya",
//       },
//     ],
//   },
//   {
//     id: 3,
//     firstName: "Sebastian",
//     lastName: "Cilb",
//     profilepic:
//       "https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2F7ec7c81f-dedc-4a0f-8d4e-ddc6544dc96b.jpeg?alt=media&token=141060d7-b533-4e92-bce0-7e317a6ae9d8",
//     headline:
//       "Elite Performance | Specialized in Climbing, Sprinting/Time Trails | Driven By Precesion, Power, and Calmness",
//     caption:
//       "Another day, another ride. Focus, train,repeat. Pursing Peformance one mile at a time. The journey countinues",
//     image:
//       "https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2F409857d8-56c3-465f-9cac-dffddf0575e2.jpeg?alt=media&token=f3aa7516-8dac-4de5-90a5-b057c5d8703c",
//     likes: ["harshal_123", "Miraj_123"],
//     comments: [
//       {
//         id: 1,
//         firstName: "harshl",
//         lastName: "mishra",
//         description: "kjaskjdashdkasjndjansjndjan",
//         comment: "amazing",
//       },
//       {
//         id: 2,
//         firstName: "harshl",
//         lastName: "mishra",
//         description: "kjaskjdashdkasjndjansjndjan",
//         comment: "agg laga deya",
//       },
//     ],
//   },
//   {
//     id: 4,
//     firstName: "Sebastian",
//     lastName: "Cilb",
//     profilepic:
//       "https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2F7ec7c81f-dedc-4a0f-8d4e-ddc6544dc96b.jpeg?alt=media&token=141060d7-b533-4e92-bce0-7e317a6ae9d8",
//     headline:
//       "Elite Performance | Specialized in Climbing, Sprinting/Time Trails | Driven By Precesion, Power, and Calmness",
//     caption:
//       "Another day, another ride. Focus, train,repeat. Pursing Peformance one mile at a time. The journey countinues",
//     image:
//       "https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2F409857d8-56c3-465f-9cac-dffddf0575e2.jpeg?alt=media&token=f3aa7516-8dac-4de5-90a5-b057c5d8703c",
//     likes: ["harshal_123", "Miraj_123"],
//     comments: [
//       {
//         id: 1,
//         firstName: "harshl",
//         lastName: "mishra",
//         description: "kjaskjdashdkasjndjansjndjan",
//         comment: "amazing",
//       },
//       {
//         id: 2,
//         firstName: "harshl",
//         lastName: "mishra",
//         description: "kjaskjdashdkasjndjansjndjan",
//         comment: "agg laga deya",
//       },
//     ],
//   },
// ];

const Overview = () => {
  const params = useLocalSearchParams();
  
    const fetchedUserId = useMemo(() => {
      return params.userId
        ? JSON.parse(decodeURIComponent(params?.userId as string))
        : null;
    }, [params.userId]);
  const [getUserSpecificPost, { data: posts }] =
    useLazyGetSpecificUserPostQuery();
  
    useEffect(() => {
      getUserSpecificPost({
        postedBy: fetchedUserId?.id,
        postedByType: fetchedUserId?.type,
        limit: 10,
        skip: 0,
        // lastTimestamp: null,
      });
    }, []);
  
    // console.log("\n\n\nPosts : ", posts);


  const { width: screenWidth2 } = useWindowDimensions();
  const scaleFactor = screenWidth2 / 410;


  const [isExpanded, setIsExpanded] = useState(false);


  const { profileData, isLoading, error } = useContext(ProfileContext);
  console.log("User data on Overview page : ", profileData);

  const maxAboutLength = 140;
  const aboutText = profileData?.about || '';
  const needsTruncation = aboutText.length > maxAboutLength;
  const truncatedText = needsTruncation ? 
    `${aboutText.substring(0, maxAboutLength).trim()}...` : 
    aboutText;

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const validSports =
    profileData?.selectedSports?.filter((s: any) => s.sport) || [];
  const [activeSubSection, setActiveSubSection] = useState(
    validSports[0]?.sport.name || null
  );

  const scrollViewRef = useRef<ScrollView>(null);

  const handleScrollToStart = () => {
    scrollViewRef.current?.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });
  };

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
      {validSports.length > 0 && (
        <Tabs value={activeSubSection} onValueChange={setActiveSubSection}>
          <ScrollView
            ref={scrollViewRef}
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
                    {sport.sport?.name.charAt(0).toUpperCase() +
                      sport.sport?.name.slice(1)}
                  </TextScallingFalse>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                className="border-[0.5px] border-[#686868] rounded-lg flex items-center justify-center"
                style={{ width: 36 * scaleFactor, height: 36 * scaleFactor }}
                onPress={handleScrollToStart}
              >
                <Feather name="chevron-right" size={20 * scaleFactor} color="#CCCCCC" />
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
                    <View className="flex-row justify-start flex-wrap gap-8 gap-y-4">
                      {Object.entries(sport.details).map(
                        ([key, value], idx) => (
                          <View
                            key={idx}
                            // className={`${idx < 3 ? "basis-[33%]" : "w-full"}`}
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

                {sport.teams?.length > 0 && (
                  <View className="bg-[#121212] w-[96%] px-5 py-4 rounded-xl mt-2">
                    {/* Two-Column Header */}
                    <View className="flex-row justify-between items-center mb-3">
                      <TextScallingFalse
                        className="text-[#8A8A8A]"
                        style={{fontFamily: "Montserrat", fontWeight:700, fontSize: responsiveFontSize(1.8),}}
                      >
                        CURRENT TEAMS
                      </TextScallingFalse>
                    </View>

                    {/* Teams Mapping */}
                    {sport.teams.map((team:any, index:any) => (
                      <View key={index} style={{ marginVertical: 1}}>
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
                      onPress={() => console.log('Navigate to Full Insights')}
                      style={{
                        flex:1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent:"center",
                        marginVertical: 6,
                      }}
                    >
                      <TextScallingFalse
                        style={{
                          color: "#808080",
                          fontSize: 15,
                          fontWeight: '700', // Bold
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
              >
                {isExpanded ? aboutText : truncatedText}
                {needsTruncation && (
                  <TextScallingFalse
                    onPress={handleToggle}
                    className="text-[#808080] font-light text-lg"
                  >
                    {isExpanded ? '  see less' : ' see more'}
                  </TextScallingFalse>
                )}
              </TextScallingFalse>
            </View>
          </View>
        </View>
      )}

      {/* recent posts */}
      <RecentPostsSection
        posts={posts}
        onSeeAllPress={() =>  {}}
        scaleFactor={scaleFactor}
      />

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
