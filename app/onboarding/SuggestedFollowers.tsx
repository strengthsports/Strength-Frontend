import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import TextScallingFalse from "@/components/CentralText";
import Logo from "@/components/logo";
import { getToken } from "@/utils/secureStore";

interface SupportCardProps {
  user: any;
  isSelected: boolean;
  onClose: (id: string) => void;
  onSupport: (id: string) => void;
}

const SupportCard: React.FC<SupportCardProps> = ({
  user,
  isSelected,
  onClose,
  onSupport,
}) => (
  <View className="rounded-xl p-4 m-1 w-[180px] relative border border-[#464646]">
    <TouchableOpacity
      className="absolute right-2 top-2 z-10"
      onPress={() => onClose(user._id)}
    >
      <TextScallingFalse className="text-gray-400 text-lg">×</TextScallingFalse>
    </TouchableOpacity>

    <View className="items-center space-y-2">
      <View className="bg-white rounded-full w-16 h-16 items-center justify-center">
        <Image
          source={{ uri: user.profilePic }}
          className="w-10 h-10"
          resizeMode="contain"
        />
      </View>

      <TextScallingFalse className="text-white text-lg font-semibold">
        {user.firstName} {user.lastName}
      </TextScallingFalse>

      <TextScallingFalse className="text-gray-400 text-sm text-center">
        {user.headline}
      </TextScallingFalse>

      <TouchableOpacity
        className={`mt-4 border rounded-full px-6 py-2 ${
          isSelected ? "bg-[#12956B]" : "border-[#12956B]"
        }`}
        onPress={() => onSupport(user._id)}
      >
        <TextScallingFalse
          className={`text-center ${
            isSelected ? "text-white" : "text-[#12956B]"
          }`}
        >
          {isSelected ? "Unfollow" : "Follow"}
        </TextScallingFalse>
      </TouchableOpacity>
    </View>
  </View>
);

const SuggestedSupportScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const headline = params?.headline;
  const selectedSports = params?.selectedSports;
  const selectedFile = params?.selectedFile;
  var profileImage = params?.profileImage;
  const [token, setToken] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [assets, setAssets] = useState<Blob | undefined>(undefined);

  useEffect(() => {
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

  useEffect(() => {
    if (token) {
      fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/user-suggestions`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUsers(data.data); // Set the fetched users data
        })
        .catch((error) => console.error("Error fetching sports:", error));
    }
  }, [token]);

  const handleClose = (id: string) => {
    setSelectedPlayers((prev) => prev.filter((player) => player !== id));
  };

  const handleSupport = (id: string) => {
    if (selectedPlayers.includes(id)) {
      setSelectedPlayers((prev) => prev.filter((player) => player !== id));
    } else {
      setSelectedPlayers((prev) => [...prev, id]);
    }
  };

  const handleContinue = async () => {
    console.log("Selected players:", selectedPlayers);

    // Handle headline
    const finalHeadline = headline === undefined ? "" : headline;

    // Handle selectedSports
    const sports = selectedSports.split(",");
    console.log(selectedFile);
    // console.log("Selected sports:", sports);
    // Handle profileImage
    const finalProfileImage = profileImage === undefined ? "" : profileImage;

    await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/onboard-user`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        headline: finalHeadline,
        assets: [selectedFile],
        sports: sports,
        followings: selectedPlayers,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black", marginTop: 28 }}>
      <Logo />
      <StatusBar barStyle="light-content" />

      <View
        style={{ paddingTop: insets.top }}
        className="px-4 py-6 flex-1 mt-6"
      >
        <View className="mb-6">
          <TextScallingFalse className="text-gray-500 text-base">
            Step 3 of 3
          </TextScallingFalse>
          <TextScallingFalse className="text-white text-3xl font-bold mt-1">
            Suggested supports
          </TextScallingFalse>
          <TextScallingFalse className="text-gray-400 text-base mt-2">
            Supporting others lets you see updates and keep in touch.
          </TextScallingFalse>
        </View>

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row flex-wrap justify-center">
            {users.map((user) => (
              <SupportCard
                key={user._id}
                user={user}
                isSelected={selectedPlayers.includes(user._id)}
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
            alignSelf: "center",
            width: "100%",
            maxWidth: 120,
            height: 36,
          }}
          onPress={selectedPlayers.length > 0 ? handleContinue : undefined}
        >
          <TextScallingFalse
            className={`${
              selectedPlayers.length > 0 ? "text-white" : "text-gray-400"
            } text-center`}
          >
            {selectedPlayers.length > 0 ? "Continue" : "Skip for now"}
          </TextScallingFalse>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SuggestedSupportScreen;
