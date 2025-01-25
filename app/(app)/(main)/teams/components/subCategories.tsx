import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Squad from "./Squad";

const SubCategories = () => {
  const [selectedTab, setSelectedTab] = useState<"SQUAD" | "ABOUT">("SQUAD");

  const renderContent = () => {
    if (selectedTab === "SQUAD") {
      return <Squad />;
    } else if (selectedTab === "ABOUT") {
      return <Text className="text-white text-lg">ABOUT Content</Text>;
    }
  };

  return (
    <View className="flex-1 mt-[65%] px-2">
      {/* Tab Buttons */}
      <View className="flex-row  p-2 px-4 bg-[#191919] rounded-[10px]">
        <TouchableOpacity
          className={`px-6 py-2 rounded-[10px] ${
            selectedTab === "SQUAD" ? "bg-green-600" : "bg-[#191919]"
          }`}
          onPress={() => setSelectedTab("SQUAD")}
        >
          <Text className="text-white font-bold">SQUAD</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`px-6 py-2 rounded-[10px] ${
            selectedTab === "ABOUT" ? "bg-green-600" : "bg-[#191919]"
          }`}
          onPress={() => setSelectedTab("ABOUT")}
        >
          <Text className="text-white font-bold">ABOUT</Text>
        </TouchableOpacity>
      </View>

      {/* Render Content */}
      {renderContent()}
    </View>
  );
};

export default SubCategories;
