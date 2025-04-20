import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
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
  const [selectedTab, setSelectedTab] = useState<"SQUAD" | "ABOUT">("SQUAD");

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
     <View className="pb-[3px] bg-black ">
      <View className="flex-row p-2 px-4 bg-[#191919]">
        <TouchableOpacity
          className={`px-4  rounded-[4px] ${
            selectedTab === "ABOUT" ? "bg-[#12956B]" : "bg-[#191919]"
          }`}
          onPress={() => setSelectedTab("ABOUT")}
        >
          <Text
            className="text-white text-6xl mt-2"
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
            className="text-white justify-center text-6xl mt-2"
            style={{ fontFamily: "SairaExtraCondensed_500Medium" }}
          >
            SQUAD
          </Text>
        </TouchableOpacity>
      </View>
      </View>
      {/* Render Content */}
      {renderContent()}
    </View>
  );
};

export default SubCategories;
