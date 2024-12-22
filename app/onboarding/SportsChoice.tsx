import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import NavigationLogo from "@/components/onboarding/Logo";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");

interface Sport {
  id: string;
  name: string;
  icon: any;
}

const sports: Sport[] = [
  {
    id: "1",
    name: "Cricket",
    icon: require("../../assets/images/onboarding/sportsIcon/okcricket.png"),
  },
  {
    id: "2",
    name: "Football",
    icon: require("../../assets/images/onboarding/sportsIcon/okfootball.png"),
  },
  {
    id: "3",
    name: "Basketball",
    icon: require("../../assets/images/onboarding/sportsIcon/okbasketball.png"),
  },
  {
    id: "4",
    name: "Badminton",
    icon: require("../../assets/images/onboarding/sportsIcon/okbadminton.png"),
  },
  {
    id: "5",
    name: "Table Tennis",
    icon: require("../../assets/images/onboarding/sportsIcon/oktabletenis.png"),
  },
  {
    id: "6",
    name: "Tennis",
    icon: require("../../assets/images/onboarding/sportsIcon/oktenis.png"),
  },
  {
    id: "7",
    name: "Volleyball",
    icon: require("../../assets/images/onboarding/sportsIcon/okvollyball.png"),
  },
  {
    id: "8",
    name: "Kabaddi",
    icon: require("../../assets/images/onboarding/sportsIcon/okkabaddi.png"),
  },
  {
    id: "9",
    name: "Hockey",
    icon: require("../../assets/images/onboarding/sportsIcon/okhockey.png"),
  },
  {
    id: "10",
    name: "Racing",
    icon: require("../../assets/images/onboarding/sportsIcon/check.png"),
  },
  {
    id: "11",
    name: "Ice Hockey",
    icon: require("../../assets/images/onboarding/sportsIcon/okicehockey.png"),
  },
  {
    id: "12",
    name: "Cyclist",
    icon: require("../../assets/images/onboarding/sportsIcon/cycle.png"),
  },
];

const SportsChoice: React.FC = () => {
  const [selectedSports, setSelectedSports] = React.useState<Set<string>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = React.useState("");
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);
  const router = useRouter();

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

  const toggleSport = (sportId: string) => {
    const newSelected = new Set(selectedSports);
    if (newSelected.has(sportId)) {
      newSelected.delete(sportId);
    } else {
      newSelected.add(sportId);
    }
    setSelectedSports(newSelected);
  };

  const handleNextClick = () => {
    const selectedArray = Array.from(selectedSports)
      .map((sportId) => sports.find((sport) => sport.id === sportId)?.name)
      .filter((name): name is string => name !== undefined);

    console.log(selectedArray);
    router.push({
      pathname: "/onboarding/SetProfile",
      params: { selectedSports: selectedArray },
    });
  };

  const filteredSports = sports.filter((sport) =>
    sport.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <View style={{ flex: 1 }}>
        <View className="px-6">
          <NavigationLogo />
          <StatusBar barStyle="light-content" />
        </View>

        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: keyboardVisible ? 20 : 100, // Adjust padding when keyboard is visible
          }}
        >
          <Text className="text-white text-4xl font-bold mt-8 mb-10 leading-tight">
            Ready to dive in?{"\n"}Fantastic!
          </Text>

          <Text className="text-white text-2xl font-bold mb-3">
            What's your sport of choice?
          </Text>

          <Text className="text-gray-400 text-lg mb-8">
            Let us know your athletic passion as you sign up!
          </Text>

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
                key={sport.id}
                style={{ margin: 4 }}
                onPress={() => toggleSport(sport.id)}
              >
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      height: 40,
                      width: width * 0.27,
                      borderWidth: 0.5,
                      borderColor: selectedSports.has(sport.id)
                        ? "#12956B"
                        : "white",
                      borderRadius: 8,
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      backgroundColor: selectedSports.has(sport.id)
                        ? "#12956B"
                        : "black",
                      paddingHorizontal: 10,
                    }}
                  >
                    <Image
                      source={sport.icon}
                      style={{
                        width: width * 0.04,
                        height: width * 0.04,
                        marginRight: "6.5%",
                      }}
                    />
                    <Text
                      style={{
                        color: "white",
                        fontSize: width * 0.035,
                        fontWeight: selectedSports.has(sport.id)
                          ? "600"
                          : "400",
                      }}
                      allowFontScaling={false}
                    >
                      {sport.name}
                    </Text>
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
              <Text className="text-gray-300 text-base">
                You can always select more than 1
              </Text>
              <TouchableOpacity
                className={`px-8 py-4 rounded-3xl ${
                  selectedSports.size > 0 ? "bg-[#00A67E]" : "bg-[#333]"
                }`}
                onPress={handleNextClick}
                disabled={selectedSports.size === 0}
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
