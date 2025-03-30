import React, { useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useFonts } from "expo-font";
import { useSelector } from "react-redux";
import Supporters from "~/components/SvgIcons/teams/Supporters";
import CustomButton from "~/constants/CustomButton";
import Members from "~/components/SvgIcons/teams/Members";
import EstabilishedOn from "~/components/SvgIcons/teams/EstabilishedOn";
import TeamId from "~/components/SvgIcons/teams/TeamId";
import CopyCode from "./CopyCode";

interface AboutProps {
  teamDetails: string;
}

const About: React.FC<AboutProps> = ({ teamDetails }) => {
  const [supportersCount, setSupportersCount] = useState(4123);
  const [isSupporting, setIsSupporting] = useState(false);
  // const [fontsLoaded] = useFonts({
  //   "Sansation-Regular": require("../../../../../assets/fonts/Sansation_Bold_Italic.ttf"),
  // });

  const handleButtonPress = () => {
    // Toggles support and increases count correctly
    setIsSupporting((prevIsSupporting) => {
      const newIsSupporting = !prevIsSupporting;
      setSupportersCount((prevCount) =>
        prevIsSupporting ? prevCount - 1 : prevCount + 1
      );
      return newIsSupporting;
    });
  };

  // if (!fontsLoaded) {
  //   return <ActivityIndicator size="large" color="white" />;
  // }

  // Redux state (If needed, you can manage user data here)
  const { error, loading, user } = useSelector((state: any) => state?.profile);

  return (
    <ScrollView>
      <View className="p-4 bg-black rounded-lg">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center justify-between">
            <Supporters />
            <Text className="text-white text-3xl ml-1 font-bold">
              {supportersCount}
            </Text>
            <Text className="text-gray-500 text-4xl font-bold ">
              {" "}
              Supporters
            </Text>
          </View>
          <CustomButton
            buttonName={isSupporting ? "✓ Supporting" : "+" + " Support"}
            onPress={handleButtonPress}
          />
        </View>

        <Text className="text-white pt-8 ml-1 text-6xl font-bold mb-2">
          Description
        </Text>
        <Text
          className="text-white ml-1 text-lg"
          style={{ fontFamily: "Sansation-Regular" }}
        >
          {teamDetails}
        </Text>
      </View>

      <View className="ml-4 mt-10 flex flex-row ">
        <Members />
        <Text className="text-white text-4xl mt-1 ml-1 "> Members - 16</Text>
      </View>

      <View className="ml-4 mt-3 flex flex-row ">
        <EstabilishedOn />
        <Text className="text-white text-4xl mt-1 ml-1 ">
          Established on - April, 2024
        </Text>
      </View>

      <View className="ml-4 mt-3 flex flex-row ">
        <TeamId />
        <Text className="text-white text-4xl mt-1 ml-1 ">
          {" "}
          Team unique ID - RKR1421
        </Text>
        <CopyCode />
      </View>
    </ScrollView>
  );
};

export default About;
