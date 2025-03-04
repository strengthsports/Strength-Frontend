import React, { useEffect } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
  Keyboard,
  Text,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import Logo from "@/components/logo";
import TextScallingFalse from "@/components/CentralText";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSportsData,
  resetOnboardingData,
  setSelectedSports,
} from "~/reduxStore/slices/user/onboardingSlice";
import { RootState } from "@/reduxStore";
import { AppDispatch } from "@/reduxStore";

// Define the type of sport that includes a 'logo' property
interface Sport {
  _id: string;
  name: string;
  logo?: string; // 'logo' is optional as it may not be available for every sport
}

const { width } = Dimensions.get("window");

// Default image for sports that don't have a logo
const defaultImage = require("../../assets/images/onboarding/sportsIcon/okcricket.png");


const SportsChoice: React.FC = () => {
  const [localSelectedSports, setLocalSelectedSports] = React.useState<
    Set<string>
  >(new Set());
  const [searchQuery, setSearchQuery] = React.useState("");
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);
  const [numberOfSports, setNumberOfSports] = React.useState(1);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { sportsData, loading, error } = useSelector(
    (state: RootState) => state.onboarding,
  );
  const handleSkipClick = () => {
    router.push({
      pathname: "/onboarding/SetProfile",
    });
  };

  // Remove previous states of onboarding on component mount
  React.useEffect(() => {
    dispatch(resetOnboardingData());
  }, [dispatch]);

  // Fetch sports data on component mount
  React.useEffect(() => {
    dispatch(fetchSportsData());
  }, [dispatch]);

  // Handle keyboard visibility
  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    if (localSelectedSports.size > 0) {
      setNumberOfSports(localSelectedSports.size);
    }
  }, [localSelectedSports]);

  // Toggle selection of sports
  const toggleSport = (_id: string) => {
    const updatedSelected = new Set(localSelectedSports);
    if (updatedSelected.has(_id)) {
      updatedSelected.delete(_id);
    } else {
      updatedSelected.add(_id);
    }
    setLocalSelectedSports(updatedSelected);
  };

  // Handle navigation and pass selected sports
  const handleNextClick = () => {
    const selectedArray = Array.from(localSelectedSports)
      .map((_id) => sportsData.find((sport: Sport) => sport._id === _id)?._id)
      .filter((id): id is string => id !== undefined);

    console.log("Selected Sports:", selectedArray);
    dispatch(setSelectedSports(selectedArray));
    router.push({
      pathname: "/onboarding/SetProfile",
    });
  };

  const handleRequestClick = () => {
    router.push({
      pathname: "/onboarding/requestSport",
    });
  };

  // Filter sports data based on search query
  // Filter and sort sports data alphabetically based on name
  const filteredSports = sportsData
    .filter((sport: Sport) =>
      sport.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  // Render each sport item
  const renderSportItem = ({ item }: { item: Sport }) => {
    const isSelected = localSelectedSports.has(item._id);

    return (
      <TouchableOpacity className="m-1" onPress={() => toggleSport(item._id)}>
        <View
          className={`rounded-lg w-[110px] h-[100px] items-center justify-center p-2 ${
            isSelected
              ? "border border-[#12956B] bg-[#12956B]" // Green background when selected
              : "border border-white/30 bg-black" // Default black background
          }`}
        >
          <Image
            source={item.logo ? { uri: item.logo } : defaultImage}
            className="w-[28px] h-[28px] mb-2"
            style={{ tintColor: isSelected ? "white" : "inherit" }}
          />
          <TextScallingFalse
            className={`text-center text-[13px] leading-[15px] mt-2 ${
              isSelected ? "text-white font-normal" : "text-white font-normal"
            }`}
            numberOfLines={2} // Ensures text wraps within two lines
            ellipsizeMode="tail" // Adds "..." if text is too long
            allowFontScaling={false}
            style={{
              flexShrink: 1, // Ensures text shrinks if needed
              width: "100%", // Ensures text doesn't overflow
              overflow: "hidden", // Prevents text from breaking out
              textAlign: "center",
            }}
          >
            {item.name}
          </TextScallingFalse>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <View style={{ flex: 1 }}>
        <View className="px-6 mt-8">
          <Logo />
          <StatusBar barStyle="light-content" />
        </View>
        <TextScallingFalse className="text-white text-[1.8rem] font-bold mb-1 px-6 mt-3">
          What's your sport of choice?
        </TextScallingFalse>

        <TextScallingFalse className="text-gray-400 text-[1rem] mb-8 px-6">
          Let us know your athletic passion as you sign up!
        </TextScallingFalse>
        <View className="px-6">
          <View className="flex-row items-center rounded-[2rem] px-5  mb-8 h-14 border border-white">
            <Icon name="search" size={32} color="#fff" />
            <TextInput
              className="flex-1 text-white h-[50px]"
              placeholder="Search...."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
        <ScrollView
          className="flex-1  mt-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: keyboardVisible ? 20 : 100,
          }}
        >
          {/* <TextScallingFalse className="text-white text-[2.5rem] font-bold mt-8 mb-10 leading-tight">
            Ready to dive in?{"\n"}Fantastic!
          </TextScallingFalse> */}

          {loading ? (
            <Text className="text-white">Loading...</Text>
          ) : error ? (
            <Text className="text-red-500">{error}</Text>
          ) : (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {filteredSports.map((item) => (
                <View
                  key={item._id}
                  style={{
                    margin: 1,
                  }}
                >
                  {renderSportItem({ item })}
                </View>
              ))}
            </View>
          )}

          <View className="flex-row justify-center items-center mt-6 flex-wrap">
            <TouchableOpacity className="">
              <Text className="text-white text-[1.2rem]">
                Don't see your sport?
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center items-center flex-wrap">
            <TouchableOpacity
              className="ml-2 mt-4"
              onPress={handleRequestClick}
            >
              <Text className="text-[#00A67E] text-[1.1rem] font-semibold">
                Request Sport
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {!keyboardVisible && (
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "black",
              paddingHorizontal: 24,
              paddingVertical: 20,
              borderTopWidth: 1,
              borderTopColor: "#333",
            }}
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-300 text-[1rem]">
                You can always select more than {numberOfSports}
              </Text>
              <TouchableOpacity
                activeOpacity={0.5}
                className={`px-8 py-4 rounded-3xl ${
                  localSelectedSports.size > 0 ? "bg-[#00A67E]" : "bg-[#333]"
                }`}
                onPress={
                  localSelectedSports.size > 0
                    ? handleNextClick
                    : handleSkipClick
                }
              >
                <Text
                  className={`text-[1rem] font-medium ${
                    localSelectedSports.size > 0 ? "text-white" : "text-black"
                  }`}
                >
                  {localSelectedSports.size > 0 ? "Next" : "Skip"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SportsChoice;
