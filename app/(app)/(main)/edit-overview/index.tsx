import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Modal,
  TextInput,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import PageThemeView from "~/components/PageThemeView";
import {
  AntDesign,
  FontAwesome5,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import TextScallingFalse from "~/components/CentralText";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AddSportsModal from "~/components/Modal/AddSportsModal";
import { FlatList } from "react-native";
import { Text } from "react-native";
import { useGetSportsQuery } from "~/reduxStore/api/sportsApi";
import { defaultFormat } from "moment";
import { SportsList } from "~/types/sports";

const index = () => {
  const router = useRouter();

  const { data } = useGetSportsQuery(null);

  const [selectedSport, setSelectedSport] = useState<SportsList | null>(null);
  const [selectedSports, setSelectedSports] = useState<SportsList[]>([]);
  const backarrow = <AntDesign name="arrowleft" size={28} color="white" />;
  const rightArrow = (
    <AntDesign
      name="right"
      style={{ paddingRight: 5 }}
      size={17}
      color="grey"
    />
  );
  const downArrow = (
    <AntDesign
      name="down"
      style={{ paddingLeft: 25, paddingTop: 2.5 }}
      size={17}
      color="grey"
    />
  );
  const [isSportsOptionModalVisible, setSportsOptionModalVisible] =
    useState(false);
  const [isSportModalVisible, setSportModalVisible] = useState(false);
  const [isModalVisible3, setModalVisible3] = useState(false);
  const [isAlertModalVisible, setAlertModalVisible] = useState(false);
  const [isAlertModalVisible2, setAlertModalVisible2] = useState(false);
  const [isAlertModalVisible3, setAlertModalVisible3] = useState(false);
  const { width: screenWidth2 } = Dimensions.get("window");
  const scaleFactor = screenWidth2 / 410;

  // Modal functions for Sports selection page
  const closeSportsOptionModal = () => setSportsOptionModalVisible(false);
  const openSportsOptionModal = (type: React.SetStateAction<string>) => {
    setSportsOptionModalVisible(true);
  };

  // Modal functions for Sport specific menu page
  const closeSportModal = () => setSportModalVisible(false);
  const openSportModal = (sport: {
    _id: string;
    name: string;
    logo: string;
    defaultProperties: any;
  }) => {
    setSportModalVisible(true);
    setSelectedSport(sport);
    setSelectedSports((prev) =>
      prev.some((s) => s.name === sport.name) ? prev : [...prev, sport]
    );
    setTimeout(closeSportsOptionModal, 1000);
  };

  // Modal
  const closeModal3 = () => setModalVisible3(false);
  const openModal3 = (sport: SportsList) => {
    if (sport) {
      setSelectedSport(sport);
      setModalVisible3(true);
    } else {
      console.error("No sport selected to open Modal 3");
    }
    setTimeout(() => {
      closeSportModal();
    }, 1000);
  };

  const openAlertModal2 = (sport: SportsList) => {
    if (sport) {
      setSelectedSport(sport);
      setAlertModalVisible2(true);
    } else {
      console.error("No sport selected to open Modal 3");
    }
  };

  // Unselect the sport and close the modal
  const unselectSport = (sport: SportsList) => {
    setSelectedOptions({});
    setTimeout(() => {
      closeSportModal();
    }, 500);
    setSelectedSports((prev) => prev.filter((s) => s.name !== sport.name)); // Remove the sport
  };

  const [searchQuery, setSearchQuery] = useState("");

  // Filter sports based on the search query
  const filteredSports = data?.filter((sport) =>
    sport.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log("selectedSports -", selectedSport);

  const [showDropdown1, setShowDropdown1] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<{
    question: string;
    options: Array<string>;
  }>({
    question: "",
    options: [],
  });
  const [selectedOptions, setSelectedOptions] = useState({});

  const insets = useSafeAreaInsets();
  const [menuValue, setMenuValue] = useState<string | undefined>();

  function handleMenuChange(value: string | undefined) {
    setMenuValue(value);
  }

  const toggleDropdown1 = (question: string, options: Array<string>) => {
    setSelectedQuestion({ question, options });
    setShowDropdown1(!showDropdown1);
  };

  const handleOptionSelect1 = (question: string, option: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [question]: option,
    }));
    setShowDropdown1(false);
    console.log("Selected options : ", selectedOptions);
  };

  // Function to check if all questions are answered
  const allQuestionsAnswered = () => {
    // Count the number of answered questions
    const answeredCount = Object.values(selectedOptions).filter(
      (answer) => answer && answer !== ""
    ).length;

    // Check if at least 3 questions are answered
    return answeredCount >= 3;
  };

  // Function to check if atlest one questions is answered
  const oneQuestionsAnswered = () => {
    // Count the number of answered questions
    const answeredCount = Object.values(selectedOptions).filter(
      (answer) => answer && answer !== ""
    ).length;

    // Check if at least 1 questions are answered
    return answeredCount >= 1;
  };

  return (
    <SafeAreaView>
      <PageThemeView>
        {/* Top Header */}
        <View className="h-12 w-full flex-row justify-between items-center px-5">
          <TouchableOpacity
            onPress={() => router.push("/profile")}
            className="basis-[15%]"
          >
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <TextScallingFalse className="flex-grow text-center text-white font-light text-5xl">
            Edit Overview
          </TextScallingFalse>
          <TouchableOpacity
            // onPress={handleFormSubmit}
            className="basis-[15%] justify-center items-end"
          >
            <TextScallingFalse className="text-[#12956B] text-4xl font-medium">
              Done
            </TextScallingFalse>
          </TouchableOpacity>
        </View>
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
          style={{ width: "100%", paddingHorizontal: 23, paddingVertical: 15 }}
        >
          <TextScallingFalse
            style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
          >
            Sports Overview
          </TextScallingFalse>
          <View
            style={{
              width: "100%",
              paddingVertical: 10,
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 7,
            }}
          >
            {selectedSports.map((sport, index) => (
              <View
                key={sport.name}
                style={{
                  width: 115,
                  height: 35,
                  backgroundColor: "#12956B",
                  borderRadius: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 10,
                }}
              >
                <Image
                  source={{ uri: sport.logo }}
                  style={{ width: 20, height: 20 }}
                />
                <TextScallingFalse
                  style={{ color: "white", fontSize: 12, fontWeight: "500" }}
                >
                  {sport.name}
                </TextScallingFalse>
              </View>
            ))}
          </View>
          <TouchableOpacity
            onPress={openSportsOptionModal}
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
        <View style={{ width: "100%", padding: 20 }}>
          <TouchableOpacity activeOpacity={0.8} style={styles.EditTopicsView}>
            <TextScallingFalse
              style={{ color: "white", fontSize: 16, fontWeight: "500" }}
            >
              About
            </TextScallingFalse>
            {rightArrow}
          </TouchableOpacity>
        </View>

        {/* Sports selection modal */}
        <Modal
          visible={isSportsOptionModalVisible}
          transparent={true}
          onRequestClose={closeSportsOptionModal}
        >
          <PageThemeView>
            {/* Top header */}
            <View style={styles.headerView}>
              <View style={styles.flexRowView}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={closeSportsOptionModal}
                >
                  {backarrow}
                </TouchableOpacity>
                <TextScallingFalse style={styles.headerText}>
                  Add Sports
                </TextScallingFalse>
              </View>
            </View>
            {/* Headings */}
            <View style={{ width: "100%", padding: 20 }}>
              <TextScallingFalse
                style={{ color: "white", fontSize: 18, fontWeight: "400" }}
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
                className="bg-[#181818] w-3/4 h-12 pl-5 rounded-l-md"
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
            <View className="w-full flex-row flex-wrap justify-center items-center gap-2 p-5">
              {filteredSports?.map((sport) => (
                <TouchableOpacity
                  onPress={() => openSportModal(sport)}
                  activeOpacity={0.7}
                  key={sport._id}
                  style={{
                    width: 115,
                    height: 37,
                    borderWidth: 0.3,
                    borderColor: "#404040",
                    borderRadius: 7,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 10,
                    backgroundColor: selectedSports.some(
                      (s) => s.name === sport.name
                    )
                      ? "#12956B"
                      : "transparent",
                  }}
                >
                  <Image
                    source={{ uri: sport.logo }}
                    style={{ width: 17, height: 17 }}
                  />
                  <TextScallingFalse
                    style={{ color: "white", fontSize: 12, fontWeight: "500" }}
                  >
                    {sport.name}
                  </TextScallingFalse>
                </TouchableOpacity>
              ))}
            </View>
          </PageThemeView>
        </Modal>

        {/* Sport specific menu modal */}
        <Modal
          visible={isSportModalVisible}
          transparent={true}
          onRequestClose={closeSportModal}
        >
          <PageThemeView>
            {/* Top header */}
            <View style={styles.headerView}>
              <View style={styles.flexRowView}>
                <TouchableOpacity activeOpacity={0.7} onPress={closeSportModal}>
                  {backarrow}
                </TouchableOpacity>
                <TextScallingFalse style={styles.headerText}>
                  {selectedSport ? selectedSport.name : ""}
                </TextScallingFalse>
              </View>
              {/* Save button */}
              {allQuestionsAnswered() ? (
                <TouchableOpacity
                  onPress={closeSportModal}
                  style={{ paddingRight: 10 }}
                >
                  <TextScallingFalse style={styles.doneButton}>
                    Save
                  </TextScallingFalse>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setAlertModalVisible(true)}
                  activeOpacity={0.7}
                  style={{ paddingRight: 10 }}
                >
                  <TextScallingFalse style={styles.doneButton}>
                    Save
                  </TextScallingFalse>
                </TouchableOpacity>
              )}
            </View>
            {/* Main section */}
            <View style={{ padding: 20, gap: 1 }}>
              <TouchableOpacity
                onPress={() => selectedSport && openModal3(selectedSport)}
                activeOpacity={0.7}
                style={styles.EditTopicSportsView}
              >
                <TextScallingFalse style={styles.menuText}>
                  Key Details
                </TextScallingFalse>
                {rightArrow}
              </TouchableOpacity>
              {oneQuestionsAnswered() ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.EditTopicSportsView}
                >
                  <TextScallingFalse style={styles.menuText}>
                    Teams
                  </TextScallingFalse>
                  {rightArrow}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setAlertModalVisible3(true)}
                  activeOpacity={0.7}
                  style={styles.EditTopicSportsView}
                >
                  <TextScallingFalse
                    style={[styles.menuText, { color: "grey" }]}
                  >
                    Teams
                  </TextScallingFalse>
                  {rightArrow}
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 10,
              }}
            >
              {oneQuestionsAnswered() ? (
                <TouchableOpacity
                  onPress={() =>
                    selectedSport && openAlertModal2(selectedSport)
                  }
                  activeOpacity={0.7}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    padding: 30,
                  }}
                >
                  <TextScallingFalse
                    style={{ color: "grey", fontSize: 13, fontWeight: "400" }}
                  >
                    Delete overview
                  </TextScallingFalse>
                </TouchableOpacity>
              ) : null}
            </View>
          </PageThemeView>
        </Modal>

        {/* sports Key Details page */}
        <Modal
          visible={isModalVisible3}
          transparent={true}
          onRequestClose={closeModal3}
        >
          <PageThemeView>
            <View style={styles.headerView}>
              <View style={styles.flexRowView}>
                <TouchableOpacity activeOpacity={0.7} onPress={closeModal3}>
                  {backarrow}
                </TouchableOpacity>
                <TextScallingFalse style={styles.headerText}>
                  {selectedSport ? selectedSport.name : ""}
                </TextScallingFalse>
              </View>
              {oneQuestionsAnswered() ? (
                <TouchableOpacity
                  onPress={() => {
                    setSportModalVisible(true);
                    setSelectedSports((prev) =>
                      prev.some((s) => s.name === selectedSport?.name)
                        ? prev
                        : [...prev, selectedSport]
                    );
                    setTimeout(() => {
                      setModalVisible3(false);
                    }, 1000);
                  }}
                  style={{ paddingRight: 10 }}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="done" size={28} color="#12956B" />
                </TouchableOpacity>
              ) : (
                <View style={{ paddingRight: 10 }}>
                  <MaterialIcons name="done" size={28} color={"#353535"} />
                </View>
              )}
            </View>
            <View style={{ width: "100%", padding: 20 }}>
              <TextScallingFalse
                style={{ color: "grey", fontSize: 20, fontWeight: "500" }}
              >
                Key Details:
              </TextScallingFalse>
            </View>

            <View style={{ width: "100%", paddingHorizontal: 20, gap: 1 }}>
              {selectedSport?.defaultProperties?.map(
                (
                  options: {
                    name: string;
                    enumValues: Array<string>;
                  },
                  index: any
                ) => (
                  <View key={index} style={styles.EditTopicSportsView}>
                    <TextScallingFalse style={styles.KeymenuText}>
                      {options.name} -
                    </TextScallingFalse>
                    <TouchableOpacity
                      onPress={() =>
                        toggleDropdown1(options.name, options.enumValues)
                      }
                      activeOpacity={0.5}
                      style={styles.flexRowView}
                    >
                      <TextScallingFalse style={styles.selectButton}>
                        {"Select"}
                      </TextScallingFalse>
                      {downArrow}
                    </TouchableOpacity>
                  </View>
                )
              )}
            </View>
          </PageThemeView>
        </Modal>

        {/* Option menu for each questions according to every sports */}
        <Modal visible={showDropdown1} transparent animationType="fade">
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              flex: 1,
              marginTop: 175 * scaleFactor,
              marginLeft: 135 * scaleFactor,
            }}
            onPress={() => setShowDropdown1(false)}
          >
            <View style={styles.modalContent}>
              {selectedQuestion.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.option}
                  onPress={() =>
                    handleOptionSelect1(selectedQuestion.question, option)
                  }
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

        {/* Alert Modal designed as pr FTU */}
        <Modal visible={isAlertModalVisible} transparent animationType="fade">
          <View style={styles.AlertModalView}>
            <View style={styles.AlertModalContainer}>
              <TextScallingFalse style={styles.AlertModalHeader}>
                Complete Key Details
              </TextScallingFalse>
              <TextScallingFalse style={styles.ModalContentText}>
                Filling your Key Details can give your account more reach and
                improve clarity
              </TextScallingFalse>
              <View style={styles.ModalButtonsView}>
                {oneQuestionsAnswered() ? (
                  <TouchableOpacity
                    onPress={() => setAlertModalVisible(false)}
                    style={styles.LeftButton}
                  >
                    <TextScallingFalse style={styles.AlertModalButtonsText}>
                      No thanks
                    </TextScallingFalse>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setAlertModalVisible(false);
                      setSportModalVisible(false);
                    }}
                    style={styles.LeftButton}
                  >
                    <TextScallingFalse style={styles.AlertModalButtonsText}>
                      No thanks
                    </TextScallingFalse>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    selectedSport && openModal3(selectedSport);
                    setAlertModalVisible(false);
                  }}
                  style={styles.RightButton}
                >
                  <TextScallingFalse style={styles.AlertModalButtonsText}>
                    Okay
                  </TextScallingFalse>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Alert Modal designed as pr FTU */}
        <Modal visible={isAlertModalVisible2} transparent animationType="fade">
          <View style={styles.AlertModalView}>
            <View style={styles.AlertModalContainer}>
              <TextScallingFalse style={styles.AlertModalHeader}>
                Delete overview
              </TextScallingFalse>
              <TextScallingFalse style={styles.ModalContentText}>
                Are you sure you want to delete your{" "}
                {selectedSport ? selectedSport.name2 : ""} overview ?
              </TextScallingFalse>
              <View style={styles.ModalButtonsView}>
                <TouchableOpacity
                  onPress={() => setAlertModalVisible2(false)}
                  style={styles.LeftButton}
                >
                  <TextScallingFalse style={styles.AlertModalButtonsText}>
                    No thanks
                  </TextScallingFalse>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    selectedSport && unselectSport(selectedSport);
                    setAlertModalVisible2(false);
                  }}
                  style={styles.RightButton}
                >
                  <TextScallingFalse
                    style={[styles.AlertModalButtonsText, { color: "red" }]}
                  >
                    Delete
                  </TextScallingFalse>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Alert Modal designed as pr FTU */}
        <Modal visible={isAlertModalVisible3} transparent animationType="fade">
          <View style={styles.AlertModalView}>
            <View style={styles.AlertModalContainer}>
              <TextScallingFalse style={styles.AlertModalHeader}>
                Team requires Key Details
              </TextScallingFalse>
              <TextScallingFalse style={styles.ModalContentText}>
                For creating or joing any team the user must fill their selected
                sports key details
              </TextScallingFalse>
              <View
                style={[
                  styles.ModalButtonsView,
                  { justifyContent: "center", alignItems: "center" },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setAlertModalVisible3(false)}
                  style={[
                    styles.LeftButton,
                    { borderColor: "white", height: 50, width: "100%" },
                  ]}
                >
                  <TextScallingFalse style={styles.AlertModalButtonsText}>
                    Okay
                  </TextScallingFalse>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </PageThemeView>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  headerView: {
    width: "100%",
    height: 65,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "500",
    color: "white",
    paddingLeft: 25,
  },
  menuText: {
    color: "white",
    fontSize: 18,
    fontWeight: "400",
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
  doneButton: {
    color: "white",
    fontSize: 17,
    fontWeight: "400",
  },
  EditTopicsView: {
    borderWidth: 0.4,
    borderTopColor: "#353535",
    borderBottomColor: "#353535",
    width: "100%",
    height: 55,
    alignItems: "center",
    justifyContent: "space-between",
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
    width: "80%",
    height: 200,
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
  },
  AlertModalHeader: {
    color: "black",
    fontSize: 17,
    fontWeight: "500",
    alignSelf: "center",
    paddingTop: 40,
  },
  ModalContentText: {
    width: "100%",
    padding: 20,
    textAlign: "center",
    color: "black",
    fontWeight: "400",
  },
  ModalButtonsView: {
    flexDirection: "row",
    borderTopColor: "grey",
    borderTopWidth: 0.3,
    width: "100%",
  },
  LeftButton: {
    borderRightWidth: 0.3,
    borderRightColor: "grey",
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  RightButton: {
    borderRightWidth: 0.3,
    borderRightColor: "grey",
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
  },
  AlertModalButtonsText: {
    color: "grey",
    fontSize: 14,
    fontWeight: "600",
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
  option: {
    paddingVertical: 10,
  },
  loader: {
    marginVertical: 20,
  },
});
