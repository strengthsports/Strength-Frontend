import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Squad from "./Squad";
import { SafeAreaView } from "react-native-safe-area-context";
import About from "@/components/teamPage/About";

interface SubCategoriesProps {
  // teamId: string | string[];
  teamDetails: any;
}

const SubCategories: React.FC<SubCategoriesProps> = (teamDetails) => {
  console.log("Checking", teamDetails);
  const [selectedTab, setSelectedTab] = useState<"SQUAD" | "ABOUT">("SQUAD");

  const renderContent = () => {
    if (selectedTab === "SQUAD") {
      return <Squad teamDetails={teamDetails.teamDetails} />;
    } else if (selectedTab === "ABOUT") {
      return <About teamDetails={teamDetails.teamDetails.description} />;
    }
  };

  return (
    <View className="flex-1">
      {/* Tab Buttons */}
      <View className="flex-row  p-2 px-4 bg-[#191919]">
        <TouchableOpacity
          className={`px-6 py-2 rounded-[10px] ${
            selectedTab === "ABOUT" ? "bg-[#12956B]" : "bg-[#191919]"
          }`}
          onPress={() => setSelectedTab("ABOUT")}
        >
          <Text className="text-white font-bold text-3xl">ABOUT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-6 py-2 rounded-[10px] ${
            selectedTab === "SQUAD" ? "bg-[#12956B]" : "bg-[#191919]"
          }`}
          onPress={() => setSelectedTab("SQUAD")}
        >
          <Text className="text-white  text-3xl font-bold">SQUAD</Text>
        </TouchableOpacity>
      </View>

      {/* Render Content */}
      {renderContent()}
    </View>
  );
};

export default SubCategories;
