import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Squad from "./Squad";
import { SafeAreaView } from "react-native-safe-area-context";
import About from "@/components/teamPage/About";
import { TeamPayload } from "~/reduxStore/slices/team/teamSlice";
import {
  useFonts,
  SairaExtraCondensed_500Medium,
} from "@expo-google-fonts/saira-extra-condensed";
import AppLoading from "expo-app-loading";

const SubCategories = ({ teamDetails }: { teamDetails: TeamPayload }) => {
  const [selectedTab, setSelectedTab] = useState<"SQUAD" | "ABOUT">("ABOUT");

  const [fontsLoaded] = useFonts({
    SairaExtraCondensed_500Medium,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const renderContent = () => {
    if (selectedTab === "SQUAD") {
      return <Squad teamDetails={teamDetails} />;
    } else if (selectedTab === "ABOUT") {
      return <About teamDetails={teamDetails} />;
    }
  };

  return (
    <View className="flex-1">
      {/* Sticky Header */}
      <View className="bg-black">
        <View className="flex-row p-2 px-4 bg-[#191919]">
          <TouchableOpacity
            className={`px-4 rounded-[4px] ${
              selectedTab === "ABOUT" ? "bg-[#12956B]" : "bg-[#191919]"
            }`}
            onPress={() => setSelectedTab("ABOUT")}
          >
            <Text
              className="text-white text-[21px] mt-1"
              style={{ fontFamily: "SairaExtraCondensed_500Medium" }}
            >
              ABOUT
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`ml-4 justify-center px-3 rounded-[4px] ${
              selectedTab === "SQUAD" ? "bg-[#12956B]" : "bg-[#191919]"
            }`}
            onPress={() => setSelectedTab("SQUAD")}
          >
            <Text
              className="text-white text-[21px] mt-1"
              style={{ fontFamily: "SairaExtraCondensed_500Medium" }}
            >
              SQUAD
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
};

export default SubCategories;