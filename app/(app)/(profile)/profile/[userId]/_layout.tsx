import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  ScrollView,
  BackHandler,
  Modal as RNModal,
  ActivityIndicator,
  Platform,
  Text,
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
import { useBlockUserMutation } from "~/reduxStore/api/profile/profileApi.block";
import { Divider } from "react-native-elements";
import { useReport } from "~/hooks/useReport";
import { FollowUser, ReportUser } from "~/types/user";
import { useFollow } from "~/hooks/useFollow";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import PicModal from "~/components/profilePage/PicModal";
import { PicModalType } from "~/types/others";
import Header from "~/components/profilePage/Header";
import { useBottomSheet } from "~/context/BottomSheetContext";
import ModalLayout1 from "~/components/modals/layout/ModalLayout1";
import { calculateAge } from "~/utils/calculateAge";
import TickIcon from "~/components/SvgIcons/Common_Icons/TickIcon";
import { RefreshControl } from "react-native";
import { getCountryFlag } from "~/utils/getCountryFlag";
import { Linking } from "react-native";

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

const shadowStyle = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  android: {
    elevation: 10,
    shadowColor: "#000",
  },
});

const countryAbbreviations = {
  "United Arab Emirates": "UAE",
  "United States of America": "USA",
  "United States": "USA",
  "United Kingdom": "UK",
  "Antigua and Barbuda": "ANT",
  "Bosnia and Herzegovina": "BIH",
  "British Virgin Islands": "BVI",
  "Cayman Islands": "CAY",
  "Central African Republic": "CAF",
  "Cook Islands": "COK",
  "Costa Rica": "CRI",
  "Czech Republic": "CZE",
  "Dominican Republic": "DOM",
  "El Salvador": "SLV",
  "Equatorial Guinea": "GNQ",
  "Falkland Islands": "FLK",
  "Faroe Islands": "FRO",
  "French Polynesia": "PYF",
  "Marshall Islands": "MHL",
  "New Caledonia": "NCL",
  "New Zealand": "NZL",
  "North Macedonia": "MKD",
  "Papua New Guinea": "PNG",
  "Puerto Rico": "PRI",
  "Saint Kitts and Nevis": "KNA",
  "Saint Lucia": "LCA",
  "Saint Vincent and the Grenadines": "VCT",
  "San Marino": "SMR",
  "Sao Tome and Principe": "STP",
  "Saudi Arabia": "SAU",
  "Sierra Leone": "SLE",
  "Solomon Islands": "SLB",
  "South Africa": "ZAF",
  "South Korea": "KOR",
  "Sri Lanka": "LKA",
  "Trinidad and Tobago": "TTO",
  "Turks and Caicos Islands": "TCA",
  "Vatican City": "VAT",
  "Democratic Republic of the Congo": "DRC",
  "Republic of the Congo": "COG",
  "United States Minor Outlying Islands": "UMI",
  "Northern Mariana Islands": "MNP",
  "Saint Helena, Ascension and Tristan da Cunha": "SHN",
  "Svalbard and Jan Mayen": "SJM",
  "Timor-Leste": "TLS",
  "Virgin Islands, British": "VGB",
  "Virgin Islands, U.S.": "VIR",
  "Wallis and Futuna": "WLF",
  "Western Sahara": "ESH",
  "Bouvet Island": "BVT",
  "Heard Island and McDonald Islands": "HMD",
  "British Indian Ocean Territory": "IOT",
  "Federated States of Micronesia": "FSM",
  "Saint Pierre and Miquelon": "SPM",
  "American Samoa": "ASM",
  "French Southern Territories": "ATF",
  "Isle of Man": "IMN",
  "Norfolk Island": "NFK",
  "Pitcairn Islands": "PCN",
  "South Georgia and the South Sandwich Islands": "SGS",
  "Lao People's Democratic Republic": "LAO",
  "Democratic People's Republic of Korea": "PRK",
  "Republic of Korea": "KOR",
  "Russian Federation": "RUS",
  "Syrian Arab Republic": "SYR",
  "United Republic of Tanzania": "TZA",
  "Bolivarian Republic of Venezuela": "VEN",
  Australia: "AUS",
  Afghanistan: "AFG",
  Argentina: "ARG",
  Bangladesh: "BGD",
  Cambodia: "KHM",
  Colombia: "COL",
  Ethiopia: "ETH",
  Indonesia: "IDN",
  Madagascar: "MDG",
  Mozambique: "MOZ",
  Philippines: "PHL",
  Switzerland: "CHE",
  Luxembourg: "LUX",
  Mauritania: "MRT",
  Mauritius: "MUS",
  Nicaragua: "NIC",
  Paraguay: "PRY",
  Singapore: "SGP",
  Slovakia: "SVK",
  Slovenia: "SVN",
  Tajikistan: "TJK",
  Turkmenistan: "TKM",
  Uzbekistan: "UZB",
  Uruguay: "URY",
  Netherlands: "NLD",
};

const getShortCountryName = (countryName, maxLength = 6) => {
  if (!countryName) {
    return "undefined";
  }
  if (countryAbbreviations[countryName]) {
    return countryAbbreviations[countryName];
  }
  if (countryName.length > maxLength) {
    return `${countryName.substring(0, maxLength)}...`;
  }
  return countryName;
};

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
  // RTK Querys
  const [getUserProfile, { data: profileData, isLoading, error }] =
    useLazyGetUserProfileQuery();
  const [blockUser] = useBlockUserMutation();

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
  const [followingStatus, setFollowingStatus] = useState<boolean>();
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [isReported, setIsReported] = useState<boolean>();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (userId?.id && userId?.type) {
        await getUserProfile({
          targetUserId: userId?.id,
          targetUserType: userId?.type,
        }).unwrap();
      }
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  }, [userId?.id, userId?.type]);

  // Fetch user profile when the component mounts
  useEffect(() => {
    if (userId) {
      console.log("User ID : ", userId?.id, " Type : ", userId?.type);

      if (userId?.id === undefined && userId?.type === undefined) {
        router.replace("/(app)/(profile)/profile/profile-not-found");
        return;
      }

      getUserProfile({
        targetUserId: userId?.id,
        targetUserType: userId?.type,
      });
    }
  }, [userId, getUserProfile]);

  useEffect(() => {
    if (profileData) {
      console.log("Profile data : ", profileData);
      setFollowingStatus(profileData.followingStatus);
      setFollowerCount(profileData.followerCount);
      setIsReported(profileData.reportingStatus);
    }
  }, [profileData]);

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
  const handlePress = async () => {
    if (profileData?.websiteLink) {
      const supported = await Linking.canOpenURL(profileData.websiteLink);
      if (supported) {
        await Linking.openURL(profileData.websiteLink);
      } else {
        console.log(
          `Don't know how to open this URL: ${profileData.websiteLink}`
        );
      }
    }
  };

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
  const heightValue = Platform.OS === "ios" ? "27%" : "22%";
  const { openBottomSheet } = useBottomSheet();

  // Define the content separately
  const messagingBottomSheetConfig = {
    isVisible: true,
    content: (
      <View style={{ paddingVertical: 15, paddingHorizontal: 20 }}>
        <TextScallingFalse
          style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
        >
          Messaging Coming Soon
        </TextScallingFalse>
        <TextScallingFalse
          style={{
            color: "gray",
            fontSize: 15,
            fontWeight: "400",
            paddingVertical: 10,
            lineHeight: 20,
          }}
        >
          We're currently working on bringing messaging to our platform. Stay
          tuned chatting with teammates and friends will be available in a
          future update!
        </TextScallingFalse>
      </View>
    ),
    height: heightValue,
    maxHeight: heightValue,
    bgcolor: "#151515",
    border: false,
    draggableDirection: "down",
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

  // better error handling
  if (error) {
    console.error("Profile fetch error:", error);

    let displayError = "Failed to load profile data.";

    // Check common RTK Query error structures
    if (typeof error === "object" && error !== null) {
      if ("data" in error && error.data) {
        if (typeof error.data === "string") {
          displayError = error.data;
        } else if (
          typeof error.data === "object" &&
          "message" in error.data &&
          typeof error.data.message === "string"
        ) {
          displayError = error.data.message; // Common pattern for API errors
        }
      } else if ("error" in error && typeof error.error === "string") {
        displayError = error.error; // Common pattern for fetch errors
      } else if ("message" in error && typeof error.message === "string") {
        displayError = error.message;
      }
      // Add more checks based on your specific API error structure if needed
    } else if (typeof error === "string") {
      displayError = error;
    }

    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <TextScallingFalse className="text-red-500 text-center">
          {displayError}
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#12956B"]}
              tintColor="#12956B"
              progressBackgroundColor="#000"
            />
          }
        >
          <View
            style={{
              backgroundColor: "black",
              zIndex: 999,
            }}
          >
            <Header
              username={profileData?.username}
              isBackButtonVisible={true}
            />
          </View>

          {/* profile pic and cover image */}
          <View style={{ alignItems: "flex-end", height: 137 * scaleFactor }}>
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
              {/* <View
                style={[
                  {
                    borderRadius: responsiveWidth(30) / 2,
                    overflow: "hidden",
                  },
                  shadowStyle,
                ]}
              > */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  setPicModalVisible({
                    message: "profilePic",
                    status: true,
                  })
                }
                disabled={!profileData?.profilePic}
                style={shadowStyle}
              >
                <Image
                  source={
                    profileData?.profilePic
                      ? { uri: profileData?.profilePic }
                      : nopic
                  }
                  style={{
                    width: responsiveWidth(30),
                    height: responsiveWidth(30),
                    borderRadius: responsiveWidth(30) / 2,
                    borderColor: "#1C1C1C",
                    borderWidth: 1.5,
                  }}
                  className="lg:w-14 lg:h-14"
                />
              </TouchableOpacity>
            </View>
            {/* </View> */}
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
                  gap: 4,
                }}
              >
                <View
                  style={{
                    width: "50%",
                    flexDirection: "row",
                    gap: 15,
                    // marginBottom: 5,
                  }}
                >
                  <TextScallingFalse
                    style={{
                      color: "white",
                      fontSize: responsiveFontSize(2.35),
                      fontWeight: "bold",
                    }}
                  >
                    {profileData?.firstName} {profileData?.lastName || ""}
                  </TextScallingFalse>

                  {!profileData?.blockingStatus && (
                    <View
                      style={{ marginTop: 5, marginRight: 5, height: "auto" }}
                    >
                      {profileData?.address?.country && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                            marginBottom: 5,
                          }}
                        >
                          <Image
                            source={{
                              uri:
                                getCountryFlag(profileData.address.country) ||
                                "",
                            }}
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: 5,
                              overflow: "hidden",
                            }}
                            defaultSource={require("@/assets/images/IN.png")}
                          />
                          <TextScallingFalse
                            style={{
                              // marginTop: 1,
                              color: "#EAEAEA",
                              fontSize: responsiveFontSize(1.41),
                              fontWeight: "300",
                            }}
                          >
                            {getShortCountryName(
                              profileData?.address?.country,
                              6
                            )}
                          </TextScallingFalse>
                        </View>
                      )}
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
                    {profileData?.type === "User" && (
                      <View style={{ position: "relative", left: -5 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: 5,
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
                              Age: {calculateAge(profileData?.dateOfBirth)}{" "}
                              <TextScallingFalse style={{ color: "grey" }}>
                                (
                                {dateFormatter(
                                  profileData?.dateOfBirth,
                                  "text"
                                )}
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
                              Height:{" "}
                              {profileData?.height || (
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
                              {profileData?.weight || (
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
                              {(() => {
                                const allTeams = [
                                  ...(profileData.createdTeams || []).map(
                                    (t: any) => t.team?.name
                                  ),
                                  ...(profileData.joinedTeams || []).map(
                                    (t: any) => t.team?.name
                                  ),
                                ].filter(Boolean);

                                const teamCount = allTeams.length;

                                if (teamCount === 0) return "Teams: No teams";

                                return (
                                  <>
                                    <TextScallingFalse
                                      style={{ color: "white" }}
                                    >
                                      {`${
                                        teamCount === 1 ? "Team" : "Teams"
                                      }: `}
                                      {allTeams[0]}
                                    </TextScallingFalse>
                                    <TextScallingFalse
                                      style={{ color: "grey" }}
                                    >
                                      {teamCount > 1
                                        ? ` +${teamCount - 1}`
                                        : ""}
                                    </TextScallingFalse>
                                  </>
                                );
                              })()}
                            </TextScallingFalse>
                          </View>
                        </View>
                      </View>
                    )}

                    {/* page type, established on, sports category for page profile */}
                    {profileData?.type === "Page" && (
                      <View style={{ position: "relative", left: -5 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            rowGap: 14,
                          }}
                        >
                          {/* page category/type */}
                          <View style={{ flexDirection: "row" }}>
                            <Entypo
                              name="dot-single"
                              size={responsiveDotSize}
                              color="white"
                            />
                            <TextScallingFalse style={styles.ProfileKeyPoints}>
                              {" "}
                              {profileData?.category}
                            </TextScallingFalse>
                          </View>
                          {/* sports category */}
                          <View style={{ flexDirection: "row" }}>
                            <Entypo
                              name="dot-single"
                              size={responsiveDotSize}
                              color="white"
                            />
                            <TextScallingFalse style={styles.ProfileKeyPoints}>
                              {" "}
                              Sports Category:{" "}
                              <TextScallingFalse style={{ color: "grey" }}>
                                {profileData?.favouriteSports.length > 0
                                  ? profileData?.favouriteSports?.map(
                                      (sport: any) => `${sport.sport.name} `
                                    )
                                  : "All"}
                              </TextScallingFalse>
                            </TextScallingFalse>
                          </View>
                          {/* established on */}
                          {profileData?.dateOfBirth && (
                            <View style={{ flexDirection: "row" }}>
                              <Entypo
                                name="dot-single"
                                size={responsiveDotSize}
                                color="white"
                              />
                              <TextScallingFalse
                                style={styles.ProfileKeyPoints}
                              >
                                {" "}
                                Established On:{" "}
                                <TextScallingFalse style={{ color: "grey" }}>
                                  Sept, 1997
                                </TextScallingFalse>
                              </TextScallingFalse>
                            </View>
                          )}
                          {/* website */}
                          {profileData?.websiteLink && (
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
                              <TextScallingFalse
                                style={styles.ProfileKeyPoints}
                              >
                                {" "}
                                Website:{" "}
                                <TextScallingFalse
                                  style={{
                                    color: "#E1E1E1",
                                    fontSize: responsiveFontSize(1.4),
                                  }}
                                >
                                  {profileData?.websiteLink}
                                  {"  "}
                                </TextScallingFalse>
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
                            width: "100%",
                          }}
                        >
                          {`${profileData?.address.city}, ${profileData?.address.state}, ${profileData?.address.country}`}
                        </TextScallingFalse>
                      </View>
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          activeOpacity={0.5}
                          onPress={() => {
                            const serializedUser = encodeURIComponent(
                              JSON.stringify({
                                userId: userId.id,
                                type: userId.type,
                              })
                            );
                            router.push(
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
                            {followerCount || profileData?.followerCount}{" "}
                            Followers
                          </TextScallingFalse>
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={0.5}
                          onPress={() => {
                            const serializedUser = encodeURIComponent(
                              JSON.stringify({
                                userId: userId.id,
                                type: userId.type,
                              })
                            );
                            router.push(
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
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 6,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TickIcon />
                      <TextScallingFalse
                        style={{
                          color: "white",
                          fontSize: responsiveFontSize(1.7),
                          fontWeight: "400",
                        }}
                      >
                        Following
                      </TextScallingFalse>
                    </View>
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
                  onPress={() => handleOpenSettingsModal("Message")}
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
      <ModalLayout1
        onClose={() =>
          setSettingsModalVisible((prev) => ({ ...prev, status: false }))
        }
        heightValue={4.2}
        visible={isSettingsModalVisible.status}
        bgcolor="#151515"
      >
        <View className="pt-6">
          {isSettingsModalVisible.message === "" ? (
            <View className="flex gap-y-4">
              {/* block */}
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={handleBlock}
                className="items-center flex-row gap-x-3"
              >
                <MaterialIcons
                  name="block"
                  size={22}
                  color="white"
                  className="basis-[6%]"
                />
                <TextScallingFalse className=" flex-1 text-white ml-4 text-4xl font-medium">
                  Block this profile
                </TextScallingFalse>
              </TouchableOpacity>
              {/* report */}
              <TouchableOpacity
                className="items-center flex-row gap-x-3"
                onPress={handleReport}
                disabled={isReported}
              >
                <MaterialIcons
                  name="report-problem"
                  size={22}
                  color={isReported ? "#808080" : "white"}
                  className="basis-[6%]"
                />
                <TextScallingFalse
                  className={`${
                    isReported ? "text-[#808080]" : "text-white"
                  } ml-4 text-4xl font-medium flex-1`}
                >
                  {isReported ? "Reported this profile" : "Report this profile"}
                </TextScallingFalse>
              </TouchableOpacity>
              {/* follow/unfollow */}
              {followingStatus ? (
                <TouchableOpacity
                  className="flex-row items-center gap-x-3"
                  onPress={handleUnfollow}
                >
                  <Entypo
                    name="cross"
                    size={22}
                    color="white"
                    className="basis-[6%]"
                  />
                  <TextScallingFalse className="text-white ml-4 text-4xl font-medium flex-1">
                    Unfollow {profileData?.firstName}
                  </TextScallingFalse>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  className="flex-row items-center gap-x-3"
                  onPress={handleFollow}
                >
                  <FontAwesome6
                    name="plus"
                    size={22}
                    color="white"
                    className="basis-[6%]"
                  />
                  <TextScallingFalse className="text-white ml-4 text-4xl font-medium flex-1">
                    Follow {profileData?.firstName}
                  </TextScallingFalse>
                </TouchableOpacity>
              )}
            </View>
          ) : isSettingsModalVisible.message === "Unfollow" ? (
            <View>
              <TextScallingFalse className="text-white text-4xl font-medium">
                Unfollow {profileData?.firstName || ""}
              </TextScallingFalse>
              <TextScallingFalse className="text-white mt-1 font-light text-lg">
                Stop seeing posts from {profileData?.firstName || ""} on your
                feed. {profileData?.firstName || ""} won't be notified that
                you've unfollowed
              </TextScallingFalse>
              <View className="items-center justify-start gap-5 flex-row mt-5">
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
            <View style={{ paddingHorizontal: 10 }}>
              <TextScallingFalse
                style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
              >
                Messaging Coming Soon
              </TextScallingFalse>
              <TextScallingFalse
                style={{
                  color: "gray",
                  fontSize: 15,
                  fontWeight: "400",
                  paddingVertical: 10,
                  lineHeight: 20,
                }}
              >
                We're currently working on bringing messaging to our platform.
                Stay tuned chatting with teammates and friends will be available
                in a future update!
              </TextScallingFalse>
            </View>
          )}
        </View>
      </ModalLayout1>

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
        <PageThemeView>
          <TouchableOpacity
            className="flex-1 justify-center items-center"
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
        </PageThemeView>
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
  dragHandle: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#555",
    borderRadius: 3,
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
    { name: "Media", path: `/profile/${params}/media` },
    { name: "Mentions", path: `/profile/${params}/tags` },
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
          <TextScallingFalse
            className={`text-[1.1rem] ${
              activeTab === tab.name ? "text-[#12956B]" : "text-white"
            }`}
          >
            {tab.name}
          </TextScallingFalse>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export { Tabs };

export default ProfileLayout;
