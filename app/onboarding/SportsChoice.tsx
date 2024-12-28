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
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import Logo from "@/components/logo";
import TextScallingFalse from "@/components/CentralText";

const { width } = Dimensions.get("window");
import { getToken } from "@/utils/secureStore";

interface sportsData {
  _id: string; // Updated from 'id' to '_id'
  name: string;
  logo: string;
  icon: any;
}
const defaultImage = require("../../assets/images/onboarding/sportsIcon/okcricket.png");

const SportsChoice: React.FC = () => {
  const [selectedSports, setSelectedSports] = React.useState<Set<string>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = React.useState("");
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);
  const [token, setToken] = React.useState<string | null>(null);
  const [sportsData, setSportsData] = React.useState<sportsData[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    const fetchToken = async () => {
      try {
        const tokenValue = await getToken("accessToken");
        setToken(tokenValue);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };
    fetchToken();
  }, []);

  React.useEffect(() => {
    if (token) {
      // Make the API call only after the token is available
      fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/fetch-allSports`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
          setSportsData(data.data); // Assuming the API returns data with 'data' field
        })
        .catch((error) => console.error("Error fetching sports:", error));
    }
  }, [token]);

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

  const toggleSport = (_id: string) => {
    const newSelected = new Set(selectedSports);
    if (newSelected.has(_id)) {
      newSelected.delete(_id);
    } else {
      newSelected.add(_id);
    }
    setSelectedSports(newSelected);
  };

  const handleNextClick = () => {
    const selectedArray = Array.from(selectedSports)
      .map((_id) => sportsData.find((sport) => sport._id === _id)?._id)
      .filter((name): name is string => name !== undefined);

    console.log(selectedArray);
    router.push({
      pathname: "/onboarding/SetProfile",
      params: { selectedSports: selectedArray },
    });
  };

  const filteredSports = sportsData.filter((sport) =>
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
            paddingBottom: keyboardVisible ? 20 : 100, // Adjust padding when keyboard is visible
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

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              width: "100%",
              alignItems: "center",
            }}
          >
            {filteredSports.map((sport) => (
              <TouchableOpacity
                key={sport._id} // Updated to use '_id'
                style={{ margin: 4 }}
                onPress={() => toggleSport(sport._id)} // Updated to use '_id'
              >
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      height: 40,
                      width: width * 0.27,
                      borderWidth: 0.5,
                      borderColor: selectedSports.has(sport._id) // Updated to use '_id'
                        ? "#12956B"
                        : "white",
                      borderRadius: 8,
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      backgroundColor: selectedSports.has(sport._id) // Updated to use '_id'
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
                        fontWeight: selectedSports.has(sport._id) // Updated to use '_id'
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
              <TextScallingFalse className="text-gray-300 text-base">
                You can always select more than 1
              </TextScallingFalse>
              <TouchableOpacity
                activeOpacity={0.5}
                className={`px-8 py-4 rounded-3xl ${
                  selectedSports.size > 0 ? "bg-[#00A67E]" : "bg-[#333]"
                }`}
                onPress={handleNextClick}
                disabled={selectedSports.size === 0}
              >
                <TextScallingFalse className="text-white text-lg font-medium">
                  Next
                </TextScallingFalse>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SportsChoice;
