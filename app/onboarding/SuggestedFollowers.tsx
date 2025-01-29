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
import { router, useLocalSearchParams, Redirect } from "expo-router";
import TextScallingFalse from "@/components/CentralText";
import Logo from "@/components/logo";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxStore";
import { useDispatch } from "react-redux";
import { fetchUserSuggestions } from "~/reduxStore/slices/user/onboardingSlice";
import { AppDispatch } from "@/reduxStore";
import { onboardingUser } from "~/reduxStore/slices/user/onboardingSlice";
import Toast from "react-native-toast-message";

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
  // const selectedFile = params?.selectedFile;
  // var profileImage = useSelector(
  //   (state: RootState) => state.onboarding.profileImage
  // );
  const dispatch = useDispatch<AppDispatch>();
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  const { fetchedUsers, headline, profilePic, selectedSports, loading, error } =
    useSelector((state: RootState) => state.onboarding);

  React.useEffect(() => {
    console.log(selectedSports);
    dispatch(fetchUserSuggestions(selectedSports));
    console.log("Dispatch completed...");
  }, [dispatch]);

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
    // console.log("Selected Players:", selectedPlayers);
    // console.log("Selected File:", selectedFile);
    console.log("Selected Sports:", selectedSports);
    // console.log("Profile Image:", profileImage);
    // console.log("Headline:", headline);

    const onboardingData = {
      headline: headline,
      assets: profilePic?.fullFileObject,
      followings: selectedPlayers,
    };

    try {
      // Dispatch the onboardingUser action and wait for the result using unwrap

      console.log("Data to be submitted : ", onboardingData);

      const finalOnboardingData = new FormData();
      finalOnboardingData.append("headline", onboardingData.headline);
      finalOnboardingData.append("assets", onboardingData.assets);
      finalOnboardingData.append("followings", onboardingData.followings);

      const response = await dispatch(onboardingUser(onboardingData)).unwrap();

      // Alert the successful response
      Toast.show({
        type: "success",
        text1: "Successfully Updated Profile",
      });
      router.push("/(app)/(tabs)/home");
    } catch (error: unknown) {
      console.log(error);
      if (error && typeof error === "object" && "message" in error) {
        Toast.show({
          type: "error",
          text1: (error as { message: string }).message,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "An unknown error occurred",
        });
      }
    }
  };

  const handleSkip = async () => {
    const onboardingData = {
      headline: headline,
      assets: [profilePic],
      followings: selectedPlayers,
    };

    try {
      // Dispatch the onboardingUser action and wait for the result using unwrap
      const response = await dispatch(onboardingUser(onboardingData)).unwrap();

      // Alert the successful response
      Toast.show({
        type: "success",
        text1: "Successfully Updated Profile",
      });
      router.push("/(app)/(tabs)/home");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "message" in error) {
        Toast.show({
          type: "error",
          text1: (error as { message: string }).message,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "An unknown error occurred",
        });
      }
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "black" }}
      className="py-12"
    >
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
            {fetchedUsers.map((user) => (
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
          onPress={selectedPlayers.length > 0 ? handleContinue : handleSkip}
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
      <Toast />
    </SafeAreaView>
  );
};

export default SuggestedSupportScreen;
