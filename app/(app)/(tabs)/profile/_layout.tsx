import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  ScrollView,
  Text,
} from "react-native";
import PageThemeView from "~/components/PageThemeView";
import PostButton from "~/components/PostButton";
import flag from "@/assets/images/IN.png";
import TextScallingFalse from "@/components/CentralText";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { Slot, usePathname, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { dateFormatter } from "~/utils/dateFormatter";

const ProfileLayout = () => {
  const { error, loading, user } = useSelector((state: any) => state?.auth);
  const router = useRouter();
  const pathname = usePathname();
  console.log("Loading:", loading);
  console.log("Error:", error);
  console.log("Profile:", user);

  const [activeTab, setActiveTab] = useState("Overview");

  const tabsMap: { [key: string]: string } = {
    "/profile": "Overview",
    "/profile/activity": "Activity",
    "/profile/events": "Events",
    "/profile/teams": "Teams",
  };

  // Sync activeTab with the current route path
  useEffect(() => {
    const currentTab = tabsMap[pathname] || "Overview";
    setActiveTab(currentTab);
  }, [pathname]);

  const handleTabPress = (tabName: string, route: any) => {
    setActiveTab(tabName);
    router.replace(route); // Navigate to the new route
  };

  return (
    <PageThemeView>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* username */}
        <View className="justify-between px-3 flex-row h-12 items-center">
          <TextScallingFalse className="text-white text-5xl">
            @{user?.username}
          </TextScallingFalse>
          <View className="flex-row gap-[0.85rem] mt-1">
            <View>
              <PostButton />
            </View>
            <TouchableOpacity activeOpacity={0.5}>
              <MaterialCommunityIcons
                name="message-reply-text-outline"
                size={27}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* profile pic and cover image */}
        <View
          className="w-full lg:w-[600px] mx-auto lg:max-h-[200px] bg-yellow-300 relative"
          style={{ alignItems: "flex-end", height: 135 * scaleFactor }}
        >
          <Image
            source={{ uri: user?.coverPic }}
            style={{ width: "100%", height: "100%" }}
          />
          <View className="absolute h-full z-50 flex items-center justify-center top-[50%] right-[5%] lg:w-[33%]">
            <View
              style={{
                width: responsiveWidth(31),
                height: responsiveHeight(15),
                backgroundColor: "black",
                borderRadius: 100,
                justifyContent: "center",
                alignItems: "center",
              }}
              className="lg:w-14 lg:h-14"
            >
              <Image
                source={{ uri: user?.profilePic }}
                style={{
                  width: responsiveWidth(29.6),
                  height: responsiveHeight(14.4),
                  borderRadius: 100,
                }}
                className="lg:w-14 lg:h-14"
              />
            </View>
          </View>
        </View>

        {/* user info */}
        <View className="w-full lg:w-[600px] mx-auto items-center pt-[2%]">
          <View
            style={{
              width: "95.12%",
              backgroundColor: "#171717",
              // backgroundColor: "red",
              borderRadius: 33,
              padding: 25,
            }}
          >
            {/* first name, last name, country */}
            <View
              style={{ position: "relative", top: -9, flexDirection: "row" }}
            >
              <View style={{ width: "47.1%" }}>
                <TextScallingFalse
                  style={{
                    color: "white",
                    fontSize: responsiveFontSize(2.35),
                    fontWeight: "bold",
                  }}
                >
                  {user?.firstName} {user?.lastName}
                </TextScallingFalse>
              </View>
              <View style={{ width: "19.70%" }}>
                <View style={{ height: 7 }} />
                <View style={{ flexDirection: "row", gap: 3 }}>
                  <Image
                    source={flag}
                    style={{ width: "23.88%", height: "90%" }}
                  />
                  <TextScallingFalse
                    style={{
                      color: "white",
                      fontSize: responsiveFontSize(1.41),
                      fontWeight: "400",
                    }}
                  >
                    {user?.address?.country || "undefined"}
                  </TextScallingFalse>
                </View>
              </View>
            </View>

            {/* headline */}
            <View style={{ width: "67.64%", position: "relative", top: -9 }}>
              <TextScallingFalse
                style={{
                  color: "white",
                  fontSize: responsiveFontSize(1.3),
                  fontWeight: "400",
                }}
              >
                {user?.headline}
              </TextScallingFalse>
            </View>

            <View style={{ paddingTop: "3.6%" }}>
              {/* age, height, weight, teams */}
              <View style={{ position: "relative", left: -3 }}>
                <View style={{ flexDirection: "row", gap: "3.65%" }}>
                  <View style={{ flexDirection: "row" }}>
                    <Entypo
                      name="dot-single"
                      size={responsiveDotSize}
                      color="white"
                    />
                    <TextScallingFalse style={styles.ProfileKeyPoints}>
                      {" "}
                      Age: {user?.age}{" "}
                      <TextScallingFalse style={{ color: "grey" }}>
                        ({dateFormatter(user?.dateOfBirth, "text")})
                      </TextScallingFalse>
                    </TextScallingFalse>
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <Entypo
                      name="dot-single"
                      size={responsiveDotSize}
                      color="white"
                    />
                    <TextScallingFalse style={styles.ProfileKeyPoints}>
                      {" "}
                      Height:{" "}
                      {user?.height || (
                        <Text style={{ color: "grey" }}>undefined</Text>
                      )}
                    </TextScallingFalse>
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <Entypo
                      name="dot-single"
                      size={responsiveDotSize}
                      color="white"
                    />
                    <TextScallingFalse style={styles.ProfileKeyPoints}>
                      {" "}
                      Weight:{" "}
                      {user?.weight || (
                        <Text style={{ color: "grey" }}>undefined</Text>
                      )}
                    </TextScallingFalse>
                  </View>
                </View>

                <View style={{ paddingTop: "3%" }}>
                  <View style={{ flexDirection: "row" }}>
                    <Entypo
                      name="dot-single"
                      size={responsiveDotSize}
                      color="white"
                    />
                    <TextScallingFalse style={styles.ProfileKeyPoints}>
                      {" "}
                      Teams:{" "}
                      {user?.createdTeams?.length > 0 &&
                        user.createdTeams.map((team: any) => (
                          <TextScallingFalse style={{ color: "grey" }}>
                            {" "}
                            {team.name}
                          </TextScallingFalse>
                        ))}
                    </TextScallingFalse>
                  </View>
                </View>
              </View>

              {/* address and followings */}
              <View
                style={{
                  paddingHorizontal: 7,
                  gap: 3,
                  paddingTop: "3.5%",
                  position: "relative",
                  bottom: "-10%",
                }}
              >
                <View>
                  <TextScallingFalse
                    style={{
                      color: "grey",
                      fontSize: responsiveFontSize(1.35),
                      width: "63.25%",
                    }}
                  >
                    {`${user?.address?.city || "undefined"}, ${
                      user?.address?.state || "undefined"
                    }, ${user?.address?.country || "undefined"}`}
                  </TextScallingFalse>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      const serializedUser = encodeURIComponent(
                        JSON.stringify({ userId: user._id, type: user.type })
                      );
                      return router.push(
                        `/(app)/(main)/followers/${serializedUser}?pageType=followers`
                      );
                    }}
                  >
                    <TextScallingFalse
                      style={{
                        color: "#12956B",
                        fontSize: responsiveFontSize(1.64),
                      }}
                    >
                      {user?.followerCount} Followers
                    </TextScallingFalse>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      const serializedUser = encodeURIComponent(
                        JSON.stringify({ userId: user._id, type: user.type })
                      );
                      return router.push(
                        `/(app)/(main)/followers/${serializedUser}?pageType=followings`
                      );
                    }}
                  >
                    <TextScallingFalse
                      style={{
                        color: "#12956B",
                        fontSize: responsiveFontSize(1.64),
                      }}
                    >
                      {" "}
                      - {user?.followingCount} Following
                    </TextScallingFalse>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* edit profile and overview */}
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            flexDirection: "row",
            gap: 10,
            paddingTop: "2.5%",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            style={{
              width: "34.14%",
              borderRadius: 10,
              backgroundColor: "#12956B",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() =>
              router.push({
                pathname: "/(app)/(main)/edit-profile",
                params: {
                  firstName: user.firstName,
                  lastName: user.lastName,
                  username: user.username,
                  headline: user.headline,
                  dateOfBirth: user.dateOfBirth,
                  city: user.address.city,
                  state: user.address.state,
                  country: user.address.country,
                  latitude: user.address.location.coordinates[0],
                  longitude: user.address.location.coordinates[1],
                  height: user.height,
                  weight: user.weight,
                  coverPic: user.coverPic,
                  profilePic: user.profilePic,
                },
              })
            }
          >
            <TextScallingFalse
              style={{
                color: "white",
                fontSize: responsiveFontSize(1.7),
                fontWeight: "500",
              }}
            >
              Edit profile
            </TextScallingFalse>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            style={{
              width: "34.14%",
              borderRadius: 10,
              borderColor: "#12956B",
              borderWidth: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() =>
              router.push({ pathname: "/(app)/(main)/edit-overview" })
            }
          >
            <TextScallingFalse
              style={{
                color: "white",
                fontSize: responsiveFontSize(1.7),
                fontWeight: "400",
              }}
            >
              Edit Overview
            </TextScallingFalse>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            style={{
              width: responsiveWidth(7.92),
              height: responsiveHeight(3.82),
              borderRadius: 100,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#12956B",
            }}
            onPress={() => router.push({ pathname: "/(app)/(main)/settings" })}
          >
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={18}
              color="white"
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            borderBottomWidth: 0.3,
            borderBottomColor: "#505050",
            position: "relative",
            top: 45,
            width: "97%",
            alignSelf: "center",
          }}
        ></View>
        <Tabs activeTab={activeTab} handleTabPress={handleTabPress} />
        <Slot />
      </ScrollView>
    </PageThemeView>
  );
};

// Profile navigator tabs
const Tabs = ({
  activeTab,
  handleTabPress,
}: {
  activeTab: any;
  handleTabPress: any;
}) => {
  const tabs = [
    { name: "Overview", path: `/profile` },
    { name: "Activity", path: `/profile/activity` },
    { name: "Events", path: `/profile/events` },
    { name: "Teams", path: `/profile/teams` },
  ];

  return (
    <View className="flex-row justify-evenly mt-2 border-b-[0.5px] border-gray-600">
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          className={`py-2 px-5 ${
            activeTab === tab.name ? "border-b-[1.5px] border-[#12956B]" : ""
          }`}
          onPress={() => handleTabPress(tab.name, tab.path)}
        >
          <Text
            className={`text-[1.1rem] ${
              activeTab === tab.name ? "text-[#12956B]" : "text-white"
            }`}
          >
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const { width: screenWidth } = Dimensions.get("window"); // Get the screen width
const containerWidth = 340; // Original container width
const dotPercentageSize = 11 / containerWidth; // Dot size as a percentage of container width

const responsiveDotSize = screenWidth * dotPercentageSize;
// const Tab = createMaterialTopTabNavigator();

const { width: screenWidth2 } = Dimensions.get("window");
const scaleFactor = screenWidth2 / 410;

const styles = StyleSheet.create({
  ProfileKeyPoints: {
    color: "white",
    fontSize: responsiveFontSize(1.17),
    fontWeight: "semibold",
  },
});

export default ProfileLayout;
