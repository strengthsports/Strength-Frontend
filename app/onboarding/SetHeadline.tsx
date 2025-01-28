import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import Logo from "@/components/logo";
import TextScallingFalse from "@/components/CentralText";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/reduxStore";
import { setHeadline } from "~/reduxStore/slices/user/onboardingSlice";
import Toast from "react-native-toast-message";

// const { height } = Dimensions.get("window");
// const firstName = "Utsav";
// const secondName = "Tiwari";
const defaultImage = require("../../assets/images/onboarding/nopic.jpg");

const SetHeadline: React.FC = () => {
  const [currentHeadline, setCurrentHeadline] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useLocalSearchParams();

  const { profilePic } = useSelector((state: RootState) => state?.onboarding);

  const { loading, error, user } = useSelector(
    (state: RootState) => state?.auth
  );
  console.log("Loading", loading);
  console.log("Error", error);
  console.log("User", user);

  console.log("profilePicture" + profilePic?.newUri);
  // const selectedFile = params?.selectedFile;
  // Use profile image if provided, else use default
  const profileImageSource = profilePic
    ? {
        uri: profilePic.newUri,
      }
    : defaultImage;

  function handleNextPress() {
    if (!currentHeadline) {
      Toast.show({
        type: "error",
        text1: "Please enter your headline.",
      });
      return;
    }
    dispatch(setHeadline(currentHeadline));
    // console.log(headline);
    router.push({
      pathname: "/onboarding/SuggestedFollowers",
      // params: { selectedFile },
    });
  }

  function handleSkipPress() {
    router.push({
      pathname: "/onboarding/SuggestedFollowers",
    });
    console.log("Skip");
  }

  return (
    <SafeAreaView className="flex-1 bg-black py-12">
      <Logo />
      <StatusBar barStyle="light-content" />
      <TouchableWithoutFeedback>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-3 mt-6">
            <View className="flex-1">
              <TextScallingFalse className="text-white text-[2.9rem] font-semibold leading-tight">
                Let's get you{"\n"}started!
              </TextScallingFalse>
              <TextScallingFalse className="text-gray-500 text-base mt-4">
                Step 2 of 3
              </TextScallingFalse>
              <TextScallingFalse className="text-white text-[24px] font-semibold mt-2.5">
                Set your sports Headline
              </TextScallingFalse>
              <TextScallingFalse className="text-[#A5A5A5] text-base mt-2">
                Let others know your position, you can always change it later.
              </TextScallingFalse>

              <TextScallingFalse className="text-white text-lg mt-4 mb-2">
                Headline
              </TextScallingFalse>
              <TextInput
                className="border border-white rounded-md text-white h-12 px-4 text-lg"
                placeholderTextColor="#666"
                placeholder="Enter your headline"
                value={currentHeadline}
                onChangeText={setCurrentHeadline}
              />

              <TextScallingFalse className="text-gray-500 text-base mt-6">
                Example:
              </TextScallingFalse>
              <View className="flex-row mt-4">
                <View className="items-center flex-1">
                  <Image
                    source={profileImageSource}
                    className="w-40 h-40 rounded-full"
                    resizeMode="cover"
                  />

                  <TextScallingFalse className="text-white text-[1.3rem] mt-2">
                    {user?.firstName || "Firstname"}{" "}
                    {user?.lastName || "Lastname"}
                  </TextScallingFalse>
                  <TextScallingFalse className="text-gray-500 text-[1rem] text-center mt-1 leading-5">
                    Cricketer-Right hand batsman,{"\n"}Ranji Trophy player
                  </TextScallingFalse>
                </View>
              </View>
            </View>

            {/* Footer Section */}
            <View className="mb-0 py-2">
              <TouchableOpacity
                className="bg-[#00A67E] h-12 rounded-full justify-center items-center"
                onPress={handleNextPress}
              >
                <TextScallingFalse className="text-white text-lg font-medium">
                  Next
                </TextScallingFalse>
              </TouchableOpacity>
              <TouchableOpacity
                className="mt-4 items-center"
                onPress={handleSkipPress}
              >
                <TextScallingFalse className="text-gray-500 text-base">
                  Skip for now
                </TextScallingFalse>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
      <Toast />
    </SafeAreaView>
  );
};

export default SetHeadline;
