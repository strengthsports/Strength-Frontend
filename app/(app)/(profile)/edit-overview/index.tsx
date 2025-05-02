import {
  AntDesign,
  Feather,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import RightArrow from "~/components/Arrows/RightArrow";
import TextScallingFalse from "~/components/CentralText";
import PageThemeView from "~/components/PageThemeView";
import TopBar from "~/components/TopBar";
import { AppDispatch, RootState } from "~/reduxStore";
import { useGetSportsQuery } from "~/reduxStore/api/sportsApi";
import {
  editUserSportsOverview,
  fetchMyProfile,
  editUserAbout,
} from "~/reduxStore/slices/user/profileSlice";
import { Member } from "~/types/user";
import AlertModal from "~/components/modals/AlertModal";
import KeyDetailsMenu from "~/components/modals/KeyDetailsMenu";
import DownArrow from "~/components/SvgIcons/Edit-Overview/DownArrow";
import isEqual from "lodash.isequal";
import BackIcon from "~/components/SvgIcons/Common_Icons/BackIcon";
import { useDispatch, useSelector } from "react-redux";

interface SelectedSport {
  sportsId: string;
  sportsName: string;
  keyDetails: { [key: string]: any };
  logo: string;
  [key: string]: any;
}

// ✅ Define the type above your component
type AlertConfigType = {
  title: string;
  message: string;
  discardAction: () => void;
  confirmMessage: string;
  cancelMessage: string;
  onSkip?: () => void;
};

function EditOverview() {
  const { loading, error, user, isUserInfoModalOpen } = useSelector(
    (state: RootState) => state?.profile
  );
  // Get associates list length
  const associatesLength = useSelector(
    (state: RootState) => state.profile.user?.associates?.length
  );
  // const { isError, isLoading, data: sports } = useGetSportsQuery(null);
  const { isError, isLoading, data: sports } = useGetSportsQuery(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const query = useLocalSearchParams();

  const [searchQuery, setSearchQuery] = useState("");

  // Filter sports based on the search query
  const filteredSports = sports?.filter((sport) =>
    sport.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log("sports-", sports);

  const [isLocalLoading, setLocalLoading] = useState<boolean>(false);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isKeyDetailsFormOpen, setKeyDetailsFormOpen] =
    useState<boolean>(false);
  const [isKeyValueDropdownOpen, setKeyValueDropdownOpen] =
    useState<boolean>(false);
  const [isSportsOptionModalOpen, setSportsOptionModalOpen] =
    useState<boolean>(false);
  const [selectedSport, setSelectedSport] = useState<SelectedSport>();
  const [selectedSportKeyDetails, setSelectedSportKeyDetails] = useState<any>();
  const [keyOptions, setKeyOptions] = useState<Array<string>>();
  const [editingProperty, setEditingProperty] = useState<string | null>(null);
  const [isAlertModalSet, setAlertModal] = useState<boolean>(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfigType>({
    title: "Discard changes?",
    message: "If you go back now, you will lose your changes.",
    discardAction: () => {},
    confirmMessage: "Discard Changes",
    cancelMessage: "Continue editing",
  });

  // Initial sports data
  const [initialSportsData, setInitialSportsData] = useState<any>();
  // Final selected sports data
  const [finalSelectedSports, setFinalSelectedSports] = useState<
    Array<SelectedSport>
  >([]);
  // About modal
  const [initialAbout, setAbout] = useState(user?.about);
  const [isAboutModalOpen, setAboutModalOpen] = useState<boolean>(false);

  // Check which edit request has came
  useEffect(() => {
    if (query.about) {
      setAboutModalOpen((prev) => !prev);
    }
  }, []);

  // Set initial sports data on page mount
  useEffect(() => {
    if (user?.selectedSports) {
      const data = user.selectedSports.map((sls: any) => ({
        sportsId: sls.sport?._id || "",
        sportsName: sls.sport?.name || "",
        keyDetails: sls.details,
        logo: sls.sport?.logo || "",
      }));
      setInitialSportsData(data);
      setFinalSelectedSports(data);
    }
  }, [user]);

  // Handle edit sports details
  const handleOpenEditModal = useCallback(
    (
      sportsId: string,
      sportsName: string,
      keyDetails: object,
      logo: string
    ) => {
      const existingSport = finalSelectedSports.find(
        (s) => s.sportsId === sportsId
      );

      const mergedKeyDetails =
        existingSport &&
        Object.values(existingSport.keyDetails || {}).some((val) => val !== "")
          ? existingSport.keyDetails
          : keyDetails;

      setSelectedSport({
        sportsId,
        sportsName,
        keyDetails: mergedKeyDetails,
        logo,
      });
      setHasSkippedAlert(false);
      console.log("hasSkippedAlert:", hasSkippedAlert);
      setSportsOptionModalOpen(false);
      setKeyDetailsFormOpen(true);
    },
    [finalSelectedSports]
  );

  const handleCloseEditModal = useCallback(() => {
    setEditModalOpen((prev) => !prev);
  }, []);

  const handleOpenKeyDetailsForm = useCallback((sport: SelectedSport) => {
    setKeyDetailsFormOpen((prev) => !prev);
    setSelectedSportKeyDetails(sport);
  }, []);

  const handleCloseKeyDetailsForm = useCallback(() => {
    originalKeyDetailsRef.current = null;
    setKeyDetailsFormOpen((prev) => !prev);
    setAlertModal(false);
  }, []);

  const handleOpenKeyValueDropdown = useCallback(
    (enumValues: Array<string>, propName: string) => {
      setKeyValueDropdownOpen((prev) => !prev);
      setKeyOptions(enumValues);
      setEditingProperty(propName);
    },
    []
  );

  const handleCloseKeyValueDropdown = useCallback(() => {
    setKeyValueDropdownOpen((prev) => !prev);
  }, []);

  const handleKeyValueSelect = useCallback(
    (selectedValue: string) => {
      if (!editingProperty || !selectedSport) return;
      setSelectedSport((prev) => ({
        ...prev!,
        keyDetails: { ...prev?.keyDetails, [editingProperty]: selectedValue },
      }));
      handleCloseKeyValueDropdown();
    },
    [editingProperty, selectedSport, handleCloseKeyValueDropdown]
  );

  const handleOpenSportsOptionModal = useCallback(() => {
    setSportsOptionModalOpen((prev) => !prev);
  }, []);

  const handleCloseSportsOptionModal = useCallback(() => {
    setSportsOptionModalOpen((prev) => !prev);
  }, []);

  // ✅ Define the type above your component
  type AlertConfigType = {
    title: string;
    message: string;
    discardAction: () => void;
    confirmMessage: string;
    cancelMessage: string;
    discardButtonColor?: {
      bg: string;
      text: string;
    };
    cancelButtonColor?: {
      bg: string;
      text: string;
    };
  };
  const [hasSkippedAlert, setHasSkippedAlert] = useState(false);
  const handleOpenAlertModal = useCallback(
    (
      title: string,
      message: string,
      discardAction: () => void,
      confirmMessage: string,
      cancelMessage: string,
      buttonColors?: {
        confirmButtonColor?: { bg: string; text: string };
        cancelButtonColor?: { bg: string; text: string };
        discardButtonColor?: { bg: string; text: string };
      }
    ) => {
      if (hasSkippedAlert) return;
      setAlertConfig({
        title,
        message,
        discardAction,
        confirmMessage,
        cancelMessage,
        confirmButtonColor: buttonColors?.confirmButtonColor,
        cancelButtonColor: buttonColors?.cancelButtonColor,
        discardButtonColor: buttonColors?.discardButtonColor,
      });
      setAlertModal(true);
    },
    [hasSkippedAlert]
  );

  const handleOpenAboutModal = useCallback(() => {
    setAboutModalOpen((prev) => !prev);
  }, []);

  const handleCloseAboutModal = useCallback(() => {
    setAbout(initialAbout);
    setAboutModalOpen((prev) => !prev);
  }, []);

  // Handle delete a specific sports overview (only remove sport)
  const handleDeleteSportsOverview = useCallback(() => {
    setAlertModal(false);
    setKeyDetailsFormOpen((prev) => !prev);
    setFinalSelectedSports((prev) =>
      prev.filter((sport) => sport.sportsId !== selectedSport?.sportsId)
    );
    setSelectedSport({
      sportsId: "",
      sportsName: "",
      keyDetails: {},
      logo: "",
    });
    setEditModalOpen(false);
  }, [selectedSport]);

  const handleCloseAlertModal = () => {
    setAlertModal(false);
  };

  // Handle save final sports key details
  const handleSaveFinalSportsData = useCallback(() => {
    if (selectedSport) {
      const keyDetails = selectedSport.keyDetails || {};

      // Count how many non-empty values exist in keyDetails
      const filledFieldsCount = Object.values(keyDetails).filter(
        (value) => value && value.trim() !== ""
      ).length;

      // If fewer than 3 options are selected, show alert and stop execution
      if (filledFieldsCount < 3 && !hasSkippedAlert) {
        handleOpenAlertModal(
          "Add More Key Details",
          "Atleast 3 key details are recommended to add for a complete and impactful profile.",
          () => setAlertModal(false),
          "Add more",
          "  Skip  ",
          {
            confirmButtonColor: { bg: "#12956B", text: "white" }, // Pass it all in one object
          }
        );
        return; // Don't proceed
      }
    }
    setFinalSelectedSports((prev) => {
      // Check if the sport already exists
      const existingIndex = prev.findIndex(
        (sport) => sport.sportsId === selectedSport?.sportsId
      );
      // Create a new array without the existing entry if found
      const filteredArray =
        existingIndex !== -1
          ? prev.filter((_, index) => index !== existingIndex)
          : prev;
      // Add the updated selectedSport at the end (or add new if didn't exist)
      return selectedSport ? [...filteredArray, selectedSport] : filteredArray;
    });
    setKeyDetailsFormOpen((prev) => !prev);
    setSportsOptionModalOpen(false);
  }, [selectedSport, hasSkippedAlert]);

  // Handle save about
  const handleSaveAbout = useCallback(() => {
    // setAbout(initialAbout);
    console.log(initialAbout);
    setAboutModalOpen(false);
  }, [initialAbout]);

  // Handle submit sports overview details
  const handleSubmitOverviewData = useCallback(async () => {
    console.log("Data submitting...");
    // Immediately update local loading state so that the spinner appears
    setLocalLoading(true);

    console.log(initialAbout);
    if (initialAbout !== user?.about) {
      await dispatch(editUserAbout(initialAbout));
    }

    // Let the UI update
    setTimeout(async () => {
      if (
        JSON.stringify(initialSportsData) ===
        JSON.stringify(finalSelectedSports)
      ) {
        setLocalLoading(false);
        router.push("/(app)/(tabs)/profile");
      } else {
        const dataToSubmit = finalSelectedSports.map((sp) => ({
          details: sp.keyDetails,
          sportsId: sp.sportsId,
        }));
        const sportsData = { sports: dataToSubmit };
        await dispatch(editUserSportsOverview(sportsData));
        await dispatch(
          fetchMyProfile({ targetUserId: user?._id, targetUserType: user.type })
        );
        router.push("/(app)/(tabs)/profile");
        setLocalLoading(false);
      }
    }, 0);
  }, [
    initialSportsData,
    initialAbout,
    finalSelectedSports,
    dispatch,
    router,
    user,
  ]);

  if (error) {
    <View className="flex-row justify-center">
      <TextScallingFalse className="text-red-500">
        {error.message || "Error fetching sports !"}
      </TextScallingFalse>
    </View>;
  }

  const originalKeyDetailsRef = useRef(null);

  // Only store original data when modal opens
  if (
    isKeyDetailsFormOpen &&
    !originalKeyDetailsRef.current &&
    selectedSport?.keyDetails
  ) {
    originalKeyDetailsRef.current = JSON.parse(
      JSON.stringify(selectedSport.keyDetails)
    );
  }

  const handleBackPress = () => {
    const isDataUnchanged =
      isEqual(initialSportsData, finalSelectedSports) &&
      initialAbout === user?.about;

    if (isDataUnchanged) {
      router.push("/(app)/(tabs)/profile");
    } else {
      setAlertConfig({
        title: "Discard changes?",
        message: "If you go back now, you will lose your changes.",
        confirmMessage: "Discard",
        cancelMessage: "Cancel",
        discardButtonColor: {
          bg: "transparent",
          text: "#FF0000",
        },
        cancelButtonColor: {
          bg: "transparent",
          text: "#808080",
        },
        discardAction: () => router.push("/(app)/(tabs)/profile"),
      });
      setAlertModal(true);
    }
  };

  // Compare current keyDetails to original
  const isKeyDetailsUnchanged =
    JSON.stringify(selectedSport?.keyDetails) ===
    JSON.stringify(originalKeyDetailsRef.current);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PageThemeView>
        <TopBar heading="Edit Overview" backHandler={handleBackPress}>
          {isLocalLoading ? (
            <ActivityIndicator size="small" color="#12956B" />
          ) : (
            <TouchableOpacity
              onPress={handleSubmitOverviewData}
              disabled={
                JSON.stringify(initialSportsData) ===
                  JSON.stringify(finalSelectedSports) &&
                initialAbout === user?.about
              }
            >
              <TextScallingFalse
                className={`${
                  JSON.stringify(initialSportsData) ===
                    JSON.stringify(finalSelectedSports) &&
                  initialAbout === user?.about
                    ? "text-[#808080]"
                    : "text-[#12956B]"
                } text-4xl text-right`}
              >
                Save
              </TextScallingFalse>
            </TouchableOpacity>
          )}
        </TopBar>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 50 }} // Add padding for bottom content
          showsVerticalScrollIndicator={false}
        >
          {/* Headings */}
          <View style={{ width: "100%", padding: 17 }}>
            <TextScallingFalse
              style={{ color: "white", fontSize: 21, fontWeight: "bold" }}
            >
              {user?.type === "User"
                ? "Highlight your unique Journey"
                : "Enhance Your Profile"}
            </TextScallingFalse>
            <TextScallingFalse
              style={{ color: "white", fontSize: 13, fontWeight: "300" }}
            >
              Your overview is your canvas to share key details about your
              sports
              {user?.type === "User" ? " profession" : " page"}.
            </TextScallingFalse>
          </View>

          {/* Sports overview */}
          {user?.type === "User" && (
            <View
              style={{ width: "90%", paddingVertical: 7 }}
              className="mx-auto flex justify-center gap-y-2"
            >
              <TextScallingFalse
                style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
              >
                Sports Overview
              </TextScallingFalse>
              <View className="w-full justify-start gap-x-2.5 gap-y-2 py-[5px] flex-row items-center flex-wrap">
                {finalSelectedSports && finalSelectedSports.length > 0 ? (
                  finalSelectedSports.map((sport, index) => (
                    <TouchableOpacity
                      activeOpacity={0.5}
                      key={index}
                      onPress={() =>
                        handleOpenEditModal(
                          sport.sportsId,
                          sport.sportsName,
                          sport.keyDetails,
                          sport.logo
                        )
                      }
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <View
                        className={`p-2.5 min-w-[8rem] bg-[#12956B] rounded-md flex-row px-4 items-center justify-between gap-x-2`}
                        style={{ zIndex: 10 }}
                      >
                        <Image
                          source={{ uri: sport.logo }}
                          style={{
                            width: 20,
                            height: 20,
                          }}
                          resizeMode="contain"
                        />
                        <TextScallingFalse className="text-3xl font-medium text-white">
                          {sport.sportsName}
                        </TextScallingFalse>
                      </View>
                      <View
                        style={{
                          borderWidth: 0.5,
                          borderColor: "#505050",
                          width: "98%",
                          height: 22,
                          justifyContent: "center",
                          alignItems: "center",
                          borderBottomLeftRadius: 6,
                          borderBottomRightRadius: 6,
                          marginTop: -2,
                        }}
                      >
                        <TextScallingFalse
                          style={{
                            color: "white",
                            fontSize: 9,
                            fontWeight: "semibold",
                          }}
                        >
                          {" "}
                          Edit {sport.sportsName}
                        </TextScallingFalse>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <TextScallingFalse className="text-white">
                    {""}
                  </TextScallingFalse>
                )}
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  width: 115,
                  height: 40,
                  backgroundColor: "white",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  borderRadius: 5,
                  gap: 9,
                }}
                onPress={handleOpenSportsOptionModal}
              >
                <FontAwesome5 name="plus" size={19} color="black" />
                <TextScallingFalse
                  style={{ color: "black", fontSize: 14, fontWeight: "500" }}
                >
                  Add Sport
                </TextScallingFalse>
              </TouchableOpacity>
            </View>
          )}

          {/* About section */}
          <View style={{ paddingTop: 20 }}>
            <View
              style={{ width: "90%", padding: 20 }}
              className="mx-auto py-2 px-0 border-t-[0.5px] border-b-[0.5px] border-[#808080]"
            >
              <TouchableOpacity
                activeOpacity={0.8}
                className="border-[0.4] border-y-[#353535] w-full h-14 items-center justify-between flex-row"
                onPress={handleOpenAboutModal}
              >
                <TextScallingFalse
                  style={{ color: "white", fontSize: 16, fontWeight: "500" }}
                >
                  About
                </TextScallingFalse>
                <RightArrow />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{ width: "90%", padding: 20 }}
            className="mx-auto py-2 px-0 border-b-[0.5px] border-[#808080]"
          >
            <TouchableOpacity
              activeOpacity={0.8}
              className="border-[0.4] border-y-[#353535] w-full h-14 items-center justify-between flex-row"
              onPress={() =>
                router.push(
                  "/(app)/(profile)/edit-overview/(modal)/current-team"
                )
              }
            >
              <TextScallingFalse
                style={{ color: "white", fontSize: 16, fontWeight: "500" }}
              >
                Current Teams
              </TextScallingFalse>
              <RightArrow />
            </TouchableOpacity>
          </View>

          {/* Members section */}
          {user?.type === "Page" && (
            <>
              <View
                style={{ width: "90%", padding: 20 }}
                className="mx-auto py-2 px-0 border-b-[0.5px] border-[#808080]"
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="border-[0.4] border-y-[#353535] w-full h-14 items-center justify-between flex-row"
                  onPress={handleOpenAboutModal}
                >
                  <TextScallingFalse
                    style={{ color: "white", fontSize: 16, fontWeight: "500" }}
                  >
                    Teams
                  </TextScallingFalse>
                  <RightArrow />
                </TouchableOpacity>
              </View>
              <View
                style={{ width: "90%", padding: 20 }}
                className="mx-auto py-2 px-0 border-b-[0.5px] border-[#808080]"
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="border-[0.4] border-y-[#353535] w-full h-14 items-center justify-between flex-row"
                  onPress={() =>
                    router.push("/(app)/(profile)/edit-overview/associates")
                  }
                >
                  <TextScallingFalse
                    style={{ color: "white", fontSize: 16, fontWeight: "500" }}
                  >
                    Associates {`[${associatesLength}]`}
                  </TextScallingFalse>
                  <RightArrow />
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>

        {/* Alert modal */}
        {isAlertModalSet && (
          <AlertModal
            alertConfig={{
              ...alertConfig,
              confirmAction: () => {
                if (alertConfig.title === "Add More Key Details") {
                  setHasSkippedAlert(true);
                }
                alertConfig.discardAction?.(); // optional chaining for safety
                handleCloseAlertModal();
              },
              discardAction: () => {
                if (alertConfig.title === "Add More Key Details") {
                  setHasSkippedAlert(true);
                }
                handleCloseAlertModal();
              },
            }}
            isVisible={isAlertModalSet}
          />
        )}

        {/* Edit sports details modal */}
        <Modal
          visible={isEditModalOpen}
          transparent={true}
          onRequestClose={handleCloseEditModal}
        >
          <PageThemeView>
            {/* Top header */}
            <View className="py-2 px-5 flex-row justify-between items-center">
              <View className="flex-row justify-start items-center gap-x-3">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleCloseEditModal}
                >
                  <AntDesign name="arrowleft" size={24} color="white" />
                </TouchableOpacity>
                <TextScallingFalse className="text-white text-5xl">
                  {selectedSport ? selectedSport.sportsName : ""}
                </TextScallingFalse>
              </View>
              {/* Save button */}
            </View>
            {/* Main section */}
            <View
              style={{ padding: 20, gap: 1 }}
              className="w-full flex items-start gap-y-3"
            >
              <TouchableOpacity
                onPress={() =>
                  selectedSport && handleOpenKeyDetailsForm(selectedSport)
                }
                activeOpacity={0.7}
                className="w-full flex-row justify-between items-center pt-2 pb-3 border-b-[0.5px] border-[#808080]"
              >
                <TextScallingFalse className="text-white text-4xl font-semibold">
                  Key Details
                </TextScallingFalse>
                <RightArrow />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                className="w-full flex-row justify-between items-center pb-3 border-b-[0.5px] border-[#808080]"
              >
                <TextScallingFalse className="text-white text-4xl font-semibold">
                  Teams
                </TextScallingFalse>
                <RightArrow />
              </TouchableOpacity>
            </View>
          </PageThemeView>
        </Modal>

        {/* Key details form */}
        <Modal
          visible={isKeyDetailsFormOpen}
          transparent={true}
          onRequestClose={handleCloseKeyDetailsForm}
        >
          <PageThemeView>
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 18,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    if (isKeyDetailsUnchanged) {
                      handleCloseKeyDetailsForm();
                    } else {
                      handleOpenAlertModal(
                        "Discard Changes?",
                        "If you go back, you will lose your changes.",
                        handleCloseKeyDetailsForm,
                        "Discard",
                        "Cancel",
                        { bg: "transparent", text: "#E4080A" }
                      );
                    }
                  }}
                >
                  <BackIcon />
                </TouchableOpacity>
              </View>
              <TextScallingFalse className="text-6xl text-white">
                {selectedSport ? selectedSport.sportsName : ""}
              </TextScallingFalse>
              <TouchableOpacity
                disabled={isKeyDetailsUnchanged}
                onPress={handleSaveFinalSportsData}
              >
                <MaterialIcons
                  name="done"
                  size={30}
                  color={isKeyDetailsUnchanged ? "#353535" : "#12956B"}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: "100%",
                paddingVertical: 10,
                paddingHorizontal: 20,
                paddingTop: 20,
              }}
            >
              <TextScallingFalse
                style={{ color: "grey", fontSize: 16, fontWeight: "500" }}
              >
                Key Details:
              </TextScallingFalse>
            </View>

            {isKeyValueDropdownOpen && (
              <KeyDetailsMenu
                isVisible={isKeyValueDropdownOpen}
                keyOptions={keyOptions ?? []}
                handleKeyValueSelect={handleKeyValueSelect}
                handleClose={handleCloseKeyValueDropdown}
              />
            )}

            <View style={{ width: "100%", paddingHorizontal: 20, gap: 1 }}>
              {sports
                ?.filter(
                  (sport) =>
                    sport._id === selectedSport?.sportsId &&
                    sport.defaultProperties
                )
                .flatMap((sport) =>
                  sport.defaultProperties.map((prop, index) => {
                    const propName = prop.name;
                    const propValue =
                      selectedSport?.keyDetails?.[propName] || "";

                    return (
                      <View key={index} style={styles.EditTopicSportsView}>
                        <TextScallingFalse style={styles.KeymenuText}>
                          {propName} -
                        </TextScallingFalse>
                        <TouchableOpacity
                          activeOpacity={0.5}
                          style={styles.flexRowView}
                          onPress={() =>
                            handleOpenKeyValueDropdown(
                              prop.enumValues,
                              propName
                            )
                          }
                        >
                          <TextScallingFalse style={styles.selectButton}>
                            {propValue || "Select"}
                          </TextScallingFalse>
                          <View style={{ paddingTop: 5 }}>
                            <DownArrow />
                          </View>
                        </TouchableOpacity>
                      </View>
                    );
                  })
                )}
            </View>
            {/* Delete overview button */}
            {selectedSport?.keyDetails &&
              !Object.values(selectedSport.keyDetails).every(
                (value) => value === ""
              ) && (
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    className="flex-row justify-center items-center w-[70%] rounded-[20px] mt-12"
                    onPress={() =>
                      handleOpenAlertModal(
                        "Delete Overview",
                        "Are you sure you want to delete your Cricket overview ?",
                        handleDeleteSportsOverview,
                        "Delete",
                        "Cancel",
                        { bg: "transparent", text: "#D44044" }
                      )
                    }
                  >
                    <TextScallingFalse className="text-[#E4080A] text-2xl font-semibold">
                      Delete Overview
                    </TextScallingFalse>
                  </TouchableOpacity>
                </View>
              )}

            {/* Alert modal */}
            {isAlertModalSet && (
              <AlertModal
                alertConfig={{
                  ...alertConfig,
                  confirmAction: () => {
                    if (alertConfig.title === "Add More Key Details") {
                      setHasSkippedAlert(true);
                    }
                    alertConfig.discardAction?.(); // optional chaining for safety
                    handleCloseAlertModal();
                  },
                  discardAction: () => {
                    if (alertConfig.title === "Add More Key Details") {
                      setHasSkippedAlert(true);
                    }
                    handleCloseAlertModal();
                  },
                }}
                isVisible={isAlertModalSet}
              />
            )}
          </PageThemeView>
        </Modal>

        {/* Sports selection options modal */}
        <Modal
          visible={isSportsOptionModalOpen}
          transparent={true}
          onRequestClose={handleCloseSportsOptionModal}
        >
          <PageThemeView>
            {/* Top header */}
            <View className="px-5 py-2 flex-row justify-start items-center">
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={handleCloseSportsOptionModal}
                style={{ width: "30%", height: 50, paddingVertical: 5.5 }}
              >
                <BackIcon />
              </TouchableOpacity>
            </View>
            {/* Headings */}
            <View style={{ width: "100%", paddingHorizontal: 20 }}>
              <TextScallingFalse
                style={{ color: "white", fontSize: 20, fontWeight: "500" }}
              >
                Select Your Sport..
              </TextScallingFalse>
              <TextScallingFalse className="text-[#808080] text-lg font-normal pt-2">
                Choose the sport you want to showcase in your Overview Your
                sports profile is your story; let's make it legendary!
              </TextScallingFalse>
            </View>
            {/* Search bar */}
            <View className="w-full justify-center items-center flex-row mx-auto h-[80px]">
              <TextInput
                placeholder="Search for sports"
                placeholderTextColor={"grey"}
                className="bg-[#181818] w-3/4 h-12 pl-5 rounded-l-md text-white"
                value={searchQuery}
                onChangeText={setSearchQuery}
                cursorColor="#12956B"
              />
              <View className="bg-[#181818] h-12 w-12 justify-center rounded-r-md">
                <Feather
                  name="search"
                  style={{ paddingLeft: 10 }}
                  size={23}
                  color="grey"
                />
              </View>
            </View>
            {/* Sports options */}
            {isLoading ? (
              <ActivityIndicator size="small" color="#12956B" />
            ) : (
              <ScrollView showsVerticalScrollIndicator={true}>
                <View className="w-full flex-row flex-wrap justify-center items-center mx-auto gap-3 p-5">
                  {[...filteredSports]
                    .sort((a, b) => {
                      const aSelected = finalSelectedSports.some(
                        (s) => s.sportsName === a.name
                      );
                      const bSelected = finalSelectedSports.some(
                        (s) => s.sportsName === b.name
                      );
                      return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
                    })
                    .map((sport) => {
                      const keyDetails = sport.defaultProperties.reduce(
                        (acc: any, dp) => {
                          acc[dp.name] = "";
                          return acc;
                        },
                        {}
                      );

                      const isSelected = finalSelectedSports.some(
                        (s) => s.sportsName === sport.name
                      );

                      return (
                        <TouchableOpacity
                          onPress={() =>
                            handleOpenEditModal(
                              sport._id,
                              sport.name,
                              keyDetails,
                              sport.logo
                            )
                          }
                          activeOpacity={0.7}
                          key={sport._id}
                          style={{
                            height: 100,
                            width: 110,
                            borderWidth: 0.3,
                            borderColor: "#606060",
                            borderRadius: 7,
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 10,
                            backgroundColor: isSelected
                              ? "#12956B"
                              : "transparent",
                          }}
                          className="w-[30%]"
                        >
                          <Image
                            source={{ uri: sport.logo }}
                            style={{ width: 28, height: 28 }}
                          />
                          <TextScallingFalse
                            style={{
                              color: "white",
                              fontSize: 13,
                              fontWeight: "500",
                            }}
                          >
                            {sport.name}
                          </TextScallingFalse>
                        </TouchableOpacity>
                      );
                    })}
                </View>
              </ScrollView>
            )}
          </PageThemeView>
        </Modal>

        {/* About Modal */}
        <Modal
          visible={isAboutModalOpen}
          transparent
          onRequestClose={handleCloseAboutModal}
        >
          <SafeAreaView className="bg-black h-full">
            {/* Modal Header */}
            <View className="flex-row justify-between items-center h-12 px-5 border-b border-gray-800">
              <View className="flex-row items-center">
                <TouchableOpacity
                  style={{ height: "20", width: "30" }}
                  onPress={handleCloseAboutModal}
                >
                  <BackIcon />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={handleSaveAbout}>
                <MaterialIcons
                  name="done"
                  size={28}
                  color={initialAbout === user?.about ? "grey" : "#12956B"}
                />
              </TouchableOpacity>
            </View>
            {/* Modal Content */}
            <View className="p-5">
              <TextScallingFalse className="text-white font-bold text-5xl">
                Edit About
              </TextScallingFalse>
              <TextScallingFalse className="text-[#A5A5A5] text-[13px] mb-5 mt-1">
                Your journey, your passion, your story — showcase what drives
                you and connect with the world of sport.
              </TextScallingFalse>
              <View className="border border-white h-72 rounded-[8px] justify-start">
                <TextInput
                  value={initialAbout}
                  onChangeText={setAbout}
                  placeholder="Write about yourself..."
                  placeholderTextColor="gray"
                  multiline
                  numberOfLines={15}
                  className="text-white text-xl flex-1 p-3"
                  style={{ textAlignVertical: "top" }}
                />
              </View>
            </View>
          </SafeAreaView>
        </Modal>

        {/* {isUserInfoModalOpen && (
          <UserInfoModal isUserInfoModalOpen={isUserInfoModalOpen} />
        )} */}
      </PageThemeView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  option: {
    paddingVertical: 10,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    elevation: 5,
    width: 250,
  },
  optionText: {
    fontSize: 14,
    color: "black",
  },
  KeymenuText: {
    color: "white",
    fontSize: 16,
    fontWeight: "400",
  },
  selectButton: {
    color: "white",
    fontSize: 14,
    fontWeight: "300",
    paddingRight: 23,
  },
  flexRowView: {
    flexDirection: "row",
  },
  EditTopicSportsView: {
    borderWidth: 0.5,
    borderBottomColor: "#353535",
    width: "100%",
    height: 55,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  AlertModalView: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    paddingVertical: 250,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  AlertModalContainer: {
    width: "90%",
    height: 240,
    borderRadius: 15,
    backgroundColor: "#181818",
    alignItems: "center",
  },
});
export default EditOverview;
