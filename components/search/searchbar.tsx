import React from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import TextScallingFalse from "../CentralText";

const SearchBar = ({ searchText }: { searchText?: string }) => {
  const router = useRouter();
  return (
    <View className="flex-row items-center justify-between gap-2 my-2 px-2">
      {/* Back Icon */}
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => router.push("/(app)/(tabs)/home")}
        className="justify-center items-center"
      >
        <Feather name="chevron-left" size={30} color="white" />
      </TouchableOpacity>
      {/* Search Bar */}
      <TouchableOpacity
        activeOpacity={0.8}
        className="flex-row bg-neutral-800 rounded-3xl px-3 py-2 items-center flex-1"
        onPress={() => router.push("/(app)/searchPage")}
      >
        <MaterialCommunityIcons name="magnify" size={24} color="grey" />
        <TextScallingFalse
          className={`text-2xl ${searchText ? "text-white" : "text-[#808080]"}`}
          aria-disabled={true}
        >
          {searchText || "Search for news, team, matches, etc..."}
        </TextScallingFalse>
      </TouchableOpacity>

      {/* Plus Icon */}
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => ({})}
        className="justify-center items-center ml-3"
      >
        {/* <MaterialCommunityIcons name="plus" size={20} color="white" /> */}
        <Feather name="align-right" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
