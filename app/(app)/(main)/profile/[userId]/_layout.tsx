import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  ScrollView,
  Text,
  BackHandler,
  Modal,
  ActivityIndicator,
} from "react-native";
import PageThemeView from "~/components/PageThemeView";
import PostButton from "~/components/PostButton";
import flag from "@/assets/images/IN.png";
import TextScallingFalse from "@/components/CentralText";
import {
  MaterialCommunityIcons,
  Entypo,
  FontAwesome5,
  MaterialIcons,
  FontAwesome6,
} from "@expo/vector-icons";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { Slot, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserProfile,
  followUser,
  unFollowUser,
} from "~/reduxStore/slices/user/profileSlice";
import { AppDispatch } from "~/reduxStore";
import { dateFormatter } from "~/utils/dateFormatter";
import { useRouter } from "expo-router";

const ProfileLayout = () => {
  const params = useLocalSearchParams();
  const userId = useMemo(() => {
    return params.userId ? JSON.parse(decodeURIComponent(params.userId)) : null;
  }, [params.userId]);

  // console.log("userId:", userId);

  const dispatch = useDispatch<AppDispatch>();
  const { profiles, error, loading, user } = useSelector(
    (state: any) => state?.profile
  );
  const router = useRouter();

  console.log("User : ", user);
  console.log("Error : ", error);
  console.log("Loading : ", loading);

  const [activeTab, setActiveTab] = useState("Overview");
  const [currentFollowingStatus, setCurrentFollowingStatus] = useState(
    user?.followingStatus
  );
  const [isSettingsModalVisible, setSettingsModalVisible] = useState({
    status: false,
    message: "",
  });

  useEffect(() => {
    if (userId && (!profiles || !profiles[userId?.id])) {
      // Dispatch API call only if the profile is not cached
      console.log("First Dispatch start...");
      dispatch(
        getUserProfile({
          targetUserId: userId?.id,
          targetUserType: userId?.type,
        })
      );
    } else if (profiles && profiles[userId?.id]) {
      // If cached, set the user to the cached profile
      console.log("Second Dispatch...");
      dispatch({
        type: "profile/getUserProfile/fulfilled",
        payload: { user: profiles[userId?.id], fromCache: true },
      });
    }
  }, [dispatch, userId, profiles]);

  //close modal on back button press
  useEffect(() => {
    const handleBackPress = () => {
      if (isSettingsModalVisible.status) {
        setSettingsModalVisible((prev) => ({ ...prev, status: false }));
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => backHandler.remove(); // Cleanup the event listener
  }, [isSettingsModalVisible]);

  //set active tab
  const handleTabPress = (tabName, route) => {
    setActiveTab(tabName); // Set active tab state
    router.replace(route); // Navigate to the route
  };

  //handle follow
  const handleFollow = () => {
    if (userId) {
      dispatch(
        followUser({
          followingId: userId?.id,
          followingType: userId?.type,
        })
      )
        .unwrap()
        .catch((err) => console.error("Error following user:", err));
      setCurrentFollowingStatus((prev: boolean) => !prev);
    }
  };

  //handle unfollow
  const handleUnfollow = () => {
    setSettingsModalVisible((prev) => ({ ...prev, status: false }));
    if (userId) {
      dispatch(
        unFollowUser({
          followingId: userId?.id,
          followingType: userId?.type,
        })
      )
        .unwrap()
        .catch((err) => console.error("Error unfollowing user:", err));
      setCurrentFollowingStatus((prev: boolean) => !prev);
    }
  };

  //handle message
  const handleMessage = () => {
    if (!currentFollowingStatus) {
      setSettingsModalVisible({ status: true, message: "Message" });
    } else {
      router.push("/");
    }
  };

  //handle settings modal
  const handleOpenSettingsModal = (settingsType: string) => {
    console.log("Button clicked");

    setSettingsModalVisible({ status: true, message: settingsType });
  };

  return (
    <PageThemeView>
      {loading ? (
        <ActivityIndicator size="large" color="#12956B" style={styles.loader} />
      ) : (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* username */}
          <View
            style={{
              justifyContent: "space-between",
              paddingHorizontal: 13,
              flexDirection: "row",
              height: 45,
              alignItems: "center",
            }}
          >
            <TextScallingFalse style={{ color: "white", fontSize: 19 }}>
              @{user?.username}
            </TextScallingFalse>
            <View style={{ flexDirection: "row", gap: 10, marginTop: 2 }}>
              <View style={{ marginTop: 1.5 }}>
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
          <View style={{ alignItems: "flex-end", height: 135 * scaleFactor }}>
            <Image
              source={{ uri: user?.coverPic }}
              style={{ width: "100%", height: "100%" }}
            ></Image>
            <View
              style={{
                paddingHorizontal: "4.87%",
                position: "relative",
                top: "-45%",
                zIndex: 100,
              }}
            >
              <View
                style={{
                  width: responsiveWidth(31),
                  height: responsiveHeight(15),
                  backgroundColor: "black",
                  borderRadius: 100,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: user?.profilePic }}
                  style={{
                    width: responsiveWidth(29.6),
                    height: responsiveHeight(14.4),
                    borderRadius: 100,
                  }}
                ></Image>
              </View>
            </View>
          </View>

          {/* user info */}
          <View
            style={{ width: "100%", alignItems: "center", paddingTop: "2%" }}
          >
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
                        Age: {user?.age}
                        <TextScallingFalse style={{ color: "grey" }}>
                          ({dateFormatter(user?.dateOfBirth)})
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
                        Height: {user?.height}
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
                        Weight: {user?.weight}
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
                        <TextScallingFalse style={{ color: "grey" }}>
                          {" "}
                          Pro Trackers
                        </TextScallingFalse>
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
                      {`${user?.address.city}, ${user?.address.state}, ${user?.address.country}`}
                    </TextScallingFalse>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() =>
                        router.push(
                          `../followers/${params?.userId}?pageType=followers`
                        )
                      }
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
                      onPress={() =>
                        router.push(
                          `../followers/${params?.userId}?pageType=followings`
                        )
                      }
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
          {/* follow, message, three dots */}
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              flexDirection: "row",
              gap: 10,
              paddingTop: "2.5%",
            }}
          >
            {/* follow button */}
            {currentFollowingStatus ? (
              <TouchableOpacity
                activeOpacity={0.5}
                className="basis-1/3 rounded-[0.70rem] border border-[#12956B] justify-center items-center"
                onPress={() => handleOpenSettingsModal("Unfollow")}
              >
                <TextScallingFalse
                  style={{
                    color: "white",
                    fontSize: responsiveFontSize(1.7),
                    fontWeight: "500",
                  }}
                >
                  <Entypo
                    style={{ marginLeft: -4 * scaleFactor }}
                    name="check"
                    size={17.5 * scaleFactor}
                    color="white"
                  />
                  Following
                </TextScallingFalse>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.5}
                className="basis-1/3 rounded-[0.70rem] bg-[#12956B] justify-center items-center"
                onPress={handleFollow}
              >
                <TextScallingFalse
                  style={{
                    color: "white",
                    fontSize: responsiveFontSize(1.7),
                    fontWeight: "500",
                  }}
                >
                  Follow
                </TextScallingFalse>
              </TouchableOpacity>
            )}

            {/* message button */}
            <TouchableOpacity
              activeOpacity={0.5}
              className="basis-1/3 rounded-[0.70rem] border border-[#12956B] justify-center items-center"
              onPress={handleMessage}
            >
              <TextScallingFalse
                style={{
                  color: "white",
                  fontSize: responsiveFontSize(1.7),
                  fontWeight: "400",
                }}
              >
                Message
              </TextScallingFalse>
            </TouchableOpacity>

            {/* three dots settings */}
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
              onPress={() => handleOpenSettingsModal("")}
            >
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={18}
                color="white"
              />
            </TouchableOpacity>
          </View>
          {/* Tab buttons */}
          <Tabs
            activeTab={activeTab}
            handleTabPress={handleTabPress}
            params={params}
          />
          <Slot />
          {/* Settings modal */}
          <Modal
            visible={isSettingsModalVisible.status}
            animationType="slide"
            onRequestClose={() =>
              setSettingsModalVisible((prev) => ({ ...prev, status: false }))
            }
            transparent={true}
          >
            <TouchableOpacity
              className="flex-1 justify-end items-center bg-black/20"
              activeOpacity={1}
              onPress={() =>
                setSettingsModalVisible((prev) => ({ ...prev, status: false }))
              }
            >
              <View className="w-full bg-[#1D1D1D] rounded-tl-2xl rounded-tr-2xl mx-auto p-5 pt-7">
                {isSettingsModalVisible.message === "" ? (
                  <View>
                    {/* block */}
                    <View className="items-center flex-row">
                      <MaterialIcons
                        name="block"
                        size={20 * scaleFactor}
                        color="white"
                      />
                      <TextScallingFalse className="text-white font-semibold text-base">
                        Block this profile
                      </TextScallingFalse>
                    </View>
                    {/* report */}
                    <View className="items-center flex-row">
                      <MaterialIcons
                        name="report-problem"
                        size={20 * scaleFactor}
                        color="white"
                      />
                      <TextScallingFalse className="text-white font-semibold text-base">
                        Report this profile
                      </TextScallingFalse>
                    </View>
                    {/* follow/unfollow */}
                    {currentFollowingStatus ? (
                      <TouchableOpacity
                        className="flex-row items-center"
                        onPress={handleUnfollow}
                      >
                        <Entypo
                          name="cross"
                          size={28 * scaleFactor}
                          color="white"
                        />
                        <TextScallingFalse className="text-white font-semibold text-base">
                          Unfollow {user?.firstName}
                        </TextScallingFalse>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        className="flex-row items-center"
                        onPress={handleFollow}
                      >
                        <FontAwesome6
                          name="plus"
                          size={20 * scaleFactor}
                          color="white"
                        />
                        <TextScallingFalse className="text-white font-semibold text-base">
                          Follow {user?.firstName}
                        </TextScallingFalse>
                      </TouchableOpacity>
                    )}
                  </View>
                ) : isSettingsModalVisible.message === "Unfollow" ? (
                  <View>
                    <TextScallingFalse className="text-white text-xl font-semibold">
                      Unfollow {user?.firstName}
                    </TextScallingFalse>
                    <TextScallingFalse className="text-white mt-1 font-light text-sm">
                      Stop seeing posts from {user?.firstName} on your feed.{" "}
                      {user?.firstName} won't be notified that you've unfollowed
                    </TextScallingFalse>
                    <View className="items-center justify-evenly flex-row mt-5">
                      {/* cancel unfollow */}
                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="px-14 py-1.5 justify-center items-center border rounded-xl border-[#12956B]"
                        onPress={() =>
                          setSettingsModalVisible((prev) => ({
                            ...prev,
                            status: false,
                          }))
                        }
                      >
                        <TextScallingFalse className="text-[#12956B] text-[1rem] font-medium">
                          Cancel
                        </TextScallingFalse>
                      </TouchableOpacity>
                      {/* do unfollow */}
                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="px-14 py-1.5 justify-center items-center bg-[#12956B] border rounded-xl border-[#12956B]"
                        onPress={handleUnfollow}
                      >
                        <TextScallingFalse className="text-white text-[1rem] font-medium">
                          Unfollow
                        </TextScallingFalse>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View>
                    <TextScallingFalse className="text-white font-semibold text-xl">
                      Follow {user?.firstName} to Message
                    </TextScallingFalse>
                    <TextScallingFalse className="text-white font-normal mt-2">
                      Unlock Messaging Power: Follow Friends and Athletes for a
                      good Career Growth in your Choosen Sports game
                    </TextScallingFalse>
                    <TouchableOpacity
                      onPress={() =>
                        setSettingsModalVisible((prev) => ({
                          ...prev,
                          status: false,
                        }))
                      }
                      className="w-5/12 py-1.5 mt-4 rounded-lg border border-[#12956B] justify-center items-center"
                    >
                      <TextScallingFalse className="text-[#12956B] font-medium">
                        Close
                      </TextScallingFalse>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </Modal>
        </ScrollView>
      )}
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
  loader: {
    marginVertical: 20,
  },
});

// Tabs component
const Tabs = ({ activeTab, handleTabPress, params }) => {
  const tabs = [
    { name: "Overview", path: `/profile/${params}` },
    { name: "Activity", path: `/profile/${params}/activity` },
    { name: "Events", path: `/profile/${params}/events` },
    { name: "Teams", path: `/profile/${params}/teams` },
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

export { Tabs };

export default ProfileLayout;
