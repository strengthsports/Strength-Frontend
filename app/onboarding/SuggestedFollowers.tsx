import NavigationLogo from "@/components/onboarding/Logo";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ImageSourcePropType,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

interface SportIcon {
  id: string;
  source: ImageSourcePropType;
  title: string;
  description: string;
}

interface SupportCardProps {
  icon: SportIcon;
  isSelected: boolean;
  onClose: (id: string) => void;
  onSupport: (id: string) => void;
}

const SupportCard: React.FC<SupportCardProps> = ({
  icon,
  isSelected,
  onClose,
  onSupport,
}) => (
  <View className="rounded-xl p-4 m-1 w-[180px] relative border border-[#464646]">
    <TouchableOpacity
      className="absolute right-2 top-2 z-10"
      onPress={() => onClose(icon.id)}
    >
      <Text className="text-gray-400 text-lg">×</Text>
    </TouchableOpacity>

    <View className="items-center space-y-2">
      <View className="bg-white rounded-full w-16 h-16 items-center justify-center">
        <Image
          source={icon.source}
          className="w-10 h-10"
          resizeMode="contain"
        />
      </View>

      <Text className="text-white text-lg font-semibold">{icon.title}</Text>

      <Text className="text-gray-400 text-sm text-center">
        {icon.description}
      </Text>

      <TouchableOpacity
        className={`mt-4 border rounded-full px-6 py-2 ${
          isSelected ? "bg-[#12956B]" : "border-[#12956B]"
        }`}
        onPress={() => onSupport(icon.id)}
      >
        <Text
          className={`text-center ${
            isSelected ? "text-white" : "text-[#12956B]"
          }`}
        >
          {isSelected ? "Unfollow" : "Follow"}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

interface SuggestedSupportScreenProps {
  onSkip?: () => void;
  onSupportSelected?: (id: string) => void;
}

const SuggestedSupportScreen: React.FC<SuggestedSupportScreenProps> = ({
  onSkip,
  onSupportSelected,
}) => {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const headline = params?.headline;
  const selectedSports = params?.selectedSports;
  const profileImage = params?.profileImage;

  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  const sportIcons: SportIcon[] = [
    {
      id: "1",
      source: require("../../assets/images/onboarding/logo2.png"),
      title: "MI",
      description: "Step into the world of sports",
    },
    {
      id: "2",
      source: require("../../assets/images/onboarding/logo2.png"),
      title: "CSK",
      description: "Step into the world of sports",
    },
    {
      id: "3",
      source: require("../../assets/images/onboarding/logo2.png"),
      title: "RCB",
      description: "Step into the world of sports",
    },
    {
      id: "4",
      source: require("../../assets/images/onboarding/logo2.png"),
      title: "KKR",
      description: "Step into the world of sports",
    },
    {
      id: "5",
      source: require("../../assets/images/onboarding/logo2.png"),
      title: "RR",
      description: "Step into the world of sports",
    },
    {
      id: "6",
      source: require("../../assets/images/onboarding/logo2.png"),
      title: "PBKS",
      description: "Step into the world of sports",
    },
  ];

  const handleClose = (id: string) => {
    setSelectedPlayers((prev) => prev.filter((player) => player !== id));
  };

  const handleSupport = (id: string) => {
    if (selectedPlayers.includes(id)) {
      setSelectedPlayers((prev) => prev.filter((player) => player !== id));
    } else {
      setSelectedPlayers((prev) => [...prev, id]);
    }
    onSupportSelected?.(id);
  };

  const handleContinue = () => {
    console.log("Selected players:", selectedPlayers);
    console.log("Headline:", headline);
    console.log("Selected sports:", selectedSports);
    console.log("Profile image:", profileImage);
    alert("Data submitted successfully!");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <NavigationLogo />
      <StatusBar barStyle="light-content" />

      <View style={{ paddingTop: insets.top }} className="px-4 py-6 flex-1">
        <View className="mb-6">
          <Text className="text-gray-500 text-base">Step 3 of 3</Text>
          <Text className="text-white text-3xl font-bold mt-1">
            Suggested supports
          </Text>
          <Text className="text-gray-400 text-base mt-2">
            Supporting others lets you see updates and keep in touch.
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 20, // To ensure there's space when scrolling
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row flex-wrap justify-center">
            {sportIcons.map((icon) => (
              <SupportCard
                key={icon.id}
                icon={icon}
                isSelected={selectedPlayers.includes(icon.id)}
                onClose={handleClose}
                onSupport={handleSupport}
              />
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity
          className={`py-2 mt-4 mx-4 rounded-full  ${
            selectedPlayers.length > 0 ? "bg-[#12956B]" : "bg-transparent"
          }`}
          style={{
            alignSelf: "center", // Center the button horizontally
            width: "100%", // Full width of its parent container
            maxWidth: 120, // Limit the maximum width of the button
            height:36,
          }}
          onPress={selectedPlayers.length > 0 ? handleContinue : onSkip}
        >
          <Text
            className={`${
              selectedPlayers.length > 0 ? "text-white" : "text-gray-400"
            } text-center`}
          >
            {selectedPlayers.length > 0 ? "Continue" : "Skip for now"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SuggestedSupportScreen;
