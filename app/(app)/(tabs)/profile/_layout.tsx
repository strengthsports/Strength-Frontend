import React, { useCallback, useMemo, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  ScrollView,
  Text,
  Pressable,
  Modal,
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
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { dateFormatter } from "~/utils/dateFormatter";
import { MotiView } from "moti";
import Overview from ".";
import Activity from "./activity/_layout";
import Events from "./events";
import Teams from "./teams";
import PicModal from "~/components/profilePage/PicModal";
import nopic from "@/assets/images/nopic.jpg";
import nocoverpic from "@/assets/images/nocover.png";
import { AppDispatch } from "~/reduxStore";
import { removePic } from "~/reduxStore/slices/user/profileSlice";
import { PicModalType } from "~/types/others";

const ProfileLayout = () => {
  const { error, loading, user } = useSelector((state: any) => state?.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("Overview");
  const [isPicEditModalVisible, setPicEditModalVisible] =
    useState<PicModalType>({
      status: false,
      message: "",
    });

  // Define the available tabs.
  const tabs = useMemo(
    () => [
      { name: "Overview" },
      { name: "Activity" },
      { name: "Events" },
      { name: "Teams" },
    ],
    []
  );

  // Memoized function to render the current tab's content.
  const renderContent = useCallback(() => {
    switch (activeTab) {
      case "Overview":
        return <Overview />;
      case "Activity":
        return <Activity />;
      case "Events":
        return <Events />;
      case "Teams":
        return <Teams />;
      default:
        return <Overview />;
    }
  }, [activeTab]);

  // Handle remove cover/profile pic
  const handleRemovePic = async (picType: string) => {
    await dispatch(removePic(picType));
  };

  if (loading) {
    <View>
      <Text className="text-white">Loading...</Text>
    </View>;
  }
  if (error) {
    <View>
      <Text className="text-red-500">{error}</Text>
    </View>;
  }

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
          <TouchableOpacity
            className="w-full h-full"
            activeOpacity={0.9}
            onPress={() =>
              setPicEditModalVisible({ message: "coverPic", status: true })
            }
          >
            <Image
              source={user?.coverPic ? { uri: user?.coverPic } : nocoverpic}
              style={{ width: "100%", height: "100%" }}
            />
          </TouchableOpacity>
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
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  setPicEditModalVisible({
                    message: "profilePic",
                    status: true,
                  })
                }
              >
                <Image
                  source={user?.profilePic ? { uri: user?.profilePic } : nopic}
                  style={{
                    width: responsiveWidth(29.6),
                    height: responsiveHeight(14.4),
                    borderRadius: 100,
                  }}
                  className="lg:w-14 lg:h-14"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* user info */}
        <View className="w-full lg:w-[600px] mx-auto items-center pt-[2%]">
          <View
            style={{
              width: "95.12%",
              backgroundColor: "#171717",
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
        {/* Tabs Header */}
        <View className="flex-row justify-evenly my-2 border-b-[0.5px] border-gray-600">
          {tabs.map((tab) => {
            // Check if this tab is active.
            const isActive = activeTab === tab.name;
            return (
              <Pressable
                key={tab.name}
                className={`py-2 px-5 ${
                  isActive ? "border-b-2 border-[#12956B]" : ""
                }`}
                onPress={() => setActiveTab(tab.name)}
              >
                <Text
                  className={`text-[1.1rem] ${
                    isActive ? "text-[#12956B]" : "text-white"
                  }`}
                >
                  {tab.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Animated Tab Content */}
        <MotiView className="flex-1">{renderContent()}</MotiView>

        {/* Profile/Cover Pic modal */}
        <Modal
          visible={isPicEditModalVisible.status}
          animationType="slide"
          onRequestClose={() =>
            setPicEditModalVisible((prev) => ({ ...prev, status: false }))
          }
          transparent={true}
        >
          <TouchableOpacity
            className="flex-1 justify-center items-center bg-black"
            activeOpacity={1}
          >
            <View className="w-full h-full justify-between items-center mx-auto">
              {isPicEditModalVisible.message === "profilePic" ? (
                <PicModal
                  type={isPicEditModalVisible.message}
                  heading="Profile Picture"
                  imgUrl={user?.profilePic || null}
                  handleBack={() =>
                    setPicEditModalVisible({
                      message: "profilePic",
                      status: false,
                    })
                  }
                  handleRemovePic={() =>
                    handleRemovePic(isPicEditModalVisible.message)
                  }
                />
              ) : isPicEditModalVisible.message === "coverPic" ? (
                <PicModal
                  type={isPicEditModalVisible.message}
                  heading="Cover Picture"
                  imgUrl={user?.coverPic || null}
                  handleBack={() =>
                    setPicEditModalVisible({
                      message: "coverPic",
                      status: false,
                    })
                  }
                  handleRemovePic={() =>
                    handleRemovePic(isPicEditModalVisible.message)
                  }
                />
              ) : (
                <View></View>
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    </PageThemeView>
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
