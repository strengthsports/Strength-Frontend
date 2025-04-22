import React, { useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Animated, Easing } from "react-native";
import { useFonts } from "expo-font";
import { useSelector } from "react-redux";
import Supporters from "~/components/SvgIcons/teams/Supporters";
import CustomButton from "~/constants/CustomButton";
import Members from "~/components/SvgIcons/teams/Members";
import EstabilishedOn from "~/components/SvgIcons/teams/EstabilishedOn";
import TeamId from "~/components/SvgIcons/teams/TeamId";
import CopyCode from "./CopyCode";
import TextScallingFalse from "../CentralText";

interface AboutProps {
  teamDetails: any;
}

const About: React.FC<AboutProps> = ({ teamDetails }) => {
  const [supportersCount, setSupportersCount] = useState(4123);
  const [isSupporting, setIsSupporting] = useState(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const handleButtonPress = () => {
    setIsSupporting((prevIsSupporting) => {
      const newIsSupporting = !prevIsSupporting;
      setSupportersCount((prevCount) =>
        prevIsSupporting ? prevCount - 1 : prevCount + 1
      );
      return newIsSupporting;
    });
  };

  const handleEstablished = () => {
    const date = new Date(teamDetails?.establishedOn);
    const formattedDate = date.toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });
    return formattedDate; 
  };

  const handleTeamUniqueId = () => {
    const name = teamDetails?.name || ""; 
    const id = teamDetails?._id || ""; 
    const firstTwoLetters = name.substring(0, 2).toUpperCase(); 
    const lastFourDigits = id.slice(-4).toUpperCase(); 
    return `${firstTwoLetters}${lastFourDigits}`;
  };

  const handleCopySuccess = () => {
    setShowCopiedMessage(true);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start(() => setShowCopiedMessage(false));
  };

  return (
    <ScrollView className="pb-[500px]">
      {/* Copied Message Animation */}
      {showCopiedMessage && (
        <Animated.View 
          className="absolute top-20 left-0 right-0 items-center z-50"
          style={{ opacity: fadeAnim }}
        >
          <View className="bg-green-500 px-6 py-3 rounded-full">
            <Text className="text-white font-bold">Copied to clipboard!</Text>
          </View>
        </Animated.View>
      )}

      <View className="p-4 ml-1 bg-black rounded-lg">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center">
            <Supporters />
            <Text className="text-white text-3xl ml-1 font-bold">
              {supportersCount}
            </Text>
            <Text className="text-gray-500 text-4xl font-semibold ml-1">
              Supporters
            </Text>
          </View>
          <CustomButton
            buttonName={isSupporting ? "✓ Supporting" : "+ Support"}
            onPress={handleButtonPress}
          />
        </View>

        <TextScallingFalse className="text-white pt-8 text-5xl font-bold mb-2">
          Description
        </TextScallingFalse>
        <TextScallingFalse className="text-white text-xl mr-3">
          {teamDetails?.description}
        </TextScallingFalse>
      </View>

      <View className="p-2 ml-3  flex flex-row items-center">
        <Members />
        <Text className="text-white text-4xl ml-1">Members - {teamDetails?.members?.length || 0}</Text>
      </View>

      <View className="p-2 ml-3 flex flex-row items-center">
        <EstabilishedOn />
        <Text className="text-white text-4xl ml-2">
          Established On - {handleEstablished()}
        </Text>
      </View>

      <View className="p-2 ml-3  flex flex-row items-center">
        <TeamId />
       
        <CopyCode code={handleTeamUniqueId()} onCopy={handleCopySuccess} />
      </View>
    </ScrollView>
  );
};

export default About;