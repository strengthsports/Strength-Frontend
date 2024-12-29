import React from "react";
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
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import Logo from "@/components/logo";
import TextScallingFalse from "@/components/CentralText";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSportsData,
  setSelectedSports,
} from "@/reduxStore/slices/profileSlice";
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

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { sportsData, loading, error } = useSelector(
    (state: RootState) => state.profile,
  );

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

  // Filter sports data based on search query
  const filteredSports = sportsData.filter((sport: Sport) =>
    sport.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <View style={{ flex: 1 }}>
        <View className="px-6 mt-8">
          <Logo />
          <StatusBar barStyle="light-content" />
        </View>

        <ScrollView
          className="flex-1 px-6 mt-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: keyboardVisible ? 20 : 100,
          }}
        >
          <TextScallingFalse className="text-white text-4xl font-bold mt-8 mb-10 leading-tight">
            Ready to dive in?{"\n"}Fantastic!
          </TextScallingFalse>

          <TextScallingFalse className="text-white text-2xl font-bold mb-3">
            What's your sport of choice?
          </TextScallingFalse>

          <TextScallingFalse className="text-gray-400 text-lg mb-8">
            Let us know your athletic passion as you sign up!
          </TextScallingFalse>

          <View className="flex-row items-center rounded-[2rem] px-5 mb-8 h-14 border border-white">
            <Icon name="search" size={32} color="#fff" />
            <TextInput
              className="flex-1 text-white h-[50px]"
              placeholder="Search...."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

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
                width: "100%",
                alignItems: "center",
              }}
            >
              {filteredSports.map((sport: Sport) => (
                <TouchableOpacity
                  key={sport._id}
                  style={{ margin: 4 }}
                  onPress={() => toggleSport(sport._id)}
                >
                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={{
                        height: 40,
                        width: width * 0.27,
                        borderWidth: 0.5,
                        borderColor: localSelectedSports.has(sport._id)
                          ? "#12956B"
                          : "white",
                        borderRadius: 8,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        backgroundColor: localSelectedSports.has(sport._id)
                          ? "#12956B"
                          : "black",
                        paddingHorizontal: 10,
                      }}
                    >
                      <Image
                        source={sport.logo ? { uri: sport.logo } : defaultImage}
                        style={{
                          width: width * 0.04,
                          height: width * 0.04,
                          marginRight: "6.5%",
                        }}
                      />
                      <TextScallingFalse
                        style={{
                          color: "white",
                          fontSize: width * 0.035,
                          fontWeight: localSelectedSports.has(sport._id)
                            ? "600"
                            : "400",
                        }}
                        allowFontScaling={false}
                      >
                        {sport.name}
                      </TextScallingFalse>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
              <Text className="text-gray-300 text-base">
                You can always select more than 1
              </Text>
              <TouchableOpacity
                activeOpacity={0.5}
                className={`px-8 py-4 rounded-3xl ${
                  localSelectedSports.size > 0 ? "bg-[#00A67E]" : "bg-[#333]"
                }`}
                onPress={handleNextClick}
                disabled={localSelectedSports.size === 0}
              >
                <Text className="text-white text-lg font-medium">Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SportsChoice;
