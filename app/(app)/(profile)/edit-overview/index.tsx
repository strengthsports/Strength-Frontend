import {
  AntDesign,
  Feather,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Text } from "react-native";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import RightArrow from "~/components/Arrows/RightArrow";
import TextScallingFalse from "~/components/CentralText";
import PageThemeView from "~/components/PageThemeView";
import TopBar from "~/components/TopBar";
import { AppDispatch } from "~/reduxStore";
import { useGetSportsQuery } from "~/reduxStore/api/sportsApi";
import {
  editUserSportsOverview,
  fetchMyProfile,
  editUserAbout,
} from "~/reduxStore/slices/user/profileSlice";

interface SelectedSport {
  sportsId: string;
  sportsName: string;
  keyDetails: { [key: string]: any };
  logo: string;
  [key: string]: any;
}

function EditOverview() {
  const { loading, error, user } = useSelector((state: any) => state?.profile);
  const { isError, isLoading, data: sports } = useGetSportsQuery(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { about } = useLocalSearchParams();

  const [searchQuery, setSearchQuery] = useState("");

  // Filter sports based on the search query
  const filteredSports = sports?.filter((sport) =>
    sport.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    onSkip: undefined,
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

  // Check if about edit request has came
  useEffect(() => {
    if (about) {
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

      console.log("\n\n\nKey details test", mergedKeyDetails);

      setSelectedSport({
        sportsId,
        sportsName,
        keyDetails: mergedKeyDetails,
        logo,
      });
      setHasSkippedAlert(false);
      console.log("hasSkippedAlert:", hasSkippedAlert);
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
    onSkip?: () => void;
  };
  const [hasSkippedAlert, setHasSkippedAlert] = useState(false);
  const handleOpenAlertModal = useCallback(
    (
      title: string,
      message: string,
      discardAction: () => void,
      confirmMessage: string,
      cancelMessage: string
    ) => {
      if (hasSkippedAlert) return;
      setAlertConfig({
        title,
        message,
        discardAction,
        confirmMessage,
        cancelMessage,
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
          "We recommend adding at least 3 key details to your Sports Overview for a complete and impactful profile.",
          () => setAlertModal(false),
          "Skip",
          "Add more"
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
      console.log("\n\n\nNewly selected array of sports", selectedSport);
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
        console.log(sportsData);
        await dispatch(editUserSportsOverview(sportsData));
        await dispatch(
          fetchMyProfile({ targetUserId: user._id, targetUserType: user.type })
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

  return (
    <SafeAreaView>
      <PageThemeView>
        <TopBar heading="Edit Overview" backRoute="/(app)/(tabs)/profile">
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
            Your overview is your canvas to share key details about your sports
            {user?.type === "User" ? " profession" : " page"}.
          </TextScallingFalse>
        </View>

        {/* Sports overview */}
        {user?.type === "User" && (
          <View
            style={{ width: "90%", paddingVertical: 15 }}
            className="mx-auto flex justify-center gap-y-2 border-b-[0.5px] border-[#808080]"
          >
            <TextScallingFalse
              style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
            >
              Sports Overview
            </TextScallingFalse>
            <View className="w-full justify-start gap-x-2.5 gap-y-2 flex-row items-center flex-wrap">
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
                      className={`p-2.5 min-w-[8rem] bg-[#12956B] rounded-md flex-row items-center justify-between gap-x-2`}
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
                      <TextScallingFalse className="text-3xl text-white">
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
              About
            </TextScallingFalse>
            <RightArrow />
          </TouchableOpacity>
        </View>

        {/* Members section */}
        <View></View>

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
            <View className="px-5 py-2 flex-row justify-between items-center">
              <View className="flex-row justify-start items-center gap-x-3">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    if (
                      selectedSport?.keyDetails &&
                      Object.values(selectedSport.keyDetails).every(
                        (value) => value === ""
                      )
                    ) {
                      handleCloseKeyDetailsForm();
                    } else {
                      handleOpenAlertModal(
                        "Discard Changes?",
                        "If you go back, you will lose your changes.",
                        handleCloseKeyDetailsForm,
                        "Discard changes",
                        "Continue editing"
                      );
                    }
                  }}
                >
                  <AntDesign name="arrowleft" size={24} color="white" />
                </TouchableOpacity>
                <TextScallingFalse className="text-5xl text-white">
                  {selectedSport ? selectedSport.sportsName : ""}
                </TextScallingFalse>
              </View>
              <TouchableOpacity onPress={handleSaveFinalSportsData}>
                <MaterialIcons
                  name="done"
                  size={28}
                  color={
                    selectedSport?.keyDetails &&
                    Object.values(selectedSport.keyDetails).every(
                      (value) => value === ""
                    )
                      ? "#353535"
                      : "green"
                  }
                  disabled={
                    selectedSport?.keyDetails &&
                    Object.values(selectedSport.keyDetails).every(
                      (value) => value === ""
                    )
                  }
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: "100%",
                paddingVertical: 10,
                paddingHorizontal: 20,
              }}
            >
              <TextScallingFalse
                style={{ color: "grey", fontSize: 16, fontWeight: "500" }}
              >
                Key Details:
              </TextScallingFalse>
            </View>

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
                    console.log(
                      "Selected sports key details : ",
                      selectedSport?.keyDetails
                    );
                    const propValue =
                      selectedSport?.keyDetails?.[propName] || "";

                    return (
                      <View key={index} style={styles.EditTopicSportsView}>
                        <TextScallingFalse style={styles.KeymenuText}>
                          {propName}
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
                          <RightArrow />
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
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="flex-row justify-center items-center mt-4"
                  onPress={() =>
                    handleOpenAlertModal(
                      "Delete Overview",
                      "Are you sure you want to delete your Cricket overview ?",
                      handleDeleteSportsOverview,
                      "Delete",
                      "No Thanks"
                    )
                  }
                >
                  <TextScallingFalse className="text-[#808080] text-2xl font-semibold">
                    Delete Overview
                  </TextScallingFalse>
                </TouchableOpacity>
              )}
          </PageThemeView>
        </Modal>

        {/* Option menu for each key according to every sports */}
        <Modal
          visible={isKeyValueDropdownOpen}
          transparent
          animationType="fade"
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              flex: 1,
              marginTop: 100,
              marginLeft: 100,
            }}
            onPress={handleCloseKeyValueDropdown}
          >
            <View style={styles.modalContent}>
              {keyOptions?.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.option}
                  onPress={() => {
                    handleKeyValueSelect(option);
                  }}
                >
                  <TextScallingFalse
                    style={styles.optionText}
                    allowFontScaling={false}
                  >
                    {option}
                  </TextScallingFalse>
                </TouchableOpacity>
              ))}
              {/* Unselect button */}
              <TouchableOpacity
                style={[
                  styles.option,
                  { borderTopWidth: 1, borderTopColor: "#ccc", marginTop: 5 },
                ]}
                onPress={() => handleKeyValueSelect("")} // Passing empty value to remove selection
              >
                <TextScallingFalse
                  style={[styles.optionText, { color: "red" }]}
                  allowFontScaling={false}
                >
                  Unselect Option
                </TextScallingFalse>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
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
              >
                <AntDesign name="arrowleft" size={24} color="white" />
              </TouchableOpacity>
            </View>
            {/* Headings */}
            <View style={{ width: "100%", padding: 20 }}>
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

        {/* Alert modal */}
        <Modal visible={isAlertModalSet} transparent animationType="fade">
          <View style={styles.AlertModalView}>
            <View
              style={styles.AlertModalContainer}
              className="h-full flex items-center justify-center gap-y-3 p-8"
            >
              <TextScallingFalse className="text-[20px] text-white font-bold">
                {alertConfig.title}
              </TextScallingFalse>
              <TextScallingFalse className="text-[14px] text-white text-center">
                {alertConfig.message}
              </TextScallingFalse>

              <View className="flex-row border-t border-[#8080808b] w-full">
                <TouchableOpacity
                  onPress={() => {
                    alertConfig.discardAction();
                  }}
                  className="py-2 items-center"
                >
                  <TextScallingFalse className="font-semibold text-4xl text-red-600">
                    {alertConfig.confirmMessage}
                  </TextScallingFalse>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    if (
                      alertConfig.title === "Add More Key Details" &&
                      alertConfig.message.includes(
                        "We recommend adding at least 3 key details"
                      )
                    ) {
                      setHasSkippedAlert(true);
                    }
                    setAlertModal(false);
                  }}
                  className="py-2 items-center"
                >
                  <TextScallingFalse className="font-semibold text-4xl text-[#808080]">
                    {alertConfig.cancelMessage}
                  </TextScallingFalse>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* About Modal */}
        <Modal
          visible={isAboutModalOpen}
          transparent
          onRequestClose={handleCloseAboutModal}
        >
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={handleCloseAboutModal}
          >
            <View className="bg-black h-full">
              {/* Modal Header */}
              <View className="flex-row justify-between items-center h-12 px-5 border-b border-gray-800">
                <View className="flex-row items-center">
                  <TouchableOpacity onPress={handleCloseAboutModal}>
                    <AntDesign name="arrowleft" size={24} color="white" />
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
                <Text className="text-white font-bold text-5xl">
                  Edit About
                </Text>
                <Text className="text-gray-500 text-base mb-5 mt-1.5">
                  Use this space to showcase who you are as a professional
                  athlete. You can share your sports background, achievements,
                  and the essence of your athletic journey.
                </Text>
                <View className="border border-white h-72 rounded-sm justify-start">
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
            </View>
          </TouchableOpacity>
        </Modal>
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
    height: 250,
    borderRadius: 15,
    backgroundColor: "#181818",
    alignItems: "center",
  },
});
export default EditOverview;
