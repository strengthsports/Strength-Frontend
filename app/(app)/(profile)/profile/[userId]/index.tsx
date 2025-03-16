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
import React, { useContext, useState } from "react";
import TextScallingFalse from "@/components/CentralText";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import PostSmallCard from "@/components/Cards/PostSmallCard";
import { Tabs, TabsContent, TabsList } from "~/components/ui/tabs";
import { useSelector } from "react-redux";
import PageThemeView from "~/components/PageThemeView";
import { ThemedText } from "~/components/ThemedText";
import { ProfileContext } from "./_layout";

const data = {
  currentteamcricket: [
    {
      id: 1,
      cteamname: "Pro Trackers",
      cteamaddress: "Queensland, Australia",
      cteamposition: "Sprit-Lead",
      cteamjoinedon: "2/4/20",
      cteamlogo:
        "https://th.bing.com/th/id/R.8e89771a422f8151c53146eb2b950755?rik=x2SbdtUqdN4MrA&riu=http%3a%2f%2f1.bp.blogspot.com%2f-PSo_4af_Y4M%2fU1fY4UHfHOI%2fAAAAAAAANfw%2fMHW_GKUCYLE%2fs1600%2fchelsea-fc-logo-wallpapers%2b02.jpg&ehk=KVIwGdoGS9heIpR7oXnPO0o1K6GL5PhcyN9ugrRzpqA%3d&risl=&pid=ImgRaw&r=0",
    },
  ],
};

const posts = [
  {
    id: 1,
    firstName: "Sebastian",
    lastName: "Cilb",
    profilepic:
      "https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2F7ec7c81f-dedc-4a0f-8d4e-ddc6544dc96b.jpeg?alt=media&token=141060d7-b533-4e92-bce0-7e317a6ae9d8",
    headline:
      "Elite Performance | Specialized in Climbing, Sprinting/Time Trails | Driven By Precesion, Power, and Calmness",
    caption:
      "Another day, another ride. Focus, train,repeat. Pursing Peformance one mile at a time. The journey countinues",
    image:
      "https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2Fec810ca3-96d1-4101-981e-296240d60437.jpg?alt=media&token=da6e81af-e2d0-49c0-8ef0-fe923f837a07",
    likes: ["harshal_123", "Miraj_123"],
    comments: [
      {
        id: 1,
        firstName: "harshl",
        lastName: "mishra",
        description: "kjaskjdashdkasjndjansjndjan",
        comment: "amazing",
      },
      {
        id: 2,
        firstName: "harshl",
        lastName: "mishra",
        description: "kjaskjdashdkasjndjansjndjan",
        comment: "agg laga deya",
      },
    ],
  },
  {
    id: 2,
    firstName: "Sebastian",
    lastName: "Cilb",
    profilepic:
      "https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2F7ec7c81f-dedc-4a0f-8d4e-ddc6544dc96b.jpeg?alt=media&token=141060d7-b533-4e92-bce0-7e317a6ae9d8",
    headline:
      "Elite Performance | Specialized in Climbing, Sprinting/Time Trails | Driven By Precesion, Power, and Calmness",
    caption:
      "Another day, another ride. Focus, train,repeat. Pursing Peformance one mile at a time. The journey countinues",
    image:
      "https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2F409857d8-56c3-465f-9cac-dffddf0575e2.jpeg?alt=media&token=f3aa7516-8dac-4de5-90a5-b057c5d8703c",
    likes: ["harshal_123", "Miraj_123"],
    comments: [
      {
        id: 1,
        firstName: "harshl",
        lastName: "mishra",
        description: "kjaskjdashdkasjndjansjndjan",
        comment: "amazing",
      },
      {
        id: 2,
        firstName: "harshl",
        lastName: "mishra",
        description: "kjaskjdashdkasjndjansjndjan",
        comment: "agg laga deya",
      },
    ],
  },
  {
    id: 3,
    firstName: "Sebastian",
    lastName: "Cilb",
    profilepic:
      "https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2F7ec7c81f-dedc-4a0f-8d4e-ddc6544dc96b.jpeg?alt=media&token=141060d7-b533-4e92-bce0-7e317a6ae9d8",
    headline:
      "Elite Performance | Specialized in Climbing, Sprinting/Time Trails | Driven By Precesion, Power, and Calmness",
    caption:
      "Another day, another ride. Focus, train,repeat. Pursing Peformance one mile at a time. The journey countinues",
    image:
      "https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2F409857d8-56c3-465f-9cac-dffddf0575e2.jpeg?alt=media&token=f3aa7516-8dac-4de5-90a5-b057c5d8703c",
    likes: ["harshal_123", "Miraj_123"],
    comments: [
      {
        id: 1,
        firstName: "harshl",
        lastName: "mishra",
        description: "kjaskjdashdkasjndjansjndjan",
        comment: "amazing",
      },
      {
        id: 2,
        firstName: "harshl",
        lastName: "mishra",
        description: "kjaskjdashdkasjndjansjndjan",
        comment: "agg laga deya",
      },
    ],
  },
  {
    id: 4,
    firstName: "Sebastian",
    lastName: "Cilb",
    profilepic:
      "https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2F7ec7c81f-dedc-4a0f-8d4e-ddc6544dc96b.jpeg?alt=media&token=141060d7-b533-4e92-bce0-7e317a6ae9d8",
    headline:
      "Elite Performance | Specialized in Climbing, Sprinting/Time Trails | Driven By Precesion, Power, and Calmness",
    caption:
      "Another day, another ride. Focus, train,repeat. Pursing Peformance one mile at a time. The journey countinues",
    image:
      "https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2F409857d8-56c3-465f-9cac-dffddf0575e2.jpeg?alt=media&token=f3aa7516-8dac-4de5-90a5-b057c5d8703c",
    likes: ["harshal_123", "Miraj_123"],
    comments: [
      {
        id: 1,
        firstName: "harshl",
        lastName: "mishra",
        description: "kjaskjdashdkasjndjansjndjan",
        comment: "amazing",
      },
      {
        id: 2,
        firstName: "harshl",
        lastName: "mishra",
        description: "kjaskjdashdkasjndjansjndjan",
        comment: "agg laga deya",
      },
    ],
  },
];

const Overview = () => {
  // const { width: screenWidth2 } = Dimensions.get("window");
  const { width: screenWidth2 } = useWindowDimensions();
  const scaleFactor = screenWidth2 / 410;

  const gap = 10; // Space between posts
  const postWidth = (screenWidth2 - gap) / 1.25; // Width of each post
  const spacerWidth = (screenWidth2 - postWidth) / 1.5; //spacer width for the end of the ScrollView

  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const { profileData, isLoading, error } = useContext(ProfileContext);
  // console.log("User data on Overview page : ", profileData);

  const validSports = profileData?.selectedSports?.filter((s: any) => s.sport) || [];
  const [activeSubSection, setActiveSubSection] = useState(validSports[0]?.sport.name || null);

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
            </TabsList>
          </ScrollView>

          {/* Tab Contents */}
           {validSports.map((sport : any) => (
            <TabsContent key={sport.sport._id} value={sport.sport.name}>
              {/* Sports Overview */}
              <View className="w-full flex-1 items-center p-2">
                {sport.details && (
                  <View className="bg-[#121212] w-[96%] px-5 py-4 rounded-xl">
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
      {profileData?.about && (
        <View style={styles.OuterView}>
          <View style={styles.DetailsContainer}>
            <View style={{ padding: 2 }}>
              <TextScallingFalse
                style={{
                  color: "grey",
                  fontSize: responsiveFontSize(2.23),
                  fontWeight: "bold",
                }}
              >
                About
              </TextScallingFalse>
              <TextScallingFalse
                style={{
                  fontSize: responsiveFontSize(1.52),
                  color: "white",
                  fontWeight: "300",
                  paddingTop: "3%",
                  lineHeight: 17.5,
                }}
                numberOfLines={isExpanded ? undefined : 3}
              >
                {profileData?.about}
              </TextScallingFalse>
              <TouchableOpacity onPress={handleToggle}>
                <TextScallingFalse style={styles.seeMore}>
                  {profileData?.about.length > 140 &&
                    (isExpanded ? "see less" : "see more")}
                </TextScallingFalse>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* recent posts */}
      {posts && posts.length > 0 && (
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

            <ScrollView
              horizontal
              snapToInterval={postWidth + gap}
              decelerationRate="normal"
              showsHorizontalScrollIndicator={false}
            >
              <View className="flex-row ml-4" style={{ gap }}>
                {posts.map((post) => (
                  <View key={post.id} style={{ width: postWidth, height: "100%" }}>
                    <PostSmallCard post={post} />
                  </View>
                ))}
                <View style={{ width: spacerWidth }} />
              </View>
            </ScrollView>

            <View className="w-auto h-[15%] justify-center items-center">
              <View className="h-[0.5] w-[90%] bg-gray-400" />
              <TouchableOpacity activeOpacity={0.3} className="pt-4">
                <TextScallingFalse className="text-[#12956B] text-[13px] font-normal">
                  See all posts...
                </TextScallingFalse>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

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
