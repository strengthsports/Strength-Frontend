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
      <Entypo name="back-in-time" size={20} color="#707070" className="mr-5" />
      {/* Searched Text */}
      <TextScallingFalse className="text-3xl text-neutral-400 flex-grow" style={{fontWeight:'400'}}>
        {searchText}
      </TextScallingFalse>
      <Feather
        name="arrow-up-left"
        size={20}
        color="#505050"
        onPress={() => setSearchText(searchText)}
      />
    </View>
  );
};

export default SearchHistoryText;
