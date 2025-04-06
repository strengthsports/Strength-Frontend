import React, { useState } from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import {
  MaterialCommunityIcons,
  Feather,
  FontAwesome5,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import TextScallingFalse from "../CentralText";
import { FilterModal } from "../explorePage/filter";
import SearchIcon from "../SvgIcons/Common_Icons/SearchIcon";

const SearchBar = ({
  searchText,
  placeholder,
}: {
  searchText?: string;
  placeholder?: string;
}) => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const applyFilters = () => {
    // Apply filter logic here
    setModalVisible(false);
  };

  return (
    <View className="flex-row my-3 px-5">
      <TouchableOpacity
        activeOpacity={0.8}
        className="flex-row bg-[#1E1E1E] rounded-3xl px-4 py-[10.2px] items-center flex-1"
        onPress={() => router.push("/(app)/searchPage")}
      >
        {/* <Feather name="search" size={22} color="grey" /> */}
        <SearchIcon />
        <TextScallingFalse
          className={`text-3xl pl-3 ${
            searchText ? "text-white" : "text-[#808080]"
          }`}
          aria-disabled={true}
        >
          {searchText || placeholder || "Search..."}
        </TextScallingFalse>
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
