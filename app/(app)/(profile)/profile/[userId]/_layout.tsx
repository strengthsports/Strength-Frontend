import React, { createContext, useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  ScrollView,
  Text,
  BackHandler,
  Modal as RNModal,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import { Slot, useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import {
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
  FontAwesome6,
  Feather,
} from "@expo/vector-icons";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

// Components import
import PageThemeView from "~/components/PageThemeView";
import TextScallingFalse from "~/components/CentralText";

// Utilities import
import { dateFormatter } from "~/utils/dateFormatter";

// Redux imports
import { useLazyGetUserProfileQuery } from "~/reduxStore/api/profile/profileApi.profile";

// Assets import
import flag from "@/assets/images/IN.png";
import nocoverpic from "@/assets/images/nocover.png";
import nopic from "@/assets/images/nopic.jpg";
import {
  useBlockUserMutation,
  useUnblockUserMutation,
} from "~/reduxStore/api/profile/profileApi.block";
import { Divider } from "react-native-elements";
import { useReport } from "~/hooks/useReport";
import { FollowUser, ReportUser } from "~/types/user";
import { useFollow } from "~/hooks/useFollow";
import { pushFollowings } from "~/reduxStore/slices/user/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/reduxStore";
import PicModal from "~/components/profilePage/PicModal";
import { PicModalType } from "~/types/others";
import Header from "~/components/profilePage/Header";

// Define the context type
interface ProfileContextType {
  profileData: any;
  isLoading: boolean;
  error: any;
}

export const ProfileContext = createContext<ProfileContextType>({
  profileData: null,
  isLoading: false,
  error: null,
});

// Main function
const ProfileLayout = () => {
  const params = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const userId = useMemo(() => {
    return params.userId
      ? JSON.parse(decodeURIComponent(params.userId as string))
      : null;
  }, [params.userId]);
  // console.log(userId);
  const isFollowing = useSelector((state: RootState) =>
    state.profile.followings.includes(userId.id)
  );
  console.log("Id : ", userId, "Following : ", isFollowing);
  // RTK Querys
  const [getUserProfile, { data: profileData, isLoading, error }] =
    useLazyGetUserProfileQuery();
  const [blockUser] = useBlockUserMutation();
  const [unblockUser] = useUnblockUserMutation();

  // Custom hooks
  const { reportUser, undoReportUser } = useReport();
  const { followUser, unFollowUser } = useFollow();

  const [activeTab, setActiveTab] = useState("Overview");
  const [isSettingsModalVisible, setSettingsModalVisible] = useState({
    status: false,
    message: "",
  });
  const [isPicModalVisible, setPicModalVisible] = useState<PicModalType>({
    status: false,
    message: "",
  });
  const [followingStatus, setFollowingStatus] = useState<boolean>(
    isFollowing as boolean
  );
  const [followerCount, setFollowerCount] = useState<number>(
    profileData?.followerCount
  );
  const [isReported, setIsReported] = useState<boolean>(
    profileData?.reportingStatus
  );

  // Fetch user profile when the component mounts
  useEffect(() => {
    if (userId) {
      getUserProfile({
        targetUserId: userId?.id,
        targetUserType: userId?.type,
      });
    }
  }, [userId, getUserProfile]);

  useEffect(() => {
    if (profileData) {
      console.log(profileData.followingStatus);
      profileData?.followingStatus &&
        !isFollowing &&
        dispatch(pushFollowings(userId.id));
    }
  }, [profileData, dispatch]);

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
  const handleTabPress = useMemo(
    () => (tabName: string, route: any) => {
      setActiveTab(tabName);
      router.replace(route);
    },
    []
  );

  //handle follow
  const handleFollow = async () => {
    try {
      setFollowingStatus(true);
      setFollowerCount((prev) => prev + 1);
      const followData: FollowUser = {
        followingId: profileData._id,
        followingType: profileData.type,
      };

      await followUser(followData);
    } catch (err) {
      setFollowingStatus(false);
      setFollowerCount((prev) => prev - 1);
      console.error("Follow error:", err);
    }
  };

  //handle unfollow
  const handleUnfollow = async () => {
    setSettingsModalVisible((prev) => ({ ...prev, status: false }));
    try {
      setFollowingStatus(false);
      setFollowerCount((prev) => prev - 1);
      const unfollowData: FollowUser = {
        followingId: profileData._id,
        followingType: profileData.type,
      };

      await unFollowUser(unfollowData);
    } catch (err) {
      setFollowingStatus(true);
      setFollowerCount((prev) => prev + 1);
      console.error("Unfollow error:", err);
    }
  };

  //handle message
  const handleMessage = () => {
    if (!profileData?.followingStatus) {
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

  //handle block
  const handleBlock = async () => {
    if (userId) {
      try {
        // Perform the block action via mutation
        await blockUser({
          blockingId: userId?.id,
          blockingType: userId?.type,
        }).unwrap();
        setSettingsModalVisible({ status: false, message: "SettingsClose" });
        console.log("Blocked Successfully!");
      } catch (err) {
        console.error("Blocking error:", err);
      }
    }
  };

  //handle unblock
  const handleUnblock = async () => {
    if (userId) {
      try {
        // Perform the block action via mutation
        await unblockUser({
          blockedId: userId?.id,
          blockedType: userId?.type,
        }).unwrap();
        console.log("Unblocked Successfully!");
      } catch (err) {
        console.error("Unblocking error:", err);
      }
    }
  };

  //handle report
  const handleReport = async () => {
    setIsReported((prev) => !prev);
    const reportData: ReportUser = {
      targetId: profileData._id,
      targetType: profileData.type,
      reason: "Fake account",
    };

    await reportUser(reportData);
  };

  //handle undo report
  const handleUndoReport = async () => {
    setIsReported((prev) => !prev);
    const payload = { targetId: profileData._id, targetType: profileData.type };
    await undoReportUser(payload);
  };

  // Error component
  if (error) {
    return (
      <View>
        <TextScallingFalse className="text-red-500">
          {error as string}
        </TextScallingFalse>
      </View>
    );
  }

  return (
    <PageThemeView>
      {isLoading ? (
        <ActivityIndicator size="large" color="#12956B" style={styles.loader} />
      ) : (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
        >
          <View style={{
            backgroundColor: "black",
            zIndex: 999,
          }}>
            <Header username={profileData?.username} isBackButtonVisible={true} />
          </View>

          {/* profile pic and cover image */}
          <View style={{ alignItems: "flex-end", height: 135 * scaleFactor }}>
            <TouchableOpacity
              className="w-full h-full"
              activeOpacity={0.9}
              onPress={() =>
                setPicModalVisible({ message: "coverPic", status: true })
              }
              disabled={!profileData?.coverPic}
            >
              <Image
                source={
                  profileData?.coverPic
                    ? { uri: profileData?.coverPic }
                    : nocoverpic
                }
                style={{ width: "100%", height: "100%" }}
              />
            </TouchableOpacity>
            <View
              style={{
                paddingHorizontal: "4.87%",
                position: "relative",
                top: "-45%",
                zIndex: 1,
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
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() =>
                    setPicModalVisible({
                      message: "profilePic",
                      status: true,
                    })
                  }
                  disabled={!profileData?.profilePic}
                >
                  <Image
                    source={
                      profileData?.profilePic
                        ? { uri: profileData?.profilePic }
                        : nopic
                    }
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
          <View
            style={{
              width: "100%",
              alignItems: "center",
              paddingTop: "2%",
            }}
            className="lg:w-[600px] mx-auto"
          >
            <View
              style={{
                width: "95.12%",
                backgroundColor: "#181818",
                borderRadius: 33,
                padding: 25,
              }}
            >
              {/* first name, last name, country */}
              <View
                style={{
                  position: "relative",
                  top: -9,
                  flexDirection: "row",
                  gap:4,
                }}
              >
                <View style={{ width:"50%", flexDirection:"row", gap:15, }}>
                  <TextScallingFalse
                    style={{
                      color: "white",
                      fontSize: responsiveFontSize(2.35),
                      fontWeight: "bold",
                    }}
                  >
                    {profileData?.firstName} {profileData?.lastName}
                  </TextScallingFalse>

                  {!profileData?.blockingStatus && (
                    <View style={{marginTop:6, marginRight:5, height:"auto",}}>
                      <View style={{ flexDirection: "row", gap: 3, }}>
                        <Image
                          source={flag}
                          style={{ width: 18, height: 18, borderRadius:5, marginBottom:5}}
                        />
                        <TextScallingFalse
                          style={{
                            marginTop:2,
                            color: "#EAEAEA",
                            fontSize: responsiveFontSize(1.41),
                            fontWeight: "400",
                          }}
                        >
                          {profileData?.address?.country || "undefined"}
                        </TextScallingFalse>
                      </View>
                    </View>
                  )}
                </View>
              </View>

              {!profileData?.blockingStatus && (
                <>
                  {/* headline */}
                  <View
                    style={{ width: "67.64%", position: "relative", top: -12 }}
                  >
                    <TextScallingFalse
                      style={{
                        color: "#EAEAEA",
                        fontSize: responsiveFontSize(1.5),
                        fontWeight: "400",
                      }}
                    >
                      {profileData?.headline}
                    </TextScallingFalse>
                  </View>

                  <View style={{ paddingTop: 5 }}>
                    {/* age, height, weight, teams */}
                    <View style={{ position: "relative", left: -5 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          gap:5
                        }}
                      >
                        <View style={{ flexDirection: "row" }}>
                          <Entypo
                            name="dot-single"
                            size={responsiveDotSize}
                            color="white"
                          />
                          <TextScallingFalse style={styles.ProfileKeyPoints}>
                            {" "}
                            Age: {profileData?.age}
                            <TextScallingFalse style={{ color: "grey" }}>
                              ({dateFormatter(profileData?.dateOfBirth, "text")}
                              )
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
                            Height: {profileData?.height}
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
                            Weight: {profileData?.weight}
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
                            fontSize: responsiveFontSize(1.4),
                            width: "63.25%",
                          }}
                        >
                          {`${profileData?.address.city}, ${profileData?.address.state}, ${profileData?.address.country}`}
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
                              fontSize: responsiveFontSize(1.6),
                            }}
                          >
                            {followerCount || profileData?.followerCount}{" "}
                            Followers
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
                              fontSize: responsiveFontSize(1.6),
                            }}
                          >
                            {" "}
                            - {profileData?.followingCount} Following
                          </TextScallingFalse>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* follow, message, three dots */}
          {!profileData?.blockingStatus && (
            <>
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
                {followingStatus ? (
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
                params={params.userId}
              />
              <ProfileContext.Provider
                value={{ profileData, isLoading, error }}
              >
                <Slot />
              </ProfileContext.Provider>
            </>
          )}

          {/* Blocked message */}
          {profileData?.blockingStatus && (
            <View className="w-full flex-row justify-center items-center mt-10">
              <TextScallingFalse className="text-[#808080] text-5xl font-bold">
                You have blocked this user
              </TextScallingFalse>
            </View>
          )}
        </ScrollView>
      )}

      {/* Settings modal */}
      <RNModal
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
          <View
            className="w-full mx-auto bg-[#1D1D1D] rounded-t-3xl p-5 pt-3 border-t-[0.5px] border-x-[0.5px] border-neutral-700"
            onStartShouldSetResponder={() => true}
          >
            <Divider
              className="w-16 self-center rounded-full bg-neutral-700 mb-8"
              width={4}
            />
            {isSettingsModalVisible.message === "" ? (
              <View className="flex gap-y-4">
                {/* block */}
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={handleBlock}
                  className="items-center flex-row gap-x-3"
                >
                  <MaterialIcons name="block" size={22} color="white" />
                  <TextScallingFalse className="text-white font-normal text-3xl">
                    Block this profile
                  </TextScallingFalse>
                </TouchableOpacity>
                {/* report */}
                <TouchableOpacity
                  className="items-center flex-row gap-x-3"
                  onPress={handleReport}
                  disabled={isReported || profileData?.reportingStatus}
                >
                  <MaterialIcons
                    name="report-problem"
                    size={22}
                    color={
                      isReported || profileData?.reportingStatus
                        ? "#808080"
                        : "white"
                    }
                  />
                  <TextScallingFalse
                    className={`${
                      isReported || profileData?.reportingStatus
                        ? "text-[#808080]"
                        : "text-white"
                    } font-normal text-3xl`}
                  >
                    {isReported || profileData?.reportingStatus
                      ? "Reported this profile"
                      : "Report this profile"}
                  </TextScallingFalse>
                </TouchableOpacity>
                {/* follow/unfollow */}
                {followingStatus ? (
                  <TouchableOpacity
                    className="flex-row items-center gap-x-3"
                    onPress={handleUnfollow}
                  >
                    <Entypo name="cross" size={22} color="white" />
                    <TextScallingFalse className="text-white font-normal text-3xl">
                      Unfollow {profileData?.firstName}
                    </TextScallingFalse>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    className="flex-row items-center gap-x-3"
                    onPress={handleFollow}
                  >
                    <FontAwesome6 name="plus" size={22} color="white" />
                    <TextScallingFalse className="text-white font-normal text-3xl">
                      Follow {profileData?.firstName}
                    </TextScallingFalse>
                  </TouchableOpacity>
                )}
              </View>
            ) : isSettingsModalVisible.message === "Unfollow" ? (
              <View>
                <TextScallingFalse className="text-white text-xl font-semibold">
                  Unfollow {profileData?.firstName || ''}
                </TextScallingFalse>
                <TextScallingFalse className="text-white mt-1 font-light text-sm">
                  Stop seeing posts from {profileData?.firstName || ''} on your feed.{" "}
                  {profileData?.firstName || ''} won't be notified that you've
                  unfollowed
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
                  Follow {profileData?.firstName} to Message
                </TextScallingFalse>
                <TextScallingFalse className="text-white font-normal mt-2">
                  Unlock Messaging Power: Follow Friends and Athletes for a good
                  Career Growth in your Choosen Sports game
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
      </RNModal>

      {/* Profile/Cover Pic modal */}
      <Modal
        isVisible={isPicModalVisible.status}
        onBackButtonPress={() =>
          setPicModalVisible((prev) => ({ ...prev, status: false }))
        }
        coverScreen={true}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        style={{ margin: 0, padding: 0 }}
      >
        <TouchableOpacity
          className="flex-1 justify-center items-center bg-black"
          activeOpacity={1}
        >
          <View className="w-full h-full justify-start items-center mx-auto">
            {isPicModalVisible.message === "profilePic" ? (
              <PicModal
                type={isPicModalVisible.message}
                heading=""
                imgUrl={profileData?.profilePic || null}
                handleBack={() =>
                  setPicModalVisible({
                    message: "profilePic",
                    status: false,
                  })
                }
                profileType="other"
              />
            ) : isPicModalVisible.message === "coverPic" ? (
              <PicModal
                type={isPicModalVisible.message}
                heading=""
                imgUrl={profileData?.coverPic || null}
                handleBack={() =>
                  setPicModalVisible({
                    message: "coverPic",
                    status: false,
                  })
                }
                profileType="other"
              />
            ) : (
              <View></View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
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
    color: "#E1E1E1",
    fontSize: responsiveFontSize(1.4),
    fontWeight: "semibold",
  },
  loader: {
    marginVertical: 20,
  },
});

// Tabs component
const Tabs = ({
  activeTab,
  handleTabPress,
  params,
}: {
  activeTab: any;
  handleTabPress: any;
  params: any;
}) => {
  const tabs = [
    { name: "Overview", path: `/profile/${params}` },
    { name: "Activity", path: `/profile/${params}/activity` },
    { name: "Tags", path: `/profile/${params}/tags` },
    { name: "Media", path: `/profile/${params}/media` },
  ];

  return (
    <View className="flex-row justify-evenly mt-2 border-b-[1px] border-[#4E4E4E]">
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
