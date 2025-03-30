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
import FilterIcon from "@/components/SvgIcons/filterIcon";

const SearchBar = ({ searchText }: { searchText?: string }) => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const applyFilters = () => {
    // Apply filter logic here
    setModalVisible(false);
  };

  return (
    <View className="flex-row my-3.5 px-5">
      <TouchableOpacity
        activeOpacity={0.8}
        className="flex-row bg-[#212121] rounded-3xl px-4 py-2 items-center flex-1"
        onPress={() => router.push("/(app)/searchPage")}
      >
        <Feather name="search" size={22} color="grey" />
        <TextScallingFalse
          className={`text-3xl pl-2 ${
            searchText ? "text-white" : "text-[#808080]"
          }`}
          aria-disabled={true}
        >
          {searchText || "Search..."}
        </TextScallingFalse>
      </TouchableOpacity>

      {/* Plus Icon */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setModalVisible(true)}
        className="justify-center items-center ml-3"
      >
        {/* <MaterialCommunityIcons name="plus" size={20} color="white" /> */}
        {/* <FontAwesome5 name="sliders-h" size={24} color="white" /> */}
        <FilterIcon />
        <FilterModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onApplyFilters={applyFilters}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
