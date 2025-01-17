import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Text,
  TouchableHighlight,
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import TextScallingFalse from "@/components/CentralText";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import PostSmallCard from "@/components/Cards/PostSmallCard";
import { Tabs, TabsContent, TabsList } from "~/components/ui/tabs";
import cricket from "@/assets/images/Sports Icons/okcricket.png";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import logo2 from "@/assets/images/logo2.png";

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
];

const Overview = () => {
  const { error, loading, user } = useSelector((state: any) => state?.auth);
  const { width } = useWindowDimensions();
  const sports = user?.selectedSports ? [...user.selectedSports] : [];

  // Dynamic scaling for responsiveness
  const containerWidth = width > 768 ? "50%" : "96%";
  const { width: screenWidth2 } = Dimensions.get("window");
  const scaleFactor = screenWidth2 / 410;

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSubSection, setActiveSubSection] = useState(
    sports[0]?.sport.name
  );

  //toggle see more
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={{ flex: 1 }}>
      {user?.isSportsOverviewSet ? (
        // <Tabs value={activeSubSection} onValueChange={setActiveSubSection}>
        //   <ScrollView
        //     horizontal
        //     showsHorizontalScrollIndicator={false}
        //     style={{ paddingStart: 15 * scaleFactor, paddingTop: "1%" }}
        //   >
        //     <TabsList style={styles.tabsList}>
        //       {user?.selectedSports?.length > 0 &&
        //         user?.selectedSports?.map((sport: any) => (
        //           <TouchableHighlight
        //             style={styles.touchableHighlight}
        //             onPress={() => setActiveSubSection(sport.sport.name)} // Update active tab
        //           >
        //             <View
        //               style={[
        //                 styles.buttonContainer,
        //                 {
        //                   borderRadius:
        //                     activeSubSection === sport.sport.name ? 7 : 9,
        //                   backgroundColor:
        //                     activeSubSection === sport.sport.name
        //                       ? "#12956B"
        //                       : "black",
        //                   borderColor:
        //                     activeSubSection === sport.sport.name
        //                       ? "#12956B"
        //                       : "#404040",
        //                 },
        //               ]}
        //             >
        //               <Image
        //                 source={{ uri: sport.sport.logo }}
        //                 style={{
        //                   width: 20 * scaleFactor,
        //                   height: 20 * scaleFactor,
        //                 }}
        //               />
        //               <Text style={styles.buttonText}>
        //                 {sport.sport.name.charAt(0).toUpperCase() +
        //                   sport.sport.name.slice(1)}
        //               </Text>
        //             </View>
        //           </TouchableHighlight>
        //         ))}
        //       <View
        //         style={{
        //           paddingRight: 25 * scaleFactor,
        //           paddingLeft: 6 * scaleFactor,
        //         }}
        //       >
        //         <TouchableOpacity
        //           activeOpacity={0.5}
        //           style={{
        //             borderColor: "#454545",
        //             borderWidth: 0.3,
        //             width: 36 * scaleFactor,
        //             height: 36 * scaleFactor,
        //             borderRadius: 7,
        //             alignItems: "center",
        //             justifyContent: "center",
        //           }}
        //         >
        //           <Feather name="plus" size={20 * scaleFactor} color="white" />
        //         </TouchableOpacity>
        //       </View>
        //     </TabsList>
        //   </ScrollView>
        //   {user?.selectedSports?.length > 0 &&
        //     user?.selectedSports?.map((sport: any) => (
        //       <TabsContent value={sport.sport.name}>
        //         {/* Sports Overview */}
        //         <View style={styles.OuterView}>
        //           <View style={styles.DetailsContainer}>
        //             <View
        //               style={{
        //                 flexDirection: "row",
        //                 flexWrap: "wrap",
        //                 columnGap: "12%",
        //                 rowGap: "11%",
        //               }}
        //             >
        //               {sport.details &&
        //                 Object.entries(sport.details).map(
        //                   ([key, value], index) => (
        //                     <View key={index}>
        //                       <TextScallingFalse style={styles.HeadingText}>
        //                         {key.toUpperCase()}
        //                       </TextScallingFalse>
        //                       <TextScallingFalse style={styles.DetailText}>
        //                         {value}
        //                       </TextScallingFalse>
        //                     </View>
        //                   )
        //                 )}
        //             </View>
        //           </View>
        //         </View>

        //         {/* team overview */}
        //         <View style={styles.OuterView}>
        //           <View style={styles.DetailsContainer}>
        //             <View style={{ flexDirection: "row" }}>
        //               <View style={{ backgroundColor: "purple" }}>
        //                 <TextScallingFalse style={styles.HeadingText}>
        //                   CURRENT TEAMS
        //                 </TextScallingFalse>
        //                 <View
        //                   style={{
        //                     flexDirection: "row",
        //                     columnGap: "3%",
        //                     paddingTop: "6%",
        //                   }}
        //                 >
        //                   <Image
        //                     source={{
        //                       uri: data.currentteamcricket[0].cteamlogo,
        //                     }}
        //                     style={{ width: 45, height: 45, borderRadius: 100 }}
        //                   />
        //                   <View
        //                     style={{ backgroundColor: "green", width: 120 }}
        //                   >
        //                     <TextScallingFalse
        //                       style={{
        //                         color: "white",
        //                         fontSize: responsiveFontSize(1.76),
        //                         fontWeight: "bold",
        //                       }}
        //                     >
        //                       Pro Tracker
        //                     </TextScallingFalse>
        //                     <TextScallingFalse
        //                       style={{
        //                         color: "grey",
        //                         fontSize: responsiveFontSize(1.41),
        //                         fontWeight: "300",
        //                       }}
        //                     >
        //                       Brisbane, Queensland, Australia
        //                     </TextScallingFalse>
        //                   </View>
        //                 </View>
        //               </View>

        //               <View
        //                 style={{
        //                   backgroundColor: "orange",
        //                   width: "50%",
        //                   alignItems: "center",
        //                 }}
        //               >
        //                 <View
        //                   style={{
        //                     width: "100%",
        //                     justifyContent: "center",
        //                     alignItems: "center",
        //                   }}
        //                 >
        //                   <TextScallingFalse style={styles.HeadingText}>
        //                     QUICK INFO
        //                   </TextScallingFalse>
        //                 </View>
        //                 <View style={{ backgroundColor: "brown" }}>
        //                   <View>
        //                     <TextScallingFalse
        //                       style={{
        //                         color: "white",
        //                         fontSize: responsiveFontSize(1.41),
        //                         fontWeight: "500",
        //                       }}
        //                     >
        //                       Position:{" "}
        //                       <TextScallingFalse
        //                         style={{ color: "white", fontWeight: "200" }}
        //                       >
        //                         [ c ] Batsman
        //                       </TextScallingFalse>
        //                     </TextScallingFalse>
        //                   </View>
        //                   <View style={{ paddingTop: "2%" }}>
        //                     <TextScallingFalse
        //                       style={{
        //                         color: "white",
        //                         fontSize: responsiveFontSize(1.29),
        //                         fontWeight: "400",
        //                       }}
        //                     >
        //                       Oct 2003
        //                       <TextScallingFalse
        //                         style={{ color: "white", fontWeight: "300" }}
        //                       >
        //                         {" "}
        //                         - Present - 20yrs
        //                       </TextScallingFalse>
        //                     </TextScallingFalse>
        //                   </View>
        //                   <View style={{ paddingTop: "2%" }}>
        //                     <TextScallingFalse
        //                       style={{
        //                         color: "white",
        //                         fontSize: responsiveFontSize(1.29),
        //                         fontWeight: "400",
        //                       }}
        //                     >
        //                       present:
        //                       <TextScallingFalse
        //                         style={{ color: "grey", fontWeight: "300" }}
        //                       ></TextScallingFalse>
        //                     </TextScallingFalse>
        //                   </View>
        //                 </View>
        //               </View>
        //             </View>
        //           </View>
        //         </View>
        //       </TabsContent>
        //     ))}
        // </Tabs>
        <Tabs value={activeSubSection} onValueChange={setActiveSubSection}>
          {/* Horizontal Tab Scroll */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={200}
            snapToAlignment="start"
            contentContainerStyle={{ paddingStart: 15 * scaleFactor }}
          >
            <TabsList className="flex-row gap-x-2 w-[100%]">
              {user?.selectedSports?.length > 0 &&
                user.selectedSports.map((sport: any) => (
                  <TouchableOpacity
                    key={sport.sport.name}
                    onPress={() => setActiveSubSection(sport.sport.name)}
                    className={`px-5 py-2 flex flex-row gap-x-3 items-center ${
                      activeSubSection === sport.sport.name
                        ? "bg-[#12956B]"
                        : "bg-black border-gray-600"
                    } border`}
                    style={{
                      borderRadius:
                        activeSubSection === sport.sport.name ? 7 : 9,
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
              <View>
                <TouchableOpacity
                  activeOpacity={0.5}
                  className="border border-gray-700 rounded-lg flex items-center justify-center"
                  style={{
                    width: 36 * scaleFactor,
                    height: 36 * scaleFactor,
                  }}
                >
                  <Feather name="plus" size={20 * scaleFactor} color="white" />
                </TouchableOpacity>
              </View>
            </TabsList>
          </ScrollView>

          {/* Tab Contents */}
          {user?.selectedSports?.length > 0 &&
            user.selectedSports.map((sport: any) => (
              <TabsContent key={sport.sport.name} value={sport.sport.name}>
                {/* Sports Overview */}
                <View
                  className={`w-full flex-1 items-center ${
                    sport.details && "p-2"
                  }`}
                >
                  {sport.details && (
                    <View className="bg-[#121212] w-[96%] px-5 py-4 rounded-xl">
                      <View className="flex-row justify-start flex-wrap gap-y-4">
                        {Object.entries(sport.details).map(
                          ([key, value], idx) => (
                            <View
                              key={idx}
                              className={`${
                                idx < 3 ? "basis-[33%]" : "w-full"
                              }`} // Basis for first 3 items and full width for others
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
                                {value}
                              </Text>
                            </View>
                          )
                        )}
                      </View>
                    </View>
                  )}
                </View>

                {/* Team Overview */}
                <View className="w-full flex-1 items-center p-2">
                  <View className="bg-[#121212] w-[96%] px-5 py-4 rounded-xl">
                    <View className="flex-row">
                      {/* Left Section: Current Teams */}
                      <View className="flex-1">
                        <TextScallingFalse
                          className="text-white font-bold"
                          style={styles.HeadingText}
                        >
                          CURRENT TEAMS
                        </TextScallingFalse>
                        <View className="flex-row gap-x-3 pt-4">
                          <Image
                            source={{
                              uri: data.currentteamcricket[0].cteamlogo,
                            }}
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
                              Pro Tracker
                            </TextScallingFalse>
                            <TextScallingFalse
                              className="text-gray-400"
                              style={{ fontSize: 13 * scaleFactor }}
                            >
                              Brisbane, Queensland, Australia
                            </TextScallingFalse>
                          </View>
                        </View>
                      </View>

                      {/* Right Section: Quick Info */}
                      <View className="flex-1 items-center">
                        <TextScallingFalse
                          className="text-white font-bold"
                          style={styles.HeadingText}
                        >
                          QUICK INFO
                        </TextScallingFalse>
                        <View className="pt-4">
                          <TextScallingFalse
                            className="text-white font-medium"
                            style={{ fontSize: 13 * scaleFactor }}
                          >
                            Position:{" "}
                            <TextScallingFalse className="font-light">
                              [c] Batsman
                            </TextScallingFalse>
                          </TextScallingFalse>
                          <TextScallingFalse
                            className="text-white font-light pt-2"
                            style={{ fontSize: 13 * scaleFactor }}
                          >
                            Oct 2003 - Present - 20yrs
                          </TextScallingFalse>
                          <TextScallingFalse
                            className="text-gray-400 pt-2"
                            style={{ fontSize: 13 * scaleFactor }}
                          >
                            present:
                          </TextScallingFalse>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </TabsContent>
            ))}
        </Tabs>
      ) : (
        <View className="w-full">
          {/* Carousel Section */}
          <View className="w-full items-center justify-center my-2">
            <ScrollView
              pagingEnabled
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row"
            >
              <View className="border border-gray-500 rounded-lg bg-white/10 items-center justify-center p-5">
                {/* Close Icon */}
                <TouchableOpacity
                  className="absolute top-2 right-2 bg-black/50 rounded"
                  style={{
                    width: 30 * scaleFactor,
                    height: 30 * scaleFactor,
                  }}
                >
                  <AntDesign
                    name="close"
                    size={14 * scaleFactor}
                    color="white"
                  />
                </TouchableOpacity>

                {/* Logo */}
                <View
                  className="rounded-full bg-black"
                  style={{
                    width: 30 * scaleFactor,
                    height: 30 * scaleFactor,
                    marginBottom: 10 * scaleFactor,
                  }}
                >
                  <Image
                    source={logo2}
                    className="w-full h-full rounded-full"
                  />
                </View>

                {/* Welcome Message */}
                <Text
                  className="text-white font-bold text-md text-center"
                  style={{ marginBottom: 5 * scaleFactor }}
                  allowFontScaling={false}
                >
                  Welcome to Strength!
                </Text>

                {/* Description */}
                <Text
                  className="text-gray-500 text-xs text-center px-4"
                  allowFontScaling={false}
                >
                  To craft an impactful athletic narrative, enhance your page -
                </Text>

                {/* Update Button */}
                <TouchableOpacity
                  className="bg-[#12956B] mt-2 rounded-full justify-center items-center"
                  style={{
                    width: screenWidth * 0.8,
                    height: 30 * scaleFactor,
                  }}
                >
                  <Text
                    className="text-white text-sm font-medium"
                    allowFontScaling={false}
                  >
                    Update Overview
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
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
          {/* About Heading */}
          <View className="p-0.5">
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
          </View>
        </View>
      </View>

      {/* <View style={styles.OuterView}>
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
              {user?.about}
            </TextScallingFalse>
            <TouchableOpacity onPress={handleToggle}>
              <TextScallingFalse style={styles.seeMore}>
                {isExpanded ? "see less" : "see more"}
              </TextScallingFalse>
            </TouchableOpacity>
          </View>
        </View>
      </View> */}

      {/* recent posts */}
      <View style={{ paddingTop: "3%", alignItems: "center" }}>
        <View
          style={{
            borderWidth: 0.3,
            width: "97.56%",
            height: 582 * scaleFactor,
            borderRadius: 20,
            borderLeftColor: "#494949",
            borderBottomColor: "#494949",
            borderTopColor: "#494949",
          }}
        >
          <View
            style={{
              width: "100%",
              height: "8.5%",
              justifyContent: "flex-end",
              paddingHorizontal: 22,
            }}
          >
            <TextScallingFalse
              style={{
                color: "grey",
                fontSize: responsiveFontSize(2.23),
                fontWeight: "bold",
              }}
            >
              RECENT POSTS
            </TextScallingFalse>
          </View>
          <ScrollView horizontal style={{ paddingStart: 20 }}>
            <View style={{ flexDirection: "row", gap: 20 }}>
              {posts.map((post: any) => (
                <PostSmallCard key={post.id} post={post} />
              ))}
              <View style={{ width: 10 }} />
            </View>
          </ScrollView>
          <View
            style={{
              width: "100%",
              height: "15%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{ height: 0.5, width: "90%", backgroundColor: "grey" }}
            />
            <TouchableOpacity
              activeOpacity={0.3}
              style={{ paddingTop: "3.5%" }}
            >
              <TextScallingFalse
                style={{ color: "#12956B", fontSize: 13, fontWeight: "400" }}
              >
                See all posts..
              </TextScallingFalse>
            </TouchableOpacity>
          </View>
        </View>
      </View>

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
