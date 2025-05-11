"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
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
  SafeAreaView,
  RefreshControl,
  Linking,
  InteractionManager,
} from "react-native";
import PageThemeView from "~/components/PageThemeView";
import flag from "@/assets/images/IN.png";
import TextScallingFalse from "@/components/CentralText";
import {
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { useRouter, Slot, useSegments } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { dateFormatter } from "~/utils/dateFormatter";
import PicModal from "~/components/profilePage/PicModal";
import nopic from "@/assets/images/nopic.jpg";
import nocoverpic from "@/assets/images/nocover.png";
import { AppDispatch } from "~/reduxStore";
import {
  fetchMyProfile,
  removePic,
} from "~/reduxStore/slices/user/profileSlice";
import { PicModalType } from "~/types/others";
import Header from "~/components/profilePage/Header";
import { setAddPostContainerOpen } from "~/reduxStore/slices/post/postSlice";
import { useBottomSheet } from "~/context/BottomSheetContext";
import { RootState } from "~/reduxStore";
import { Platform } from "react-native";
import { Share } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

const ProfileOptionsBottomSheet = ({
  onClose,
  onNavigate,
  onShare,
}: {
  onClose: () => void;
  onNavigate: (path: string) => void;
  onShare: () => void;
}) => {
  return (
    <View style={styles.bottomSheetContainer}>
      <TouchableOpacity
        onPress={() => {
          onNavigate("/(app)/(settings)/settings");
          onClose();
        }}
        style={styles.bottomSheetOption}
        activeOpacity={0.7}
      >
        <MaterialIcons name="settings" size={24} color="white" />
        <TextScallingFalse style={styles.bottomSheetText}>
          Settings
        </TextScallingFalse>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          onShare();
          onClose();
        }}
        style={styles.bottomSheetOption}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="share" size={24} color="white" />
        <TextScallingFalse style={styles.bottomSheetText}>
          Share Profile
        </TextScallingFalse>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          // TODO: to be replaced with the actual path
          onNavigate("/(app)/(profile)/manage-teams");
          onClose();
        }}
        style={styles.bottomSheetOption}
        activeOpacity={0.7}
      >
        <MaterialIcons name="group" size={24} color="white" />
        <TextScallingFalse style={styles.bottomSheetText}>
          Manage Teams
        </TextScallingFalse>
      </TouchableOpacity>
    </View>
  );
};

const ProfileLayout = () => {
  const { error, loading, user } = useSelector((state: any) => state?.profile);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const segments = useSegments();
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();

  const currentProfileSegment = useMemo(() => {
    const profileIndex = segments.findIndex((s) => s === "profile");
    if (profileIndex !== -1 && segments.length > profileIndex + 1) {
      return segments[profileIndex + 1];
    }
    return "index";
  }, [segments]);

  const [isPicEditModalVisible, setPicEditModalVisible] =
    useState<PicModalType>({ status: false, message: "" });
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (user?._id && user?.type) {
      await dispatch(
        fetchMyProfile({ targetUserId: user._id, targetUserType: user.type })
      );
    }
    setRefreshing(false);
  }, [dispatch, user?._id, user?.type]);

  const tabs = useMemo(
    () => [
      { name: "Overview", segment: "index" },
      { name: "Activity", segment: "activity" },
      { name: "Tags", segment: "tags" },
      { name: "Media", segment: "media" },
    ],
    []
  );

  const handleTabPress = useCallback(
    (segment: string) => {
      const path = segment === "index" ? `/profile` : `/profile/${segment}`;
      router.replace(path as any);
    },
    [router]
  );

  const handleShareProfile = async () => {
    try {
      // TODO: need modification of the profile url
      const profileUrl = `strength://profile/${user?._id}`;
      const result = await Share.share({
        message: `Check out ${user?.firstName || "this"
          } profile on Strength! ${profileUrl}`,
        url: Platform.OS === "ios" ? profileUrl : undefined,
        title: "Share Profile",
      });
    } catch (error: any) {
      console.error("Error sharing profile:", error.message);
    }
  };

  const handleOpenProfileOptions = () => {
    openBottomSheet({
      isVisible: true,
      content: (
        <ProfileOptionsBottomSheet
          onClose={closeBottomSheet}
          onNavigate={(path) => router.push(path as any)}
          onShare={handleShareProfile}
        />
      ),
      height: "28%",
      bgcolor: "#151515",
      border: false,
      maxHeight: 250,
      draggableDirection: "down",
    });
  };

  const handleRemovePic = async (picType: string) => {
    await dispatch(removePic(picType));
  };

  const handleOpenPostContainer = () => {
    dispatch(setAddPostContainerOpen(true));
  };
  // console.log(user);
  const handlePress = async () => {
    if (user?.websiteLink) {
      const supported = await Linking.canOpenURL(user.websiteLink);
      if (supported) {
        await Linking.openURL(user.websiteLink);
      } else {
        console.log(`Don't know how to open this URL: ${user.websiteLink}`);
      }
    }
  };

  const getDisplaySportNames = (
    favouriteSports: Array<{ sport: { _id: string; name: string } }>
  ) => {
    if (!favouriteSports || favouriteSports.length === 0) {
      return "No sports added";
    }
    const sportNames = favouriteSports
      .map((item) => item.sport?.name)
      .filter(Boolean);

    if (sportNames.length === 0) {
      return "No sports added";
    }

    const firstSportName = sportNames[0];
    const remainingCount = sportNames.length - 1;

    if (remainingCount > 0) {
      return `${firstSportName} +${remainingCount}`;
    } else {
      return firstSportName;
    }
  };

  return (
    <PageThemeView>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[4]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View>
          <Header
            username={user?.username}
            isBackButtonVisible={false}
            handlePostContainerOpen={handleOpenPostContainer}
          />
        </View>
        <View
          className="w-full lg:w-[600px] mx-auto lg:max-h-[200px] bg-yellow-300 relative"
          style={{ alignItems: "flex-end", height: 137 * scaleFactor }}
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
          <View
            className="absolute h-full flex items-center justify-center top-[50%] right-[5%] lg:w-[33%]"
            style={{ zIndex: 1 }}
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

        <View className="w-full lg:w-[600px] mx-auto items-center pt-[2%]">
          <View
            style={{
              width: "95.12%",
              backgroundColor: "#181818",
              borderRadius: 33,
              padding: 25,
            }}
          >
            <View
              style={{
                position: "relative",
                top: -9,
                flexDirection: "row",
                gap: 4,
              }}
            >
              <View style={{ width: "50%", flexDirection: "row", gap: 15 }}>
                <TextScallingFalse
                  style={{
                    color: "white",
                    fontSize: responsiveFontSize(2.35),
                    fontWeight: "bold",
                  }}
                >
                  {user?.firstName} {user?.lastName}
                </TextScallingFalse>

                <View style={{ marginTop: 6, marginRight: 5, height: "auto" }}>
                  <View style={{ flexDirection: "row", gap: 3 }}>
                    <Image
                      source={flag}
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 5,
                        marginBottom: 5,
                      }}
                    />
                    <TextScallingFalse
                      style={{
                        marginTop: 2,
                        color: "#EAEAEA",
                        fontSize: responsiveFontSize(1.41),
                        fontWeight: "400",
                      }}
                    >
                      {user?.address?.country || "undefined"}
                    </TextScallingFalse>
                  </View>
                </View>
              </View>
            </View>

            <View style={{ width: "67.64%", position: "relative", top: -12 }}>
              <TextScallingFalse
                style={{
                  color: "#EAEAEA",
                  fontSize: responsiveFontSize(1.5),
                  fontWeight: "400",
                }}
              >
                {user?.headline}
              </TextScallingFalse>
            </View>

            <View style={{ paddingTop: 5 }}>
              {/* age, height, weight, teams for user profile */}
              {user?.type === "User" && (
                <View style={{ position: "relative", left: -5 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
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
                          <TextScallingFalse style={{ color: "grey" }}>
                            undefined
                          </TextScallingFalse>
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
                          <TextScallingFalse style={{ color: "grey" }}>
                            undefined
                          </TextScallingFalse>
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
                            <TextScallingFalse
                              key={team?.team?._id}
                              style={{ color: "grey" }}
                            >
                              {" "}
                              {team.name}
                            </TextScallingFalse>
                          ))}
                      </TextScallingFalse>
                    </View>
                  </View>
                </View>
              )}

              {/* page type, established on, sports category for page profile */}
              {user?.type === "Page" && (
                <View style={{ position: "relative", left: -5 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      rowGap: 14,
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
                        {user?.category}
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
                        Sports:{" "}
                        <TextScallingFalse style={{ color: "grey" }}>
                          {getDisplaySportNames(user?.favouriteSports)}
                        </TextScallingFalse>
                      </TextScallingFalse>
                    </View>
                    {user?.dateOfBirth && (
                      <View style={{ flexDirection: "row" }}>
                        <Entypo
                          name="dot-single"
                          size={responsiveDotSize}
                          color="white"
                        />
                        <TextScallingFalse style={styles.ProfileKeyPoints}>
                          {" "}
                          Est.:{" "}
                          <TextScallingFalse style={{ color: "grey" }}>
                            {dateFormatter(user?.dateOfBirth, "text")}
                          </TextScallingFalse>
                        </TextScallingFalse>
                      </View>
                    )}
                    {user?.websiteLink && (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Entypo
                          name="dot-single"
                          size={responsiveDotSize}
                          color="white"
                        />
                        <TextScallingFalse style={styles.ProfileKeyPoints}>
                          {" "}
                          Website:{" "}
                          <Text
                            style={{
                              color: "#E1E1E1",
                              fontSize: responsiveFontSize(1.4),
                            }}
                          >
                            {user?.websiteLink}
                            {"  "}
                          </Text>
                          <TouchableOpacity
                            className="mt-[5px]"
                            onPress={handlePress}
                            activeOpacity={0.7}
                          >
                            <FontAwesome6
                              name="arrow-up-right-from-square"
                              size={10}
                              color="#E1E1E1"
                            />
                          </TouchableOpacity>
                        </TextScallingFalse>
                      </View>
                    )}
                  </View>
                </View>
              )}

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
                      width: "100%",
                    }}
                  >
                    {`${user?.address?.city || "undefined"}, ${user?.address?.state || "undefined"
                      }, ${user?.address?.country || "undefined"}`}
                  </TextScallingFalse>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      const serializedUser = encodeURIComponent(
                        JSON.stringify({ userId: user?._id, type: user?.type })
                      );
                      return router.push(
                        `/(app)/(profile)/followers/${serializedUser}?pageType=followers`
                      );
                    }}
                  >
                    <TextScallingFalse
                      style={{
                        color: "#12956B",
                        fontSize: responsiveFontSize(1.6),
                      }}
                    >
                      {user?.followerCount} Followers
                    </TextScallingFalse>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      const serializedUser = encodeURIComponent(
                        JSON.stringify({ userId: user?._id, type: user?.type })
                      );
                      return router.push(
                        `/(app)/(profile)/followers/${serializedUser}?pageType=followings`
                      );
                    }}
                  >
                    <TextScallingFalse
                      style={{
                        color: "#12956B",
                        fontSize: responsiveFontSize(1.6),
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

        <View
          style={{
            width: "100%",
            justifyContent: "center",
            flexDirection: "row",
            gap: 10,
            paddingTop: "2.5%",
            // paddingBottom: 15,
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
              paddingVertical: 8,
            }}
            onPress={() =>
              router.push({
                pathname: "/(app)/(profile)/edit-profile",
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
              router.push({ pathname: "/(app)/(profile)/edit-overview" })
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

          {/* three dots */}
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
            onPress={handleOpenProfileOptions}
          >
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={18}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {/* Removed Spacer View */}
        {/* <View style={{ position: "relative", top: 45, width: "97%", alignSelf: "center" }}></View> */}

        <View
          className="flex-row justify-evenly mt-2 border-b-[1px] border-[#4E4E4E] bg-black"
          style={{ position: "absolute", zIndex: 50, backgroundColor: "black" }}
        >
          {tabs.map((tab) => {
            const isActive = currentProfileSegment === tab.segment;
            return (
              <Pressable
                key={tab.name}
                className={`py-2 px-5 ${isActive ? "border-b-2 border-[#12956B]" : ""
                  }`}
                onPress={() => handleTabPress(tab.segment)}
              >
                <TextScallingFalse
                  className={`text-[1.1rem] ${isActive ? "text-[#12956B]" : "text-[#EEEEEE]"
                    }`}
                >
                  {tab.name}
                </TextScallingFalse>
              </Pressable>
            );
          })}
        </View>

        <View className="flex-1 mt-2">
          <Slot />
        </View>

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
            <SafeAreaView className="w-full h-full justify-between items-center mx-auto">
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
            </SafeAreaView>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    </PageThemeView>
  );
};

const { width: screenWidth } = Dimensions.get("window");
const containerWidth = 340;
const dotPercentageSize = 11 / containerWidth;
const responsiveDotSize = screenWidth * dotPercentageSize;
const { width: screenWidth2 } = Dimensions.get("window");
const scaleFactor = screenWidth2 / 410;

const styles = StyleSheet.create({
  ProfileKeyPoints: {
    color: "#E1E1E1",
    fontSize: responsiveFontSize(1.4),
    fontWeight: "semibold",
    alignItems: "center",
    display: "flex",
  },
  bottomSheetContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    gap: 15,
  },
  bottomSheetText: {
    color: "white",
    fontSize: responsiveFontSize(1.9),
    fontWeight: "500",
  },
});

export default ProfileLayout;
