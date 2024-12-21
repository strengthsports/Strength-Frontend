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
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";
import NavigationLogo from "@/components/onboarding/Logo";

const { height } = Dimensions.get("window");
const firstName = "Utsav";
const secondName = "Tiwari";
const img = require("../../assets/images/onboarding/nopic.jpg");

const SetHeadline: React.FC = () => {
  const [headline, setHeadline] = useState("");
  const router = useRouter();

  function handleNextPress() {
    if (!headline) {
      alert("Please enter a headline.");
      return;
    }
    console.log(headline);
    router.push({
      pathname: "/onboarding/SportsChoice",
      params: { headline },
    });
  }

  function handleSkipPress() {
    console.log("Skip");
  }

  return (
    <SafeAreaView className="flex-1 bg-black p-4">
      <StatusBar barStyle="light-content" />
      <TouchableWithoutFeedback>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 px-3">
              <NavigationLogo />
              <View className="flex-1 mt-6">
                <Text className="text-white text-4xl font-semibold leading-tight">
                  Let's get you{"\n"}started!
                </Text>
                <Text className="text-gray-500 text-base mt-4">Step 2 of 3</Text>
                <Text className="text-white text-[1.6rem] font-semibold mt-2.5">
                  Set your sports Headline
                </Text>
                <Text className="text-gray-500 text-base mt-2">
                  Let others know your position, you can always change it later.
                </Text>

                <Text className="text-white text-lg mt-4 mb-2">Headline</Text>
                <TextInput
                  className="border border-white rounded-md text-white h-12 px-4 text-lg"
                  placeholderTextColor="#666"
                  placeholder="Enter your headline"
                  value={headline}
                  onChangeText={setHeadline}
                />

                <Text className="text-gray-500 text-base mt-6">Example:</Text>
                <View className="flex-row mt-4">
                  <View className="items-center flex-1">
                    <Image source={img} className="w-40 h-40 rounded-full" />
                    <Text className="text-white text-[1.3rem] mt-2">
                      {firstName} {secondName}
                    </Text>
                    <Text className="text-gray-500 text-[1rem] text-center mt-1 leading-5">
                      Cricketer-Right hand batsman,{"\n"}Ranji Trophy player
                    </Text>
                  </View>
                </View>
              </View>

              {/* Footer Section */}
              <View className="mb-4">
                <TouchableOpacity
                  className="bg-[#00A67E] h-12 rounded-full justify-center items-center"
                  onPress={handleNextPress}
                >
                  <Text className="text-white text-lg font-medium">Next</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="mt-4 items-center"
                  onPress={handleSkipPress}
                >
                  <Text className="text-gray-500 text-base">Skip for now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default SetHeadline;
