import {
  AntDesign,
  Feather,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { Divider } from "react-native-elements";
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
} from "~/reduxStore/slices/user/profileSlice";

interface SelectedSport {
  sportsId: string;
  sportsName: string;
  keyDetails: object;
  logo: string;
  [key: string]: any;
}

function EditOverview() {
  const { loading, error, user } = useSelector((state) => state?.auth);
  const { isError, isLoading, data: sports } = useGetSportsQuery(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");

  // Filter sports based on the search query
  const filteredSports = sports?.filter((sport) =>
    sport.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isKeyDetailsFormOpen, setKeyDetailsFormOpen] =
    useState<boolean>(false);
  const [isKeyValueDropdownOpen, setKeyValueDropdownOpen] =
    useState<boolean>(false);
  const [isSportsOptionModalOpen, setSportsOptionModalOpen] =
    useState<boolean>(false);
  const [selectedSport, setSelectedSport] = useState<SelectedSport>();
  const [selectedSportKeyDetails, setSelectedSportKeyDetails] = useState<any>();
  const [keyOptions, setkeyOptions] = useState<Array<string>>();
  const [editingProperty, setEditingProperty] = useState<string | null>(null);
  // Initial sports data
  const [initialSportsData, setInitialSportsData] = useState<any>();
  // Final selected sports data
  const [finalSelectedSports, setFinalSelectedSports] = useState<
    Array<SelectedSport>
  >([]);

  // Set initial sports data on page mount
  useEffect(() => {
    if (user.selectedSports) {
      const data = user.selectedSports.map((sls: any) => {
        return {
          sportsId: sls.sport._id,
          sportsName: sls.sport.name,
          keyDetails: sls.details,
          logo: sls.sport.logo,
        };
      });
      setInitialSportsData(data);
      setFinalSelectedSports(data);
    }
  }, []);

  // Handle edit sports details
  const handleOpenEditModal = (
    sportsId: string,
    sportsName: string,
    keyDetails: object,
    logo: string
  ) => {
    setEditModalOpen((prev) => !prev);
    console.log("\n\n\nKey details test", keyDetails);
    setSelectedSport(
      { sportsId, sportsName, keyDetails: keyDetails, logo } || {}
    );
  };
  const handleCloseEditModal = () => {
    setEditModalOpen((prev) => !prev);
  };
  const handleOpenKeyDetailsForm = (selectedSport: SelectedSport) => {
    setKeyDetailsFormOpen((prev) => !prev);
    setSelectedSportKeyDetails(selectedSport);
  };
  const handleCloseKeyDetailsForm = () => {
    setKeyDetailsFormOpen((prev) => !prev);
  };
  const handleOpenKeyValueDropdown = (
    enumValues: Array<string>,
    propName: string
  ) => {
    setKeyValueDropdownOpen((prev) => !prev);
    setkeyOptions(enumValues);
    setEditingProperty(propName);
  };
  const handleCloseKeyValueDropdown = () => {
    setKeyValueDropdownOpen((prev) => !prev);
  };
  const handleKeyValueSelect = (selectedValue: string) => {
    if (!editingProperty || !selectedSport) return;

    setSelectedSport((prev) => ({
      ...prev!,
      keyDetails: {
        ...prev?.keyDetails,
        [editingProperty]: selectedValue,
      },
    }));

    handleCloseKeyValueDropdown();
  };
  const handleOpenSportsOptionModal = () => {
    setSportsOptionModalOpen((prev) => !prev);
  };
  const handleCloseSportsOptionModal = () => {
    setSportsOptionModalOpen((prev) => !prev);
  };

  // Handle save final sports key details
  const handleSaveFinalSportsData = () => {
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

    setEditModalOpen((prev) => !prev);
  };

  // Handle submit sports overview details
  const handleSubmitOverviewData = async () => {
    // Check if inital data and final data are same or not

    console.log("Initial data : ", initialSportsData);
    console.log("Final data : ", finalSelectedSports);

    if (initialSportsData === finalSelectedSports) {
      console.log("No changes in data");
      return;
    } else {
      const data = finalSelectedSports.map((sp) => {
        return {
          details: sp.keyDetails,
          sportsId: sp.sportsId,
        };
      });
      const sports = { sports: [...data] };
      console.log(sports);
      await dispatch(editUserSportsOverview(sports));
      await dispatch(
        fetchMyProfile({ targetUserId: user._id, targetUserType: user.type })
      );
      router.push("/(app)/(tabs)/profile");
    }
  };

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
          {loading ? (
            <ActivityIndicator size="small" color="#12956B" />
          ) : (
            <TouchableOpacity
              onPress={handleSubmitOverviewData}
              disabled={initialSportsData === finalSelectedSports}
            >
              <TextScallingFalse
                className={`${
                  initialSportsData === finalSelectedSports
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
            Highlight your unique Journey
          </TextScallingFalse>
          <TextScallingFalse
            style={{ color: "white", fontSize: 13, fontWeight: "300" }}
          >
            Your overview is your canvas to share key details about your sports
            profession.
          </TextScallingFalse>
        </View>
        {/* Sports overview */}
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
                  className={`p-2.5 min-w-[8rem] bg-[#12956B] rounded-md flex-row items-center justify-between gap-x-2`}
                  onPress={() =>
                    handleOpenEditModal(
                      sport.sportsId,
                      sport.sportsName,
                      sport.keyDetails,
                      sport.logo
                    )
                  }
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
                </TouchableOpacity>
              ))
            ) : (
              <TextScallingFalse className="text-white">{""}</TextScallingFalse>
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
        {/* About section */}
        <View
          style={{ width: "90%", padding: 20 }}
          className="mx-auto py-2 px-0 border-b-[0.5px] border-[#808080]"
        >
          <TouchableOpacity
            activeOpacity={0.8}
            className="border-[0.4] border-y-[#353535] w-full h-14 items-center justify-between flex-row"
          >
            <TextScallingFalse
              style={{ color: "white", fontSize: 16, fontWeight: "500" }}
            >
              About
            </TextScallingFalse>
            <RightArrow />
          </TouchableOpacity>
        </View>

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
              <TouchableOpacity
                onPress={handleSaveFinalSportsData}
                activeOpacity={0.7}
                style={{ paddingRight: 10 }}
              >
                <TextScallingFalse className="text-white">
                  Save
                </TextScallingFalse>
              </TouchableOpacity>
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
                  onPress={handleCloseKeyDetailsForm}
                >
                  <AntDesign name="arrowleft" size={24} color="white" />
                </TouchableOpacity>
                <TextScallingFalse className="text-5xl text-white">
                  {selectedSport ? selectedSport.sportsName : ""}
                </TextScallingFalse>
              </View>
              <TouchableOpacity
                onPress={() => {
                  handleCloseKeyDetailsForm();
                }}
              >
                <MaterialIcons name="done" size={28} color={"#353535"} />
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
            <View className="w-full justify-center items-center flex-row mx-auto">
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
              <View className="w-full flex-row flex-wrap justify-center items-center mx-auto gap-2 p-5">
                {filteredSports?.map((sport) => {
                  const keyDetails = sport.defaultProperties.map((dp) => {
                    return {
                      [dp.name]: "",
                    };
                  });
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
                        height: 37,
                        borderWidth: 0.3,
                        borderColor: "#404040",
                        borderRadius: 7,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 10,
                        backgroundColor: finalSelectedSports.some(
                          (s) => s.sportsName === sport.name
                        )
                          ? "#12956B"
                          : "transparent",
                      }}
                      className="w-[30%]"
                    >
                      <Image
                        source={{ uri: sport.logo }}
                        style={{ width: 17, height: 17 }}
                      />
                      <TextScallingFalse
                        style={{
                          color: "white",
                          fontSize: 12,
                          fontWeight: "500",
                        }}
                      >
                        {sport.name}
                      </TextScallingFalse>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </PageThemeView>
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
});
export default EditOverview;
