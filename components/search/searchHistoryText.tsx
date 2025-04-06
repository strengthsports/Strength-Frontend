import { View, Text } from "react-native";
import React from "react";
import { Entypo, Feather } from "@expo/vector-icons";
import TextScallingFalse from "../CentralText";

const SearchHistoryText = ({
  searchText,
  setSearchText,
}: {
  searchText: string;
  setSearchText: (text: string) => void;
}) => {
  return (
    <View className="flex-row items-center w-full">
      <Entypo name="back-in-time" size={18} color="white" className="mr-5" />
      {/* Searched Text */}
      <TextScallingFalse className="text-xl text-white flex-grow">
        {searchText}
      </TextScallingFalse>
      <Feather
        name="arrow-up-left"
        size={18}
        color="grey"
        onPress={() => setSearchText(searchText)}
      />
    </View>
  );
};

export default SearchHistoryText;
